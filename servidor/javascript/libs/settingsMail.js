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
exports.enviarMail = exports.Credenciales = exports.email = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const database_1 = __importDefault(require("../database"));
exports.email = process.env.EMAIL || '';
let pass = process.env.PASSWORD || '';
// export let email: string;
// let pass: string;
exports.Credenciales = function (id_empresa) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let credenciales = yield database_1.default.query('SELECT correo, password_correo FROM cg_empresa WHERE id = $1', [id_empresa]).then(result => {
                return result.rows[0];
            });
            console.log('Credenciales === ', credenciales);
            exports.email = credenciales.correo;
            pass = credenciales.password_correo;
        }
        catch (error) {
            // console.log(error);
            console.info(error.toString());
        }
    });
};
exports.enviarMail = function (data) {
    console.log(exports.email, '>>>>>>', pass);
    const smtpTransport = nodemailer_1.default.createTransport({
        service: 'Gmail',
        auth: {
            user: exports.email,
            pass: pass
        }
    });
    try {
        smtpTransport.sendMail(data, (error, info) => __awaiter(this, void 0, void 0, function* () {
            console.log('****************************************************');
            console.log(data);
            console.log('****************************************************');
            if (error) {
                console.warn(error);
            }
            else {
                console.log('Email sent: ' + info.response);
            }
        }));
    }
    catch (error) {
        console.log(error.toString());
        return { err: error.toString() };
    }
};
