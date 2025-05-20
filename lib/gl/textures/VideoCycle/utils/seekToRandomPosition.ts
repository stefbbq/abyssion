/**
 * Seek to a random position in the video
 * @param video HTML Video Element
 * @returns Promise that resolves when seeking is complete
 */
export const seekToRandomPosition = (video: HTMLVideoElement): Promise<void> => {
  return new Promise<void>((resolve) => {
    if (!video.duration || isNaN(video.duration) || video.duration === Infinity) {
      console.warn('Cannot seek: video duration is not available');
      resolve();
      return;
    }

    // Skip the first and last 10% of the video
    const skipPercentage = 0.1;
    const minTime = video.duration * skipPercentage;
    const maxTime = video.duration * (1 - skipPercentage);
    const randomTime = minTime + Math.random() * (maxTime - minTime);

    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked);
      resolve();
    };

    video.addEventListener('seeked', onSeeked);

    try {
      video.currentTime = randomTime;
    } catch (error) {
      console.error('Error seeking to random position:', error);
      video.removeEventListener('seeked', onSeeked);
      resolve();
    }
  });
};
