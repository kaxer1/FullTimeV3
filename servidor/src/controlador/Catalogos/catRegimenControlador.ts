import { Request, Response, text } from 'express';
import fs from 'fs';
const builder = require('xmlbuilder');

import pool from '../../database';

class RegimenControlador {

    public async ListarRegimen(req: Request, res: Response) {
        const REGIMEN = await pool.query('SELECT * FROM cg_regimenes ORDER BY descripcion ASC');
        if (REGIMEN.rowCount > 0) {
            return res.jsonp(REGIMEN.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarUnRegimen(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const REGIMEN = await pool.query('SELECT * FROM cg_regimenes WHERE id = $1', [id]);
        if (REGIMEN.rowCount > 0) {
            return res.jsonp(REGIMEN.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearRegimen(req: Request, res: Response) {
        try {
            const { descripcion, dia_anio_vacacion, dia_incr_antiguedad, anio_antiguedad, dia_mes_vacacion, max_dia_acumulacion, dia_libr_anio_vacacion } = req.body;
            await pool.query('INSERT INTO cg_regimenes (descripcion, dia_anio_vacacion, dia_incr_antiguedad, anio_antiguedad, dia_mes_vacacion, max_dia_acumulacion, dia_libr_anio_vacacion) VALUES ($1, $2, $3, $4, $5, $6, $7)', [descripcion, dia_anio_vacacion, dia_incr_antiguedad, anio_antiguedad, dia_mes_vacacion, max_dia_acumulacion, dia_libr_anio_vacacion]);
            res.jsonp({ message: 'Regimen guardado' });
        }
        catch (error) {
            return res.jsonp({ message: 'error' });
        }
    }

    public async ActualizarRegimen(req: Request, res: Response): Promise<void> {
        const { descripcion, dia_anio_vacacion, dia_incr_antiguedad, anio_antiguedad, dia_mes_vacacion, max_dia_acumulacion, dia_libr_anio_vacacion, id } = req.body;
        await pool.query('UPDATE cg_regimenes  SET descripcion = $1, dia_anio_vacacion = $2, dia_incr_antiguedad = $3, anio_antiguedad = $4, dia_mes_vacacion = $5, max_dia_acumulacion = $6, dia_libr_anio_vacacion = $7 WHERE id = $8', [descripcion, dia_anio_vacacion, dia_incr_antiguedad, anio_antiguedad, dia_mes_vacacion, max_dia_acumulacion, dia_libr_anio_vacacion, id]);
        res.jsonp({ message: 'Regimen guardado' });
    }

    public async FileXML(req: Request, res: Response): Promise<any> {
        var xml = builder.create('root').ele(req.body).end({ pretty: true });
        console.log(req.body.userName);
        let filename = "RegimenLaboral-" + req.body.userName + '-' + req.body.userId + '-' + new Date().getTime() + '.xml';
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

}

const REGIMEN_CONTROLADOR = new RegimenControlador();

export default REGIMEN_CONTROLADOR;
