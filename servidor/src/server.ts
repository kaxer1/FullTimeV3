import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';

// rutas importadas
import indexRutas from './rutas/indexRutas';
import ROLES_RUTAS from './rutas/catalogos/catRolesRutas';
import EMPLEADO_RUTAS from './rutas/empleado/empleadoRegistro/empleadoRutas';
import LOGIN_RUTA from './rutas/login/loginRuta';
import DISCAPACIDAD_RUTAS from './rutas/empleado/empleadoDiscapacidad/discapacidadRutas';
import TITULO_RUTA from './rutas/catalogos/catTituloRutas';
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
        this.app.use('/rol', ROLES_RUTAS);
        this.app.use('/login', LOGIN_RUTA);

        //Empleado
        this.app.use('/empleado', EMPLEADO_RUTAS);
        this.app.use('/contratoEmpleado', CONTRATO_EMPLEADO_RUTAS);
        this.app.use('/empleadoCargos', EMPLEADO_CARGO_RUTAS);
        this.app.use('/perVacacion', PERIODO_VACACION__RUTAS);

        //Almuerzo
        this.app.use('/planComidas', PLAN_COMIDAS_RUTAS);

        //Enrolados
        this.app.use('/enrolados', ENROLADO_RUTA);
        this.app.use('/relojes', RELOJES_RUTA);
        this.app.use('/enroladosRelojes', ENROLADO_RELOJ_RUTAS);

        //Redireccionamiento a páginas que contienen catálogos
        this.app.use('/titulo', TITULO_RUTA);
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

    }

    start(): void {
        this.app.listen(this.app.get('puerto'), () => {
            console.log('Servidor en el puerto', this.app.get('puerto'))
        });
    }
}

const SERVIDOR = new Server();
SERVIDOR.start();
