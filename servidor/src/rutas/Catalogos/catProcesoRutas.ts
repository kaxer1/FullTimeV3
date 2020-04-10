import { Router } from 'express';

<<<<<<< HEAD:servidor/src/rutas/Catalogos/catProcesoRutas.ts
import PROCESO_CONTROLADOR from '../../controlador/catalogos/catProcesoControlador';
=======
import PROCESO_CONTROLADOR from '../../controlador/Catalogos/procesoControlador';
>>>>>>> 06167363ec0cb38bfe8074c610dd2718b80dcecf:servidor/src/rutas/Catalogos/procesoRutas.ts

class ProcesoRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', PROCESO_CONTROLADOR.list);
        this.router.get('/busqueda/:nombre', PROCESO_CONTROLADOR.getIdByNombre);
        this.router.get('/:id',  PROCESO_CONTROLADOR.getOne);
        this.router.post('/', PROCESO_CONTROLADOR.create);    
    }
}

const PROCESO_RUTAS = new ProcesoRutas();

export default PROCESO_RUTAS.router;