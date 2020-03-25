"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
// rutas importadas
const indexRutas_1 = __importDefault(require("./rutas/indexRutas"));
const pruebaRutas_1 = __importDefault(require("./rutas/pruebaRutas"));
const empleadoRutas_1 = __importDefault(require("./rutas/empleadoRutas"));
const loginRuta_1 = __importDefault(require("./rutas/login/loginRuta"));
const discapacidadRutas_1 = __importDefault(require("./rutas/discapacidadRutas"));
const tituloRutas_1 = __importDefault(require("./rutas/Catalogos/tituloRutas"));
const catRegimenRuta_1 = __importDefault(require("./rutas/Catalogos/catRegimenRuta"));
const catFeriadosRuta_1 = __importDefault(require("./rutas/Catalogos/catFeriadosRuta"));
const catTipoComidasRuta_1 = __importDefault(require("./rutas/Catalogos/catTipoComidasRuta"));
const catRelojesRuta_1 = __importDefault(require("./rutas/Catalogos/catRelojesRuta"));
const catProvinciaRutas_1 = __importDefault(require("./rutas/Catalogos/catProvinciaRutas"));
const catDepartamentoRutas_1 = __importDefault(require("./rutas/Catalogos/catDepartamentoRutas"));
const procesoRutas_1 = __importDefault(require("./rutas/Catalogos/procesoRutas"));
const catHorarioRutas_1 = __importDefault(require("./rutas/Catalogos/catHorarioRutas"));
const horasExtrasRutas_1 = __importDefault(require("./rutas/Catalogos/horasExtrasRutas"));
const notificacionesRutas_1 = __importDefault(require("./rutas/Catalogos/notificacionesRutas"));
const enroladoRutas_1 = __importDefault(require("./rutas/Catalogos/enroladoRutas"));
const usuarioRutas_1 = __importDefault(require("./rutas//Catalogos/usuarioRutas"));
const horasExtrasRutas_2 = __importDefault(require("./rutas/Catalogos/horasExtrasRutas"));
const notificacionesRutas_2 = __importDefault(require("./rutas/Catalogos/notificacionesRutas"));
const rolPermisosRutas_1 = __importDefault(require("./rutas/Catalogos/rolPermisosRutas"));
const tipoPermisosRutas_1 = __importDefault(require("./rutas/Catalogos/tipoPermisosRutas"));
const ciudadesRutas_1 = __importDefault(require("./rutas/ciudades/ciudadesRutas"));
const ciudadFeriadoRutas_1 = __importDefault(require("./rutas/CiudadFeriado/ciudadFeriadoRutas"));
class Server {
    constructor() {
        this.app = express_1.default();
        this.configuracion();
        this.rutas();
    }
    configuracion() {
        this.app.set('puerto', process.env.PORT || 3000);
        this.app.use(morgan_1.default('dev'));
        this.app.use(cors_1.default());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    rutas() {
        this.app.use('/', indexRutas_1.default);
        this.app.use('/rol', pruebaRutas_1.default);
        this.app.use('/empleado', empleadoRutas_1.default);
        this.app.use('/login', loginRuta_1.default);
        //Redireccionamiento a páginas que contienen catálogos
        this.app.use('/titulo', tituloRutas_1.default);
        this.app.use('/discapacidad', discapacidadRutas_1.default);
        this.app.use('/regimenLaboral', catRegimenRuta_1.default);
        this.app.use('/feriados', catFeriadosRuta_1.default);
        this.app.use('/tipoComidas', catTipoComidasRuta_1.default);
        this.app.use('/relojes', catRelojesRuta_1.default);
        this.app.use('/provincia', catProvinciaRutas_1.default);
        this.app.use('/departamento', catDepartamentoRutas_1.default);
        this.app.use('/proceso', procesoRutas_1.default);
        this.app.use('/horario', catHorarioRutas_1.default);
        this.app.use('/horasExtras', horasExtrasRutas_1.default);
        this.app.use('/notificaciones', notificacionesRutas_1.default);
        this.app.use('/enrolados', enroladoRutas_1.default);
        this.app.use('/usuarios', usuarioRutas_1.default);
        this.app.use('/horasExtras', horasExtrasRutas_2.default);
        this.app.use('/notificaciones', notificacionesRutas_2.default);
        this.app.use('/rolPermisos', rolPermisosRutas_1.default);
        this.app.use('/tipoPermisos', tipoPermisosRutas_1.default);
        this.app.use('/ciudades', ciudadesRutas_1.default);
        this.app.use('/ciudadFeriados', ciudadFeriadoRutas_1.default);
    }
    start() {
        this.app.listen(this.app.get('puerto'), () => {
            console.log('Servidor en el puerto', this.app.get('puerto'));
        });
    }
}
const SERVIDOR = new Server();
SERVIDOR.start();
