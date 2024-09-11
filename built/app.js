"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tetris_routes_1 = __importDefault(require("./routes/tetris.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8070;
app.use('/api/game', tetris_routes_1.default);
app.get('/', (req, res) => {
    res.redirect('/api/game');
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
