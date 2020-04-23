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
const catRolesRutas_1 = __importDefault(require("./rutas/Catalogos/catRolesRutas"));
const empleadoRutas_1 = __importDefault(require("./rutas/empleado/empleadoRegistro/empleadoRutas"));
const loginRuta_1 = __importDefault(require("./rutas/login/loginRuta"));
const discapacidadRutas_1 = __importDefault(require("./rutas/empleado/empleadoDiscapacidad/discapacidadRutas"));
const catTituloRutas_1 = __importDefault(require("./rutas/Catalogos/catTituloRutas"));
const catRegimenRuta_1 = __importDefault(require("./rutas/Catalogos/catRegimenRuta"));
const catFeriadosRuta_1 = __importDefault(require("./rutas/Catalogos/catFeriadosRuta"));
const catTipoComidasRuta_1 = __importDefault(require("./rutas/Catalogos/catTipoComidasRuta"));
const catRelojesRuta_1 = __importDefault(require("./rutas/Catalogos/catRelojesRuta"));
const catProvinciaRutas_1 = __importDefault(require("./rutas/Catalogos/catProvinciaRutas"));
const catDepartamentoRutas_1 = __importDefault(require("./rutas/Catalogos/catDepartamentoRutas"));
const catProcesoRutas_1 = __importDefault(require("./rutas/Catalogos/catProcesoRutas"));
const catHorarioRutas_1 = __importDefault(require("./rutas/Catalogos/catHorarioRutas"));
const catEnroladoRutas_1 = __importDefault(require("./rutas/Catalogos/catEnroladoRutas"));
const usuarioRutas_1 = __importDefault(require("./rutas/usuarios/usuarioRutas"));
const catHorasExtrasRutas_1 = __importDefault(require("./rutas/Catalogos/catHorasExtrasRutas"));
const catRolPermisosRutas_1 = __importDefault(require("./rutas/Catalogos/catRolPermisosRutas"));
const catTipoPermisosRutas_1 = __importDefault(require("./rutas/Catalogos/catTipoPermisosRutas"));
const ciudadesRutas_1 = __importDefault(require("./rutas/ciudades/ciudadesRutas"));
const ciudadFeriadoRutas_1 = __importDefault(require("./rutas/CiudadFeriado/ciudadFeriadoRutas"));
const catNotificacionesRutas_1 = __importDefault(require("./rutas/Catalogos/catNotificacionesRutas"));
const contratoEmpleadoRutas_1 = __importDefault(require("./rutas/empleado/empleadoContrato/contratoEmpleadoRutas"));
const emplCargosRutas_1 = __importDefault(require("./rutas/empleado/empleadoCargos/emplCargosRutas"));
const planComidasRutas_1 = __importDefault(require("./rutas/planComidas/planComidasRutas"));
const enroladoRelojRutas_1 = __importDefault(require("./rutas/enroladoReloj/enroladoRelojRutas"));
const sucursalRutas_1 = __importDefault(require("./rutas/Sucursal/sucursalRutas"));
const nacionalidadRutas_1 = __importDefault(require("./rutas/Nacionalidad/nacionalidadRutas"));
const nivelTituloRutas_1 = __importDefault(require("./rutas/NivelTitulo/nivelTituloRutas"));
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
        this.app.use('/rol', catRolesRutas_1.default);
        this.app.use('/login', loginRuta_1.default);
        //Empleado
        this.app.use('/empleado', empleadoRutas_1.default);
        this.app.use('/contratoEmpleado', contratoEmpleadoRutas_1.default);
        this.app.use('/empleadoCargos', emplCargosRutas_1.default);
        //Almuerzo
        this.app.use('/planComidas', planComidasRutas_1.default);
        //Enrolados
        this.app.use('/enrolados', catEnroladoRutas_1.default);
        this.app.use('/relojes', catRelojesRuta_1.default);
        this.app.use('/enroladosRelojes', enroladoRelojRutas_1.default);
        //Redireccionamiento a páginas que contienen catálogos
        this.app.use('/titulo', catTituloRutas_1.default);
        this.app.use('/discapacidad', discapacidadRutas_1.default);
        this.app.use('/regimenLaboral', catRegimenRuta_1.default);
        this.app.use('/feriados', catFeriadosRuta_1.default);
        this.app.use('/tipoComidas', catTipoComidasRuta_1.default);
        this.app.use('/provincia', catProvinciaRutas_1.default);
        this.app.use('/departamento', catDepartamentoRutas_1.default);
        this.app.use('/proceso', catProcesoRutas_1.default);
        this.app.use('/horario', catHorarioRutas_1.default);
        this.app.use('/horasExtras', catHorasExtrasRutas_1.default);
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
    }
    start() {
        this.app.listen(this.app.get('puerto'), () => {
            console.log('Servidor en el puerto', this.app.get('puerto'));
        });
    }
}
const SERVIDOR = new Server();
SERVIDOR.start();
