import type { FilmParams } from '@lib/gl/configPostProcessing.types.ts'

export const createFilmPass = async (film?: FilmParams) => {
  if (!film || film.enabled === false) return null
  const { FilmPass } = await import('three/examples/jsm/postprocessing/FilmPass.js')
  return new FilmPass(
    film.noiseIntensity,
    film.scanlineIntensity,
    film.scanlineCount,
    film.grayscale,
  )
}
