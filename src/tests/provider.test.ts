import { ProviderEnv, EpisodeRequest } from '../types.d';
/**
 * @vitest-environment jsdom
 */
import axios from 'axios';
import { describe, test, expect } from 'vitest';
import { Provider } from '../provider';
import data from './searchFixture.json';

describe('Test the kosmos provider', () => {
  test('it gets sources for anime', async () => {
    const myProvider = new Provider();
    const providerEnv: ProviderEnv = {
      persistentStorage: {
        persistent: false,
        baseUrl: '',
      },
      sessionStorage: {
        persistent: false,
        baseUrl: '',
      },
      httpClientFactory: {
        createNewInstance: () => axios,
      },
      app: {
        jwtToken: '',
      },
      user: {
        premium: true,
        languages: ['en'],
      },
    };

    const episodeRequest: EpisodeRequest = {
      episode: {
        episodeNumber: 1,
        seasonNumber: 1,
        show: {
          titles: {
            main: {
              title: data[0]['title'],
              language: 'english',
            },
          },
          release: Date.now(),
          ids: {
            imdb: '1',
            tmdb: '',
            trakt: '',
            tvdb: '',
            mal: '',
          },
          standard: false,
          anime: true,
          thirdParty: true,
          url: '',
        },
      },
    };

    const sources = await myProvider.search(providerEnv, episodeRequest);
    sources.forEach((s) => console.log(s));
    expect(sources).toHaveLength(4);
  });
});
