import { Request, Response } from 'express';
import pool from '../../database';

class DepartamentoControlador {

  public async ListarDepartamentos(req: Request, res: Response) {
    const DEPARTAMENTOS = await pool.query('SELECT * FROM VistaDepartamentoPadre ORDER BY nombre ASC');
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
      return res.json(DEPARTAMENTO.rows)
    }
    res.status(404).json({ text: 'El departamento no ha sido encontrado' });
  }

  public async CrearDepartamento(req: Request, res: Response): Promise<void> {
    const { nombre, depa_padre, nivel } = req.body;
    await pool.query('INSERT INTO cg_departamentos (nombre, depa_padre,nivel) VALUES ($1, $2,$3)', [nombre, depa_padre, nivel]);
    res.json({ message: 'El departamento ha sido guardado con éxito' });
  }

  public async ActualizarDepartamento(req: Request, res: Response): Promise<any> {
    const { nombre, nivel, depa_padre } = req.body;
    const { id } = req.params;
    await pool.query('UPDATE cg_departamentos set NOMBRE= $1, DEPA_PADRE =$2, NIVEL=$3 WHERE id= $4', [nombre, depa_padre, nivel, id]);
    console.log(pool.query);
    res.json({ message: 'El departamento ha sido modificado con éxito' });
  }

}

export const DEPARTAMENTO_CONTROLADOR = new DepartamentoControlador();

export default DEPARTAMENTO_CONTROLADOR;