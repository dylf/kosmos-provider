/*
{
  "name": "My Provider Package",
  "id": "com.syncler.kosmos.mypackage",
  "version": 10,
  "classPath": "myProvider.MyPackage",
  "permaUrl": "https://raw.githubusercontent.com/dylf/kosmos-provider/main/bundles/provider.umd.js"
} 
*/

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.myProvider = {}));
})(this, (function (exports) { 'use strict';

    async function getAnimeData(httpClient, title) {
        const result = await httpClient.get(`https://consumet-api.herokuapp.com/anime/gogoanime/${title}`);
        const list = Array.isArray(result.data?.results)
            ? result.data.results
            : [];
        if (list.length < 1) {
            throw Error();
        }
        return list[0];
    }
    async function getAnimeUrls(httpClient, animeId, episode) {
        const subAnime = httpClient.get(`https://consumet-api.herokuapp.com/anime/gogoanime/watch/${animeId}-episode-${episode}`);
        const dubAnime = httpClient.get(`https://consumet-api.herokuapp.com/anime/gogoanime/watch/${animeId}-dub-episode-${episode}`);
        const [subResult, dubResult] = await Promise.all([subAnime, dubAnime]);
        const subSources = subResult.data;
        const dubSources = dubResult.data;
        return {
            subSources,
            dubSources,
        };
    }

    class Provider {
        metadata;
        constructor() {
            this.metadata = {
                name: '<My Provider />',
                premium: false,
                containsTorrents: false,
                requiresDebrid: false,
                data: {},
            };
        }
        search(env, request) {
            return new Promise((resolve, reject) => {
                let sources = [];
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
                    host: 'GoGoAnime',
                    resolved: true,
                };
                const axios = env.httpClientFactory.createNewInstance();
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
                            headers: dubSources.headers,
                        });
                    });
                });
                resolve(sources);
            });
        }
    }
    class MyPackage {
        sourceProviders;
        constructor() {
            this.sourceProviders = [new Provider()];
        }
        createBundle(env, request) {
            return new Promise((resolve, reject) => {
                let bundle = {
                    sources: [],
                    sourceProviderMetadatas: this.sourceProviders.map((i) => i.metadata),
                };
                resolve(bundle);
            });
        }
        createSourceProvider(env, metadata) {
            return this.sourceProviders.filter((p) => p.metadata.name == metadata.name)[0];
        }
    }

    exports.MyPackage = MyPackage;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
