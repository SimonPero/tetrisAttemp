import express from "express";
import path from "path";
import tetrisManager from "../controllers/tetris.controller";
const tetrisController = new tetrisManager();

const _dirname = path.dirname(__filename);
const tetrisRouter = express.Router();

tetrisRouter.use(express.static(path.join(_dirname, '../../public')));
tetrisRouter.get('/', tetrisController.loadTetrisPage)

export default tetrisRouter