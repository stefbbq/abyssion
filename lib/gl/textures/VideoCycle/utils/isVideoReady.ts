export function isVideoReady(video: HTMLVideoElement): boolean {
  return (
    video &&
    video.readyState >= 3 &&
    !isNaN(video.duration) &&
    video.videoWidth > 0
  )
}
