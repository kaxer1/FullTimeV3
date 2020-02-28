import express, {Application} from 'express';

import indexRutas from './rutas/indexRutas';
import index from './rutas/pruebaRutas';
import empleado from './rutas/empleadoRutas';

import cors from 'cors';

import morgan from 'morgan';

class Server {

    public app: Application;

    constructor(){
        this.app = express();
        this.configuracion();
        this.rutas();
    }

    configuracion(): void{
        this.app.set('puerto', process.env.PORT || 3000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
    }

    rutas(): void{

        this.app.use('/', indexRutas);
        this.app.use('/api', index);
        this.app.use('/empleado', empleado);
    }

    start(): void{
        this.app.listen(this.app.get('puerto'), () => {
            console.log('Servidor en el puerto', this.app.get('puerto'))
        });
    }
}

const servidor = new Server();
servidor.start();
