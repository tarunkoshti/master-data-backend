import dotenv from 'dotenv';
dotenv.config();

// import fs from 'fs';
// import http from 'http';
// import https from 'https';
// import app from './app.js';
// import { port } from './config/base.js';
// import Logger from './core/utils/logger.js';

// let server;
// const sslDirExists = fs.existsSync('./ssl');

// if (sslDirExists && fs.existsSync('./ssl/private.key') && fs.existsSync('./ssl/certificate.crt')) {
//   try {
//     const options = {
//       key: fs.readFileSync('./ssl/private.key'),
//       cert: fs.readFileSync('./ssl/certificate.crt'),
//     };
//     // ca bundle is optional
//     if (fs.existsSync('./ssl/ca_bundle.crt')) {
//       const caContent = fs.readFileSync('./ssl/ca_bundle.crt');
//       if (caContent.length > 0) {
//         options.ca = caContent;
//       }
//     }
//     server = https.createServer(options, app);
//     Logger.info("Starting HTTPS Server...");
//   } catch (e) {
//     Logger.warn("Failed to initialize HTTPS (invalid certificates), falling back to HTTP: " + e.message);
//     server = http.createServer(app);
//   }
// } else {
//   Logger.info("SSL certificates not found, starting HTTP Server...");
//   server = http.createServer(app);
// }

// server
//   .listen(port, () => {
//     Logger.info(`Server running on port : ${port}`);
//   })
//   .on('error', (e) => Logger.error(e));

import app from "./app.js"
import { port } from './config/base.js';
import Logger from "./core/utils/logger.js";

app
  .listen(port, () => {
    Logger.info(`Server running on port : ${port}`);
  })
  .on('error', (e) => Logger.error(e));
