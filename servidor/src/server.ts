require('dotenv').config();
const nodemailer = require("nodemailer");
import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';

// rutas importadas
import indexRutas from './rutas/indexRutas';
import ROLES_RUTAS from './rutas/catalogos/catRolesRutas';
import EMPLEADO_RUTAS from './rutas/empleado/empleadoRegistro/empleadoRutas';
import LOGIN_RUTA from './rutas/login/loginRuta';
import DISCAPACIDAD_RUTAS from './rutas/empleado/empleadoDiscapacidad/discapacidadRutas';
import TITULO_RUTAS from './rutas/catalogos/catTituloRutas';
import REGIMEN_RUTA from './rutas/catalogos/catRegimenRuta';
import FERIADOS_RUTA from './rutas/catalogos/catFeriadosRuta';
import TIPO_COMIDAS_RUTA from './rutas/catalogos/catTipoComidasRuta';
import RELOJES_RUTA from './rutas/catalogos/catRelojesRuta';
import PROVINCIA_RUTA from './rutas/catalogos/catProvinciaRutas';
import DEPARTAMENTO_RUTA from './rutas/catalogos/catDepartamentoRutas';
import PROCESO_RUTA from './rutas/catalogos/catProcesoRutas';
import HORARIO_RUTA from './rutas/catalogos/catHorarioRutas';
import ENROLADO_RUTA from './rutas/catalogos/catEnroladoRutas';
import USUARIO_RUTA from './rutas/usuarios/usuarioRutas';
import HORAS_EXTRAS_RUTAS from './rutas/catalogos/catHorasExtrasRutas';
import ROL_PERMISOS_RUTAS from './rutas/catalogos/catRolPermisosRutas';
import TIPO_PERMISOS_RUTAS from './rutas/catalogos/catTipoPermisosRutas';
import CIUDAD_RUTAS from './rutas/ciudades/ciudadesRutas';
import CIUDAD_FERIADOS_RUTAS from './rutas/ciudadFeriado/ciudadFeriadoRutas';
import NOTIFICACIONES_RUTAS from './rutas/catalogos/catNotificacionesRutas';
import CONTRATO_EMPLEADO_RUTAS from './rutas/empleado/empleadoContrato/contratoEmpleadoRutas';
import EMPLEADO_CARGO_RUTAS from './rutas/empleado/empleadoCargos/emplCargosRutas';
import PLAN_COMIDAS_RUTAS from './rutas/planComidas/planComidasRutas';
import ENROLADO_RELOJ_RUTAS from './rutas/enroladoReloj/enroladoRelojRutas';
import EMPRESA_RUTAS from './rutas/catalogos/catEmpresaRutas';
import SUCURSAL_RUTAS from './rutas/sucursal/sucursalRutas';
import NACIONALIDADES_RUTAS from './rutas/nacionalidad/nacionalidadRutas';
import NIVEL_TITULO_RUTAS from './rutas/nivelTitulo/nivelTituloRutas';
import PERIODO_VACACION__RUTAS from './rutas/empleado/empleadoPeriodoVacacion/periodoVacacionRutas';
import VACACIONES__RUTAS from './rutas/vacaciones/vacacionesRutas';
import EMPLEADO_PROCESO_RUTAS from './rutas/empleado/empleadoProcesos/empleProcesosRutas';
import PLAN_HORARIO_RUTAS from './rutas/horarios/planHorario/planHorarioRutas';
import DETALLE_PLAN_HORARIO_RUTAS from './rutas/horarios/detallePlanHorario/detallePlanHorarioRutas';
import AUTORIZA_DEPARTAMENTO_RUTAS from './rutas/autorizaDepartamento/autorizaDepartamentoRutas';
import EMPLEADO_HORARIOS_RUTAS from './rutas/horarios/empleadoHorarios/empleadoHorariosRutas';
import PERMISOS_RUTAS from './rutas/permisos/permisosRutas';
import DETALLE_CATALOGO_HORARIO_RUTAS from './rutas/horarios/detalleCatHorario/detalleCatHorarioRutas';
import NOTIFICACIONES_AUTORIZACIONES_RUTAS from './rutas/catalogos/catNotiAutorizacionesRutas';
import AUTORIZACIONES_RUTAS from './rutas/autorizaciones/autorizacionesRutas';
import PLANTILLA_RUTAS from './rutas/descargarPlantilla/plantillaRutas';
import NOTIFICACION_TIEMPO_REAL_RUTAS from './rutas/notificaciones/notificacionesRutas';
import DOCUMENTOS_RUTAS from './rutas/documentos/documentosRutas';
import HORA_EXTRA_PEDIDA_RUTAS from './rutas/horaExtra/horaExtraRutas';
import BIRTHDAY_RUTAS from './rutas/birthday/birthdayRutas';
import REPORTES_RUTAS from './rutas/reportes/reportesRutas';
import PLAN_HORAS_EXTRAS_RUTAS from './rutas/planHoraExtra/planHoraExtraRutas';
import { createServer, Server } from 'http';
const socketIo = require('socket.io');

