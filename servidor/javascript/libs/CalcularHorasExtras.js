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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalcularHoraExtra = function (id_empleado, fec_desde, fec_hasta) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(id_empleado, fec_desde, fec_hasta);
    });
};
/**************************************************************************
 *        /\                     _______________  _________
 *       /  \       |          |        |        |         |
 *      /    \      |          |        |        |         |
 *     /      \     |          |        |        |         |
 *    /--------\    |          |        |        |         |
 *   /          \   |          |        |        |         |
 *  /            \  |          |        |        |         |
 * /              \ |__________|        |        |_________|
 ***************************************************************************/
exports.GenerarHoraExtraCalulo = function (id_hora_extr_pedido) {
    return __awaiter(this, void 0, void 0, function* () {
        // let hora_extra_pedida = await pool.query('SELECT fec_inicio, fec_final')
    });
};
