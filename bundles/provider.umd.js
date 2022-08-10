/*
{
  "name": "My Provider Package",
  "id": "com.syncler.kosmos.mypackage",
  "version": 2,
  "classPath": "myProvider.MyPackage",
  "permaUrl": "https://raw.githubusercontent.com/dylf/kosmos-provider/main/bundles/provider.umd.js"
} 
*/

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.myProvider = {}));
})(this, (function (exports) { 'use strict';

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
                const defaults = {
                    providerName: 'false',
                    name: 'thefilename.mkv',
                    resolved: true,
                    quality: '4k',
                    url: 'https://file-examples.com/storage/fe522079b962f100d94fb66/2017/04/file_example_MP4_480_1_5MG.mp4',
                };
                let item;
                if (request.movie) {
                    const { movie, ...rest } = request;
                    item = request.movie;
                    if (rest) {
                        sources.push({
                            ...defaults,
                            host: JSON.stringify(rest),
                        });
                    }
                }
                else {
                    const { show, ...rest } = request.episode;
                    item = request.episode.show;
                    if (rest) {
                        sources.push({
                            ...defaults,
                            host: JSON.stringify(rest),
                        });
                    }
                }
                sources.push({
                    ...defaults,
                    host: JSON.stringify(item.titles.main),
                });
                sources.push({
                    ...defaults,
                    host: JSON.stringify(item.titles.original),
                });
                sources.push({
                    ...defaults,
                    host: JSON.stringify(item.titles.alternate),
                });
                sources.push({
                    ...defaults,
                    host: JSON.stringify(item.ids),
                });
                sources.push({
                    ...defaults,
                    host: JSON.stringify(item.cast),
                });
                sources.push({
                    ...defaults,
                    host: JSON.stringify(item.crew),
                });
                sources.push({
                    ...defaults,
                    host: JSON.stringify(item.release),
                });
                sources.push({
                    ...defaults,
                    host: JSON.stringify(item.standard),
                });
                sources.push({
                    ...defaults,
                    host: JSON.stringify(item.anime),
                });
                sources.push({
                    ...defaults,
                    host: JSON.stringify(item.thirdParty),
                });
                sources.push({
                    ...defaults,
                    host: JSON.stringify(item.url),
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
