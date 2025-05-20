import * as THREE from 'three';
import { VIDEO_CYCLE_CONFIG } from '../config.ts';

/**
 * Load a single video from the given path
 * @param path Path to the video file
 * @returns Promise with video element, video texture, and success status
 */
export const loadVideo = (path: string): Promise<{ 
  video: HTMLVideoElement, 
  texture: THREE.VideoTexture | null,
  success: boolean 
}> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    
    // Set video attributes
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.crossOrigin = 'anonymous';
    video.playsInline = true;
    video.preload = 'auto';
    video.playbackRate = VIDEO_CYCLE_CONFIG.cycling.playbackSpeed;
    
    // Create a timeout for loading
    const timeout = setTimeout(() => {
      console.warn(`Video load timed out: ${path}`);
      resolve({
        video,
        texture: null,
        success: false,
      });
    }, 10000); // 10 second timeout
    
    // Event handlers
    const handleCanPlay = () => {
      clearTimeout(timeout);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      
      // Create texture
      const texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBAFormat;
      
      // Set initial video properties
      video.currentTime = 0;
      
      console.log(`Video loaded: ${path}`);
      resolve({
        video,
        texture,
        success: true,
      });
    };
    
    const handleError = (error: ErrorEvent) => {
      clearTimeout(timeout);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      
      console.error(`Error loading video: ${path}`, error);
      resolve({
        video,
        texture: null,
        success: false,
      });
    };
    
    // Set up event listeners
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    
    // Set source and load
    video.src = path;
    video.load();
  });
};
