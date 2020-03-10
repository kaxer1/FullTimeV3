import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';

// rutas importadas
import indexRutas from './rutas/indexRutas';
import roles from './rutas/pruebaRutas';
import empleado from './rutas/empleadoRutas';
import loginRuta from './rutas/login/loginRuta';
import DISCAPACIDAD_RUTAS from './rutas/discapacidadRutas';
import TITULO_RUTA from './rutas/Catalogos/tituloRutas';
import REGIMEN_RUTA from './rutas/Catalogos/catRegimenRuta';
import FERIADOS_RUTA from './rutas/Catalogos/catFeriadosRuta';
import TIPO_COMIDAS_RUTA from './rutas/Catalogos/catTipoComidasRuta';
import RELOJES_RUTA from './rutas/Catalogos/catRelojesRuta';
import PROVINCIA_RUTA from './rutas/Catalogos/provinciaRutas';
import DEPARTAMENTO_RUTA from './rutas/Catalogos/departamentoRutas';
import PROCESO_RUTA from './rutas/Catalogos/procesoRutas';
import HORARIO_RUTA from './rutas/Catalogos/horarioRutas';
import HORAS_EXTRAS_RUTAS from './rutas/Catalogos/horasExtrasRutas';
import NOTIFICACIONES_RUTAS from './rutas/Catalogos/notificacionesRutas';
import ROL_PERMISOS_RUTAS from './rutas/Catalogos/rolPermisosRutas';
import TIPO_PERMISOS_RUTAS from './rutas/Catalogos/tipoPermisosRutas';

class Server {

    public app: Application;

    constructor() {
        this.app = express();
        this.configuracion();
        this.rutas();
    }

    configuracion(): void {
        this.app.set('puerto', process.env.PORT || 3000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }

    rutas(): void {

        this.app.use('/', indexRutas);
        this.app.use('/rol', roles);
        this.app.use('/empleado', empleado);
        this.app.use('/login', loginRuta);

        //Redireccionamiento a páginas que contienen catálogos
        this.app.use('/titulo', TITULO_RUTA);
        this.app.use('/discapacidad', DISCAPACIDAD_RUTAS);
        this.app.use('/regimenLaboral', REGIMEN_RUTA);
        this.app.use('/feriados', FERIADOS_RUTA);
        this.app.use('/tipoComidas', TIPO_COMIDAS_RUTA);
        this.app.use('/relojes', RELOJES_RUTA);
        this.app.use('/provincia',PROVINCIA_RUTA);
        this.app.use('/departamento',DEPARTAMENTO_RUTA);
        this.app.use('/proceso', PROCESO_RUTA);
        this.app.use('/horario', HORARIO_RUTA);
        this.app.use('/horasExtras', HORAS_EXTRAS_RUTAS);
        this.app.use('/notificaciones', NOTIFICACIONES_RUTAS);
        this.app.use('/rolPermisos', ROL_PERMISOS_RUTAS);
        this.app.use('/tipoPermisos', TIPO_PERMISOS_RUTAS);

    }

    start(): void {
        this.app.listen(this.app.get('puerto'), () => {
            console.log('Servidor en el puerto', this.app.get('puerto'))
        });
    }
}

const SERVIDOR = new Server();
SERVIDOR.start();
