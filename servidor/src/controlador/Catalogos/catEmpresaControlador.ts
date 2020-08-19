import { Request, Response } from 'express';
import fs from 'fs';
const builder = require('xmlbuilder');

import pool from '../../database';

class EmpresaControlador {

    public async ListarEmpresa(req: Request, res: Response) {
        const EMPRESA = await pool.query('SELECT * FROM cg_empresa ORDER BY nombre ASC');
        if (EMPRESA.rowCount > 0) {
            return res.jsonp(EMPRESA.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarUnaEmpresa(req: Request, res: Response) {
        const { nombre } = req.params;
        const EMPRESA = await pool.query('SELECT * FROM cg_empresa WHERE nombre = $1', [nombre]);
        if (EMPRESA.rowCount > 0) {
            return res.jsonp(EMPRESA.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearEmpresa(req: Request, res: Response): Promise<void> {
        const { nombre, ruc, direccion, telefono, correo, tipo_empresa, representante, establecimiento } = req.body;
        await pool.query('INSERT INTO cg_empresa (nombre, ruc, direccion, telefono, correo, tipo_empresa, representante, establecimiento  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [nombre, ruc, direccion, telefono, correo, tipo_empresa, representante, establecimiento]);
        res.jsonp({ message: 'La Empresa se registró con éxito' });
    }

    public async ActualizarEmpresa(req: Request, res: Response): Promise<void> {
        const { nombre, ruc, direccion, telefono, correo, tipo_empresa, representante, establecimiento, id } = req.body;
        await pool.query('UPDATE cg_empresa SET nombre = $1, ruc = $2, direccion = $3, telefono = $4, correo = $5, tipo_empresa = $6, representante = $7, establecimiento = $8 WHERE id = $9', [nombre, ruc, direccion, telefono, correo, tipo_empresa, representante, establecimiento, id]);
        res.jsonp({ message: 'Empresa actualizada exitosamente' });
    }

    public async FileXML(req: Request, res: Response): Promise<any> {
        var xml = builder.create('root').ele(req.body).end({ pretty: true });
        console.log(req.body.userName);
        let filename = "Empresas-" + req.body.userName + '-' + req.body.userId + '-' + new Date().getTime() + '.xml';
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

    public async EliminarRegistros(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        await pool.query('DELETE FROM cg_empresa WHERE id = $1', [id]);
        res.jsonp({ message: 'Registro eliminado' });
    }

    public async ListarEmpresaId(req: Request, res: Response) {
        const { id } = req.params;
        const EMPRESA = await pool.query('SELECT * FROM cg_empresa WHERE id = $1', [id]);
        if (EMPRESA.rowCount > 0) {
            return res.jsonp(EMPRESA.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

}

export const EMPRESA_CONTROLADOR = new EmpresaControlador();

export default EMPRESA_CONTROLADOR;