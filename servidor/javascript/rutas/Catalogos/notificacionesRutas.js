"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificacionesControlador_1 = __importDefault(require("../../controlador/Catalogos/notificacionesControlador"));
class NotificacionesRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        this.router.get('/', notificacionesControlador_1.default.list);
        this.router.get('/:id', notificacionesControlador_1.default.getOne);
        this.router.post('/', notificacionesControlador_1.default.create);
    }
}
const notificacionesRutas = new NotificacionesRutas();
exports.default = notificacionesRutas.router;
