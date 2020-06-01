import { Request, Response } from 'express';
import pool from '../../database';

class DepartamentoControlador {

  public async ListarDepartamentos(req: Request, res: Response) {
    const DEPARTAMENTOS = await pool.query('SELECT * FROM VistaDepartamentoPadre ORDER BY id ASC');
    if (DEPARTAMENTOS.rowCount > 0) {
      return res.json(DEPARTAMENTOS.rows)
    }
    else {
      return res.status(404).json({ text: 'No se encuentran registros' });
    }
  }

  public async ListarNombreDepartamentos(req: Request, res: Response) {
    const DEPARTAMENTOS = await pool.query('SELECT * FROM cg_departamentos');
    if (DEPARTAMENTOS.rowCount > 0) {
      return res.json(DEPARTAMENTOS.rows)
    }
    else {
      return res.status(404).json({ text: 'No se encuentran registros' });
    }
  }

  public async ListarIdDepartamentoNombre(req: Request, res: Response): Promise<any> {
    const { nombre } = req.params;
    const DEPARTAMENTOS = await pool.query('SELECT * FROM cg_departamentos WHERE nombre = $1', [nombre]);
    if (DEPARTAMENTOS.rowCount > 0) {
      return res.json(DEPARTAMENTOS.rows)
    }
    else {
      return res.status(404).json({ text: 'No se encuentran registros' });
    }
  }

  public async ObtenerIdDepartamento(req: Request, res: Response): Promise<any> {
    const { nombre } = req.params;
    const DEPARTAMENTO = await pool.query('SELECT id FROM cg_departamentos WHERE nombre = $1', [nombre]);
    if (DEPARTAMENTO.rowCount > 0) {
      return res.json(DEPARTAMENTO.rows);
    }
    res.status(404).json({ text: 'El departamento no ha sido encontrado' });
  }

  public async ObtenerUnDepartamento(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const DEPARTAMENTO = await pool.query('SELECT * FROM cg_departamentos WHERE id = $1', [id]);
    if (DEPARTAMENTO.rowCount > 0) {
      return res.json(DEPARTAMENTO.rows[0])
    }
    res.status(404).json({ text: 'El departamento no ha sido encontrado' });
  }

  public async ObtenerDepartamentosSucursal(req: Request, res: Response): Promise<any> {
    const { id_sucursal } = req.params;
    const DEPARTAMENTO = await pool.query('SELECT * FROM cg_departamentos WHERE id_sucursal = $1', [id_sucursal]);
    if (DEPARTAMENTO.rowCount > 0) {
      return res.json(DEPARTAMENTO.rows)
    }
    res.status(404).json({ text: 'El departamento no ha sido encontrado' });
  }

  public async CrearDepartamento(req: Request, res: Response): Promise<void> {
    const { nombre, depa_padre, nivel, id_sucursal } = req.body;
    await pool.query('INSERT INTO cg_departamentos (nombre, depa_padre, nivel, id_sucursal ) VALUES ($1, $2, $3, $4)', [nombre, depa_padre, nivel, id_sucursal]);
    res.json({ message: 'El departamento ha sido guardado con éxito' });
  }

  public async ActualizarDepartamento(req: Request, res: Response): Promise<any> {
    const { nombre, depa_padre, nivel, id_sucursal } = req.body;
    const id  = req.params.id;
    console.log(id);
    await pool.query('UPDATE cg_departamentos set nombre = $1, depa_padre = $2, nivel = $3 , id_sucursal = $4 WHERE id = $5', [nombre, depa_padre, nivel, id_sucursal, id]);
    res.json({ message: 'El departamento ha sido modificado con éxito' });
  }

}

export const DEPARTAMENTO_CONTROLADOR = new DepartamentoControlador();

export default DEPARTAMENTO_CONTROLADOR;