import { h } from "preact";
import { useState, useRef, useEffect } from "preact/hooks";
import { createPerlinNoise } from "../lib/logo3d/noise/PerlinNoise.ts";
import { createScratchNoise } from "../lib/logo3d/noise/ScratchNoise.ts";
import { createDistressedNoise } from "../lib/logo3d/noise/DistressedNoise.ts";
import { createCellularNoise } from "../lib/logo3d/noise/CellularNoise.ts";

const CANVAS_SIZE = 200;
const NOISE_RESOLUTION = 200;

type NoiseParams = {
  scale: number;
  seedValue?: number;
}

type NoiseType = "perlin" | "scratch" | "distressed" | "cellular";

export default function NoiseVisualizer() {
  const [activeNoise, setActiveNoise] = useState<NoiseType>("perlin");
  const [noiseParams, setNoiseParams] = useState<Record<NoiseType, NoiseParams>>({
    perlin: { scale: 5 },
    scratch: { scale: 1 },
    distressed: { scale: 3 },
    cellular: { scale: 2 }
  });
  
  // specialized parameters for each noise type
  const [scratchParams, setScratchParams] = useState({
    density: 0.5,
    length: 0.2,
    width: 0.02,
    angle: 0
  });
  
  const [distressedParams, setDistressedParams] = useState({
    roughness: 0.7,
    iterations: 3
  });
  
  const [cellularParams, setCellularParams] = useState({
    jitter: 1.0
  });
  
  const canvasRefs = {
    perlin: useRef<HTMLCanvasElement>(null),
    scratch: useRef<HTMLCanvasElement>(null),
    distressed: useRef<HTMLCanvasElement>(null),
    cellular: useRef<HTMLCanvasElement>(null)
  };
  
  // generate the noise visualization on the canvas
  const generateNoiseVisual = (type: NoiseType) => {
    const canvas = canvasRefs[type].current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const imageData = ctx.createImageData(NOISE_RESOLUTION, NOISE_RESOLUTION);
    const data = imageData.data;
    
    // create noise generator based on type
    let getValue: (x: number, y: number) => number;
    
    switch (type) {
      case "perlin": {
        const noise = createPerlinNoise();
        noise.seed(noiseParams.perlin.seedValue || Math.floor(Math.random() * 65535));
        getValue = (x, y) => (noise.noise2D(x, y) + 1) * 0.5; // normalize to 0-1
        break;
      }
      
      case "scratch": {
  const noise = createScratchNoise(
    scratchParams.density,
    scratchParams.length,
    scratchParams.width,
    scratchParams.angle
  );
  if (noiseParams.scratch.seedValue) {
    noise.setValue(noiseParams.scratch.seedValue);
  }
  getValue = (x, y) => noise.getValue(x, y);
  break;
}
      
      case "distressed": {
  const noise = createDistressedNoise(
    distressedParams.roughness,
    noiseParams[type].scale,
    distressedParams.iterations
  );
  if (noiseParams.distressed.seedValue) {
    noise.setValue(noiseParams.distressed.seedValue);
  }
  getValue = (x, y) => noise.getValue(x, y);
  break;
}
      
      case "cellular": {
  const noise = createCellularNoise(
    noiseParams[type].scale,
    cellularParams.jitter
  );
  if (noiseParams.cellular.seedValue) {
    noise.setValue(noiseParams.cellular.seedValue);
  }
  getValue = (x, y) => noise.getValue(x, y);
  break;
}
    }
    
    // render noise to canvas
    for (let y = 0; y < NOISE_RESOLUTION; y++) {
      for (let x = 0; x < NOISE_RESOLUTION; x++) {
        const value = getValue(
          x / NOISE_RESOLUTION * noiseParams[type].scale,
          y / NOISE_RESOLUTION * noiseParams[type].scale
        );
        
        // convert to grayscale RGBA
        const color = Math.floor(value * 255);
        const idx = (y * NOISE_RESOLUTION + x) * 4;
        
        data[idx] = color;     // r
        data[idx + 1] = color; // g
        data[idx + 2] = color; // b
        data[idx + 3] = 255;   // a
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };
  
  // regenerate all noise visualizations
  const regenerateAll = () => {
    console.log("Regenerating all noise visualizations");
    
    // Create separate noise generators for debugging
    const perlinNoise = createPerlinNoise();
    perlinNoise.seed(Math.floor(Math.random() * 65535));
    console.log("Perlin noise created:", perlinNoise);
    
    const scratchNoise = createScratchNoise();
    console.log("Scratch noise created:", scratchNoise);
    
    const distressedNoise = createDistressedNoise();
    console.log("Distressed noise created:", distressedNoise);
    
    const cellularNoise = createCellularNoise();
    console.log("Cellular noise created:", cellularNoise);
    
    generateNoiseVisual("perlin");
    generateNoiseVisual("scratch");
    generateNoiseVisual("distressed");
    generateNoiseVisual("cellular");
  };
  
  // regenerate on parameter change
  useEffect(() => {
    regenerateAll();
  }, [noiseParams, scratchParams, distressedParams, cellularParams]);
  
  // handle scale change
  const handleScaleChange = (type: NoiseType, value: number) => {
    setNoiseParams({
      ...noiseParams,
      [type]: { ...noiseParams[type], scale: value }
    });
  };
  
  // randomize seeds
  const randomizeSeeds = () => {
    const newParams = { ...noiseParams };
    Object.keys(newParams).forEach(key => {
      newParams[key as NoiseType].seedValue = Math.floor(Math.random() * 10000);
    });
    setNoiseParams(newParams);
  };
  
  return (
    <div class="p-4 max-w-screen-xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Noise Visualizer</h1>
      
      <div class="mb-4 flex space-x-2">
        <button 
          onClick={regenerateAll}
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Regenerate All
        </button>
        <button 
          onClick={randomizeSeeds}
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Randomize Seeds
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Perlin Noise */}
        <div class="p-4 border rounded shadow-lg">
          <h2 class="text-xl font-semibold mb-2">Perlin Noise</h2>
          <canvas 
            ref={canvasRefs.perlin} 
            width={NOISE_RESOLUTION} 
            height={NOISE_RESOLUTION} 
            class="w-full aspect-square mb-4 bg-gray-100"
          />
          <div class="mb-2">
            <label class="block text-sm font-medium mb-1">Scale: {noiseParams.perlin.scale}</label>
            <input 
              type="range" 
              min="1" 
              max="20" 
              step="0.1" 
              value={noiseParams.perlin.scale} 
              onChange={e => handleScaleChange("perlin", parseFloat((e.target as HTMLInputElement).value))} 
              class="w-full"
            />
          </div>
        </div>
        
        {/* Scratch Noise */}
        <div class="p-4 border rounded shadow-lg">
          <h2 class="text-xl font-semibold mb-2">Scratch Noise</h2>
          <canvas 
            ref={canvasRefs.scratch} 
            width={NOISE_RESOLUTION} 
            height={NOISE_RESOLUTION} 
            class="w-full aspect-square mb-4 bg-gray-100"
          />
          <div class="mb-2">
            <label class="block text-sm font-medium mb-1">Density: {scratchParams.density}</label>
            <input 
              type="range" 
              min="0.1" 
              max="2" 
              step="0.1" 
              value={scratchParams.density} 
              onChange={e => setScratchParams({...scratchParams, density: parseFloat((e.target as HTMLInputElement).value)})} 
              class="w-full"
            />
          </div>
          <div class="mb-2">
            <label class="block text-sm font-medium mb-1">Length: {scratchParams.length}</label>
            <input 
              type="range" 
              min="0.05" 
              max="0.5" 
              step="0.01" 
              value={scratchParams.length} 
              onChange={e => setScratchParams({...scratchParams, length: parseFloat((e.target as HTMLInputElement).value)})} 
              class="w-full"
            />
          </div>
          <div class="mb-2">
            <label class="block text-sm font-medium mb-1">Width: {scratchParams.width.toFixed(3)}</label>
            <input 
              type="range" 
              min="0.005" 
              max="0.1" 
              step="0.001" 
              value={scratchParams.width} 
              onChange={e => setScratchParams({...scratchParams, width: parseFloat((e.target as HTMLInputElement).value)})} 
              class="w-full"
            />
          </div>
          <div class="mb-2">
            <label class="block text-sm font-medium mb-1">Angle: {Math.round(scratchParams.angle * 180 / Math.PI)}°</label>
            <input 
              type="range" 
              min="0" 
              max={`${Math.PI * 2}`} 
              step="0.1" 
              value={scratchParams.angle} 
              onChange={e => setScratchParams({...scratchParams, angle: parseFloat((e.target as HTMLInputElement).value)})} 
              class="w-full"
            />
          </div>
        </div>
        
        {/* Distressed Noise */}
        <div class="p-4 border rounded shadow-lg">
          <h2 class="text-xl font-semibold mb-2">Distressed Noise</h2>
          <canvas 
            ref={canvasRefs.distressed} 
            width={NOISE_RESOLUTION} 
            height={NOISE_RESOLUTION} 
            class="w-full aspect-square mb-4 bg-gray-100"
          />
          <div class="mb-2">
            <label class="block text-sm font-medium mb-1">Scale: {noiseParams.distressed.scale}</label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              step="0.1" 
              value={noiseParams.distressed.scale} 
              onChange={e => handleScaleChange("distressed", parseFloat((e.target as HTMLInputElement).value))} 
              class="w-full"
            />
          </div>
          <div class="mb-2">
            <label class="block text-sm font-medium mb-1">Roughness: {distressedParams.roughness}</label>
            <input 
              type="range" 
              min="0.1" 
              max="0.9" 
              step="0.05" 
              value={distressedParams.roughness} 
              onChange={e => setDistressedParams({...distressedParams, roughness: parseFloat((e.target as HTMLInputElement).value)})} 
              class="w-full"
            />
          </div>
          <div class="mb-2">
            <label class="block text-sm font-medium mb-1">Iterations: {distressedParams.iterations}</label>
            <input 
              type="range" 
              min="1" 
              max="6" 
              step="1" 
              value={distressedParams.iterations} 
              onChange={e => setDistressedParams({...distressedParams, iterations: parseInt((e.target as HTMLInputElement).value)})} 
              class="w-full"
            />
          </div>
        </div>
        
        {/* Cellular Noise */}
        <div class="p-4 border rounded shadow-lg">
          <h2 class="text-xl font-semibold mb-2">Cellular Noise</h2>
          <canvas 
            ref={canvasRefs.cellular} 
            width={NOISE_RESOLUTION} 
            height={NOISE_RESOLUTION} 
            class="w-full aspect-square mb-4 bg-gray-100"
          />
          <div class="mb-2">
            <label class="block text-sm font-medium mb-1">Scale: {noiseParams.cellular.scale}</label>
            <input 
              type="range" 
              min="0.5" 
              max="5" 
              step="0.1" 
              value={noiseParams.cellular.scale} 
              onChange={e => handleScaleChange("cellular", parseFloat((e.target as HTMLInputElement).value))} 
              class="w-full"
            />
          </div>
          <div class="mb-2">
            <label class="block text-sm font-medium mb-1">Jitter: {cellularParams.jitter}</label>
            <input 
              type="range" 
              min="0.1" 
              max="2" 
              step="0.1" 
              value={cellularParams.jitter} 
              onChange={e => setCellularParams({jitter: parseFloat((e.target as HTMLInputElement).value)})} 
              class="w-full"
            />
          </div>
        </div>
      </div>
      
      <div class="mt-8">
        <h3 class="text-lg font-semibold mb-2">About These Noise Functions</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-3 bg-gray-100 rounded">
            <h4 class="font-medium">Perlin Noise</h4>
            <p class="text-sm">Smooth gradient noise useful for terrain, clouds, and flowing textures.</p>
          </div>
          <div class="p-3 bg-gray-100 rounded">
            <h4 class="font-medium">Scratch Noise</h4>
            <p class="text-sm">Generates random scratch patterns for worn surfaces, scuffs, and directional damage.</p>
          </div>
          <div class="p-3 bg-gray-100 rounded">
            <h4 class="font-medium">Distressed Noise</h4>
            <p class="text-sm">Creates weathered, worn textures with sharp transitions for aged surfaces.</p>
          </div>
          <div class="p-3 bg-gray-100 rounded">
            <h4 class="font-medium">Cellular Noise</h4>
            <p class="text-sm">Produces organic cell-like patterns, good for scales, cracks, and natural textures.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 