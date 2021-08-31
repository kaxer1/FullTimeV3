"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IndexControlador {
    index(req, res) {
        res.jsonp({ text: 'Probando funciones' });
    }
}
exports.indexControlador = new IndexControlador();
