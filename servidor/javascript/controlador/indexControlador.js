"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IndexControlador {
    index(req, res) {
        res.json({ text: 'Probando funciones' });
    }
}
exports.indexControlador = new IndexControlador();
