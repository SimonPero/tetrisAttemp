import path from "path"
import { Request, Response } from "express";

export default class tetrisManager {
    async loadTetrisPage(req:Request,res:Response){
        const __dirname = path.dirname(__filename);
        res.sendFile(path.join(__dirname, '../../public/tetris.html'));
    }
}