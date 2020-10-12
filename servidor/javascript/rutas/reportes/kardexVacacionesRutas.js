"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kardexVacacionesControlador_1 = require("../../controlador/reportes/kardexVacacionesControlador");
const express_1 = require("express");
const verificarToken_1 = require("../../libs/verificarToken");
class KardexVacacionesRutas {
    constructor() {
        this.router = express_1.Router();
        this.configuracion();
    }
    configuracion() {
        // solicita empleados
        this.router.get('/:desde/:hasta', verificarToken_1.TokenValidation, kardexVacacionesControlador_1.KARDEX_VACACION_CONTROLADOR.CarcularVacacionByIdToken);
        // solicita administrador
        this.router.get('/:id_empleado/:desde/:hasta', verificarToken_1.TokenValidation, kardexVacacionesControlador_1.KARDEX_VACACION_CONTROLADOR.CarcularVacacionByIdEmpleado);
        // Reporte de horas extras solo del empleado
        this.router.get('/hora-extra/:id_empleado/:desde/:hasta', verificarToken_1.TokenValidation, kardexVacacionesControlador_1.KARDEX_VACACION_CONTROLADOR.CarcularHorasExtras);
    }
}
exports.KARDEX_VACACION_RUTAS = new KardexVacacionesRutas();
exports.default = exports.KARDEX_VACACION_RUTAS.router;
