import { Request, Response, text } from 'express';
import pool from '../../database';
import excel from 'xlsx';
import fs from 'fs';
const builder = require('xmlbuilder');

class FeriadosControlador {

    public async ListarFeriados(req: Request, res: Response) {
        const FERIADOS = await pool.query('SELECT * FROM cg_feriados ORDER BY descripcion ASC');
        if (FERIADOS.rowCount > 0) {
            return res.jsonp(FERIADOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarFeriadosActualiza(req: Request, res: Response) {
        const id = req.params.id;
        const FERIADOS = await pool.query('SELECT * FROM cg_feriados WHERE NOT id = $1', [id]);
        if (FERIADOS.rowCount > 0) {
            return res.jsonp(FERIADOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ObtenerUltimoId(req: Request, res: Response) {
        const FERIADOS = await pool.query('SELECT MAX(id) FROM cg_feriados');
        if (FERIADOS.rowCount > 0) {
            return res.jsonp(FERIADOS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ActualizarFeriado(req: Request, res: Response) {
        try {
            const { fecha, descripcion, fec_recuperacion, id } = req.body;
            await pool.query('UPDATE cg_feriados SET fecha = $1, descripcion = $2, fec_recuperacion = $3 WHERE id = $4', [fecha, descripcion, fec_recuperacion, id]);
            res.jsonp({ message: 'Feriado actualizado exitosamente' });
        }
        catch (error) {
            return res.jsonp({ message: 'error' });
        }
    }

    public async CrearFeriados(req: Request, res: Response) {
        try {
            const { fecha, descripcion, fec_recuperacion } = req.body;
            await pool.query('INSERT INTO cg_feriados (fecha, descripcion, fec_recuperacion) VALUES ($1, $2, $3)', [fecha, descripcion, fec_recuperacion]);
            res.jsonp({ message: 'Feriado guardado' });
        }
        catch (error) {
            return res.jsonp({ message: 'error' });
        }
    }

    public async ObtenerUnFeriado(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const FERIADO = await pool.query('SELECT * FROM cg_feriados WHERE id = $1', [id]);
        if (FERIADO.rowCount > 0) {
            return res.jsonp(FERIADO.rows)
        }
        res.status(404).jsonp({ text: 'Registros no encontrados' });
    }

    public async CrearFeriadoPlantilla(req: Request, res: Response): Promise<void> {
        let list: any = req.files;
        let cadena = list.uploads[0].path;
        let filename = cadena.split("\\")[1];
        var filePath = `./plantillas/${filename}`

        const workbook = excel.readFile(filePath);
        const sheet_name_list = workbook.SheetNames;
        const plantilla = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        plantilla.forEach(async (data: any) => {
            const { fecha, descripcion, fec_recuperacion } = data;
            if (fec_recuperacion === undefined) {
                var recuperar = null;
            }
            await pool.query('INSERT INTO cg_feriados (fecha, descripcion, fec_recuperacion) VALUES ($1, $2, $3)', [fecha, descripcion, recuperar]);
            return res.jsonp({ message: 'correcto' });
        });
        fs.unlinkSync(filePath);
    }

    public async RevisarDatos(req: Request, res: Response): Promise<void> {
        let list: any = req.files;
        let cadena = list.uploads[0].path;
        let filename = cadena.split("\\")[1];
        var filePath = `./plantillas/${filename}`

        const workbook = excel.readFile(filePath);
        const sheet_name_list = workbook.SheetNames;
        const plantilla = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        var contarFecha = 0;
        var contarFechaRecuperar = 0;
        var contarDescripcion = 0;
        var contador = 1;

        plantilla.forEach(async (data: any) => {
            const { fecha, descripcion, fec_recuperacion } = data;
            var fecha_data = fecha;
            var fec_recuperacion_data = fec_recuperacion;
            var descripcion_data = descripcion;
            const VERIFICAR_FECHA = await pool.query('SELECT * FROM cg_feriados WHERE fecha = $1 OR fec_recuperacion = $1', [fecha_data]);
            if (VERIFICAR_FECHA.rowCount === 0) {
                contarFecha = contarFecha + 1;
            }
            if (fec_recuperacion != undefined) {
                const VERIFICAR_FECHA_RECUPERAR = await pool.query('SELECT * FROM cg_feriados WHERE fecha = $1 OR fec_recuperacion = $1', [fec_recuperacion_data]);
                if (VERIFICAR_FECHA_RECUPERAR.rowCount === 0 && fec_recuperacion > fecha) {
                    contarFechaRecuperar = contarFechaRecuperar + 1;
                }
            }
            else {
                contarFechaRecuperar = contarFechaRecuperar + 1;
            }
            if (descripcion_data != undefined) {
                contarDescripcion = contarDescripcion + 1;
            }
            // Verificación cuando se ha leido todos los datos de la plantilla
            console.log('fecha', contarFecha, plantilla.length, contador);
            console.log('fecha_rec', contarFechaRecuperar, plantilla.length, contador);
            console.log('descripcion', contarDescripcion, plantilla.length, contador);
            if (contador === plantilla.length) {
                if (contarFecha === plantilla.length && contarFechaRecuperar === plantilla.length &&
                    contarDescripcion === plantilla.length) {
                    return res.jsonp({ message: 'correcto' });
                }
                else {
                    return res.jsonp({ message: 'error' });
                }
            }
            contador = contador + 1;
        });
        fs.unlinkSync(filePath);
    }

    public async RevisarDatos_Duplicados(req: Request, res: Response) {
        let list: any = req.files;
        let cadena = list.uploads[0].path;
        let filename = cadena.split("\\")[1];
        var filePath = `./plantillas/${filename}`

        const workbook = excel.readFile(filePath);
        const sheet_name_list = workbook.SheetNames;
        const plantilla = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        var contador = 1;
        var contarFechaData = 0;
        var contarFechaRecuperarData = 0;
        var array_todo: any = [];
        plantilla.forEach(async (data: any) => {
            const { fecha, descripcion, fec_recuperacion } = data;
            let datos_array = {
                fecha: fecha,
                fec_recuperacion: fec_recuperacion,
                descripcion: descripcion
            }
            array_todo.push(datos_array);
        });
        console.log('array', array_todo)
        console.log('array2', array_todo[0].fecha)
        for (var i = 0; i <= array_todo.length - 1; i++) {
            for (var j = 0; j <= array_todo.length - 1; j++) {
                console.log('fecha....', array_todo[i].fecha, array_todo[j].fecha, array_todo[j].fec_recuperacion, array_todo[j].fec_recuperacion, plantilla.length, contador);
                if (array_todo[i].fecha === array_todo[j].fecha && array_todo[i].fecha === array_todo[j].fec_recuperacion) {
                    contarFechaData = contarFechaData + 1;
                }
                if (array_todo[i].fec_recuperacion != undefined) {
                    if (array_todo[i].fec_recuperacion === array_todo[j].fec_recuperacion &&
                        array_todo[i].fec_recuperacion === array_todo[j].fecha) {
                        contarFechaRecuperarData = contarFechaRecuperarData + 1;
                    }
                }
            }
            contador = contador + 1;
        }
        console.log('fecha1', contarFechaData, plantilla.length, contador);
        console.log('fecha_rec1', contarFechaRecuperarData, plantilla.length, contador);
        if ((contador - 1) === plantilla.length) {
            if (contarFechaData === 0 &&
                contarFechaRecuperarData === 0) {
                return res.jsonp({ message: 'correcto' });
            }
            else {
                return res.jsonp({ message: 'error' });
            }
        }
        fs.unlinkSync(filePath);
    }


    public async FileXML(req: Request, res: Response): Promise<any> {
        var xml = builder.create('root').ele(req.body).end({ pretty: true });
        console.log(req.body.userName);
        let filename = "Feriados-" + req.body.userName + '-' + req.body.userId + '-' + new Date().getTime() + '.xml';
        fs.writeFile(`xmlDownload/${filename}`, xml, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Archivo guardado");
        });
        res.jsonp({ text: 'XML creado', name: filename });
    }

    public async downloadXML(req: Request, res: Response): Promise<any> {
        const name = req.params.nameXML;
        let filePath = `servidor\\xmlDownload\\${name}`
        res.sendFile(__dirname.split("servidor")[0] + filePath);
    }

    public async EliminarFeriado(req: Request, res: Response): Promise<any> {
        const id = req.params.id;
        await pool.query('DELETE FROM cg_feriados WHERE id = $1', [id]);
        res.jsonp({ text: 'registro eliminado' });
    }
}

const FERIADOS_CONTROLADOR = new FeriadosControlador();

export default FERIADOS_CONTROLADOR;
