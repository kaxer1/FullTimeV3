import { Router } from 'express';

import SUCURSAL_CONTROLADOR from '../../controlador/Sucursal/sucursalControlador';

class SucursalRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', SUCURSAL_CONTROLADOR.ListarSucursales);
        this.router.get('/id:', SUCURSAL_CONTROLADOR.ObtenerUnaSucursal);
        this.router.post('/', SUCURSAL_CONTROLADOR.CrearSucursal);

    }
}

const SUCURSAL_RUTAS = new SucursalRutas();

export default SUCURSAL_RUTAS.router;