/**
 * get a server-side config value by key
 *
 * order of resolution (first hit wins):
 * - process environment via Deno.env.get
 * - JSON string provided in env var `GITHUB_ACTIONS_SECRETS_JSON` or `SECRETS_JSON`
 * - JSON file pointed to by env var `SECRETS_PATH`
 * - fallback JSON file at `./secrets.json` (project root)
 *
 * usage in CI (github actions):
 *   - write your secrets to env vars and also export a combined JSON as SECRETS_JSON, or
 *   - write a file to the workspace (e.g. secrets.json) from secrets and set SECRETS_PATH
 */
let cachedSecrets = null as null | Record<string, string>

const parseJsonObject = (value: string | undefined): Record<string, string> | null => {
  if (!value) return null
  try {
    const parsed = JSON.parse(value) as unknown
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as Record<string, string>
  } catch (_err) {
    // ignore invalid json
  }
  return null
}

const tryLoadSecretsFromEnvJson = (): Record<string, string> | null => {
  const fromGithub = parseJsonObject(Deno.env.get('GITHUB_ACTIONS_SECRETS_JSON'))
  if (fromGithub) return fromGithub
  const fromGeneric = parseJsonObject(Deno.env.get('SECRETS_JSON'))
  if (fromGeneric) return fromGeneric
  return null
}

const tryLoadSecretsFromFile = (): Record<string, string> | null => {
  const path = Deno.env.get('SECRETS_PATH') || './secrets.json'
  try {
    const text = Deno.readTextFileSync(path)
    const parsed = parseJsonObject(text)
    if (parsed) return parsed
  } catch (_err) {
    // ignore missing or unreadable file
  }
  return null
}

const getSecrets = (): Record<string, string> => {
  if (cachedSecrets) return cachedSecrets
  const fromEnvJson = tryLoadSecretsFromEnvJson()
  if (fromEnvJson) {
    cachedSecrets = fromEnvJson
    return cachedSecrets
  }
  const fromFile = tryLoadSecretsFromFile()
  if (fromFile) {
    cachedSecrets = fromFile
    return cachedSecrets
  }
  cachedSecrets = {}
  return cachedSecrets
}

export const getServerEnv = (key: string): string | undefined => {
  const direct = Deno.env.get(key)
  if (direct !== undefined && direct !== null && direct !== '') return direct
  const secrets = getSecrets()
  const fallback = secrets[key]
  if (fallback !== undefined && fallback !== null && fallback !== '') return fallback
  return undefined
}
