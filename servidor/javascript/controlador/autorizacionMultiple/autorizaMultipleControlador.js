"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../database"));
class AutorizacionMultipleControlador {
    CrearAutorizacionPlanHoraExtra(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orden, estado, id_departamento, id_permiso, id_vacacion, id_hora_extra, id_documento } = req.body;
            yield database_1.default.query('INSERT INTO autorizaciones ( orden, estado, id_departamento, id_permiso, id_vacacion, id_hora_extra, id_documento) VALUES ($1, $2, $3, $4, $5, $6, $7)', [orden, estado, id_departamento, id_permiso, id_vacacion, id_hora_extra, id_documento]);
            res.jsonp({ message: 'Autorización guardada' });
        });
    }
}
exports.AUTORIZACION_MULTIPLE_CONTROLADOR = new AutorizacionMultipleControlador();
exports.default = exports.AUTORIZACION_MULTIPLE_CONTROLADOR;
