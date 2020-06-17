import { Router } from 'express';
import ROLES_CONTROLADOR from '../../controlador/catalogos/catRolesControlador';

class PruebasRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', ROLES_CONTROLADOR.ListarRoles);
        this.router.get('/:id', ROLES_CONTROLADOR.ObtnenerUnRol);
        this.router.post('/', ROLES_CONTROLADOR.CrearRol);
        this.router.put('/', ROLES_CONTROLADOR.ActualizarRol);
        // this.router.delete('/:id', pruebaControlador.delete);
        this.router.post('/xmlDownload/', ROLES_CONTROLADOR.FileXML);
        this.router.get('/download/:nameXML', ROLES_CONTROLADOR.downloadXML);
    }
}

const ROLES_RUTAS = new PruebasRutas();

export default ROLES_RUTAS.router;