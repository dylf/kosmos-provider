/*
{
  "name": "My Provider Package",
  "id": "com.syncler.kosmos.mypackage",
  "version": 1,
  "classPath": "myProvider.MyPackage"
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
                name: 'WatchNow',
                premium: false,
                containsTorrents: false,
                requiresDebrid: false,
                data: {},
            };
        }
        search(env, request) {
            return new Promise((resolve, reject) => {
                let sources = [];
                let keys = Object.getOwnPropertyNames(env.httpClientFactory);
                keys.forEach((variable) => {
                    sources.push({
                        providerName: 'false',
                        name: 'thefilename.mkv',
                        resolved: true,
                        host: JSON.stringify(variable),
                        quality: '4k',
                        url: 'https://file-examples.com/storage/fe522079b962f100d94fb66/2017/04/file_example_MP4_480_1_5MG.mp4',
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