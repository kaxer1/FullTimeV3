"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
// rutas importadas
const indexRutas_1 = __importDefault(require("./rutas/indexRutas"));
const catRolesRutas_1 = __importDefault(require("./rutas/catalogos/catRolesRutas"));
const empleadoRutas_1 = __importDefault(require("./rutas/empleado/empleadoRegistro/empleadoRutas"));
const loginRuta_1 = __importDefault(require("./rutas/login/loginRuta"));
const discapacidadRutas_1 = __importDefault(require("./rutas/empleado/empleadoDiscapacidad/discapacidadRutas"));
const catTituloRutas_1 = __importDefault(require("./rutas/catalogos/catTituloRutas"));
const catRegimenRuta_1 = __importDefault(require("./rutas/catalogos/catRegimenRuta"));
const catFeriadosRuta_1 = __importDefault(require("./rutas/catalogos/catFeriadosRuta"));
const catTipoComidasRuta_1 = __importDefault(require("./rutas/catalogos/catTipoComidasRuta"));
const catRelojesRuta_1 = __importDefault(require("./rutas/catalogos/catRelojesRuta"));
const catProvinciaRutas_1 = __importDefault(require("./rutas/catalogos/catProvinciaRutas"));
const catDepartamentoRutas_1 = __importDefault(require("./rutas/catalogos/catDepartamentoRutas"));
const catProcesoRutas_1 = __importDefault(require("./rutas/catalogos/catProcesoRutas"));
const catHorarioRutas_1 = __importDefault(require("./rutas/catalogos/catHorarioRutas"));
const catEnroladoRutas_1 = __importDefault(require("./rutas/catalogos/catEnroladoRutas"));
const usuarioRutas_1 = __importDefault(require("./rutas/usuarios/usuarioRutas"));
const catHorasExtrasRutas_1 = __importDefault(require("./rutas/catalogos/catHorasExtrasRutas"));
const catRolPermisosRutas_1 = __importDefault(require("./rutas/catalogos/catRolPermisosRutas"));
const catTipoPermisosRutas_1 = __importDefault(require("./rutas/catalogos/catTipoPermisosRutas"));
const ciudadesRutas_1 = __importDefault(require("./rutas/ciudades/ciudadesRutas"));
const ciudadFeriadoRutas_1 = __importDefault(require("./rutas/ciudadFeriado/ciudadFeriadoRutas"));
const catNotificacionesRutas_1 = __importDefault(require("./rutas/catalogos/catNotificacionesRutas"));
const contratoEmpleadoRutas_1 = __importDefault(require("./rutas/empleado/empleadoContrato/contratoEmpleadoRutas"));
const emplCargosRutas_1 = __importDefault(require("./rutas/empleado/empleadoCargos/emplCargosRutas"));
const planComidasRutas_1 = __importDefault(require("./rutas/planComidas/planComidasRutas"));
const enroladoRelojRutas_1 = __importDefault(require("./rutas/enroladoReloj/enroladoRelojRutas"));
const catEmpresaRutas_1 = __importDefault(require("./rutas/catalogos/catEmpresaRutas"));
const sucursalRutas_1 = __importDefault(require("./rutas/sucursal/sucursalRutas"));
const nacionalidadRutas_1 = __importDefault(require("./rutas/nacionalidad/nacionalidadRutas"));
const nivelTituloRutas_1 = __importDefault(require("./rutas/nivelTitulo/nivelTituloRutas"));
const periodoVacacionRutas_1 = __importDefault(require("./rutas/empleado/empleadoPeriodoVacacion/periodoVacacionRutas"));
const vacacionesRutas_1 = __importDefault(require("./rutas/vacaciones/vacacionesRutas"));
const empleProcesosRutas_1 = __importDefault(require("./rutas/empleado/empleadoProcesos/empleProcesosRutas"));
const planHorarioRutas_1 = __importDefault(require("./rutas/horarios/planHorario/planHorarioRutas"));
const detallePlanHorarioRutas_1 = __importDefault(require("./rutas/horarios/detallePlanHorario/detallePlanHorarioRutas"));
const autorizaDepartamentoRutas_1 = __importDefault(require("./rutas/autorizaDepartamento/autorizaDepartamentoRutas"));
const empleadoHorariosRutas_1 = __importDefault(require("./rutas/horarios/empleadoHorarios/empleadoHorariosRutas"));
const permisosRutas_1 = __importDefault(require("./rutas/permisos/permisosRutas"));
const detalleCatHorarioRutas_1 = __importDefault(require("./rutas/horarios/detalleCatHorario/detalleCatHorarioRutas"));
const catNotiAutorizacionesRutas_1 = __importDefault(require("./rutas/catalogos/catNotiAutorizacionesRutas"));
const autorizacionesRutas_1 = __importDefault(require("./rutas/autorizaciones/autorizacionesRutas"));
const plantillaRutas_1 = __importDefault(require("./rutas/descargarPlantilla/plantillaRutas"));
const notificacionesRutas_1 = __importDefault(require("./rutas/notificaciones/notificacionesRutas"));
const documentosRutas_1 = __importDefault(require("./rutas/documentos/documentosRutas"));
const horaExtraRutas_1 = __importDefault(require("./rutas/horaExtra/horaExtraRutas"));
const birthdayRutas_1 = __importDefault(require("./rutas/birthday/birthdayRutas"));
const kardexVacacionesRutas_1 = __importDefault(require("./rutas/reportes/kardexVacacionesRutas"));
const asistenciaRutas_1 = __importDefault(require("./rutas/reportes/asistenciaRutas"));
const cargaMultipleRutas_1 = __importDefault(require("./rutas/cargaMultiple/cargaMultipleRutas"));
const reportesRutas_1 = __importDefault(require("./rutas/reportes/reportesRutas"));
const planHoraExtraRutas_1 = __importDefault(require("./rutas/planHoraExtra/planHoraExtraRutas"));
const datosGeneralesRutas_1 = __importDefault(require("./rutas/datosGenerales/datosGeneralesRutas"));
const timbresRutas_1 = __importDefault(require("./rutas/timbres/timbresRutas"));
const http_1 = require("http");
const socketIo = require('socket.io');
class Servidor {
    constructor() {
        this.app = express_1.default();
        this.configuracion();
        this.rutas();
        this.server = http_1.createServer(this.app);
        this.io = socketIo(this.server);
    }
    configuracion() {
        this.app.set('puerto', process.env.PORT || 3001);
        this.app.use(morgan_1.default('dev'));
        this.app.use(cors_1.default({
            origin: '*',
            //methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
            credentials: true
        }));
        //this.app.options('*', cors());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use(express_1.default.raw({ type: 'image/*', limit: '1Mb' }));
        this.app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            if (req.method == 'OPTIONS') {
                res.header('Access-Control-Allow-Credentials', 'true');
                res.header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
                res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
                //return res.status(200).json({});
                res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
                res.header('Referrer-Policy', 'origin');
                res.header('Cache-Control: no-cache, no-store, must-revalidate');
                res.header('Pragma: no-cache');
                res.header('Expires: 0');
                res.header('Authorization', 'token');
                return res.status(200).json({});
            }
            next();
        });
    }
    rutas() {
        this.app.use('/', indexRutas_1.default);
        this.app.use('/rol', catRolesRutas_1.default);
        this.app.use('/login', loginRuta_1.default);
        // Empleado
        this.app.use('/empleado', empleadoRutas_1.default);
        this.app.use('/contratoEmpleado', contratoEmpleadoRutas_1.default);
        this.app.use('/empleadoCargos', emplCargosRutas_1.default);
        this.app.use('/perVacacion', periodoVacacionRutas_1.default);
        this.app.use('/vacaciones', vacacionesRutas_1.default);
        this.app.use('/horas-extras-pedidas', horaExtraRutas_1.default);
        this.app.use('/empleadoProcesos', empleProcesosRutas_1.default);
        // Autorizaciones
        this.app.use('/autorizaDepartamento', autorizaDepartamentoRutas_1.default);
        // Permisos
        this.app.use('/empleadoPermiso', permisosRutas_1.default);
        // Almuerzo
        this.app.use('/planComidas', planComidasRutas_1.default);
        // Horarios
        this.app.use('/planHorario', planHorarioRutas_1.default);
        this.app.use('/detallePlanHorario', detallePlanHorarioRutas_1.default);
        this.app.use('/empleadoHorario', empleadoHorariosRutas_1.default);
        this.app.use('/detalleHorario', detalleCatHorarioRutas_1.default);
        // Enrolados
        this.app.use('/enrolados', catEnroladoRutas_1.default);
        this.app.use('/relojes', catRelojesRuta_1.default);
        this.app.use('/enroladosRelojes', enroladoRelojRutas_1.default);
        //Redireccionamiento a páginas que contienen catálogos
        this.app.use('/titulo', catTituloRutas_1.default);
        this.app.use('/discapacidad', discapacidadRutas_1.default);
        this.app.use('/empresas', catEmpresaRutas_1.default);
        this.app.use('/regimenLaboral', catRegimenRuta_1.default);
        this.app.use('/feriados', catFeriadosRuta_1.default);
        this.app.use('/tipoComidas', catTipoComidasRuta_1.default);
        this.app.use('/provincia', catProvinciaRutas_1.default);
        this.app.use('/departamento', catDepartamentoRutas_1.default);
        this.app.use('/proceso', catProcesoRutas_1.default);
        this.app.use('/horario', catHorarioRutas_1.default);
        this.app.use('/usuarios', usuarioRutas_1.default);
        this.app.use('/horasExtras', catHorasExtrasRutas_1.default);
        this.app.use('/rolPermisos', catRolPermisosRutas_1.default);
        this.app.use('/tipoPermisos', catTipoPermisosRutas_1.default);
        this.app.use('/ciudades', ciudadesRutas_1.default);
        this.app.use('/ciudadFeriados', ciudadFeriadoRutas_1.default);
        this.app.use('/notificaciones', catNotificacionesRutas_1.default);
        this.app.use('/sucursales', sucursalRutas_1.default);
        this.app.use('/nacionalidades', nacionalidadRutas_1.default);
        this.app.use('/nivel-titulo', nivelTituloRutas_1.default);
        this.app.use('/noti-autorizaciones', catNotiAutorizacionesRutas_1.default);
        this.app.use('/autorizaciones', autorizacionesRutas_1.default);
        this.app.use('/noti-real-time', notificacionesRutas_1.default);
        // Timbres
        this.app.use('/timbres', timbresRutas_1.default);
        // Plantillas
        this.app.use('/plantillaD', plantillaRutas_1.default);
        // Documentos
        this.app.use('/archivosCargados', documentosRutas_1.default);
        // Mensaje de cumpleaños empresas
        this.app.use('/birthday', birthdayRutas_1.default);
        // Asistencia
        this.app.use('/asistencia', asistenciaRutas_1.default);
        // Reportes
        this.app.use('/reportes/vacacion', kardexVacacionesRutas_1.default);
        this.app.use('/reporte', reportesRutas_1.default);
        // HORAS EXTRAS
        this.app.use('/planificacionHoraExtra', planHoraExtraRutas_1.default);
        // CARGA MULTIPLE
        this.app.use('/cargaMultiple', cargaMultipleRutas_1.default);
        // DATOS GENERALES QUE COMPARTEN VARIOS ARCHIVOS
        this.app.use('/generalidades', datosGeneralesRutas_1.default);
    }
    start() {
        this.server.listen(this.app.get('puerto'), () => {
            console.log('Servidor en el puerto', this.app.get('puerto'));
        });
        this.io.on('connection', (socket) => {
            console.log('Connected client on port %s.', this.app.get('puerto'));
            socket.on("nueva_notificacion", (data) => {
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
                };
                console.log(data_llega);
                socket.broadcast.emit('enviar_notification', data_llega);
            });
        });
    }
}
const SERVIDOR = new Servidor();
SERVIDOR.start();
const sendBirthday_1 = require("./libs/sendBirthday");
const avisoVacaciones_1 = require("./libs/avisoVacaciones");
const ContarHoras_1 = require("./libs/ContarHoras");
// llama al meodo de cumpleaños
sendBirthday_1.cumpleanios();
// llama al metodo de avisos de vacaciones
avisoVacaciones_1.beforeFiveDays();
avisoVacaciones_1.beforeTwoDays();
// llama al metodo de verificacion para crear un nuevo perido de vacaciones si se acaba el anterior
avisoVacaciones_1.Peri_Vacacion_Automatico();
ContarHoras_1.RegistrarAsistenciaByTimbres();
//generarTimbres(1);
//ModificarTimbresEntrada();
