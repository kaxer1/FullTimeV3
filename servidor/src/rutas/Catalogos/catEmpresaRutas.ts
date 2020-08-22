import { Router } from 'express';
import EMPRESA_CONTROLADOR from '../../controlador/catalogos/catEmpresaControlador';
import { TokenValidation } from '../../libs/verificarToken';

class DepartamentoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', TokenValidation, EMPRESA_CONTROLADOR.ListarEmpresa);
        this.router.get('/buscar/:nombre', TokenValidation, EMPRESA_CONTROLADOR.ListarUnaEmpresa);
        this.router.post('/', TokenValidation, EMPRESA_CONTROLADOR.CrearEmpresa);
        this.router.put('/', TokenValidation, EMPRESA_CONTROLADOR.ActualizarEmpresa);
        this.router.post('/xmlDownload/', TokenValidation, EMPRESA_CONTROLADOR.FileXML);
        this.router.get('/download/:nameXML', EMPRESA_CONTROLADOR.downloadXML);
        this.router.delete('/eliminar/:id', TokenValidation, EMPRESA_CONTROLADOR.EliminarRegistros);
        this.router.get('/buscar/datos/:id', TokenValidation, EMPRESA_CONTROLADOR.ListarEmpresaId);
    }
}

const EMPRESA_RUTAS = new DepartamentoRutas();

export default EMPRESA_RUTAS.router;