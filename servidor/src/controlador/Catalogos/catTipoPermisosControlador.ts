import { Request, Response } from 'express';
import pool from '../../database';

class TipoPermisosControlador {
  public async list(req: Request, res: Response) {
    const rolPermisos = await pool.query('SELECT * FROM cg_tipo_permisos');
    res.json(rolPermisos.rows);
  }

  public async getOne(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const unTipoPermiso = await pool.query('SELECT * FROM cg_tipo_permisos WHERE id = $1', [id]);
    if (unTipoPermiso.rowCount > 0) {
      return res.json(unTipoPermiso.rows)
    }
    res.status(404).json({ text: 'Rol permiso no encontrado' });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { descripcion, tipo_descuento, num_dia_maximo, num_hora_maximo, num_dia_ingreso, vaca_afecta, anio_acumula, correo, gene_justificacion, fec_validar, acce_empleado, actualizar, autorizar, eliminar, legalizar, preautorizar, almu_incluir, num_dia_justifica } = req.body;
    await pool.query('INSERT INTO cg_tipo_permisos (  descripcion, tipo_descuento, num_dia_maximo, num_hora_maximo, num_dia_ingreso, vaca_afecta, anio_acumula, correo, gene_justificacion, fec_validar, acce_empleado, actualizar, autorizar, eliminar, legalizar, preautorizar, almu_incluir, num_dia_justifica ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)', [ descripcion, tipo_descuento, num_dia_maximo, num_hora_maximo, num_dia_ingreso, vaca_afecta, anio_acumula, correo, gene_justificacion, fec_validar, acce_empleado, actualizar, autorizar, eliminar, legalizar, preautorizar, almu_incluir, num_dia_justifica]);
    res.json({ message: 'Guardado Tipo Permiso'});
  }

}

export const tipoPermisosControlador = new TipoPermisosControlador();

export default tipoPermisosControlador;