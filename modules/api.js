import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import * as httpImport from "http";
const http = httpImport.Server(app);

export { app, http };
