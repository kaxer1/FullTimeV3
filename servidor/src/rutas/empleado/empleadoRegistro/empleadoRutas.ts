import { Router } from 'express';
import EMPLEADO_CONTROLADOR from '../../../controlador/empleado/empleadoRegistro/empleadoControlador';
import { TokenValidation } from '../../../libs/verificarToken';

const multipart = require('connect-multiparty');

const multipartMiddleware = multipart({
    uploadDir: './imagenesEmpleados',
});

const multipartMiddlewarePlantilla = multipart({
    uploadDir: './plantillas',
});

class EmpleadoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', TokenValidation, EMPLEADO_CONTROLADOR.list);
        this.router.get('/buscador-empl', TokenValidation, EMPLEADO_CONTROLADOR.ListaBusquedaEmpleados);
        this.router.get('/:id', TokenValidation, EMPLEADO_CONTROLADOR.getOne);
        this.router.get('/img/:imagen', EMPLEADO_CONTROLADOR.getImagen);
        this.router.get('/download/:nameXML', EMPLEADO_CONTROLADOR.downloadXML);
        this.router.get('/emplTitulos/:id_empleado', TokenValidation, EMPLEADO_CONTROLADOR.getTitulosDelEmpleado);
        this.router.put('/:id/usuario', TokenValidation, EMPLEADO_CONTROLADOR.editar);
        this.router.put('/:id_empleado/uploadImage', [TokenValidation, multipartMiddleware], EMPLEADO_CONTROLADOR.crearImagenEmpleado);
        this.router.put('/:id_empleado_titulo/titulo', TokenValidation, EMPLEADO_CONTROLADOR.editarTituloDelEmpleado);
        this.router.post('/', TokenValidation, EMPLEADO_CONTROLADOR.create);
        this.router.post('/xmlDownload/', TokenValidation, EMPLEADO_CONTROLADOR.FileXML);
        this.router.post('/emplTitulos/', TokenValidation, EMPLEADO_CONTROLADOR.createEmpleadoTitulos);
        this.router.post('/plantillaExcel/', [TokenValidation, multipartMiddlewarePlantilla], EMPLEADO_CONTROLADOR.CargaPlantillaEmpleadoUsuario);
        this.router.delete('/eliminar/titulo/:id_empleado_titulo', TokenValidation, EMPLEADO_CONTROLADOR.eliminarTituloDelEmpleado);
        this.router.post('/buscarDepartamento', TokenValidation, EMPLEADO_CONTROLADOR.ObtenerDepartamentoEmpleado);
        this.router.get('/encontrarDato/codigo', TokenValidation, EMPLEADO_CONTROLADOR.ObtenerCodigo);
        this.router.post('/crearCodigo', TokenValidation, EMPLEADO_CONTROLADOR.CrearCodigo);
        this.router.put('/cambiarCodigo', TokenValidation, EMPLEADO_CONTROLADOR.ActualizarCodigo);
        this.router.get('/desactivados/empleados', TokenValidation, EMPLEADO_CONTROLADOR.listaEmpleadosDesactivados);
        this.router.put('/desactivar/masivo', TokenValidation, EMPLEADO_CONTROLADOR.DesactivarMultiplesEmpleados);
        this.router.put('/activar/masivo', TokenValidation, EMPLEADO_CONTROLADOR.ActivarMultiplesEmpleados);
        this.router.put('/re-activar/masivo', TokenValidation, EMPLEADO_CONTROLADOR.ReactivarMultiplesEmpleados);
    }

}

const EMPLEADO_RUTAS = new EmpleadoRutas();

export default EMPLEADO_RUTAS.router;
