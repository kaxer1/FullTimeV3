import { Router } from 'express';

import  PROVINCIA_CONTROLADOR  from '../../controlador/catalogos/catProvinciaControlador';

class ProvinciaRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', PROVINCIA_CONTROLADOR.ListarProvincia);
        this.router.get('/paises', PROVINCIA_CONTROLADOR.ListarTodoPais);
        this.router.get('/continentes', PROVINCIA_CONTROLADOR.ListarContinentes);
        this.router.get('/pais/:continente', PROVINCIA_CONTROLADOR.ListarPaises);
        this.router.get('/nombreProvincia/:nombre', PROVINCIA_CONTROLADOR.ObtenerIdProvincia);
        this.router.get('/:id_pais',  PROVINCIA_CONTROLADOR.ObtenerUnaProvincia);
        this.router.get('/buscar/:id',  PROVINCIA_CONTROLADOR.ObtenerProvincia);
        this.router.get('/buscar/pais/:id',  PROVINCIA_CONTROLADOR.ObtenerPais);
        this.router.post('/',  PROVINCIA_CONTROLADOR.CrearProvincia);
        this.router.delete('/eliminar/:id', PROVINCIA_CONTROLADOR.EliminarProvincia);
    }
}

const PROVINCIA_RUTAS = new ProvinciaRutas();

export default PROVINCIA_RUTAS.router;