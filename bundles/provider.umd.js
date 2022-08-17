/*
{
  "name": "My Provider Package",
  "id": "com.syncler.kosmos.mypackage",
  "version": 3,
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
                    url: 'https://github.com/ietf-wg-cellar/matroska-test-files/blob/master/test_files/test1.mkv?raw=true',
                };
                if (request.movie) {
                    reject();
                    return;
                }
                const { show: item, episodeNumber, seasonNumber } = request.episode;
                sources.push({
                    ...defaults,
                    host: JSON.stringify(Object.keys(this)),
                });
                sources.push({
                    ...defaults,
                    host: JSON.stringify(item.titles.original),
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
