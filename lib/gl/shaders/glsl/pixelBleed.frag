#pragma include "utils/random.glsl"
#pragma include "utils/random2D.glsl"
#pragma include "utils/snoise3.glsl"

// Pixel Bleed Corruption Effect Fragment Shader
// Creates a bizarre computerized corruption that samples large chunks and stretches them
// Uses geometric shapes to define stretch patterns with persistence and growth

precision mediump float;

uniform sampler2D tDiffuse;
uniform vec2 resolution;
uniform float time;
uniform float intensity;          // Overall effect intensity (0.0 to 1.0)
uniform float chunkSize;          // Size of pixel chunks to sample (1.0 to 100.0)
uniform float chunkRandomness;    // Randomness in chunk placement (0.0 to 1.0)
uniform float stretchDistance;    // How far pixels stretch (0.0 to 1.0)
uniform float geometryComplexity; // Complexity of geometric shapes (0.0 to 1.0)
uniform float persistence;        // How much corruption persists/builds (0.0 to 1.0)
uniform float regenerationRate;   // How often new corruption spawns (0.0 to 1.0)

varying vec2 vUv;

/**
 * Creates a triangular geometric pattern
 * Returns 1.0 inside triangle, 0.0 outside
 */
float trianglePattern(vec2 uv, vec2 center, float size, float rotation) {
    // Rotate UV around center
    vec2 rotUV = uv - center;
    float c = cos(rotation);
    float s = sin(rotation);
    rotUV = vec2(rotUV.x * c - rotUV.y * s, rotUV.x * s + rotUV.y * c);
    rotUV += center;
    
    // Triangle vertices (equilateral)
    vec2 v1 = center + vec2(0.0, size);
    vec2 v2 = center + vec2(size * 0.866, -size * 0.5);
    vec2 v3 = center + vec2(-size * 0.866, -size * 0.5);
    
    // Barycentric coordinates to check if point is inside triangle
    float denom = (v2.y - v3.y) * (v1.x - v3.x) + (v3.x - v2.x) * (v1.y - v3.y);
    float a = ((v2.y - v3.y) * (rotUV.x - v3.x) + (v3.x - v2.x) * (rotUV.y - v3.y)) / denom;
    float b = ((v3.y - v1.y) * (rotUV.x - v3.x) + (v1.x - v3.x) * (rotUV.y - v3.y)) / denom;
    float c_coord = 1.0 - a - b;
    
    return step(0.0, a) * step(0.0, b) * step(0.0, c_coord);
}

/**
 * Creates a rectangular geometric pattern
 * Returns 1.0 inside rectangle, 0.0 outside
 */
float rectanglePattern(vec2 uv, vec2 center, vec2 size, float rotation) {
    // Rotate UV around center
    vec2 rotUV = uv - center;
    float c = cos(rotation);
    float s = sin(rotation);
    rotUV = vec2(rotUV.x * c - rotUV.y * s, rotUV.x * s + rotUV.y * c);
    
    // Check if inside rectangle
    vec2 halfSize = size * 0.5;
    vec2 d = abs(rotUV) - halfSize;
    return step(max(d.x, d.y), 0.0);
}

/**
 * Creates a diamond/rhombus geometric pattern
 * Returns 1.0 inside diamond, 0.0 outside
 */
float diamondPattern(vec2 uv, vec2 center, float size, float rotation) {
    // Rotate UV around center
    vec2 rotUV = uv - center;
    float c = cos(rotation);
    float s = sin(rotation);
    rotUV = vec2(rotUV.x * c - rotUV.y * s, rotUV.x * s + rotUV.y * c);
    
    // Diamond is rotated square
    float dist = abs(rotUV.x) + abs(rotUV.y);
    return step(dist, size);
}

/**
 * Generate stretch directions based on geometric pattern
 * Returns up to 3 direction vectors
 */
vec3 getStretchDirections(vec2 uv, float seed, float geometryType) {
    vec3 directions = vec3(0.0);
    
    if (geometryType < 0.33) {
        // Triangle: 3 directions at 120 degree intervals
        float angle1 = seed * 6.28318;
        float angle2 = angle1 + 2.094; // 120 degrees
        float angle3 = angle1 + 4.188; // 240 degrees
        
        directions.x = angle1;
        directions.y = angle2;
        directions.z = angle3;
    } else if (geometryType < 0.66) {
        // Rectangle: 2 perpendicular directions
        float angle1 = seed * 6.28318;
        float angle2 = angle1 + 1.5708; // 90 degrees
        
        directions.x = angle1;
        directions.y = angle2;
        directions.z = -1.0; // Unused
    } else {
        // Diamond: 2 diagonal directions
        float angle1 = seed * 6.28318;
        float angle2 = angle1 + 3.14159; // 180 degrees
        
        directions.x = angle1;
        directions.y = angle2;
        directions.z = -1.0; // Unused
    }
    
    return directions;
}

