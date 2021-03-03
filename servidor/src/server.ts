require('dotenv').config();
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
import KARDEX_VACACION_RUTAS from './rutas/reportes/kardexVacacionesRutas';
import ASISTENCIA_RUTAS from './rutas/reportes/asistenciaRutas';
import CARGA_MULTIPLE_RUTAS from './rutas/cargaMultiple/cargaMultipleRutas';
import REPORTES_RUTAS from './rutas/reportes/reportesRutas';
import PLAN_HORAS_EXTRAS_RUTAS from './rutas/planHoraExtra/planHoraExtraRutas';
import DATOS_GENERALES_RUTAS from './rutas/datosGenerales/datosGeneralesRutas';
import TIMBRES_RUTAS from './rutas/timbres/timbresRutas';
import PLAN_GENERAL_RUTAS from './rutas/planGeneral/planGeneralRutas';
import REPORTE_HORA_EXTRA_RUTAS from './rutas/reportes/reporteHoraExtraRutas';
import GRAFICAS_RUTAS from './rutas/graficas/graficasRutas';
import ALIMENTACION_RUTAS from './rutas/reportes/alimentacionRutas';
import REPORTES_A_RUTAS from './rutas/reportes/reportesAsistenciaRutas';
import FUNCIONES_RUTAS from './rutas/funciones/funcionRutas';

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
        this.app.use(cors());

    }

    configuracion(): void {
        this.app.set('puerto', process.env.PORT || 3001);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.raw({ type: 'image/*', limit: '2Mb' }));
        this.app.set('trust proxy', true);
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

        // Timbres
        this.app.use('/timbres', TIMBRES_RUTAS);
        this.app.use('/planificacion_general', PLAN_GENERAL_RUTAS);

        // Plantillas
        this.app.use('/plantillaD', PLANTILLA_RUTAS);

        // Documentos
        this.app.use('/archivosCargados', DOCUMENTOS_RUTAS);

        // Mensaje de cumpleaños empresas
        this.app.use('/birthday', BIRTHDAY_RUTAS);

        // Asistencia
        this.app.use('/asistencia', ASISTENCIA_RUTAS);

        // Reportes
        this.app.use('/reportes/vacacion', KARDEX_VACACION_RUTAS);
        this.app.use('/reportes/hora-extra', REPORTE_HORA_EXTRA_RUTAS);
        this.app.use('/reporte', REPORTES_RUTAS);
        this.app.use('/reportes-asistencias/', REPORTES_A_RUTAS);

        // Modulo Alimentación
        this.app.use('/alimentacion', ALIMENTACION_RUTAS);

        // HORAS EXTRAS
        this.app.use('/planificacionHoraExtra', PLAN_HORAS_EXTRAS_RUTAS);

        // CARGA MULTIPLE
        this.app.use('/cargaMultiple', CARGA_MULTIPLE_RUTAS);

        // DATOS GENERALES QUE COMPARTEN VARIOS ARCHIVOS
        this.app.use('/generalidades', DATOS_GENERALES_RUTAS);

        // GRAFICAS PARA MOSTRAR EN EL HOME
        this.app.use('/metricas', GRAFICAS_RUTAS);

        // FUNCIONES
        this.app.use('/administracion', FUNCIONES_RUTAS);

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

import { cumpleanios } from './libs/sendBirthday';
import { beforeFiveDays, beforeTwoDays, Peri_Vacacion_Automatico } from './libs/avisoVacaciones';
import { conteoPermisos } from './libs/timerPermiso';
import { RegistrarAsistenciaByTimbres } from './libs/ContarHoras';
import { NotificacionTimbreAutomatica } from './libs/NotiTimbres'
import { NotificacionSinTimbres } from './libs/SinTimbres'
import { DesactivarFinContratoEmpleado } from './libs/DesactivarEmpleado'
// llama al meodo de cumpleaños
// cumpleanios();
// llama al metodo de avisos de vacaciones
// beforeFiveDays();
// beforeTwoDays();
// llama al metodo de verificacion para crear un nuevo perido de vacaciones si se acaba el anterior
// Peri_Vacacion_Automatico();

// RegistrarAsistenciaByTimbres();

// ----------// conteoPermisos();

// NotificacionTimbreAutomatica();

// NotificacionSinTimbres();

// DesactivarFinContratoEmpleado();


import { generarTimbres, ModificarTimbresEntrada } from './script/scriptTimbres'

//generarTimbres(1);
//ModificarTimbresEntrada();