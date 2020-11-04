"use strict";
//Conexión con la base de datos PostgreSQL
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_pool_1 = __importDefault(require("pg-pool"));
const pool = new pg_pool_1.default({
    user: 'postgres',
    host: 'localhost',
    port: 5432,
<<<<<<< HEAD
    database: 'fulltime',
    password: 'fulltime'
=======
    database: 'fulltime3',
    //database: 'timbres',
    password: 'admin'
>>>>>>> 9dcb5cb2d65b85a3d117e6e3df78fa3a223569ea
});
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log("Error durante la conexión", err);
    }
    else {
        console.log("Conexión exitosa");
    }
});
exports.default = pool;
