import type {
  Bundle,
  ProviderMetadata,
  ProviderEnv,
  Source,
  SourceRequest,
  SourceProvider,
  ProviderPackage,
} from './types';

class Provider implements SourceProvider {
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

      let keys = Object.keys(request);
      keys.forEach((variable) => {
        sources.push({
          providerName: 'false',
          name: 'thefilename.mkv',
          resolved: true,
          host: JSON.stringify(variable),
          quality: '4k',
          url: 'https://file-examples.com/storage/fe522079b962f100d94fb66/2017/04/file_example_MP4_480_1_5MG.mp4',
        });
        sources.push({
          providerName: 'false',
          name: 'thefilename.mkv',
          resolved: true,
          host: JSON.stringify(request[variable]),
          quality: '4k',
          url: 'https://file-examples.com/storage/fe522079b962f100d94fb66/2017/04/file_example_MP4_480_1_5MG.mp4',
        });
      });
      resolve(sources);
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