class Servidor {

    public app: Application;
    private server: Server;
    private io: SocketIO.Server;

    constructor() {
        this.app = express();
        this.configuracion();
        this.rutas();
        this.server = createServer(this.app);
        this.io = socketIo(this.server);

    }

    configuracion(): void {
        this.app.set('puerto', process.env.PORT || 3000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.raw({ type: 'image/*', limit: '2Mb' }));

    }

    rutas(): void {
        this.app.use('/', indexRutas);
        this.app.use('/rol', ROLES_RUTAS);
        this.app.use('/login', LOGIN_RUTA);

        // Empleado
        this.app.use('/empleado', EMPLEADO_RUTAS);
        this.app.use('/contratoEmpleado', CONTRATO_EMPLEADO_RUTAS);
        this.app.use('/empleadoCargos', EMPLEADO_CARGO_RUTAS);
        this.app.use('/perVacacion', PERIODO_VACACION__RUTAS);
        this.app.use('/vacaciones', VACACIONES__RUTAS);
        this.app.use('/horas-extras-pedidas', HORA_EXTRA_PEDIDA_RUTAS);
        this.app.use('/empleadoProcesos', EMPLEADO_PROCESO_RUTAS);

        // Autorizaciones
        this.app.use('/autorizaDepartamento', AUTORIZA_DEPARTAMENTO_RUTAS);

        // Permisos
        this.app.use('/empleadoPermiso', PERMISOS_RUTAS);

        // Almuerzo
        this.app.use('/planComidas', PLAN_COMIDAS_RUTAS);

        // Horarios
        this.app.use('/planHorario', PLAN_HORARIO_RUTAS);
        this.app.use('/detallePlanHorario', DETALLE_PLAN_HORARIO_RUTAS);
        this.app.use('/empleadoHorario', EMPLEADO_HORARIOS_RUTAS);
        this.app.use('/detalleHorario', DETALLE_CATALOGO_HORARIO_RUTAS);

        // Enrolados
        this.app.use('/enrolados', ENROLADO_RUTA);
        this.app.use('/relojes', RELOJES_RUTA);
        this.app.use('/enroladosRelojes', ENROLADO_RELOJ_RUTAS);

        //Redireccionamiento a páginas que contienen catálogos
        this.app.use('/titulo', TITULO_RUTAS);
        this.app.use('/discapacidad', DISCAPACIDAD_RUTAS);
        this.app.use('/empresas', EMPRESA_RUTAS);
        this.app.use('/regimenLaboral', REGIMEN_RUTA);
        this.app.use('/feriados', FERIADOS_RUTA);
        this.app.use('/tipoComidas', TIPO_COMIDAS_RUTA);
        this.app.use('/provincia', PROVINCIA_RUTA);
        this.app.use('/departamento', DEPARTAMENTO_RUTA);
        this.app.use('/proceso', PROCESO_RUTA);
        this.app.use('/horario', HORARIO_RUTA);
        this.app.use('/horasExtras', HORAS_EXTRAS_RUTAS);
        this.app.use('/usuarios', USUARIO_RUTA);
        this.app.use('/horasExtras', HORAS_EXTRAS_RUTAS);
        this.app.use('/rolPermisos', ROL_PERMISOS_RUTAS);
        this.app.use('/tipoPermisos', TIPO_PERMISOS_RUTAS);
        this.app.use('/ciudades', CIUDAD_RUTAS);
        this.app.use('/ciudadFeriados', CIUDAD_FERIADOS_RUTAS);
        this.app.use('/notificaciones', NOTIFICACIONES_RUTAS);
        this.app.use('/sucursales', SUCURSAL_RUTAS);
        this.app.use('/nacionalidades', NACIONALIDADES_RUTAS);
        this.app.use('/nivel-titulo', NIVEL_TITULO_RUTAS);
        this.app.use('/noti-autorizaciones', NOTIFICACIONES_AUTORIZACIONES_RUTAS);
        this.app.use('/autorizaciones', AUTORIZACIONES_RUTAS);
        this.app.use('/noti-real-time', NOTIFICACION_TIEMPO_REAL_RUTAS);

        // Plantillas
        this.app.use('/plantillaD', PLANTILLA_RUTAS);

        // Documentos
        this.app.use('/archivosCargados', DOCUMENTOS_RUTAS);

        // Mensaje de cumpleaños empresas
        this.app.use('/birthday', BIRTHDAY_RUTAS);

        // Reportes
        this.app.use('/reporte', REPORTES_RUTAS);

        // HORAS EXTRAS
        this.app.use('/planificacionHoraExtra', PLAN_HORAS_EXTRAS_RUTAS);

    }

