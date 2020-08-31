import { Router } from 'express';
import PROCESO_CONTROLADOR from '../../controlador/catalogos/catProcesoControlador';
import { TokenValidation } from '../../libs/VerificarToken';

class ProcesoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', TokenValidation, PROCESO_CONTROLADOR.list);
        this.router.get('/busqueda/:nombre', TokenValidation, PROCESO_CONTROLADOR.getIdByNombre);
        this.router.get('/:id', TokenValidation, PROCESO_CONTROLADOR.getOne);
        this.router.post('/', TokenValidation, PROCESO_CONTROLADOR.create);
        this.router.put('/', TokenValidation, PROCESO_CONTROLADOR.ActualizarProceso);  
        this.router.delete('/eliminar/:id', TokenValidation, PROCESO_CONTROLADOR.EliminarProceso);
        this.router.post('/xmlDownload/', TokenValidation, PROCESO_CONTROLADOR.FileXML);
        this.router.get('/download/:nameXML', PROCESO_CONTROLADOR.downloadXML);
    }
}

const PROCESO_RUTAS = new ProcesoRutas();

export default PROCESO_RUTAS.router;