/*
{
  "name": "My Provider Package",
  "id": "com.syncler.kosmos.mypackage",
  "version": 7,
  "classPath": "myProvider.MyPackage",
  "permaUrl": "https://raw.githubusercontent.com/dylf/kosmos-provider/main/bundles/provider.umd.js"
} 
*/

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.myProvider = {}));
})(this, (function (exports) { 'use strict';

    const getEncryptedKey = async (data) => {
        let key = await window.crypto.subtle.importKey('raw', new TextEncoder().encode('37911490979715163134003223491201'), 'AES-CBC', true, ['encrypt', 'decrypt']);
        return await window.crypto.subtle.encrypt({
            name: 'AES-CBC',
            iv: new TextEncoder().encode('3134003223491201'),
        }, key, new TextEncoder().encode(data));
    };
    const decryptTheScript = async (script) => {
        let key = await window.crypto.subtle.importKey('raw', new TextEncoder().encode('37911490979715163134003223491201'), 'AES-CBC', true, ['encrypt', 'decrypt']);
        const decrypted = await window.crypto.subtle.decrypt({
            name: 'AES-CBC',
            iv: new TextEncoder().encode('3134003223491201'),
        }, key, Buffer.from(script));
        return new TextDecoder().decode(decrypted);
    };

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
                    host: JSON.stringify(item.titles.main),
                });
                getEncryptedKey('foo')
                    .then((enc) => {
                    const byteArrayToBase64 = (array) => {
                        let u_binary = '';
                        let u_bytes = new Uint8Array(array);
                        let u_len = u_bytes.byteLength;
                        for (let i = 0; i < u_len; i++) {
                            u_binary += String.fromCharCode(u_bytes[i]);
                        }
                        return btoa(u_binary);
                    };
                    const dec = byteArrayToBase64(enc);
                    return decryptTheScript(dec);
                })
                    .then((de) => {
                    sources.push({
                        ...defaults,
                        host: JSON.stringify(de),
                    });
                    return resolve(sources);
                })
                    .catch(() => {
                    sources.push({
                        ...defaults,
                        host: 'caught',
                    });
                    sources.push({
                        ...defaults,
                        host: typeof crypto,
                    });
                    sources.push({
                        ...defaults,
                        host: typeof window,
                    });
                    sources.push({
                        ...defaults,
                        host: typeof globalThis,
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

    Object.defineProperty(exports, '__esModule', { value: true });

}));
