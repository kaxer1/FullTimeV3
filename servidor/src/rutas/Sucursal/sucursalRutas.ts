import { Router } from 'express';

import SUCURSAL_CONTROLADOR from '../../controlador/sucursal/sucursalControlador';

class SucursalRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', SUCURSAL_CONTROLADOR.ListarSucursales);
        this.router.get('/unaSucursal/:id', SUCURSAL_CONTROLADOR.ObtenerUnaSucursal);
        this.router.get('/buscar/nombreSuc/:id_empresa', SUCURSAL_CONTROLADOR.ObtenerSucursalEmpresa);
        this.router.post('/', SUCURSAL_CONTROLADOR.CrearSucursal);
        this.router.get('/ultimoId', SUCURSAL_CONTROLADOR.ObtenerUltimoId);

    }
}

const SUCURSAL_RUTAS = new SucursalRutas();

export default SUCURSAL_RUTAS.router;