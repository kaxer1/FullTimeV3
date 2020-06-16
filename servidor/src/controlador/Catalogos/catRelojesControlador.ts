import { Request, Response, text } from 'express';
import pool from '../../database';
import excel from 'xlsx';
import fs from 'fs';

class RelojesControlador {

    public async ListarRelojes(req: Request, res: Response) {
        const RELOJES = await pool.query('SELECT * FROM NombreDispositivos');
        if (RELOJES.rowCount > 0) {
            return res.jsonp(RELOJES.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarUnReloj(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const RELOJES = await pool.query('SELECT * FROM cg_relojes WHERE id = $1', [id]);
        if (RELOJES.rowCount > 0) {
            return res.jsonp(RELOJES.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearRelojes(req: Request, res: Response): Promise<void> {
        const { nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento } = req.body;
        await pool.query('INSERT INTO cg_relojes (nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento]);
        res.jsonp({ message: 'Reloj Guardado' });
    }

    public async ActualizarReloj(req: Request, res: Response): Promise<void> {
        const { nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento, id } = req.body;
        await pool.query('UPDATE cg_relojes SET nombre = $1, ip = $2, puerto = $3, contrasenia = $4, marca = $5, modelo = $6, serie = $7, id_fabricacion = $8, fabricante = $9, mac = $10, tien_funciones = $11, id_sucursal = $12, id_departamento = $13 WHERE id = $14', [nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento, id]);
        res.jsonp({ message: 'Registro Actualizado' });
    }

    public async CargaPlantillaRelojes(req: Request, res: Response): Promise<void> {
        let list: any = req.files;
        let cadena = list.uploads[0].path;
        let filename = cadena.split("\\")[1]; 
        var filePath = `./plantillas/${filename}`
    
        const workbook = excel.readFile(filePath);
        const sheet_name_list = workbook.SheetNames;
        const plantilla = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]); 
        plantilla.forEach(async (data: any) => {
            const { nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento } = data;
            if(nombre != undefined){
                console.log(data);
                await pool.query('INSERT INTO cg_relojes (nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento]);
            } else {
                res.jsonp({error: 'plantilla equivocada'});
            }
        });
        
        res.jsonp({ message: 'La plantilla a sido receptada' });
        fs.unlinkSync(filePath);
      }

}

const RELOJES_CONTROLADOR = new RelojesControlador();

export default RELOJES_CONTROLADOR;
