import { Request, Response } from 'express';
import pool from '../../database';

class TipoPermisosControlador {
  public async list(req: Request, res: Response) {
    const rolPermisos = await pool.query('SELECT * FROM cg_tipo_permisos ORDER BY id');
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
    const { descripcion, tipo_descuento, num_dia_maximo, num_dia_ingreso, vaca_afecta, anio_acumula, correo, gene_justificacion, fec_validar, acce_empleado, actualizar, autorizar, eliminar, legalizar, preautorizar, almu_incluir, num_dia_justifica, num_hora_maximo } = req.body;
    await pool.query('INSERT INTO cg_tipo_permisos (descripcion, tipo_descuento, num_dia_maximo, num_dia_ingreso, vaca_afecta, anio_acumula, correo, gene_justificacion, fec_validar, acce_empleado, actualizar, autorizar, eliminar, legalizar, preautorizar, almu_incluir, num_dia_justifica, num_hora_maximo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)', [descripcion, tipo_descuento, num_dia_maximo, num_dia_ingreso, vaca_afecta, anio_acumula, correo, gene_justificacion, fec_validar, acce_empleado, actualizar, autorizar, eliminar, legalizar, preautorizar, almu_incluir, num_dia_justifica, num_hora_maximo]);
    res.json({ message: 'Guardado Tipo Permiso' });
  }
  
  public async editar(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const { descripcion, tipo_descuento, num_dia_maximo, num_dia_ingreso, vaca_afecta, anio_acumula, correo, gene_justificacion, fec_validar, acce_empleado, actualizar, autorizar, eliminar, legalizar, preautorizar, almu_incluir, num_dia_justifica, num_hora_maximo } = req.body;
    await pool.query('UPDATE cg_tipo_permisos SET descripcion = $1, tipo_descuento = $2, num_dia_maximo = $3, num_dia_ingreso = $4, vaca_afecta = $5, anio_acumula = $6, correo = $7, gene_justificacion = $8, fec_validar = $9, acce_empleado = $10, actualizar = $11, autorizar = $12, eliminar = $13, legalizar = $14, preautorizar = $15, almu_incluir = $16, num_dia_justifica = $17, num_hora_maximo = $18 WHERE id = $19', [descripcion, tipo_descuento, num_dia_maximo, num_dia_ingreso, vaca_afecta, anio_acumula, correo, gene_justificacion, fec_validar, acce_empleado, actualizar, autorizar, eliminar, legalizar, preautorizar, almu_incluir, num_dia_justifica, num_hora_maximo, id]);
    res.json({ message: 'Tipo Permiso Actualizado' });
  }

}

export const tipoPermisosControlador = new TipoPermisosControlador();

export default tipoPermisosControlador;