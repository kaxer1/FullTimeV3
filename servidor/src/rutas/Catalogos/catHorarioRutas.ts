import { Router } from 'express';

import HORARIO_CONTROLADOR from '../../controlador/catalogos/catHorarioControlador';

const path = require('path');
const multer = require('multer');

let storage = multer.diskStorage({
  destination:(req: any, file: any, cb: any)=>{
    cb(null, './plantillas/')
  },
  filename:(req: any, file: any, cb: any)=>{
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({storage})

class HorarioRutas {
    public router: Router = Router();

    constructor() {
        this.configuracion();
    }

    configuracion(): void {
        this.router.get('/', HORARIO_CONTROLADOR.ListarHorarios);
        this.router.get('/:id',  HORARIO_CONTROLADOR.ObtenerUnHorario);
        this.router.post('/upload', upload.single('file'), HORARIO_CONTROLADOR.CrearHorario);
    }
}

const HORARIO_RUTAS = new HorarioRutas();

export default HORARIO_RUTAS.router;