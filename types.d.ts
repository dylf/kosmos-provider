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

export interface SourceRequest {
  [key: string]: unknown;
}

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