/**
 * Sample a chunk of pixels and stretch them
 */
vec3 sampleAndStretch(vec2 uv, vec2 chunkCenter, float chunkSizeNorm, vec3 stretchDirs, float stretchFactor, float corruptionTime) {
    // Get original color
    vec3 originalColor = texture2D(tDiffuse, uv).rgb;
    
    // Check if we're in the corruption area
    float geometryType = snoise3(vec3(chunkCenter * 10.0, corruptionTime * 0.1));
    float geometrySize = chunkSizeNorm * (0.5 + geometryComplexity * 0.5);
    float rotation = snoise3(vec3(chunkCenter * 5.0, corruptionTime * 0.2)) * 6.28318;
    
    float inCorruptionArea = 0.0;
    
    if (geometryType < 0.33) {
        inCorruptionArea = trianglePattern(uv, chunkCenter, geometrySize, rotation);
    } else if (geometryType < 0.66) {
        inCorruptionArea = rectanglePattern(uv, chunkCenter, vec2(geometrySize * 1.5, geometrySize), rotation);
    } else {
        inCorruptionArea = diamondPattern(uv, chunkCenter, geometrySize, rotation);
    }
    
    if (inCorruptionArea < 0.5) {
        return originalColor;
    }
    
    // Calculate stretched sample positions
    vec3 stretchedColor = originalColor;
    float totalWeight = 0.0;
    
    // Direction 1
    if (stretchDirs.x >= 0.0) {
        vec2 dir1 = vec2(cos(stretchDirs.x), sin(stretchDirs.x));
        float stretchLength = stretchDistance * stretchFactor * (0.5 + snoise3(vec3(uv * 20.0, corruptionTime)) * 0.5);
        vec2 stretchUV1 = uv + dir1 * stretchLength;
        
        if (stretchUV1.x >= 0.0 && stretchUV1.x <= 1.0 && stretchUV1.y >= 0.0 && stretchUV1.y <= 1.0) {
            vec3 stretchSample1 = texture2D(tDiffuse, stretchUV1).rgb;
            float weight1 = 1.0 - smoothstep(0.0, stretchDistance, length(dir1 * stretchLength));
            stretchedColor = mix(stretchedColor, stretchSample1, weight1 * 0.6);
            totalWeight += weight1;
        }
    }
    
    // Direction 2
    if (stretchDirs.y >= 0.0) {
        vec2 dir2 = vec2(cos(stretchDirs.y), sin(stretchDirs.y));
        float stretchLength = stretchDistance * stretchFactor * (0.5 + snoise3(vec3(uv * 25.0, corruptionTime + 100.0)) * 0.5);
        vec2 stretchUV2 = uv + dir2 * stretchLength;
        
        if (stretchUV2.x >= 0.0 && stretchUV2.x <= 1.0 && stretchUV2.y >= 0.0 && stretchUV2.y <= 1.0) {
            vec3 stretchSample2 = texture2D(tDiffuse, stretchUV2).rgb;
            float weight2 = 1.0 - smoothstep(0.0, stretchDistance, length(dir2 * stretchLength));
            stretchedColor = mix(stretchedColor, stretchSample2, weight2 * 0.4);
            totalWeight += weight2;
        }
    }
    
    // Direction 3 (only for triangles)
    if (stretchDirs.z >= 0.0) {
        vec2 dir3 = vec2(cos(stretchDirs.z), sin(stretchDirs.z));
        float stretchLength = stretchDistance * stretchFactor * (0.5 + snoise3(vec3(uv * 30.0, corruptionTime + 200.0)) * 0.5);
        vec2 stretchUV3 = uv + dir3 * stretchLength;
        
        if (stretchUV3.x >= 0.0 && stretchUV3.x <= 1.0 && stretchUV3.y >= 0.0 && stretchUV3.y <= 1.0) {
            vec3 stretchSample3 = texture2D(tDiffuse, stretchUV3).rgb;
            float weight3 = 1.0 - smoothstep(0.0, stretchDistance, length(dir3 * stretchLength));
            stretchedColor = mix(stretchedColor, stretchSample3, weight3 * 0.3);
            totalWeight += weight3;
        }
    }
    
    // Add some color distortion to make it look more corrupted
    float hueShift = snoise3(vec3(uv * 15.0, corruptionTime * 0.5)) * 0.1;
    stretchedColor.rgb = mix(stretchedColor.rgb, stretchedColor.grb, hueShift);
    
    return stretchedColor;
}

