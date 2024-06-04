import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tetrisRouter = express.Router();

tetrisRouter.use(express.static(path.join(__dirname, '../public')));
tetrisRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/tetris.html'));
})

export default tetrisRouter