    start(): void {
        this.server.listen(this.app.get('puerto'), () => {
            console.log('Servidor en el puerto', this.app.get('puerto'));
        });
        this.io.on('connection', (socket: any) => {
            console.log('Connected client on port %s.', this.app.get('puerto'));

            socket.on("nueva_notificacion", (data: any) => {
                let data_llega = {
                    id: data.id,
                    id_send_empl: data.id_send_empl,
                    id_receives_empl: data.id_receives_empl,
                    id_receives_depa: data.id_receives_depa,
                    estado: data.estado,
                    create_at: data.create_at,
                    id_permiso: data.id_permiso,
                    id_vacaciones: data.id_vacaciones,
                    id_hora_extra: data.id_hora_extra
                }
                console.log(data_llega);
                socket.broadcast.emit('enviar_notification', data_llega);
            });

        });
    }
}

const SERVIDOR = new Servidor();
SERVIDOR.start();

import pool from './database';

// metodo para enviar los cumpleaños a una hora determinada, verificando a cada hora hasta que sean las 12 pm y se envie el correo
setInterval(async () => {

    const path = __dirname.split("javascript")[0]
    console.log(path);

    const date = new Date();
    console.log(date.toLocaleDateString());
    console.log(date.toLocaleTimeString());
    const hora = date.getHours();
    const fecha = date.toJSON().slice(4).split("T")[0];
    console.log(fecha)
    // SERVIDOR.app.use()
    if (hora === 15) {
        const felizCumple = await pool.query("SELECT e.nombre, e.apellido, e.correo, e.fec_nacimiento, em.nombre AS empresa, m.titulo, m.mensaje, m.img FROM empleados AS e, empl_contratos AS cn, empl_cargos AS cr, sucursales AS s, cg_empresa AS em, message_birthday AS m WHERE CAST(e.fec_nacimiento AS VARCHAR) LIKE '%' || $1 AND cn.id_empleado = e.id AND cr.id_empl_contrato = cn.id AND s.id = cr.id_sucursal AND em.id = s.id_empresa AND m.id_empresa = em.id", [fecha]);
        console.log(felizCumple.rows);
        if (felizCumple.rowCount > 0) {
            const email = process.env.EMAIL;
            const pass = process.env.PASSWORD;

            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: email,
                    pass: pass
                },
            });
            // Enviar mail a todos los que nacieron en la fecha seleccionada
            felizCumple.rows.forEach(obj => {

                // <p>Sabemos que es un dia especial para ti <b>${obj.nombre.split(" ")[0]} ${obj.apellido.split(" ")[0]}</b> 
                // , esperamos que la pases muy bien en compañia de tus seres queridos.
                //     </p>
                let data = {
                    to: obj.correo,
                    from: email,
                    subject: 'Felicidades',
                    html: `
                    <h2> <b> ${obj.empresa} </b> </h2>
                    <h3 style="text-align-center"><b>¡Feliz Cumpleaños ${obj.nombre.split(" ")[0]}!</b></h3>
                    <h4>${obj.titulo}</h4>
                    <p>${obj.mensaje}</p>
                    <img src="cid:cumple"/>`,
                    attachments: [{
                        filename: 'birthday1.jpg',
                        path: `${path}/cumpleanios/${obj.img}`,
                        cid: 'cumple' //same cid value as in the html img src
                    }]
                };
                console.log(data)

                smtpTransport.sendMail(data, async (error: any, info: any) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            })
        }
    }
}, 3600000);

