import { Request, Response } from 'express';
import pool from '../../database';

class DepartamentoControlador {

  public async ListarDepartamentos(req: Request, res: Response) {
    const PROVINCIA = await pool.query('SELECT * FROM cg_departamentos');
    if (PROVINCIA.rowCount > 0) {
      return res.json(PROVINCIA.rows)
    }
    else {
      return res.status(404).json({ text: 'No se encuentran registros' });
    }
  }

  public async getOne(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const unaProvincia = await pool.query('SELECT * FROM cg_departamentos WHERE id = $1', [id]);
    if (unaProvincia.rowCount > 0) {
      return res.json(unaProvincia.rows)
    }
    res.status(404).json({ text: 'El departamento no ha sido encontrado' });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { nombre, depa_padre, nivel } = req.body;
    await pool.query('INSERT INTO cg_departamentos (nombre, depa_padre,nivel) VALUES ($1, $2,$3)', [nombre, depa_padre, nivel]);
    res.json({ message: 'El departamento ha sido guardado con éxito' });
  }

  public async getIdByNombre(req: Request, res: Response): Promise<any> {
    const { nombre } = req.params;
    const unIdProceso = await pool.query('SELECT id FROM cg_departamentos WHERE nombre = $1', [nombre]);
    if (unIdProceso.rowCount > 0) {
      return res.json(unIdProceso.rows);
    }
    res.status(404).json({ text: 'El departamento no ha sido encontrado' });
  }

  public async updateDepartamento(req: Request, res: Response): Promise<any> {
    const { nombre, nivel, depa_padre } = req.body;
    const { id } = req.params;
    await pool.query('UPDATE cg_departamentos set NOMBRE= $1, DEPA_PADRE =$2, NIVEL=$3 WHERE id= $4', [nombre, depa_padre, nivel, id]);
    console.log(pool.query);
    res.json({ message: 'El departamento ha sido modificado con éxito' });
  }


}

export const DEPARTAMENTO_CONTROLADOR = new DepartamentoControlador();

export default DEPARTAMENTO_CONTROLADOR;