import { Router } from 'express';
import DEPARTAMENTO_CONTROLADOR from '../../controlador/catalogos/catDepartamentoControlador';

class DepartamentoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', DEPARTAMENTO_CONTROLADOR.ListarDepartamentos);
        this.router.get('/nombreDepartamento', DEPARTAMENTO_CONTROLADOR.ListarNombreDepartamentos);
        this.router.get('/idDepartamento/:nombre', DEPARTAMENTO_CONTROLADOR.ListarIdDepartamentoNombre);
        this.router.get('/:id', DEPARTAMENTO_CONTROLADOR.ObtenerUnDepartamento);
        this.router.get('/buscarDepa/:id_sucursal', DEPARTAMENTO_CONTROLADOR.ObtenerDepartamentosSucursal);
        this.router.post('/', DEPARTAMENTO_CONTROLADOR.CrearDepartamento);
        this.router.get('/busqueda/:nombre', DEPARTAMENTO_CONTROLADOR.ObtenerIdDepartamento);
        this.router.put('/:id', DEPARTAMENTO_CONTROLADOR.ActualizarDepartamento);
        this.router.post('/xmlDownload/', DEPARTAMENTO_CONTROLADOR.FileXML);
        this.router.get('/download/:nameXML', DEPARTAMENTO_CONTROLADOR.downloadXML);
    }
}

const DEPARTAMENTO_RUTAS = new DepartamentoRutas();

export default DEPARTAMENTO_RUTAS.router;