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
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.email = process.env.EMAIL || 'casapazminoV3@gmail.com';
const pass = process.env.PASSWORD || 'fulltimev3';
const smtpTransport = nodemailer_1.default.createTransport({
    service: 'Gmail',
    auth: {
        user: exports.email,
        pass: pass
    }
});
exports.enviarMail = function (data) {
    smtpTransport.sendMail(data, (error, info) => __awaiter(this, void 0, void 0, function* () {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    }));
};