void main() {
    vec2 uv = vUv;
    vec3 color = texture2D(tDiffuse, uv).rgb;
    
    if (intensity <= 0.0) {
        gl_FragColor = vec4(color, 1.0);
        return;
    }
    
    // Calculate chunk size in UV coordinates
    float chunkSizeUV = chunkSize / min(resolution.x, resolution.y);
    
    // Create persistent corruption time that builds up
    float corruptionTime = time * (0.1 + regenerationRate * 0.4);
    float persistentTime = time * persistence * 0.05;
    
    // Generate corruption centers using multiple time scales
    vec3 finalColor = color;
    float totalCorruption = 0.0;
    
    // Layer 1: Long-lived corruption that builds up
    for (int i = 0; i < 8; i++) {
        float layerSeed = float(i) * 123.456;
        vec2 centerBase = vec2(
            snoise3(vec3(layerSeed, persistentTime * 0.3, 0.0)) * 0.5 + 0.5,
            snoise3(vec3(layerSeed + 50.0, persistentTime * 0.3, 0.0)) * 0.5 + 0.5
        );
        
        // Add randomness to center
        vec2 centerOffset = vec2(
            snoise3(vec3(centerBase * 20.0, layerSeed)) * chunkRandomness * 0.1,
            snoise3(vec3(centerBase * 25.0, layerSeed + 100.0)) * chunkRandomness * 0.1
        );
        vec2 chunkCenter = centerBase + centerOffset;
        
        // Check if this corruption is active
        float corruptionStrength = smoothstep(0.3, 0.7, snoise3(vec3(chunkCenter * 5.0, persistentTime * 0.2)) + 0.5);
        corruptionStrength *= intensity;
        
        if (corruptionStrength > 0.1) {
            // Generate stretch directions
            vec3 stretchDirs = getStretchDirections(chunkCenter, layerSeed, snoise3(vec3(chunkCenter * 10.0, persistentTime * 0.1)));
            
            // Sample and stretch
            vec3 stretchedColor = sampleAndStretch(uv, chunkCenter, chunkSizeUV, stretchDirs, corruptionStrength, corruptionTime);
            
            // Blend with existing color
            float blendFactor = corruptionStrength * (1.0 - totalCorruption);
            finalColor = mix(finalColor, stretchedColor, blendFactor);
            totalCorruption += blendFactor;
        }
    }
    
    // Layer 2: Faster regenerating corruption
    for (int i = 0; i < 4; i++) {
        float layerSeed = float(i) * 456.789 + 1000.0;
        vec2 centerBase = vec2(
            snoise3(vec3(layerSeed, corruptionTime * 0.8, 0.0)) * 0.5 + 0.5,
            snoise3(vec3(layerSeed + 50.0, corruptionTime * 0.8, 0.0)) * 0.5 + 0.5
        );
        
        // Add randomness to center
        vec2 centerOffset = vec2(
            snoise3(vec3(centerBase * 30.0, layerSeed)) * chunkRandomness * 0.05,
            snoise3(vec3(centerBase * 35.0, layerSeed + 100.0)) * chunkRandomness * 0.05
        );
        vec2 chunkCenter = centerBase + centerOffset;
        
        // Check if this corruption is active
        float corruptionStrength = smoothstep(0.5, 0.8, snoise3(vec3(chunkCenter * 8.0, corruptionTime * 0.5)) + 0.5);
        corruptionStrength *= intensity * 0.7;
        
        if (corruptionStrength > 0.1) {
            // Generate stretch directions
            vec3 stretchDirs = getStretchDirections(chunkCenter, layerSeed, snoise3(vec3(chunkCenter * 12.0, corruptionTime * 0.2)));
            
            // Sample and stretch
            vec3 stretchedColor = sampleAndStretch(uv, chunkCenter, chunkSizeUV * 0.7, stretchDirs, corruptionStrength, corruptionTime);
            
            // Blend with existing color
            float blendFactor = corruptionStrength * (1.0 - totalCorruption);
            finalColor = mix(finalColor, stretchedColor, blendFactor);
            totalCorruption += blendFactor;
        }
    }
    
    // Clamp total corruption to prevent over-brightening
    totalCorruption = min(totalCorruption, 1.0);
    
    gl_FragColor = vec4(finalColor, 1.0);
} 