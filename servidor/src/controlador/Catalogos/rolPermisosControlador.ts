import { Request, Response } from 'express';
import pool from '../../database';

class RolPermisosControlador {
  public async list(req: Request, res: Response) {
    const rolPermisos = await pool.query('SELECT * FROM cg_rol_permisos');
    res.json(rolPermisos.rows);
  }

  public async getOne(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const unRolPermiso = await pool.query('SELECT * FROM cg_rol_permisos WHERE id = $1', [id]);
    if (unRolPermiso.rowCount > 0) {
      return res.json(unRolPermiso.rows)
    }
    res.status(404).json({ text: 'Rol permiso no encontrado' });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { funcion, link, etiqueta } = req.body;
    await pool.query('INSERT INTO cg_rol_permisos ( funcion, link, etiqueta ) VALUES ($1, $2, $3)', [funcion, link, etiqueta]);
    console.log(req.body);
    const rolPermisos = await pool.query('SELECT id FROM cg_rol_permisos');
    const ultimoDato = rolPermisos.rows.length - 1;
    const idRespuesta = rolPermisos.rows[ultimoDato].id;
    res.json({ message: 'Rol permiso Guardado', id: idRespuesta});
  }

  public async createPermisoDenegado(req: Request, res: Response): Promise<void> {
    const { id_rol, id_permiso } = req.body;
    await pool.query('INSERT INTO rol_perm_denegado ( id_rol, id_permiso ) VALUES ($1, $2)', [id_rol, id_permiso]);
    console.log(req.body);
    res.json({ message: 'Permiso denegado Guardado'});
  }

  public async getPermisosUsuario(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const unRolPermiso = await pool.query('SELECT * FROM rol_perm_denegado WHERE id_rol = $1', [id]);
    if (unRolPermiso.rowCount > 0) {
      return res.json(unRolPermiso.rows)
    }
    res.status(404).json({ text: 'El rol no tiene permisos' });
  }

}

export const rolPermisosControlador = new RolPermisosControlador();

export default rolPermisosControlador;