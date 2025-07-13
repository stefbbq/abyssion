#pragma include "utils/random2D.glsl"        
#pragma include "utils/randomRange.glsl"    
#pragma include "utils/snoise3.glsl"        

precision mediump float;

uniform sampler2D tDiffuse;        // The input texture (like an Image object in JS)
uniform vec2 resolution;           // Screen resolution [width, height] (like window.innerWidth/Height)
uniform float corruptionIntensity; // How strong the corruption effect is (0.0 to 1.0)
uniform float time;                // Current time in seconds (like Date.now() but for animation)

// === EXISTING EFFECT UNIFORMS ===
uniform float staticIntensity;        // How strong the static effect is (0.0 to 2.0)

// RGB distortion controls
uniform float rgbDistortionIntensity; // How strong RGB distortion is (0.0 to 50.0)
uniform float rgbDistortionEnabled;   // Whether RGB distortion is enabled (0.0 or 1.0)

// White noise controls
uniform float whiteNoiseIntensity;    // How strong white noise is (0.0 to 2.0)
uniform float whiteNoiseEnabled;      // Whether white noise is enabled (0.0 or 1.0)

// Block corruption controls
uniform float blockCorruptionRate;    // How fast block corruption changes (1.0 to 50.0)
uniform float blockCorruptionEnabled; // Whether block corruption is enabled (0.0 or 1.0)

// Wave distortion controls
uniform float waveNoiseIntensity;     // How strong wave distortion is (0.0 to 2.0)
uniform float waveNoiseEnabled;       // Whether wave distortion is enabled (0.0 or 1.0)

// Screen shake controls
uniform float shakeIntensity;         // How strong screen shake is (0.0 to 50.0)
uniform float shakeEnabled;           // Whether screen shake is enabled (0.0 or 1.0)

// Large block corruption controls  
uniform float largeBlockIntensity;    // How strong large block corruption is (0.0 to 1.0)
uniform float largeBlockSize;         // Size of large corruption blocks (1.0 to 50.0)
uniform float largeBlockFPS;          // FPS for large block updates (1.0 to 30.0)

// Artifact noise controls
uniform float artifactNoiseIntensity; // How strong artifact noise is (0.0 to 1.0)
uniform float artifactChunkSize;      // Size of artifact chunks (1.0 to 100.0)
uniform float artifactShiftAmount;    // How much chunks shift (0.0 to 1.0)
uniform float artifactNoiseFPS;       // FPS for artifact noise updates (1.0 to 30.0)

// VARYING INPUTS (like interpolated values from vertex shader)
// These change per pixel - think of them as coordinates passed down from vertex processing
varying vec2 vUv; // UV coordinates (0,0 to 1,1) - like normalized pixel coordinates

