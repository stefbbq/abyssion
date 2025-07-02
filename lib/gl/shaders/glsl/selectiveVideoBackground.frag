uniform sampler2D videoTexture;
uniform float opacity;
uniform float selectiveColorizationEnabled; // 0.0 = off, 1.0 = on
uniform vec3 selectivePrimaryColor; // primary target color
uniform vec3 selectiveSecondaryColor; // secondary target color
uniform float selectiveBrightnessWeight; // weight for brightness-based targeting (0.0-1.0)
uniform float selectiveSaturationWeight; // weight for saturation-based targeting (0.0-1.0)
uniform float selectiveBrightnessThreshold; // threshold for brightness detection (0.0-1.0)
uniform float selectiveSaturationThreshold; // threshold for saturation detection (0.0-1.0) 
uniform float selectiveBlendSmoothness; // smoothness of the blend transition (0.01-0.5)
uniform float selectiveBlendMode; // 0=brightness, 1=saturation, 2=mixed
uniform float selectiveBlendBalance; // blend factor between primary and secondary colors (0.0-1.0)

varying vec2 vUv;

/**
 * Flexible selective colorization function
 * Grayscales the input color but preserves/remaps areas based on configurable targeting
 * Supports dual colors with flexible blending modes and weighted targeting
 */
vec3 applySelectiveColorization(
  vec3 inputColor, 
  vec3 primaryColor, 
  vec3 secondaryColor,
  float brightnessWeight,
  float saturationWeight,
  float brightnessThreshold, 
  float saturationThreshold, 
  float blendSmoothness,
  float blendMode,
  float blendBalance
) {
  // Calculate luminance-based grayscale using standard formula
  // See: https://en.wikipedia.org/wiki/Relative_luminance
  float luminance = dot(inputColor, vec3(0.299, 0.587, 0.114));
  vec3 grayscale = vec3(luminance);
  
  // Calculate brightness (max of RGB channels)
  float brightness = max(max(inputColor.r, inputColor.g), inputColor.b);
  
  // Calculate saturation
  float minVal = min(min(inputColor.r, inputColor.g), inputColor.b);
  float maxVal = max(max(inputColor.r, inputColor.g), inputColor.b);
  float saturation = maxVal > 0.0 ? (maxVal - minVal) / maxVal : 0.0;
  
  // Calculate weighted targeting strengths
  float brightnessStrength = smoothstep(brightnessThreshold - blendSmoothness, brightnessThreshold + blendSmoothness, brightness) * brightnessWeight;
  float saturationStrength = smoothstep(saturationThreshold - blendSmoothness, saturationThreshold + blendSmoothness, saturation) * saturationWeight;
  
  // Combine targeting strengths (weighted sum instead of max for more control)
  float totalWeight = brightnessWeight + saturationWeight;
  float combinedStrength = totalWeight > 0.0 ? (brightnessStrength + saturationStrength) / totalWeight : 0.0;
  
  // Early exit if no colorization needed
  if (combinedStrength < 0.01) return grayscale;
  
  // Determine color blend factor based on blend mode
  float colorMixFactor = blendBalance; // Default to configured balance
  
  if (blendMode < 0.5) {
    // Brightness-based blending
    colorMixFactor = mix(blendBalance, brightness, 0.5);
  } else if (blendMode < 1.5) {
    // Saturation-based blending  
    colorMixFactor = mix(blendBalance, saturation, 0.5);
  } else {
    // Mixed blending - use both brightness and saturation
    float brightnessFactor = brightness * 0.6;
    float saturationFactor = saturation * 0.4;
    colorMixFactor = mix(blendBalance, brightnessFactor + saturationFactor, 0.5);
  }
  
  // Blend between primary and secondary colors
  vec3 targetColor = mix(primaryColor, secondaryColor, clamp(colorMixFactor, 0.0, 1.0));
  
  // Create colorized version by blending target color with original luminance
  vec3 colorizedVersion = targetColor * luminance;
  
  // Blend between grayscale and colorized based on combined strength
  return mix(grayscale, colorizedVersion, combinedStrength);
}

void main() {
  vec4 videoColor = texture2D(videoTexture, vUv);
  
  vec3 finalColor = videoColor.rgb;
  
  // Apply selective colorization if enabled
  if (selectiveColorizationEnabled > 0.5) {
    finalColor = applySelectiveColorization(
      videoColor.rgb, 
      selectivePrimaryColor,
      selectiveSecondaryColor,
      selectiveBrightnessWeight,
      selectiveSaturationWeight,
      selectiveBrightnessThreshold, 
      selectiveSaturationThreshold, 
      selectiveBlendSmoothness,
      selectiveBlendMode,
      selectiveBlendBalance
    );
  }
  
  gl_FragColor = vec4(finalColor, videoColor.a * opacity);
}