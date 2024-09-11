"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const tetris_controller_1 = __importDefault(require("../controllers/tetris.controller"));
const tetrisController = new tetris_controller_1.default();
const _dirname = path_1.default.dirname(__filename);
const tetrisRouter = express_1.default.Router();
tetrisRouter.use(express_1.default.static(path_1.default.join(_dirname, '../../public')));
tetrisRouter.get('/', tetrisController.loadTetrisPage);
exports.default = tetrisRouter;
