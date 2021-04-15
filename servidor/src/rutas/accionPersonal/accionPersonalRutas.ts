import { Router } from 'express';
import ACCION_PERSONAL_CONTROLADOR from '../../controlador/accionPersonal/accionPersonalControlador';
import { TokenValidation } from '../../libs/verificarToken'

class DepartamentoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        /** TABLA TIPO_ACCION_PERSONAL */
        this.router.get('/', TokenValidation, ACCION_PERSONAL_CONTROLADOR.ListarTipoAccionPersonal);
        this.router.post('/', TokenValidation, ACCION_PERSONAL_CONTROLADOR.CrearTipoAccionPersonal);
        this.router.get('/tipo/accion/:id', TokenValidation, ACCION_PERSONAL_CONTROLADOR.EncontrarTipoAccionPersonalId);
        this.router.put('/', TokenValidation, ACCION_PERSONAL_CONTROLADOR.ActualizarTipoAccionPersonal);
        this.router.delete('/eliminar/:id', TokenValidation, ACCION_PERSONAL_CONTROLADOR.EliminarTipoAccionPersonal);

        /** TABLA PROCESO_PROPUESTO */
        this.router.get('/proceso', TokenValidation, ACCION_PERSONAL_CONTROLADOR.ListarProcesosPropuestos);
        this.router.post('/proceso', TokenValidation, ACCION_PERSONAL_CONTROLADOR.CrearProcesoPropuesto);
        this.router.get('/tipo/proceso', TokenValidation, ACCION_PERSONAL_CONTROLADOR.EncontrarUltimoProceso);

        /** TABLA CARGO_PROPUESTO */
        this.router.get('/cargo', TokenValidation, ACCION_PERSONAL_CONTROLADOR.ListarCargoPropuestos);
        this.router.post('/cargo', TokenValidation, ACCION_PERSONAL_CONTROLADOR.CrearCargoPropuesto);
        this.router.get('/tipo/cargo', TokenValidation, ACCION_PERSONAL_CONTROLADOR.EncontrarUltimoCargoP);

        /** TABLA DECRETO_ACUERDO_RESOL */
        this.router.get('/decreto', TokenValidation, ACCION_PERSONAL_CONTROLADOR.ListarDecretos);
        this.router.post('/decreto', TokenValidation, ACCION_PERSONAL_CONTROLADOR.CrearDecreto);
        this.router.get('/tipo/decreto', TokenValidation, ACCION_PERSONAL_CONTROLADOR.EncontrarUltimoDecreto);

        /** TABLA PEDIDO_ACCION_EMPLEADO */
        this.router.post('/pedido/accion', TokenValidation, ACCION_PERSONAL_CONTROLADOR.CrearPedidoAccionPersonal);

        // VER LOGO DE MINISTERIO TRABAJO
        this.router.get('/logo/ministerio/codificado', TokenValidation, ACCION_PERSONAL_CONTROLADOR.verLogoMinisterio);

        // CONSULTAS PEDIDOS ACCIONES DE PERSONAL
        this.router.get('/pedidos/accion', TokenValidation, ACCION_PERSONAL_CONTROLADOR.ListarPedidoAccion);
        this.router.get('/pedidos/datos/:id', TokenValidation, ACCION_PERSONAL_CONTROLADOR.EncontrarDatosEmpleados);
        this.router.get('/pedido/informacion/:id', TokenValidation, ACCION_PERSONAL_CONTROLADOR.EncontrarPedidoAccion);
        this.router.get('/lista/procesos/:id', TokenValidation, ACCION_PERSONAL_CONTROLADOR.EncontrarProcesosRecursivos);
    }
}

const ACCION_PERSONAL_RUTAS = new DepartamentoRutas();

export default ACCION_PERSONAL_RUTAS.router;