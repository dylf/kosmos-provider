import type {
  Bundle,
  ProviderMetadata,
  ProviderEnv,
  Source,
  SourceRequest,
  SourceProvider,
  ProviderPackage,
} from './types';

import { getAnimeData, getAnimeUrls } from './searchAnime';

export class Provider implements SourceProvider {
  metadata: ProviderMetadata;

  constructor() {
    this.metadata = {
      name: '<My Provider />',
      premium: false,
      containsTorrents: false,
      requiresDebrid: false,
      data: {},
    };
  }

  search(env: ProviderEnv, request: SourceRequest): Promise<Source[]> {
    return new Promise((resolve, reject) => {
      let sources: Array<Source> = [];

      if (request.movie) {
        reject();
        return;
      }
      const { show: item, episodeNumber } = request.episode;
      if (!item.anime) {
        reject();
        return;
      }

      const defaults = {
        providerName: 'myprovider',
        host: 'Default',
        premium: true,
        name: 'name',
        resolved: false,
      };
      const axios = env.httpClientFactory.createNewInstance();

      if (process.env.NODE_ENV !== 'production') {
        axios.post(`https://${process.env.SUBDOMAIN}.loca.lt/`, {
          ';some stuff': 'other stuff',
        });
      }

      getAnimeData(axios, item.titles.main.title)
        .then(({ id }) => {
          return getAnimeUrls(axios, id, episodeNumber);
        })
        .then(({ subSources, dubSources }) => {
          subSources.sources.forEach((source) => {
            sources.push({
              ...defaults,
              url: source.url,
              quality: source.quality,
              subbed: true,
              dubbed: false,
              headers: subSources.headers,
            });
          });
          dubSources.sources.forEach((source) => {
            sources.push({
              ...defaults,
              url: source.url,
              quality: source.quality,
              subbed: false,
              dubbed: true,
              resolved: true,
              headers: dubSources.headers,
            });
          });

          resolve(sources);
        });
    });
  }
}

class MyPackage implements ProviderPackage {
  sourceProviders: Array<SourceProvider>;

  constructor() {
    this.sourceProviders = [new Provider()];
  }

  createBundle(env: ProviderEnv, request: SourceRequest): Promise<Bundle> {
    return new Promise((resolve, reject) => {
      let bundle = {
        sources: [],
        sourceProviderMetadatas: this.sourceProviders.map((i) => i.metadata),
      };
      resolve(bundle);
    });
  }

  createSourceProvider(env: ProviderEnv, metadata: ProviderMetadata) {
    /**
     * Here we are just matching the name of the provider supplied in metadata object
     * and returning that instance from our already initialized list of source providers
     */
    return this.sourceProviders.filter(
      (p) => p.metadata.name == metadata.name
    )[0];
  }
}

export { MyPackage };
