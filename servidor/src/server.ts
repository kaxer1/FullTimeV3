import express, {Application} from 'express';
import cors from 'cors';
import morgan from 'morgan';

// rutas importadas
import indexRutas from './rutas/indexRutas';
import roles from './rutas/pruebaRutas';
import empleado from './rutas/empleadoRutas';
import loginRuta from './rutas/login/loginRuta';
import discapacidadRuta from './rutas/discapacidadRutas';
import tituloRuta from './rutas/Catalogos/tituloRutas';
import horasExtrasRutas from './rutas/Catalogos/horasExtrasRutas';
import notificacionesRutas from './rutas/Catalogos/notificacionesRutas';



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
        this.app.use('/rol', roles);
        this.app.use('/empleado', empleado);
        this.app.use('/login', loginRuta);
        this.app.use('/titulo', tituloRuta);
        this.app.use('/discapacidad', discapacidadRuta);
        this.app.use('/horasExtras', horasExtrasRutas);
        this.app.use('/notificaciones', notificacionesRutas);

    }

    start(): void{
        this.app.listen(this.app.get('puerto'), () => {
            console.log('Servidor en el puerto', this.app.get('puerto'))
        });
    }
}

const servidor = new Server();
servidor.start();
