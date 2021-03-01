import { Request, Response } from 'express';
import pool from '../../database';
import { enviarMail, email, Credenciales } from '../../libs/settingsMail'

class PlanComidasControlador {

  public async ListarPlanComidas(req: Request, res: Response) {
    const PLAN_COMIDAS = await pool.query('SELECT * FROM plan_comidas');
    if (PLAN_COMIDAS.rowCount > 0) {
      return res.jsonp(PLAN_COMIDAS.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }

  public async CrearPlanComidas(req: Request, res: Response): Promise<void> {
    const { id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin, descripcion,
      extra } = req.body;
    await pool.query('INSERT INTO plan_comidas (id_empleado, fecha, id_comida, observacion, fec_solicita, ' +
      'hora_inicio, hora_fin, descripcion, extra) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin,
        descripcion, extra]);
    res.jsonp({ message: 'Planificación del almuerzo ha sido guardado con éxito' });
  }

  public async EncontrarPlanComidaPorIdEmpleado(req: Request, res: Response): Promise<any> {
    const { id_empleado } = req.params;
    const PLAN_COMIDAS = await pool.query('SELECT pc.id, pc.id_empleado, pc.fecha, pc.observacion, ' +
      'pc.fec_solicita, pc.hora_inicio, pc.hora_fin, pc.descripcion, ' +
      'ctc.id AS id_menu, ctc.nombre AS nombre_menu, tc.id AS id_servicio, tc.nombre AS nombre_servicio, ' +
      'dm.id AS id_detalle, dm.valor, dm.nombre AS nombre_plato, dm.observacion AS observa_menu, pc.extra ' +
      'FROM plan_comidas AS pc, cg_tipo_comidas AS ctc, tipo_comida AS tc, detalle_menu AS dm ' +
      'WHERE pc.id_empleado = $1 AND ctc.tipo_comida = tc.id AND ' +
      'ctc.id = dm.id_menu AND pc.id_comida = dm.id', [id_empleado]);
    if (PLAN_COMIDAS.rowCount > 0) {
      return res.jsonp(PLAN_COMIDAS.rows)
    }
    res.status(404).jsonp({ text: 'Registro no encontrado' });
  }

  public async EliminarRegistros(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    await pool.query('DELETE FROM plan_comidas WHERE id = $1', [id]);
    res.jsonp({ message: 'Registro eliminado' });
  }

  public async ActualizarPlanComidas(req: Request, res: Response): Promise<void> {
    const { id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin,
      extra, id } = req.body;
    await pool.query('UPDATE plan_comidas SET id_empleado = $1, fecha = $2, id_comida = $3, ' +
      'observacion = $4, fec_solicita = $5, hora_inicio = $6, hora_fin = $7, extra = $8 ' +
      'WHERE id = $9',
      [id_empleado, fecha, id_comida, observacion, fec_solicita, hora_inicio, hora_fin, extra, id]);
    res.jsonp({ message: 'Planificación del almuerzo ha sido guardado con éxito' });
  }

  /** TABLA TIPO COMIDAS */
  public async ListarTipoComidas(req: Request, res: Response) {
    const PLAN_COMIDAS = await pool.query('SELECT * FROM tipo_comida');
    if (PLAN_COMIDAS.rowCount > 0) {
      return res.jsonp(PLAN_COMIDAS.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }

  public async CrearTipoComidas(req: Request, res: Response): Promise<void> {
    const { nombre } = req.body;
    await pool.query('INSERT INTO tipo_comida (nombre) VALUES ($1)',
      [nombre]);
    res.jsonp({ message: 'Tipo comida ha sido guardado con éxito' });
  }

  public async VerUltimoTipoComidas(req: Request, res: Response) {
    const PLAN_COMIDAS = await pool.query('SELECT MAX(id) FROM tipo_comida');
    if (PLAN_COMIDAS.rowCount > 0) {
      return res.jsonp(PLAN_COMIDAS.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }

  // Alertas notificación y envio a correo electrónico
  public async EnviarCorreoPlanComida(req: Request, res: Response): Promise<void> {
    Credenciales(req.id_empresa)
    let { id_empl_envia, id_empl_recive, mensaje } = req.body;

    var f = new Date();
    f.setUTCHours(f.getHours())

    let create_at = f.toJSON();
    let tipo = 1; // es el tipo de aviso 
    // console.log(id_empl_envia, id_empl_recive, create_at, mensaje, tipo);
    await pool.query('INSERT INTO realtime_timbres(create_at, id_send_empl, id_receives_empl, descripcion, tipo) VALUES($1, $2, $3, $4, $5)', [create_at, id_empl_envia, id_empl_recive, mensaje, tipo]);

    const Envia = await pool.query('SELECT nombre, apellido, correo FROM empleados WHERE id = $1', [id_empl_envia]).then(resultado => { return resultado.rows[0] });
    const Recibe = await pool.query('SELECT nombre, apellido, correo FROM empleados WHERE id = $1', [id_empl_recive]).then(resultado => { return resultado.rows[0] });
    console.log(Envia.correo, 'djjj', Recibe.correo)
    let data = {
      // from: Envia.correo,
      from: email,
      to: Recibe.correo,
      subject: 'Servicio de Alimentación',
      html: `<p><h4><b>${Envia.nombre} ${Envia.apellido}</b> </h4> escribe: <b>${mensaje}</b> 
            <h4>A usted: <b>${Recibe.nombre} ${Recibe.apellido} </b></h4>
            `
    };
    enviarMail(data);

    res.jsonp({ message: 'Se envio notificacion y correo electrónico.' })
  }

}

export const PLAN_COMIDAS_CONTROLADOR = new PlanComidasControlador();

export default PLAN_COMIDAS_CONTROLADOR;