import { Request, Response, text } from 'express';
import excel from 'xlsx';
import fs from 'fs';
const builder = require('xmlbuilder');

import pool from '../../database';

class TipoComidasControlador {

    public async ListarTipoComidas(req: Request, res: Response) {
        const TIPO_COMIDAS = await pool.query('SELECT ctc.id, ctc.nombre, ctc.tipo_comida, tc.nombre AS tipo ' +
            'FROM cg_tipo_comidas AS ctc, tipo_comida AS tc ' +
            'WHERE ctc.tipo_comida = tc.id ORDER BY tc.nombre ASC');
        if (TIPO_COMIDAS.rowCount > 0) {
            return res.jsonp(TIPO_COMIDAS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async VerUnMenu(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const TIPO_COMIDAS = await pool.query('SELECT ctc.id, ctc.nombre, ctc.tipo_comida, tc.nombre AS tipo ' +
            'FROM cg_tipo_comidas AS ctc, tipo_comida AS tc WHERE ctc.tipo_comida = tc.id AND ctc.id = $1', [id]);
        if (TIPO_COMIDAS.rowCount > 0) {
            return res.jsonp(TIPO_COMIDAS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarUnTipoComida(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const TIPO_COMIDAS = await pool.query('SELECT ctc.id, ctc.nombre, ctc.tipo_comida, tc.nombre AS tipo ' +
            'FROM cg_tipo_comidas AS ctc, tipo_comida AS tc ' +
            ' WHERE ctc.tipo_comida = tc.id AND tc.id = $1 ORDER BY tc.nombre ASC', [id]);
        if (TIPO_COMIDAS.rowCount > 0) {
            return res.jsonp(TIPO_COMIDAS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearTipoComidas(req: Request, res: Response): Promise<void> {
        const { nombre, tipo_comida } = req.body;
        await pool.query('INSERT INTO cg_tipo_comidas (nombre, tipo_comida) VALUES ($1, $2)',
            [nombre, tipo_comida]);
        res.jsonp({ message: 'Tipo de comida registrada' });
    }

    public async ActualizarComida(req: Request, res: Response): Promise<void> {
        const { nombre, tipo_comida, id } = req.body;
        await pool.query('UPDATE cg_tipo_comidas SET nombre = $1, tipo_comida = $2 WHERE id = $3',
            [nombre, tipo_comida, id]);
        res.jsonp({ message: 'Registro actualizado exitosamente' });
    }

    public async FileXML(req: Request, res: Response): Promise<any> {
        var xml = builder.create('root').ele(req.body).end({ pretty: true });
        console.log(req.body.userName);
        let filename = "Comidas-" + req.body.userName + '-' + req.body.userId + '-' + new Date().getTime() + '.xml';
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

    public async CrearTipoComidasPlantilla(req: Request, res: Response): Promise<void> {
        let list: any = req.files;
        let cadena = list.uploads[0].path;
        let filename = cadena.split("\\")[1];
        var filePath = `./plantillas/${filename}`

        const workbook = excel.readFile(filePath);
        const sheet_name_list = workbook.SheetNames;
        const plantilla = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        plantilla.forEach(async (data: any) => {
            const { nombre, tipo_comida } = data;
            if (nombre != undefined) {
                await pool.query('INSERT INTO cg_tipo_comidas (nombre, tipo_comida) VALUES ($1, $2)',
                    [nombre, tipo_comida]);
            } else {
                res.jsonp({ error: 'plantilla equivocada' });
            }
        });

        res.jsonp({ message: 'La plantilla a sido receptada' });
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
        var contarDatos = 0;
        var contarLlenos = 0;
        var contador = 1;

        plantilla.forEach(async (data: any) => {
            const { nombre, tipo_comida } = data;
            if (nombre != undefined && tipo_comida != undefined) {
                contarLlenos = contarLlenos + 1;
            }

            const VERIFICAR_DATOS = await pool.query('SELECT * FROM cg_tipo_comidas WHERE UPPER(nombre) = $1 AND ' +
                'tipo_comida = $2',
                [nombre.toUpperCase(), tipo_comida]);
            if (VERIFICAR_DATOS.rowCount === 0) {
                contarDatos = contarDatos + 1;
            }
            // Verificación cuando se ha leido todos los datos de la plantilla
            console.log('datos', contarDatos, plantilla.length, contador);
            console.log('llenos', contarLlenos, plantilla.length, contador);
            if (contador === plantilla.length) {
                if (contarDatos === plantilla.length && contarLlenos === plantilla.length) {
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
        var contarDatosData = 0;
        var array_datos: any = [];
        plantilla.forEach(async (data: any) => {
            const { nombre, valor, observacion } = data;
            let datos_array = {
                nombre: nombre,
                valor: valor,
                observacion: observacion
            }
            array_datos.push(datos_array);
        });
        console.log('array', array_datos)
        for (var i = 0; i <= array_datos.length - 1; i++) {
            for (var j = 0; j <= array_datos.length - 1; j++) {
                if (array_datos[i].nombre.toUpperCase() === array_datos[j].nombre.toUpperCase() &&
                    array_datos[i].valor === array_datos[j].valor
                    && array_datos[i].observacion.toUpperCase() === array_datos[j].observacion.toUpperCase()) {
                    contarDatosData = contarDatosData + 1;
                }
            }
            contador = contador + 1;
        }
        console.log('datos', contarDatosData, plantilla.length, contador);
        if ((contador - 1) === plantilla.length) {
            if (contarDatosData === plantilla.length) {
                return res.jsonp({ message: 'correcto' });
            }
            else {
                return res.jsonp({ message: 'error' });
            }
        }
        fs.unlinkSync(filePath);
    }

    public async EliminarRegistros(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        await pool.query('DELETE FROM cg_tipo_comidas WHERE id = $1', [id]);
        res.jsonp({ message: 'Registro eliminado' });
    }

    public async VerUltimoRegistro(req: Request, res: Response) {
        const TIPO_COMIDAS = await pool.query('SELECT MAX (id) FROM cg_tipo_comidas');
        if (TIPO_COMIDAS.rowCount > 0) {
            return res.jsonp(TIPO_COMIDAS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }


    // Registro de detalle de menú - desglose de platos
    public async CrearDetalleMenu(req: Request, res: Response): Promise<void> {
        const { nombre, valor, observacion, id_menu } = req.body;
        await pool.query('INSERT INTO detalle_menu (nombre, valor, observacion, id_menu) ' +
            'VALUES ($1, $2, $3, $4)',
            [nombre, valor, observacion, id_menu]);
        res.jsonp({ message: 'Detalle de menú registrada' });
    }

    public async VerUnDetalleMenu(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const TIPO_COMIDAS = await pool.query('SELECT * FROM detalle_menu WHERE id_menu = $1', [id]);
        if (TIPO_COMIDAS.rowCount > 0) {
            return res.jsonp(TIPO_COMIDAS.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ActualizarDetalleMenu(req: Request, res: Response): Promise<void> {
        const { nombre, valor, observacion, id } = req.body;
        await pool.query('UPDATE detalle_menu SET nombre = $1, valor = $2, observacion = $3 ' +
            'WHERE id = $4',
            [nombre, valor, observacion, id]);
        res.jsonp({ message: 'Detalle de menú actualizado' });
    }

    public async EliminarDetalle(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        await pool.query('DELETE FROM detalle_menu WHERE id = $1', [id]);
        res.jsonp({ message: 'Registro eliminado' });
    }

}

const TIPO_COMIDAS_CONTROLADOR = new TipoComidasControlador();

export default TIPO_COMIDAS_CONTROLADOR;
