#pragma include "utils/random.glsl"
#pragma include "utils/snoise3.glsl"

// Simple Pixel Stretch Effect
// Pick geometric shapes, sample pixels from HALF of their outline, stretch those edge pixels

precision mediump float;

uniform sampler2D tDiffuse;
uniform vec2 resolution;
uniform float time;
uniform float intensity;          // Overall effect intensity (0.0 to 1.0)
uniform float chunkSize;          // Size of geometric shapes (5.0 to 200.0)
uniform float chunkRandomness;    // Randomness in placement (0.0 to 1.0)
uniform float stretchDistance;    // How far pixels stretch (0.0 to 0.5)
uniform float geometryComplexity; // Shape complexity (0.0 to 1.0)
uniform float persistence;        // How long corruption lasts (0.0 to 1.0)
uniform float regenerationRate;   // How often new corruption spawns (0.0 to 1.0)

varying vec2 vUv;

/**
 * Check if a pixel is on the "active" half of a shape's outline
 */
bool isOnActiveOutline(vec2 pos, vec2 center, float size, float shapeType) {
    if (shapeType < 0.33) {
        // Triangle - only sample from top edge
        vec2 v1 = center + vec2(0.0, size);
        vec2 v2 = center + vec2(size * 0.866, -size * 0.5);
        vec2 v3 = center + vec2(-size * 0.866, -size * 0.5);
        
        // Check if on top edge (v1 to v2 or v1 to v3)
        float edgeWidth = size * 0.05;
        
        // Distance to top-right edge
        vec2 edge1 = v2 - v1;
        float t1 = clamp(dot(pos - v1, edge1) / dot(edge1, edge1), 0.0, 1.0);
        vec2 proj1 = v1 + t1 * edge1;
        float dist1 = length(pos - proj1);
        
        // Distance to top-left edge  
        vec2 edge2 = v3 - v1;
        float t2 = clamp(dot(pos - v1, edge2) / dot(edge2, edge2), 0.0, 1.0);
        vec2 proj2 = v1 + t2 * edge2;
        float dist2 = length(pos - proj2);
        
        return (dist1 < edgeWidth || dist2 < edgeWidth);
        
    } else if (shapeType < 0.66) {
        // Rectangle - only sample from top edge
        vec2 halfSize = vec2(size, size * 0.6);
        vec2 d = abs(pos - center) - halfSize;
        
        // Check if on top edge
        float edgeWidth = size * 0.05;
        return (abs(d.x) < edgeWidth && pos.y > center.y + halfSize.y - edgeWidth && pos.y < center.y + halfSize.y + edgeWidth);
        
    } else {
        // Diamond - only sample from top-right edge
        vec2 relPos = pos - center;
        float edgeWidth = size * 0.05;
        
        // Check if on top-right diagonal edge
        float distToTopRightEdge = abs(relPos.x + relPos.y - size);
        return (distToTopRightEdge < edgeWidth && relPos.x > 0.0 && relPos.y > 0.0);
    }
}

void main() {
    vec2 uv = vUv;
    vec3 originalColor = texture2D(tDiffuse, uv).rgb;
    
    if (intensity <= 0.0) {
        gl_FragColor = vec4(originalColor, 1.0);
        return;
    }
    
    vec3 finalColor = originalColor;
    
    // Convert chunk size to UV coordinates
    float chunkSizeUV = chunkSize / min(resolution.x, resolution.y);
    
    // Number of corruption sources based on intensity
    int numCorruptions = int(1.0 + intensity * 7.0);
    
    for (int i = 0; i < 8; i++) {
        if (i >= numCorruptions) break;
        
        float seed = float(i) * 123.456;
        
        // Corruption timing
        float corruptionTime = time * (0.3 + regenerationRate * 0.7);
        float corruptionLife = mod(corruptionTime + seed, 5.0 + persistence * 15.0);
        
        if (corruptionLife < 0.5) continue;
        
        // Generate corruption center
        vec2 corruptionCenter = vec2(
            random(vec2(seed, floor(corruptionTime * 0.2))),
            random(vec2(seed + 100.0, floor(corruptionTime * 0.2)))
        );
        
        // Shape type and size
        float shapeType = random(vec2(seed + 200.0, 0.0));
        float shapeSize = chunkSizeUV * (0.5 + geometryComplexity * 0.5);
        
        // Determine stretch direction (mostly down, with limited right/diagonal)
        float directionChoice = random(vec2(seed + 300.0, 0.0));
        vec2 stretchDir;
        bool isDownDirection = false;
        
        if (directionChoice < 0.7) {
            // Down (70% chance)
            stretchDir = vec2(0.0, -1.0);
            isDownDirection = true;
        } else if (directionChoice < 0.85) {
            // Right (15% chance)
            stretchDir = vec2(1.0, 0.0);
        } else {
            // Down-right (15% chance)
            stretchDir = vec2(0.707, -0.707);
        }
        
        // Calculate stretch distance based on direction and pixel limits
        float baseStretchDistance = stretchDistance * 2.0;
        
        // Convert pixel limits to UV coordinates
        float maxStretchPixels = isDownDirection ? 400.0 : 200.0;
        float maxStretchUV = maxStretchPixels / min(resolution.x, resolution.y);
        
        // Use the smaller of the two limits
        float maxStretch = min(baseStretchDistance, maxStretchUV);
        
        // Check if current pixel is in a stretched area
        // Trace backwards from current position to see if we hit an active outline
        for (int j = 1; j <= 200; j++) {
            float step = float(j) / 200.0;
            vec2 sourcePos = uv - stretchDir * step * maxStretch;
            
            // Check bounds
            if (sourcePos.x < 0.0 || sourcePos.x > 1.0 || 
                sourcePos.y < 0.0 || sourcePos.y > 1.0) {
                break;
            }
            
            // Check if this source position is on the active outline
            if (isOnActiveOutline(sourcePos, corruptionCenter, shapeSize, shapeType)) {
                // Sample the source pixel and apply it
                vec3 sourceColor = texture2D(tDiffuse, sourcePos).rgb;
                finalColor = sourceColor;
                break; // Found source, stop looking
            }
        }
    }
    
    gl_FragColor = vec4(finalColor, 1.0);
} 