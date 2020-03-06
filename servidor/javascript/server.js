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
const horasExtrasRutas_1 = __importDefault(require("./rutas/Catalogos/horasExtrasRutas"));
const notificacionesRutas_1 = __importDefault(require("./rutas/Catalogos/notificacionesRutas"));
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
        this.app.use('/titulo', tituloRutas_1.default);
        this.app.use('/discapacidad', discapacidadRutas_1.default);
        this.app.use('/horasExtras', horasExtrasRutas_1.default);
        this.app.use('/notificaciones', notificacionesRutas_1.default);
    }
    start() {
        this.app.listen(this.app.get('puerto'), () => {
            console.log('Servidor en el puerto', this.app.get('puerto'));
        });
    }
}
const servidor = new Server();
servidor.start();
