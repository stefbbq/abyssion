// deno run --allow-read --allow-write scripts/glsl-to-ts.ts
// Auto-generates .ts modules for each GLSL shader file in lib/gl/shaders/glsl/
import { lc, log } from '../lib/logger/index.ts'
import { preprocessGLSLFile } from './glsl-preprocessor.ts'

const glslDir = './lib/gl/shaders/glsl'

for await (const entry of Deno.readDir(glslDir)) {
  if (!entry.isFile) continue
  if (!/\.(frag|vert|glsl)$/.test(entry.name)) continue

  // Skip utility files - they're included by other files
  if (entry.name.includes('utils/')) continue

  const inputPath = `${glslDir}/${entry.name}`
  const outputPath = `${inputPath}.ts`

  // Use preprocessor to resolve includes
  const processedSource = await preprocessGLSLFile(inputPath)

  // Escape backticks for template string
  const escaped = processedSource.replace(/`/g, '\`')
  const tsContent = `// AUTO-GENERATED FROM ${entry.name}. DO NOT EDIT.\nexport default \`\n${escaped}\n\`\n`
  await Deno.writeTextFile(outputPath, tsContent)
  log(lc.GL_SHADERS, `Generated: ${outputPath}`)
}
