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
const nodemailer = require("nodemailer");
class VacacionesControlador {
    ListarVacaciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const VACACIONES = yield database_1.default.query('SELECT v.fec_inicio, v.fec_final, v.fec_ingreso, v.estado, v.dia_libre, v.dia_laborable, v.legalizado, v.id, v.id_peri_vacacion, e.nombre, e.apellido FROM vacaciones AS v, peri_vacaciones AS p, empl_contratos AS c, empleados AS e WHERE v.id_peri_vacacion = p.id AND p.id_empl_contrato = c.id AND c.id_empleado = e.id ORDER BY id DESC');
            if (VACACIONES.rowCount > 0) {
                return res.jsonp(VACACIONES.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    ListarUnaVacacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const VACACIONES = yield database_1.default.query('SELECT v.fec_inicio, v.fec_final, v.fec_ingreso, v.estado, v.dia_libre, v.dia_laborable, v.legalizado, v.id, v.id_peri_vacacion, pv.id_empl_contrato AS id_contrato, ec.id_empleado FROM vacaciones AS v, peri_vacaciones AS pv, empl_contratos AS ec WHERE v.id = $1 AND v.id_peri_vacacion = pv.id AND ec.id = pv.id_empl_contrato', [id]);
            if (VACACIONES.rowCount > 0) {
                return res.jsonp(VACACIONES.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    CrearVacaciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fec_inicio, fec_final, fec_ingreso, estado, dia_libre, dia_laborable, legalizado, id_peri_vacacion, idContrato } = req.body;
            yield database_1.default.query('INSERT INTO vacaciones (fec_inicio, fec_final, fec_ingreso, estado, dia_libre, dia_laborable, legalizado, id_peri_vacacion) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [fec_inicio, fec_final, fec_ingreso, estado, dia_libre, dia_laborable, legalizado, id_peri_vacacion]);
            const ultimo = yield database_1.default.query('SELECT * FROM vacaciones  ORDER BY id DESC LIMIT 1');
            const JefesDepartamentos = yield database_1.default.query('SELECT da.id, cg.id AS id_dep, s.id AS id_suc, cg.nombre AS departamento, s.nombre AS sucursal, ecr.id AS cargo, ecn.id AS contrato, e.id AS empleado, e.nombre, e.cedula, e.correo FROM depa_autorizaciones AS da, empl_cargos AS ecr, cg_departamentos AS cg, sucursales AS s ,empl_contratos AS ecn, empleados AS e WHERE da.id_empl_cargo = ecr.id AND da.id_departamento = cg.id AND cg.id_sucursal = s.id AND ecr.id_empl_contrato = ecn.id AND ecn.id_empleado = e.id');
            const correoInfoPidePermiso = yield database_1.default.query('SELECT e.correo, e.nombre, e.apellido, e.cedula, ecr.id_departamento, ecr.id_sucursal, ecr.id AS cargo FROM empl_contratos AS ecn, empleados AS e, empl_cargos AS ecr WHERE ecn.id = $1 AND ecn.id_empleado = e.id AND ecn.id = ecr.id_empl_contrato ORDER BY cargo DESC', [idContrato]);
            const email = process.env.EMAIL;
            const pass = process.env.PASSWORD;
            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: email,
                    pass: pass
                }
            });
            let id_departamento_autoriza;
            let id_empleado_autoriza;
            JefesDepartamentos.rows.forEach(obj => {
                if (obj.id_dep === correoInfoPidePermiso.rows[0].id_departamento && obj.id_suc === correoInfoPidePermiso.rows[0].id_sucursal) {
                    var url = `${process.env.URL_DOMAIN}/ver-vacacion`;
                    id_departamento_autoriza = obj.id_dep;
                    id_empleado_autoriza = obj.empleado;
                    let data = {
                        to: obj.correo,
                        from: email,
                        subject: 'Solicitud de vacaciones',
                        html: `<p><b>${correoInfoPidePermiso.rows[0].nombre} ${correoInfoPidePermiso.rows[0].apellido}</b> con número de
        cédula ${correoInfoPidePermiso.rows[0].cedula} solicita vacaciones desde la fecha ${fec_inicio.split("T")[0]}
        hasta ${fec_final.split("T")[0]} </p>
        <a href="${url}/${ultimo.rows[0].id}">Ir a verificar permiso</a>`
                    };
                    console.log(data);
                    smtpTransport.sendMail(data, (error, info) => __awaiter(this, void 0, void 0, function* () {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log('Email sent: ' + info.response);
                        }
                    }));
                }
            });
            // res.jsonp({  message: 'Vacaciones guardadas con éxito'});
            res.jsonp({ message: 'Vacaciones guardadas con éxito', id_vacacion: ultimo.rows[0].id, id_departamento_autoriza, id_empleado_autoriza, estado });
        });
    }
    VacacionesIdPeriodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const VACACIONES = yield database_1.default.query('SELECT v.fec_inicio, v.fec_final, fec_ingreso, v.estado, v.dia_libre, v.dia_laborable, v.legalizado, v.id, v.id_peri_vacacion FROM vacaciones AS v, peri_vacaciones AS p WHERE v.id_peri_vacacion = p.id AND p.id = $1', [id]);
            if (VACACIONES.rowCount > 0) {
                return res.jsonp(VACACIONES.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'No se encuentran registros' });
            }
        });
    }
    ObtenerFechasFeriado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fechaSalida, fechaIngreso } = req.body;
            const FECHAS = yield database_1.default.query('SELECT fecha FROM cg_feriados WHERE fecha BETWEEN $1 AND $2 ORDER BY fecha ASC', [fechaSalida, fechaIngreso]);
            if (FECHAS.rowCount > 0) {
                return res.jsonp(FECHAS.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'Registros no encontrados' });
            }
        });
    }
    ActualizarEstado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { estado } = req.body;
            yield database_1.default.query('UPDATE vacaciones SET estado = $1 WHERE id = $2', [estado, id]);
            res.json({ message: 'Estado de permiso actualizado exitosamente' });
        });
    }
}
exports.VACACIONES_CONTROLADOR = new VacacionesControlador();
exports.default = exports.VACACIONES_CONTROLADOR;
