import { AnimeData, AnimeSourceData } from './types.d';
import { Axios } from 'axios';

export async function getAnimeData(
  httpClient: Axios,
  title: string
): Promise<AnimeData> {
  const result = await httpClient.get(
    `https://consumet-api.herokuapp.com/anime/gogoanime/${title}`
  );

  const list: AnimeData[] = Array.isArray(result.data?.results)
    ? result.data.results
    : [];

  if (list.length < 1) {
    throw Error();
  }

  return list[0];
}

export async function getAnimeUrls(
  httpClient: Axios,
  animeId: string,
  episode: number
) {
  const subAnime = httpClient.get(
    `https://consumet-api.herokuapp.com/anime/gogoanime/watch/${animeId}-episode-${episode}`
  );
  const dubAnime = httpClient.get(
    `https://consumet-api.herokuapp.com/anime/gogoanime/watch/${animeId}-dub-episode-${episode}`
  );

  const [subResult, dubResult] = await Promise.all([subAnime, dubAnime]);

  const subSources = subResult.data as AnimeSourceData;
  const dubSources = dubResult.data as AnimeSourceData;

  return {
    subSources,
    dubSources,
  };
}
