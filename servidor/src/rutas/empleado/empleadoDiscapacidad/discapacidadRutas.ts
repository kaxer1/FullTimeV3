import { Router } from 'express';

import DISCAPACIDAD_CONTROLADOR from '../../../controlador/empleado/empleadoDiscapacidad/discapacidadControlador';

class DiscapacidadRutas {
    public router: Router = Router();

    constructor() {

        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', DISCAPACIDAD_CONTROLADOR.list);
        this.router.get('/:id_empleado', DISCAPACIDAD_CONTROLADOR.getOne);
        this.router.post('/', DISCAPACIDAD_CONTROLADOR.create);
        this.router.put('/:id_empleado', DISCAPACIDAD_CONTROLADOR.update);
        this.router.delete('/eliminar/:id_empleado', DISCAPACIDAD_CONTROLADOR.deleteDiscapacidad);

        // TIPO DISCAPACIDAD
        this.router.get('/buscarTipo/tipo', DISCAPACIDAD_CONTROLADOR.ListarTipoD);
        this.router.get('/buscarTipo/tipo/:id', DISCAPACIDAD_CONTROLADOR.ObtenerUnTipoD);
        this.router.post('/buscarTipo', DISCAPACIDAD_CONTROLADOR.CrearTipoD);
        this.router.put('/buscarTipo/:id', DISCAPACIDAD_CONTROLADOR.ActualizarTipoD);
        this.router.get('/buscarTipo/ultimoId', DISCAPACIDAD_CONTROLADOR.ObtenerUltimoIdTD);
    }
}

const DISCAPACIDAD_RUTAS = new DiscapacidadRutas();

export default DISCAPACIDAD_RUTAS.router;