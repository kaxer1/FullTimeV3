import { Request, Response, text } from 'express';

import { QueryResult } from 'pg';

import pool from '../database';


class PruebaControlador {
  
  public async list(req: Request, res: Response) {
    const roles = await pool.query('SELECT * FROM roles');
    //res.json({text: 'Describe prueba'});
    res.json(roles.rows);
  }

  public async getOne(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const rol = await pool.query('SELECT * FROM roles WHERE id = $1', [id]);
    // console.log(rol);
    if (rol.rowCount > 0) {
      return res.json(rol.rows[0])
    }
    //res.json({message: 'Rol encontrado'});
    //res.json({text: 'Esta es una prueba ' + req.params.id});
    res.status(404).json({ text: 'El rol no ha sido encontrado' });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { id, descripcion, usuarios } = req.body;
    await pool.query('INSERT INTO roles (id, descripcion, usuarios) VALUES ($1, $2, $3)', [id, descripcion, usuarios]);
    //console.log(req.body);
    res.json({ message: 'Rol guardado' });
  }

  public async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { descripcion, usuarios } = req.body;
    await pool.query('UPDATE roles SET descripcion = $1, usuarios = $2 WHERE id = $3', [descripcion, usuarios, id]);
    //res.json({text: 'eliminado un dato ' + req.params.id});
    res.json({ message: 'Rol actualizado exitosamente' });
    // res.json({text: 'Actualizando un dato ' + req.params.id});
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await pool.query('DELETE FROM roles WHERE id = $1', [id]);
    //res.json({text: 'eliminado un dato ' + req.params.id});
    res.json({ message: 'Rol eliminado' });
  }
}

const pruebaControlador = new PruebaControlador();

export default pruebaControlador;
