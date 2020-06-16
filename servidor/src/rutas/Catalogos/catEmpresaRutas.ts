import { Router } from 'express';
import EMPRESA_CONTROLADOR from '../../controlador/catalogos/catEmpresaControlador';

class DepartamentoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', EMPRESA_CONTROLADOR.ListarEmpresa);
        this.router.get('/buscar/:nombre', EMPRESA_CONTROLADOR.ListarUnaEmpresa);
        this.router.post('/', EMPRESA_CONTROLADOR.CrearEmpresa);
        this.router.put('/', EMPRESA_CONTROLADOR.ActualizarEmpresa);
        this.router.post('/xmlDownload/', EMPRESA_CONTROLADOR.FileXML);
        this.router.get('/download/:nameXML', EMPRESA_CONTROLADOR.downloadXML);
    }
}

const EMPRESA_RUTAS = new DepartamentoRutas();

export default EMPRESA_RUTAS.router;