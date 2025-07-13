// GLSL Preprocessor - Handles #pragma include directives
// This allows modular GLSL files to be combined into single shaders

import { dirname, join } from 'https://deno.land/std@0.208.0/path/mod.ts'

/**
 * Preprocesses GLSL source code to resolve #pragma include directives
 *
 * @param {string} source - The GLSL source code
 * @param {string} basePath - The base directory to resolve includes from
 * @param {Set<string>} processedFiles - Set to track processed files (prevent circular includes)
 * @returns {Promise<string>} - The processed source code with includes resolved
 */
export async function preprocessGLSL(
  source: string,
  basePath: string,
  processedFiles: Set<string> = new Set(),
  globalIncludedFiles: Set<string> = new Set(),
): Promise<string> {
  // Regex to match #pragma include "filename"
  const includeRegex = /#pragma\s+include\s+"([^"]+)"/g

  let processedSource = source
  let match: RegExpExecArray | null

  // Process all include directives
  while ((match = includeRegex.exec(source)) !== null) {
    const [fullMatch, filename] = match
    const includePath = join(basePath, filename)

    // Prevent circular includes within current processing chain
    if (processedFiles.has(includePath)) {
      console.warn(`Circular include detected: ${includePath}`)
      processedSource = processedSource.replace(fullMatch, '')
      continue
    }

    // Skip if already included globally (prevents duplicates)
    if (globalIncludedFiles.has(includePath)) {
      console.log(`Skipping already included file: ${includePath}`)
      processedSource = processedSource.replace(fullMatch, '')
      continue
    }

    try {
      // Read the included file
      const includeContent = await Deno.readTextFile(includePath)

      // Add to both tracking sets
      processedFiles.add(includePath)
      globalIncludedFiles.add(includePath)

      // Recursively process the included file
      const processedInclude = await preprocessGLSL(
        includeContent,
        dirname(includePath),
        processedFiles,
        globalIncludedFiles,
      )

      // Replace the include directive with the processed content
      processedSource = processedSource.replace(fullMatch, processedInclude)

      // Remove from current processing chain (but keep in global)
      processedFiles.delete(includePath)
    } catch (error) {
      console.error(`Failed to include ${includePath}: ${error instanceof Error ? error.message : String(error)}`)
      // Replace with empty string if file not found
      processedSource = processedSource.replace(fullMatch, '')
    }
  }

  return processedSource
}

/**
 * Preprocesses a GLSL file and returns the processed source
 *
 * @param {string} filePath - Path to the GLSL file to process
 * @returns {Promise<string>} - The processed source code
 */
export async function preprocessGLSLFile(filePath: string): Promise<string> {
  const source = await Deno.readTextFile(filePath)
  const basePath = dirname(filePath)
  return await preprocessGLSL(source, basePath, new Set(), new Set())
}
