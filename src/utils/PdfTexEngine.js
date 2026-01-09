export class PdfTexEngine {
    constructor() {
        this.loadPromise = null;
    }

    _loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
            document.body.appendChild(script);
        });
    }

    async _ensureLibraryLoaded() {
        if (this.loadPromise) return this.loadPromise;

        this.loadPromise = (async () => {
            const rootPath = '/third_party/texlive.js';
            const promiseLibUrl = `${rootPath}/promisejs/promise.js`;
            const scriptUrl = `${rootPath}/pdftex.js`;

            try {
                if (typeof window.promise === 'undefined') {
                    await this._loadScript(promiseLibUrl);
                }

                // Temporary hide environment globals to avoid script conflicts
                const oldEnv = {
                    define: window.define,
                    module: window.module,
                    exports: window.exports
                };
                window.define = window.module = window.exports = undefined;

                if (!window.PDFTeX && !window.pdftex) {
                    await this._loadScript(scriptUrl);
                }

                // Restore environment globals
                window.define = oldEnv.define;
                window.module = oldEnv.module;
                window.exports = oldEnv.exports;

            } catch (error) {
                this.loadPromise = null;
                throw error;
            }
        })();

        return this.loadPromise;
    }

    async compile(latexCode, images = []) {
        await this._ensureLibraryLoaded();

        const workerUrl = '/third_party/texlive.js/pdftex-worker.js';
        let engine = null;
        let logs = [];

        try {
            if (window.PDFTeX) {
                engine = new window.PDFTeX(workerUrl);
            } else if (window.pdftex) {
                window.pdftex_worker_url = workerUrl;
                engine = new window.pdftex();
            } else {
                throw new Error("TeX engine classes not found.");
            }

            // Capture logs
            engine.on_stdout = (msg) => logs.push(msg);
            engine.on_stderr = (msg) => logs.push(msg);

            if (engine.set_TOTAL_MEMORY) {
                engine.set_TOTAL_MEMORY(80 * 1024 * 1024);
            }

            // Load images into virtual FS
            if (images && images.length > 0) {
                for (const img of images) {
                    try {
                        const data = await this._fetchImage(img.url);
                        // Convert Uint8Array to binary string because of JSON.stringify in pdftex.js
                        const binaryData = this._uint8ArrayToBinaryString(data);
                        await engine.FS_createDataFile('/', img.name, binaryData, true, true);
                    } catch (e) {
                        logs.push(`[System] Warning: Failed to load image ${img.name} (${img.url}): ${e.message}`);
                    }
                }
            }

            const output = await engine.compile(latexCode);

            if (output === false) {
                const errorDetails = logs.slice(-15).join('\n');
                throw new Error(`Compilation failed. Check logs below.\n\n${errorDetails}`);
            }

            let finalBlob = null;
            if (typeof output === 'string' && output.startsWith('data:')) {
                finalBlob = this._base64ToBlob(output.split(',')[1]);
            } else if (typeof output === 'string' && output.startsWith('%PDF')) {
                finalBlob = this._binaryStringToBlob(output);
            } else if (output instanceof Uint8Array) {
                finalBlob = new Blob([output], { type: 'application/pdf' });
            }

            if (finalBlob) {
                return URL.createObjectURL(finalBlob);
            } else {
                throw new Error("Compiler returned unknown data format.");
            }

        } catch (err) {
            if (logs.length > 0 && !err.message.includes('Compilation failed')) {
                err.message += `\n\nLogs:\n${logs.join('\n')}`;
            }
            throw err;
        } finally {
            if (engine && engine.worker) {
                engine.worker.terminate();
            }
            engine = null;
        }
    }

    async _fetchImage(url) {
        try {
            const options = url.startsWith('data:') ? {} : { mode: 'cors' };
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const buffer = await response.arrayBuffer();
            return new Uint8Array(buffer);
        } catch (e) {
            throw new Error(`Fetch failed: ${e.message}`);
        }
    }

    _uint8ArrayToBinaryString(uint8Array) {
        const chunk_size = 8192;
        let binaryString = '';
        for (let i = 0; i < uint8Array.length; i += chunk_size) {
            const chunk = uint8Array.subarray(i, i + chunk_size);
            binaryString += String.fromCharCode.apply(null, chunk);
        }
        return binaryString;
    }

    _base64ToBlob(base64) {
        const binaryString = window.atob(base64);
        return this._binaryStringToBlob(binaryString);
    }

    _binaryStringToBlob(binaryString) {
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return new Blob([bytes], { type: 'application/pdf' });
    }
}

export const pdfTex = new PdfTexEngine();