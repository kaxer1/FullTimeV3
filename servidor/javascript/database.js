"use strict";
//Conexión con la base de datos POstgreSQL
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_pool_1 = __importDefault(require("pg-pool"));
const pool = new pg_pool_1.default({
    user: 'fulltime',
    host: '192.168.0.156',
    database: 'fullTimeV3',
    password: 'fulltime',
    port: 5432,
});
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log("Error durante la conexión", err);
    }
    else {
        console.log("Conexión exitosa");
    }
    //pool.end()
});
exports.default = pool;
