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
            try {
                const { fecha, descripcion, fec_recuperacion } = data;
                if (fecha != undefined && descripcion != undefined) {
                    await pool.query('INSERT INTO cg_feriados (fecha, descripcion, fec_recuperacion) VALUES ($1, $2, $3)', [fecha, descripcion, fec_recuperacion]);
                }
                else {
                    res.jsonp({ message: 'error' });
                }
                res.jsonp({ message: 'correcto' });
                fs.unlinkSync(filePath);
            }
            catch (error) {
                res.jsonp({ error: 'error' });
            }
        });

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
