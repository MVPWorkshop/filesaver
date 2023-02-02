import express from 'express';
const app = express();
import * as httpImport from 'http';
const http = httpImport.Server(app);

export { app, http };