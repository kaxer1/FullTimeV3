"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.listaCarpetas = function (nombre_carpeta) {
    const ruta = path_1.default.resolve(nombre_carpeta);
    let Lista_Archivos = fs_1.default.readdirSync(ruta);
    // console.log(Lista_Archivos);
    return Lista_Archivos.map((obj) => {
        return {
            file: obj,
            extencion: obj.split('.')[1]
        };
    });
};
exports.DescargarArchivo = function (dir, filename) {
    const ruta = path_1.default.resolve(dir);
    return ruta + '\\' + filename;
};
