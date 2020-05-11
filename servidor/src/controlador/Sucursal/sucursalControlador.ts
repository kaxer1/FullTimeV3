import { Request, Response } from 'express';
import pool from '../../database';

class SucursalControlador {

  public async ListarSucursales(req: Request, res: Response) {
    const SUCURSAL = await pool.query('SELECT *FROM NombreCiudadEmpresa');
    if (SUCURSAL.rowCount > 0) {
      return res.json(SUCURSAL.rows)
    }
    else {
      return res.status(404).json({ text: 'No se encuentran registros' });
    }
  }

  public async ObtenerUnaSucursal(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const SUCURSAL = await pool.query('SELECT * FROM sucursales WHERE id = $1', [id]);
    if (SUCURSAL.rowCount > 0) {
      return res.json(SUCURSAL.rows)
    }
    else {
      return res.status(404).json({ text: 'No se encuentran registros' });
    }
  }

  public async ObtenerSucursalEmpresa(req: Request, res: Response): Promise<any> {
    const { id_empresa } = req.params;
    const SUCURSAL = await pool.query('SELECT * FROM sucursales WHERE id_empresa = $1', [id_empresa]);
    if (SUCURSAL.rowCount > 0) {
      return res.json(SUCURSAL.rows)
    }
    else {
      return res.status(404).json({ text: 'No se encuentran registros' });
    }
  }

  public async CrearSucursal(req: Request, res: Response): Promise<void> {
    const { nombre, id_ciudad, id_empresa } = req.body;
    await pool.query('INSERT INTO sucursales (nombre, id_ciudad, id_empresa) VALUES ($1, $2, $3)', [nombre, id_ciudad, id_empresa]);
    res.json({ message: 'Sucursal ha sido guardado con éxito' });
  }

  public async ObtenerUltimoId(req: Request, res: Response): Promise<any> {
    const SUCURSAL = await pool.query('SELECT MAX(id) FROM sucursales');
    if (SUCURSAL.rowCount > 0) {
        return res.json(SUCURSAL.rows)
    }
    else {
        return res.status(404).json({ text: 'No se encuentran registros' });
    }
}

}

export const SUCURSAL_CONTROLADOR = new SucursalControlador();

export default SUCURSAL_CONTROLADOR;