"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nacionalidadControlador_1 = __importDefault(require("../../controlador/nacionalidad/nacionalidadControlador"));
const VerificarToken_1 = require("../../libs/VerificarToken");
class NacionalidadRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', VerificarToken_1.TokenValidation, nacionalidadControlador_1.default.list);
    }
}
const nacionalidadRutas = new NacionalidadRutas();
exports.default = nacionalidadRutas.router;
