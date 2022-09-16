/*
{
  "name": "My Provider Package",
  "id": "com.syncler.kosmos.mypackage",
  "version": 16,
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
                    premium: true,
                    name: 'name',
                    resolved: false,
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
                            url: 'https://na-991.files.nextcdn.org/hls/01/c9504d22e58850680f856b8dd73e69d0db630988553f5602e0138524e14df4d6/owo.m3u8',
                            quality: source.quality,
                            subbed: false,
                            dubbed: true,
                            resolved: true,
                            headers: {
                                Referer: 'https://kwik.cx/',
                            },
                        });
                    });
                    sources.push({
                        ...defaults,
                        host: 'GaGa',
                        url: 'https://wwwx19.gogocdn.stream/videos/hls/Q8ac5SMyJO3mcuhZa47lwA/1663308826/14328/334ff10f2eac9773b951c0373b65a355/ep.1.1662458242.360.m3u8',
                        subbed: false,
                        quality: '360p',
                        dubbed: true,
                        resolved: true,
                    });
                    sources.push({
                        ...defaults,
                        host: 'GaGa',
                        url: 'https://wwwx19.gogocdn.stream/videos/hls/Q8ac5SMyJO3mcuhZa47lwA/1663308826/14328/334ff10f2eac9773b951c0373b65a355/ep.1.1662458242.360.m3u8',
                        subbed: false,
                        quality: '360p',
                        dubbed: true,
                        resolved: true,
                        headers: {
                            Referer: 'https://gogohd.net/streaming.php?id=MTQzMjg=&title=Cowboy+Bebop+Episode+1',
                        },
                    });
                    resolve(sources);
                });
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
    exports.Provider = Provider;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
