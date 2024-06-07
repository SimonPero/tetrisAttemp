import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import tetrisManager from "../controllers/tetris.controller.js";
const tetrisController = new tetrisManager();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tetrisRouter = express.Router();

tetrisRouter.use(express.static(path.join(__dirname, '../public')));
tetrisRouter.get('/', tetrisController.loadTetrisPage)

export default tetrisRouter