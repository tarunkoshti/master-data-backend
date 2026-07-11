// import dotenv from 'dotenv';
// dotenv.config();

// // Polyfill global Headers if running on older Node.js versions (< v18) in production
// if (typeof globalThis.Headers === 'undefined') {
//   try {
//     // Tier 1: Try undici (standard for modern Node)
//     const { Headers } = await import('undici');
//     globalThis.Headers = Headers;
//   } catch (err1) {
//     try {
//       // Tier 2: Try node-fetch (highly compatible with older Node)
//       const { Headers } = await import('node-fetch');
//       globalThis.Headers = Headers;
//     } catch (err2) {
//       // Tier 3: Custom SimpleHeaders class (works on any Node version, zero dependencies)
//       class SimpleHeaders {
//         constructor(init = {}) {
//           this.map = {};
//           if (init) {
//             if (typeof init.forEach === 'function') {
//               init.forEach((value, name) => {
//                 this.append(name, value);
//               });
//             } else if (Array.isArray(init)) {
//               for (const [name, value] of init) {
//                 this.append(name, value);
//               }
//             } else if (typeof init === 'object') {
//               for (const [key, value] of Object.entries(init)) {
//                 this.append(key, value);
//               }
//             }
//           }
//         }
//         append(name, value) {
//           const key = name.toLowerCase();
//           if (this.map[key]) {
//             this.map[key] += ', ' + value;
//           } else {
//             this.map[key] = String(value);
//           }
//         }
//         get(name) {
//           return this.map[name.toLowerCase()] || null;
//         }
//         has(name) {
//           return name.toLowerCase() in this.map;
//         }
//         set(name, value) {
//           this.map[name.toLowerCase()] = String(value);
//         }
//         forEach(callback) {
//           for (const [key, value] of Object.entries(this.map)) {
//             callback(value, key, this);
//           }
//         }
//         entries() {
//           return Object.entries(this.map);
//         }
//       }
//       globalThis.Headers = SimpleHeaders;
//       console.log("[Auth Polyfill] Global Headers successfully defined using custom SimpleHeaders.");
//     }
//   }
// }

// // Polyfill global Blob if running on older Node.js versions (< v18)
// if (typeof globalThis.Blob === 'undefined') {
//   try {
//     const { Blob } = await import('buffer');
//     globalThis.Blob = Blob;
//   } catch (err) {
//     class DummyBlob {
//       constructor(parts = [], options = {}) {
//         this.parts = parts;
//         this.type = options.type || '';
//         this.size = parts.reduce((acc, part) => acc + (part.length || 0), 0);
//       }
//     }
//     globalThis.Blob = DummyBlob;
//   }
// }

// // Polyfill global FormData
// if (typeof globalThis.FormData === 'undefined') {
//   class DummyFormData {
//     append() {}
//     delete() {}
//     get() {}
//     getAll() { return []; }
//     has() { return false; }
//     set() {}
//   }
//   globalThis.FormData = DummyFormData;
// }

// // Polyfill global Request
// if (typeof globalThis.Request === 'undefined') {
//   class DummyRequest {
//     constructor(input, init = {}) {
//       this.url = typeof input === 'string' ? input : input.url;
//       this.method = init.method || 'GET';
//       this.headers = new globalThis.Headers(init.headers);
//     }
//   }
//   globalThis.Request = DummyRequest;
// }

// // Polyfill global Response
// if (typeof globalThis.Response === 'undefined') {
//   class DummyResponse {
//     constructor(body, init = {}) {
//       this.ok = init.status >= 200 && init.status < 300;
//       this.status = init.status || 200;
//       this.headers = new globalThis.Headers(init.headers);
//     }
//   }
//   globalThis.Response = DummyResponse;
// }

// // Polyfill global AbortController and AbortSignal
// if (typeof globalThis.AbortController === 'undefined') {
//   class DummyAbortSignal {
//     constructor() { this.aborted = false; }
//   }
//   class DummyAbortController {
//     constructor() { this.signal = new DummyAbortSignal(); }
//     abort() {}
//   }
//   globalThis.AbortController = DummyAbortController;
//   globalThis.AbortSignal = DummyAbortSignal;
// }

// import fs from 'fs';
// import http from 'http';
// import https from 'https';
// import app from './app.js';
// import { port } from './config/base.js';
// import Logger from './core/utils/logger.js';

// let server;
// const sslDirExists = fs.existsSync('./ssl');

// if (sslDirExists && fs.existsSync('./ssl/private.key') && fs.existsSync('./ssl/certificate.crt')) {
//     try {
//         const options = {
//             key: fs.readFileSync('./ssl/private.key'),
//             cert: fs.readFileSync('./ssl/certificate.crt'),
//         };
//         // ca bundle is optional
//         if (fs.existsSync('./ssl/ca_bundle.crt')) {
//             const caContent = fs.readFileSync('./ssl/ca_bundle.crt');
//             if (caContent.length > 0) {
//                 options.ca = caContent;
//             }
//         }
//         server = https.createServer(options, app);
//         Logger.info("Starting HTTPS Server...");
//     } catch (e) {
//         Logger.warn("Failed to initialize HTTPS (invalid certificates), falling back to HTTP: " + e.message);
//         server = http.createServer(app);
//     }
// } else {
//     Logger.info("SSL certificates not found, starting HTTP Server...");
//     server = http.createServer(app);
// }

import app from "./app.js"
import { port } from './config/base.js';
import Logger from "./core/utils/logger.js";

app
  .listen(port, () => {
    Logger.info(`Server running on port : ${port}`);
  })
  .on('error', (e) => Logger.error(e));