function sumaDias(fecha: Date, dias: number) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
}

// Metodo para verificar si debe tomar vacaciones. y enviar un aviso al correo electrónico.  Tiempo de aviso 5 dias antes. 
setInterval(async () => {

    const path = __dirname.split("javascript")[0]
    console.log(path);

    const date = new Date();
    console.log(date.toLocaleDateString());
    console.log(date.toLocaleTimeString());
    const hora = date.getHours();
    console.log(hora);

    const diaIncrementado = sumaDias(date, 5).toLocaleDateString().split("T")[0];
    console.log(diaIncrementado);

    if (hora === 0) {
        const avisoVacacion = await pool.query('SELECT pv.fec_inicio, pv.fec_final, e.nombre, e.apellido, e.correo FROM peri_vacaciones AS pv, empl_contratos AS ec, empleados AS e WHERE pv.id_empl_contrato = ec.id AND ec.id_empleado = e.id AND pv.fec_inicio = $1', [diaIncrementado]);
        console.log(avisoVacacion.rows);

        if (avisoVacacion.rowCount > 0) {
            const email = process.env.EMAIL;
            const pass = process.env.PASSWORD;

            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: email,
                    pass: pass
                }
            });
            // Enviar mail a todos los que nacieron en la fecha seleccionada
            avisoVacacion.rows.forEach(obj => {

                let data = {
                    to: obj.correo,
                    from: email,
                    subject: 'Aviso toma de vacaciones',
                    html: `
                    <h2> <b> ¡Tienes 5 días para tomar vacaciones! </b> </h2>
                    <p> <b>${obj.nombre.split(" ")[0]} ${obj.apellido.split(" ")[0]}</b> se le da un aviso de que en 5 días, usted debe
                    tomar vacaciones como esta prestablecido desde el dia <b> ${obj.fec_inicio.toLocaleDateString().split("T")[0]} </b>
                    hasta el dia <b>${obj.fec_final.toLocaleDateString().split("T")[0]}</b>.</p>
                    `
                };
                console.log(data)

                smtpTransport.sendMail(data, async (error: any, info: any) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            })
        }
    }
}, 3600000);

// Aviso de toma de vacaciones en 2 dias.
setInterval(async () => {

    const date = new Date();
    const hora = date.getHours();
    const diaIncrementado = sumaDias(date, 2).toLocaleDateString().split("T")[0];

    if (hora === 0) {
        const avisoVacacion = await pool.query('SELECT pv.fec_inicio, pv.fec_final, e.nombre, e.apellido, e.correo FROM peri_vacaciones AS pv, empl_contratos AS ec, empleados AS e WHERE pv.id_empl_contrato = ec.id AND ec.id_empleado = e.id AND pv.fec_inicio = $1', [diaIncrementado]);
        console.log(avisoVacacion.rows);

        if (avisoVacacion.rowCount > 0) {
            const email = process.env.EMAIL;
            const pass = process.env.PASSWORD;

            let smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: email,
                    pass: pass
                }
            });
            // Enviar mail a todos los que nacieron en la fecha seleccionada
            avisoVacacion.rows.forEach(obj => {

                let data = {
                    to: obj.correo,
                    from: email,
                    subject: 'Aviso toma de vacaciones',
                    html: `
                    <h2> <b> ¡Tienes 2 días para tomar vacaciones! </b> </h2>
                    <p> <b>${obj.nombre.split(" ")[0]} ${obj.apellido.split(" ")[0]}</b> se le da un aviso de que en 2 días, usted debe
                    tomar vacaciones como esta prestablecido desde el dia <b> ${obj.fec_inicio.toLocaleDateString().split("T")[0]} </b>
                    hasta el dia <b>${obj.fec_final.toLocaleDateString().split("T")[0]}</b>.</p>
                    `
                };
                console.log(data)
                smtpTransport.sendMail(data, async (error: any, info: any) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            })
        }
    }
}, 3600000); 