import path from "path"
import { fileURLToPath } from "url";

export default class tetrisManager {
    async loadTetrisPage(req,res){
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        res.sendFile(path.join(__dirname, '../public/tetris.html'));
    }
}