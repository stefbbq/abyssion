// deno run --allow-read --allow-write scripts/glsl-to-ts.ts
// Auto-generates .ts modules for each GLSL shader file in lib/gl/shaders/glsl/

const glslDir = './lib/gl/shaders/glsl'

for await (const entry of Deno.readDir(glslDir)) {
  if (!entry.isFile) continue
  if (!/\.(frag|vert|glsl)$/.test(entry.name)) continue

  const inputPath = `${glslDir}/${entry.name}`
  const outputPath = `${inputPath}.ts`
  const shaderSource = await Deno.readTextFile(inputPath)
  // Escape backticks for template string
  const escaped = shaderSource.replace(/`/g, '\`')
  const tsContent = `// AUTO-GENERATED FROM ${entry.name}. DO NOT EDIT.\nexport default \`\n${escaped}\n\`\n`
  await Deno.writeTextFile(outputPath, tsContent)
  console.log(`Generated: ${outputPath}`)
}
