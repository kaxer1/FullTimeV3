import { Request, Response, text } from 'express';
import pool from '../../database';
import excel from 'xlsx';
import fs from 'fs';

class FeriadosControlador {

    public async ListarFeriados(req: Request, res: Response) {
        const FERIADOS = await pool.query('SELECT * FROM cg_feriados ORDER BY descripcion ASC');
        if (FERIADOS.rowCount > 0) {
            return res.json(FERIADOS.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' });
        }
    }

    public async ObtenerUltimoId(req: Request, res: Response) {
        const FERIADOS = await pool.query('SELECT MAX(id) FROM cg_feriados');
        if (FERIADOS.rowCount > 0) {
            return res.json(FERIADOS.rows)
        }
        else {
            return res.status(404).json({ text: 'No se encuentran registros' });
        }
    }

    public async ActualizarFeriado(req: Request, res: Response): Promise<void> {
        const { fecha, descripcion, fec_recuperacion, id } = req.body;
        await pool.query('UPDATE cg_feriados SET fecha = $1, descripcion = $2, fec_recuperacion = $3 WHERE id = $4', [fecha, descripcion, fec_recuperacion, id]);
        res.json({ message: 'Feriado actualizado exitosamente' });
    }

    public async CrearFeriados(req: Request, res: Response): Promise<void> {
        const { fecha, descripcion, fec_recuperacion } = req.body;
        await pool.query('INSERT INTO cg_feriados (fecha, descripcion, fec_recuperacion) VALUES ($1, $2, $3)', [fecha, descripcion, fec_recuperacion]);
        res.json({ message: 'Feriado guardado' });
    }

    public async ObtenerUnFeriado(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const FERIADO = await pool.query('SELECT * FROM cg_feriados WHERE id = $1', [id]);
        if (FERIADO.rowCount > 0) {
            return res.json(FERIADO.rows)
        }
        res.status(404).json({ text: 'Registros no encontrados' });
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

            if(fecha != undefined){
                await pool.query('INSERT INTO cg_feriados (fecha, descripcion, fec_recuperacion) VALUES ($1, $2, $3)', [fecha, descripcion, fec_recuperacion]);
            } else {
              res.json({error: 'plantilla equivocada'});
            }
          });
        res.json({ message: 'La plantilla a sido receptada' });
        fs.unlinkSync(filePath);
    }
}

const FERIADOS_CONTROLADOR = new FeriadosControlador();

export default FERIADOS_CONTROLADOR;