// === HELPER FUNCTIONS ===
// RGB to HSV conversion
vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// HSV to RGB conversion
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    // Get the current pixel's UV coordinates (0,0 to 1,1)
    // Like getting the normalized position of the current pixel
    vec2 uv = vUv;
    
    // Get the corruption strength (controlled by scroll position from JS)
    // This is our main "intensity knob" - 0.0 = no effect, 1.0 = full corruption
    float strength = corruptionIntensity;
    
    // Start with the original, uncorrupted pixel color
    // texture2D() is like accessing a pixel from an image canvas
    vec4 color = texture2D(tDiffuse, uv);
    
    // === EMERGENCY TIME DEBUG ===
    // If time is 0, make the entire screen flash red
    if (time == 0.0 && strength > 0.0) {
        color.rgb = mix(color.rgb, vec3(1.0, 0.0, 0.0), 0.3);
    }
    
    // === MAIN CORRUPTION EFFECTS ===
    // Only apply corruption if strength > 0 (performance optimization)
    if (strength > 0.0) {
        
        // === EFFECT 1: SCREEN SHAKE ===
        // Randomly offset the entire image to simulate camera shake
        vec2 shake = vec2(0.0);
        if (shakeEnabled > 0.5) {
            shake = random2D(vec2(time)) * vec2(strength * shakeIntensity) / resolution;
        }
        
        // === EFFECT 2: RGB CHANNEL DISTORTION ===
        // Separate and offset RGB channels to create chromatic aberration
        // Like when old TVs had color alignment issues
        
        float r = color.r;
        float g = color.g;
        float b = color.b;
        
        if (rgbDistortionEnabled > 0.5) {
            float y = vUv.y * resolution.y; // Convert to pixel Y coordinate
            
            // Create complex wave pattern using noise for horizontal RGB shift
            // This makes the distortion look organic and TV-like
            float rgbWave = (
                // Large scale noise for broad waves
                snoise3(vec3(0.0, y * 0.01, time * 200.0)) * (strength * rgbDistortionIntensity)
                // Smaller scale noise for fine detail
                * snoise3(vec3(0.0, y * 0.02, time * 100.0)) * (strength * 5.0)
                // Sharp horizontal lines (like TV scan line errors)
                + step(0.999, sin(y * 0.005 + time * 1.6)) * 8.0 * strength
                + step(0.9995, sin(y * 0.005 + time * 2.0)) * -12.0 * strength
            ) / resolution.x; // Normalize to pixel size
            
            // Additional RGB separation with high-frequency noise
            float rgbDiff = (strength * rgbDistortionIntensity + sin(time * 300.0 + vUv.y * 20.0) * (10.0 * strength)) / resolution.x;
            float rgbUvX = vUv.x + rgbWave;
            
            // Sample each color channel at slightly different positions
            // This creates the classic "color fringing" effect of broken CRT TVs
            r = texture2D(tDiffuse, vec2(rgbUvX + rgbDiff, vUv.y) + shake).r;  // Red shifted right
            g = texture2D(tDiffuse, vec2(rgbUvX, vUv.y) + shake).g;            // Green centered
            b = texture2D(tDiffuse, vec2(rgbUvX - rgbDiff, vUv.y) + shake).b;  // Blue shifted left
        }
        
        // === EFFECT 3: WHITE NOISE ===
        // Add random static noise like old TV snow
        float whiteNoise = 0.0;
        if (whiteNoiseEnabled > 0.5) {
            whiteNoise = randomRange(vUv + mod(time, 10.0), -whiteNoiseIntensity, whiteNoiseIntensity) * strength;
        }
        
        // === EFFECT 4: BLOCK CORRUPTION ===
        // Create rectangular blocks of static that appear and disappear
        // Like digital compression artifacts or data corruption
        
        float bnMask = 0.0;
        float bnMask2 = 0.0;
        
        if (blockCorruptionEnabled > 0.5) {
            float blockSize1 = 4.0; // TUNING KNOB: Size of small corruption blocks
            float blockSize2 = 8.0; // TUNING KNOB: Size of large corruption blocks
            
            // Block corruption pattern 1 - small, fast-changing blocks
            float bnTime = floor(time * blockCorruptionRate) * 100.0; // Discrete time steps
            float noiseThreshold1 = 0.8 - strength * 0.6; // Lower threshold = more blocks visible
            
            // Create block pattern by combining X and Y noise
            float noiseX = step((snoise3(vec3(0.0, vUv.x * blockSize1, bnTime)) + 1.0) / 2.0, noiseThreshold1);
            float noiseY = step((snoise3(vec3(0.0, vUv.y * blockSize1, bnTime)) + 1.0) / 2.0, noiseThreshold1);
            bnMask = noiseX * noiseY; // Only show blocks where both X and Y conditions are met
            
            // Block corruption pattern 2 - larger, slower-changing blocks
            float bnTime2 = floor(time * blockCorruptionRate * 0.8) * 120.0; // Slightly different timing
            float noiseThreshold2 = 0.9 - strength * 0.4; // Higher threshold = fewer but larger blocks
            
            float noiseX2 = step((snoise3(vec3(0.0, vUv.x * blockSize2, bnTime2)) + 1.0) / 2.0, noiseThreshold2);
            float noiseY2 = step((snoise3(vec3(0.0, vUv.y * blockSize2, bnTime2)) + 1.0) / 2.0, noiseThreshold2);
            bnMask2 = noiseX2 * noiseY2;
        }
        
        // === EFFECT 5: STATIC COLORS ===
        // Generate random colors for the corruption blocks
        vec3 staticColor1 = vec3(0.0);
        vec3 staticColor2 = vec3(0.0);
        
        if (blockCorruptionEnabled > 0.5) {
            float bnTime = floor(time * blockCorruptionRate) * 100.0;
            float bnTime2 = floor(time * blockCorruptionRate * 0.8) * 120.0;
            staticColor1 = vec3(random(vUv * 100.0 + bnTime)) * staticIntensity;
            staticColor2 = vec3(random(vUv * 120.0 + bnTime2)) * staticIntensity;
        }
        
        // === EFFECT 6: WAVE DISTORTION ===
        // Add subtle wave-like distortion across the image
        float waveNoise = 0.0;
        if (waveNoiseEnabled > 0.5) {
            waveNoise = (sin(vUv.y * 800.0 + time * 50.0) + 1.0) / 2.0 * (waveNoiseIntensity * strength);
        }
        
        // === COMBINE ALL EFFECTS ===
        // Layer each effect on top of the previous ones
        // Like compositing layers in Photoshop
        
        // Apply RGB channel distortion
        color.rgb = mix(color.rgb, vec3(r, g, b), strength);
        
        // Apply block corruption (random static blocks)
        color.rgb = mix(color.rgb, staticColor1, bnMask * strength);
        color.rgb = mix(color.rgb, staticColor2, bnMask2 * strength);
        
        // Add white noise (overall static)
        color.rgb += whiteNoise;
        
        // Add wave noise (subtle motion)
        color.rgb += waveNoise * (random(vUv + time) - 0.5);
        

        
        // === NEW EFFECT 2: LARGE BLOCK CORRUPTION ===
        // Create irregular, varied-size blocks like in reference image
        if (largeBlockIntensity > 0.0) {
            // Use controlled FPS for block updates
            float blockTime = floor(time * largeBlockFPS) / largeBlockFPS;
            float blockSeed = blockTime * 50.0;
            
            // Create multiple layers of irregular blocks with different characteristics
            float blockMask = 0.0;
            vec3 blockCorruptionColor = vec3(0.0);
            
            // Layer 1: Large irregular blocks (up to 40% of screen)
            vec2 largeBlockSize = vec2(
                (0.05 + snoise3(vec3(uv.x * 2.0, 0.0, blockSeed)) * 0.35), // 5% to 40% width
                (0.05 + snoise3(vec3(0.0, uv.y * 2.0, blockSeed + 100.0)) * 0.35) // 5% to 40% height
            );
            vec2 largeBlockUV = floor(uv / largeBlockSize) * largeBlockSize;
            float largeMask = step(0.85 - largeBlockIntensity * 0.4, 
                                  snoise3(vec3(largeBlockUV.x * 3.0, largeBlockUV.y * 3.0, blockSeed + 200.0)) + 0.5);
            
            // Layer 2: Horizontal strips (like scan line corruption)
            float stripHeight = 0.02 + snoise3(vec3(uv.y * 10.0, blockSeed + 300.0, 0.0)) * 0.08; // 2% to 10% height
            vec2 stripUV = vec2(0.0, floor(uv.y / stripHeight) * stripHeight);
            float stripMask = step(0.9 - largeBlockIntensity * 0.3, 
                                  snoise3(vec3(stripUV.y * 15.0, blockSeed + 400.0, 0.0)) + 0.5);
            
            // Layer 3: Vertical strips (less common)
            float vertStripWidth = 0.03 + snoise3(vec3(uv.x * 8.0, blockSeed + 500.0, 0.0)) * 0.12; // 3% to 15% width
            vec2 vertStripUV = vec2(floor(uv.x / vertStripWidth) * vertStripWidth, 0.0);
            float vertStripMask = step(0.95 - largeBlockIntensity * 0.2, 
                                      snoise3(vec3(vertStripUV.x * 20.0, blockSeed + 600.0, 0.0)) + 0.5);
            
            // Layer 4: Medium irregular blocks
            vec2 mediumBlockSize = vec2(
                (0.02 + snoise3(vec3(uv.x * 5.0, 0.0, blockSeed + 700.0)) * 0.15), // 2% to 17% width
                (0.02 + snoise3(vec3(0.0, uv.y * 5.0, blockSeed + 800.0)) * 0.15)  // 2% to 17% height
            );
            vec2 mediumBlockUV = floor(uv / mediumBlockSize) * mediumBlockSize;
            float mediumMask = step(0.8 - largeBlockIntensity * 0.4, 
                                   snoise3(vec3(mediumBlockUV.x * 8.0, mediumBlockUV.y * 8.0, blockSeed + 900.0)) + 0.5);
            
            // Combine all layers
            blockMask = max(max(largeMask, stripMask), max(vertStripMask, mediumMask));
            
            // Generate varied corruption colors for different block types
            if (blockMask > 0.0) {
                // Use different color patterns for different block types
                if (largeMask > 0.0) {
                    // Large blocks: high contrast, saturated colors
                    blockCorruptionColor = vec3(
                        step(0.3, snoise3(vec3(largeBlockUV.x, largeBlockUV.y, blockSeed + 1000.0))),
                        step(0.3, snoise3(vec3(largeBlockUV.x, largeBlockUV.y, blockSeed + 1100.0))),
                        step(0.3, snoise3(vec3(largeBlockUV.x, largeBlockUV.y, blockSeed + 1200.0)))
                    );
                } else if (stripMask > 0.0) {
                    // Horizontal strips: cyan/magenta like in reference
                    float stripColor = snoise3(vec3(stripUV.y * 5.0, blockSeed + 1300.0, 0.0));
                    if (stripColor > 0.3) {
                        blockCorruptionColor = vec3(0.0, 1.0, 1.0); // Cyan
                    } else if (stripColor < -0.3) {
                        blockCorruptionColor = vec3(1.0, 0.0, 1.0); // Magenta
                    } else {
                        blockCorruptionColor = vec3(1.0, 1.0, 0.0); // Yellow
                    }
                } else {
                    // Other blocks: mixed corruption
                    blockCorruptionColor = vec3(
                        snoise3(vec3(mediumBlockUV.x * 10.0, mediumBlockUV.y * 10.0, blockSeed + 1400.0)) * 0.5 + 0.5,
                        snoise3(vec3(mediumBlockUV.x * 10.0, mediumBlockUV.y * 10.0, blockSeed + 1500.0)) * 0.5 + 0.5,
                        snoise3(vec3(mediumBlockUV.x * 10.0, mediumBlockUV.y * 10.0, blockSeed + 1600.0)) * 0.5 + 0.5
                    );
                }
            }
            
            // Apply large block corruption
            color.rgb = mix(color.rgb, blockCorruptionColor, blockMask * largeBlockIntensity * strength);
        }

        // === NEW EFFECT 3: ARTIFACT NOISE BLOCKS ===
        // Horizontal strips that shift left/right, strongest on sides, taper to middle
        if (artifactNoiseIntensity > 0.0) {
            // Create horizontal strip system
            float stripHeight = artifactChunkSize / resolution.y;
            float stripY = floor(uv.y / stripHeight) * stripHeight;
            
            // Calculate distance from horizontal center for tapering
            float centerDistance = abs(uv.x - 0.5) * 2.0; // 0.0 at center, 1.0 at edges
            float sideStrength = centerDistance * centerDistance; // Quadratic falloff towards center
            
            // Generate shifting pattern for horizontal strips (discrete FPS)
            float artifactTime = floor(time * artifactNoiseFPS) / artifactNoiseFPS;
            float artifactSeed = artifactTime * 30.0;
            float stripSeed = stripY * 100.0 + artifactSeed;
            
            // Horizontal shift amount (up to 50% of screen width)
            float maxShift = artifactShiftAmount * 0.5; // Up to 50% of screen
            float horizontalShift = snoise3(vec3(stripY * 20.0, artifactSeed, 0.0)) * maxShift * sideStrength;
            
            // Create artifact mask for this strip
            float artifactMask = step(0.7 - artifactNoiseIntensity * 0.5, 
                                     snoise3(vec3(stripY * 25.0, artifactSeed + 100.0, 0.0)) + 0.5);
            
            if (artifactMask > 0.0) {
                // Calculate shifted UV for sampling
                vec2 shiftedUV = vec2(uv.x + horizontalShift, uv.y);
                
                // Wrap around if we go off screen
                if (shiftedUV.x < 0.0) shiftedUV.x += 1.0;
                if (shiftedUV.x > 1.0) shiftedUV.x -= 1.0;
                
                // Sample the shifted color (100% replacement of original)
                vec4 shiftedColor = texture2D(tDiffuse, shiftedUV);
                
                // Apply with intensity that tapers towards center - full replacement
                float finalIntensity = artifactNoiseIntensity * strength * sideStrength;
                
                // FULL REPLACEMENT: Use the shifted image as base
                color.rgb = mix(color.rgb, shiftedColor.rgb, artifactMask * finalIntensity);
                
                // BLENDED COLOR EFFECT: Add color shift as a separate overlay
                vec3 colorShift = vec3(
                    snoise3(vec3(stripY * 15.0, artifactSeed + 200.0, 0.0)) * sideStrength,
                    snoise3(vec3(stripY * 15.0, artifactSeed + 300.0, 0.0)) * sideStrength,
                    snoise3(vec3(stripY * 15.0, artifactSeed + 400.0, 0.0)) * sideStrength
                ) * 0.4;
                
                // Apply color shift as an additive blend
                color.rgb += colorShift * artifactMask * finalIntensity * 0.5;
            }
        }

        // === DEBUG VISUALIZATIONS ===
        vec2 debugVerticalPosition = vec2(0.6, 0.65);

        vec2 intensityPosition = vec2(0.3, 0.35); // red
        if (uv.x > intensityPosition.x && uv.x < intensityPosition.y && uv.y > debugVerticalPosition.x && uv.y < debugVerticalPosition.y) {
            color.rgb = mix(color.rgb, vec3(1.0, 0.0, 0.0), strength);
        }
        
        vec2 timePosition = vec2(0.4, 0.45); // green
        if (uv.x > timePosition.x && uv.x < timePosition.y && uv.y > debugVerticalPosition.x && uv.y < debugVerticalPosition.y) {
            float timeBar = mod(time * 0.1, 1.0);  // 0.0 to 1.0 cycle every 10 seconds
            // Show time as a filling bar within the green box area
            float relativeY = (uv.y - debugVerticalPosition.x) / (debugVerticalPosition.y - debugVerticalPosition.x);
            if (relativeY < timeBar) {
                color.rgb = mix(color.rgb, vec3(0.0, 1.0, 0.0), 0.8);
            } else {
                // Show time value as background color intensity (for debugging)
                float timeDebug = mod(time * 0.05, 1.0); // Slower cycle for visibility
                color.rgb = mix(color.rgb, vec3(0.0, timeDebug, 0.0), 0.3);
            }
        }

        vec2 blockCorruptionPosition = vec2(0.55, 0.6); // blue
        if (uv.x > blockCorruptionPosition.x && uv.x < blockCorruptionPosition.y && uv.y > debugVerticalPosition.x && uv.y < debugVerticalPosition.y) {
            color.rgb = mix(color.rgb, vec3(0.0, 0.0, 1.0), bnMask);
        }
        
        vec2 blockCorruption2Position = vec2(0.65, 0.7); // yellow  
        if (uv.x > blockCorruption2Position.x && uv.x < blockCorruption2Position.y && uv.y > debugVerticalPosition.x && uv.y < debugVerticalPosition.y) {
            color.rgb = mix(color.rgb, vec3(1.0, 1.0, 0.0), bnMask2);
        }
    }
    
    gl_FragColor = color;
}