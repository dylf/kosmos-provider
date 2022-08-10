import type { Axios } from 'axios';

export interface ProviderMetadata {
  name: string;
  premium: boolean;
  containsTorrents: boolean;
  requiresDebrid?: boolean;
  data?: {
    [key: string]: unknown;
  };
}

export interface ProviderEnv {
  persistentStorage: {
    persistent: boolean;
    baseUrl: string;
  };
  sessionStorage: {
    persistent: boolean;
    baseUrl: string;
  };
  httpClientFactory: {
    createNewInstance: () => Axios;
  };
  app: {
    jwtToken: string;
  };
  user: {
    premium: boolean;
    languages: Array<string>;
  };
}

type Title = {
  title: string;
  language: string;
};
interface ContentItem {
  titles: {
    main: Title;
    original?: Title;
    alternate?: Array<Title>;
  };
  cast?: Array<String>;
  crew?: Array<String>;
  release: number; // unix timestamp
  ids: {
    imdb: string;
    tmdb: string;
    trakt: string;
    tvdb: string;
    mal: string;
  };
  standard: boolean; // true for all content retrieved from trakt/tmdb
  anime: boolean; // true for all content retrieved from mal/anilist
  thirdParty: boolean; // true for all content retrieved from third party sources
  url: string; // url of where the item was retrieved from
}

interface MovieRequest {
  movie: ContentItem;
  episode: never;
}

interface EpisodeRequest {
  episode: {
    episodeNumber: number;
    seasonNumber: number;
    show: ContentItem;
  };
  movie: never;
}

export type SourceRequest = MovieRequest | EpisodeRequest;

export interface Source {
  url: string;
  headers?: {
    [key: string]: string;
  };
  providerName: string;
  name?: string;
  sizeInBytes?: number;
  premium?: boolean;
  resolved?: boolean;
  host?: string;
  subbed?: boolean;
  dubbed?: boolean;
  quality?: string;
  height?: number;
  width?: number;
  seeders?: number;
  peers?: number;
  androidPackageName?: string;
  androidPackageData?: string;
}

export interface SourceProvider {
  metadata: ProviderMetadata;
  search: (env: ProviderEnv, request: SourceRequest) => Promise<Source[]>;
}

export interface Bundle {
  sources: Source[];
  sourceProviderMetadatas: ProviderMetadata[];
}

export interface ProviderPackage {
  sourceProviders: Array<SourceProvider>;
  createBundle: (env: ProviderEnv, request: SourceRequest) => Promise<Bundle>;
  createSourceProvider: (
    env: ProviderEnv,
    metadata: ProviderMetadata
  ) => SourceProvider;
}
