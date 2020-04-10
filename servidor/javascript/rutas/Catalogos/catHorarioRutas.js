"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catHorarioControlador_1 = __importDefault(require("../../controlador/Catalogos/catHorarioControlador"));
const path = require('path');
const multer = require('multer');
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './plantillas/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });
class HorarioRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', catHorarioControlador_1.default.ListarHorarios);
        this.router.get('/:id', catHorarioControlador_1.default.ObtenerUnHorario);
        this.router.post('/upload', upload.single('file'), catHorarioControlador_1.default.CrearHorario);
    }
}
const HORARIO_RUTAS = new HorarioRutas();
exports.default = HORARIO_RUTAS.router;
