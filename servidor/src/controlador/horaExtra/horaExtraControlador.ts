import { Request, Response } from 'express';
import pool from '../../database';
import { VerificarHorario } from '../../libs/MetodosHorario';
import { enviarMail, email } from '../../libs/settingsMail'
const nodemailer = require("nodemailer");

class HorasExtrasPedidasControlador {
  public async ListarHorasExtrasPedidas(req: Request, res: Response) {
    const HORAS_EXTRAS_PEDIDAS = await pool.query('SELECT h.id, h.fec_inicio, h.fec_final, h.estado, ' +
      'h.fec_solicita, h.descripcion, h.num_hora, e.id AS id_usua_solicita, h.id_empl_cargo, ' +
      'e.nombre, e.apellido, contrato.id AS id_contrato FROM hora_extr_pedidos AS h, empleados AS e, ' +
      'empl_contratos As contrato, empl_cargos AS cargo WHERE h.id_usua_solicita = e.id AND ' +
      '(h.estado = 1 OR h.estado = 2) AND ' +
      'contrato.id = cargo.id_empl_contrato AND cargo.id = h.id_empl_cargo');
    if (HORAS_EXTRAS_PEDIDAS.rowCount > 0) {
      return res.jsonp(HORAS_EXTRAS_PEDIDAS.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }

  public async ObtenerUnaHoraExtraPedida(req: Request, res: Response): Promise<any> {
    const { id } = req.params;
    const HORAS_EXTRAS_PEDIDAS = await pool.query('SELECT h.id_empl_cargo, h.id_usua_solicita, h.fec_inicio, h.fec_final, h.fec_solicita, h.descripcion, h.estado, h.tipo_funcion, h.num_hora, h.id, h.tiempo_autorizado, c.cargo, c.id_empl_contrato AS id_contrato, c.id_departamento, e.nombre, e.apellido FROM hora_extr_pedidos AS h, empl_cargos AS c, empleados AS e WHERE h.id = $1 AND h.id_empl_cargo = c.id AND e.id = h.id_usua_solicita', [id]);
    if (HORAS_EXTRAS_PEDIDAS.rowCount > 0) {
      return res.jsonp(HORAS_EXTRAS_PEDIDAS.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }

  public async ObtenerlistaHora(req: Request, res: Response): Promise<any> {
    const { id_user } = req.params;
    const HORAS_EXTRAS_PEDIDAS = await pool.query('SELECT * FROM hora_extr_pedidos WHERE id_usua_solicita = $1', [id_user]);
    if (HORAS_EXTRAS_PEDIDAS.rowCount > 0) {
      return res.jsonp(HORAS_EXTRAS_PEDIDAS.rows)
    }
    else {
      return res.status(404).jsonp({ text: 'No se encuentran registros' });
    }
  }

  public async CrearHoraExtraPedida(req: Request, res: Response): Promise<any> {
    const { id_empl_cargo, id_usua_solicita, fec_inicio, fec_final, fec_solicita, num_hora, descripcion, estado, tipo_funcion, depa_user_loggin } = req.body;
    await pool.query('INSERT INTO hora_extr_pedidos ( id_empl_cargo, id_usua_solicita, fec_inicio, fec_final, fec_solicita, num_hora, descripcion, estado, tipo_funcion ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [id_empl_cargo, id_usua_solicita, fec_inicio, fec_final, fec_solicita, num_hora, descripcion, estado, tipo_funcion]);
    
    const JefesDepartamentos = await pool.query('SELECT da.id, da.estado, cg.id AS id_dep, cg.depa_padre, cg.nivel, s.id AS id_suc, cg.nombre AS departamento, '+
    's.nombre AS sucursal, ecr.id AS cargo, ecn.id AS contrato, e.id AS empleado, e.nombre, e.apellido, e.cedula, e.correo, c.hora_extra_mail, c.hora_extra_noti '+
    'FROM depa_autorizaciones AS da, empl_cargos AS ecr, cg_departamentos AS cg, sucursales AS s, empl_contratos AS ecn, empleados AS e, config_noti AS c '+
    'WHERE da.id_departamento = $1 AND da.estado = true AND da.id_empl_cargo = ecr.id AND da.id_departamento = cg.id AND cg.id_sucursal = s.id AND ecr.id_empl_contrato = ecn.id AND ecn.id_empleado = e.id AND e.id = c.id_empleado', [depa_user_loggin])
    .then(result => {
      return result.rows
    })
    
    if (JefesDepartamentos.length === 0) return res.jsonp({message:'Departamento sin nadie a cargo'});
    
    let depa_padre = JefesDepartamentos[0].depa_padre;
    let JefeDepaPadre;        

    if (depa_padre !== null) {
      do {
        JefeDepaPadre =  await pool.query('SELECT da.id, da.estado, cg.id AS id_dep, cg.depa_padre, cg.nivel, s.id AS id_suc, cg.nombre AS departamento, s.nombre AS sucursal, ecr.id AS cargo, ecn.id AS contrato, e.id AS empleado, e.nombre, e.apellido, e.cedula, e.correo, c.hora_extra_mail, c.hora_extra_noti FROM depa_autorizaciones AS da, empl_cargos AS ecr, cg_departamentos AS cg, sucursales AS s, empl_contratos AS ecn, empleados AS e, config_noti AS c WHERE da.id_departamento = $1 AND da.id_empl_cargo = ecr.id AND da.id_departamento = cg.id AND cg.id_sucursal = s.id AND ecr.id_empl_contrato = ecn.id AND ecn.id_empleado = e.id AND e.id = c.id_empleado', [depa_padre])
        .then(result => {
          return result.rows
        });
        if (JefeDepaPadre.length === 0) {
          depa_padre = null;
        } else {
          depa_padre = JefeDepaPadre[0].depa_padre;
          JefesDepartamentos.push(JefeDepaPadre[0]);
        }
      } while (depa_padre !== null);
      
      return res.jsonp(JefesDepartamentos);
    } else {
      return res.jsonp(JefesDepartamentos);
    }
  }

  public async SendMailNotifiHoraExtra(req: Request, res: Response): Promise<void> {
    const {id_empl_cargo, id_usua_solicita, fec_inicio, fec_final, fec_solicita, id, estado, id_dep, depa_padre, nivel, id_suc, departamento, sucursal, cargo, contrato, empleado, nombre, apellido, cedula, correo, hora_extra_mail, hora_extra_noti } = req.body;
    const ultimo = await pool.query('SELECT id, estado FROM hora_extr_pedidos WHERE id_empl_cargo = $1 AND id_usua_solicita = $2 AND fec_inicio = $3 AND fec_final = $4 AND fec_solicita = $5', [id_empl_cargo, id_usua_solicita, fec_inicio, fec_final, fec_solicita]);
    const correoInfoPideHoraExtra = await pool.query('SELECT e.id, e.correo, e.nombre, e.apellido, e.cedula, ecr.id_departamento, ecr.id_sucursal, ecr.id AS cargo FROM empl_contratos AS ecn, empleados AS e, empl_cargos AS ecr WHERE ecr.id = $1 AND ecn.id_empleado = e.id AND ecn.id = ecr.id_empl_contrato ORDER BY cargo DESC LIMIT 1', [id_empl_cargo]);
        console.log(ultimo.rows);
        console.log(correoInfoPideHoraExtra.rows);
        
    const estadoAutorizacion = [
      { id: 1, nombre: 'Pendiente' },
      { id: 2, nombre: 'Pre-Autorizado' },
      { id: 3, nombre: 'Aceptado' },
      { id: 4, nombre: 'Rechazado' }
    ];

    let nombreEstado = '';
    estadoAutorizacion.forEach(obj => {
      if (obj.id === ultimo.rows[0].estado) {
        nombreEstado = obj.nombre
      }
    })
    console.log('estado', estado)
    // codigo para enviar notificacion o correo al jefe de su propio departamento, independientemente del nivel.
    // obj.id_dep === correoInfoPideHoraExtra.rows[0].id_departamento && obj.id_suc === correoInfoPideHoraExtra.rows[0].id_sucursal
    if (estado === true) {
      var url = `${process.env.URL_DOMAIN}/ver-hora-extra`;
      let id_departamento_autoriza = id_dep;
      let id_empleado_autoriza = empleado;
      let data = {
        to: correo,
        from: email,
        subject: 'Solicitud de Hora Extra',
        html: `<p><b>${correoInfoPideHoraExtra.rows[0].nombre} ${correoInfoPideHoraExtra.rows[0].apellido}</b> con número de
        cédula ${correoInfoPideHoraExtra.rows[0].cedula} solicita autorización de hora extra: </p>
        <a href="${url}/${ultimo.rows[0].id}">Ir a verificar hora extra</a>`
      };
      if (hora_extra_mail === true && hora_extra_noti === true) {
        enviarMail(data);
        res.jsonp({ message: 'Permiso se registró con éxito', notificacion: true, id: ultimo.rows[0].id, id_departamento_autoriza, id_empleado_autoriza, estado: nombreEstado });
      } else if (hora_extra_mail === true && hora_extra_noti === false) {
        enviarMail(data);
        res.jsonp({ message: 'Permiso se registró con éxito', notificacion: false, id: ultimo.rows[0].id, id_departamento_autoriza, id_empleado_autoriza, estado: nombreEstado });
      } else if (hora_extra_mail === false && hora_extra_noti === true) {
        res.jsonp({ message: 'Permiso se registró con éxito', notificacion: true, id: ultimo.rows[0].id, id_departamento_autoriza, id_empleado_autoriza, estado: nombreEstado });
      } else if (hora_extra_mail === false && hora_extra_noti === false) {
        res.jsonp({ message: 'Permiso se registró con éxito', notificacion: false, id: ultimo.rows[0].id, id_departamento_autoriza, id_empleado_autoriza, estado: nombreEstado });
      }
    }
  }

  public async ObtenerSolicitudHoraExtra(req: Request, res: Response) {
    const id = req.params.id_emple_hora;
    const SOLICITUD = await pool.query('SELECT *FROM VistaSolicitudHoraExtra WHERE id_emple_hora = $1', [id]);
    if (SOLICITUD.rowCount > 0) {
      return res.json(SOLICITUD.rows)
    }
    else {
      return res.status(404).json({ text: 'No se encuentran registros' });
    }
  }

  public async ActualizarEstado(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const { estado, id_hora_extra, id_departamento } = req.body;
    console.log(estado, id_hora_extra, id_departamento);

    await pool.query('UPDATE hora_extr_pedidos SET estado = $1 WHERE id = $2', [estado, id]);

    const JefeDepartamento = await pool.query('SELECT da.id, cg.id AS id_dep, s.id AS id_suc, ' +
      'cg.nombre AS departamento, s.nombre AS sucursal, ecr.id AS cargo, ecn.id AS contrato, e.id AS empleado, ' +
      'e.nombre, e.cedula, e.correo, c.hora_extra_mail, c.hora_extra_noti FROM depa_autorizaciones AS da, ' +
      'empl_cargos AS ecr, cg_departamentos AS cg, sucursales AS s, empl_contratos AS ecn, empleados AS e, ' +
      'config_noti AS c WHERE da.id_departamento = $1 AND da.id_empl_cargo = ecr.id AND ' +
      'da.id_departamento = cg.id AND cg.id_sucursal = s.id AND ecr.id_empl_contrato = ecn.id ' +
      'AND ecn.id_empleado = e.id AND e.id = c.id_empleado AND da.estado = true', [id_departamento]);
    const InfoHoraExtraReenviarEstadoEmpleado = await pool.query('SELECT h.descripcion, h.fec_inicio, h.fec_final, h.fec_solicita, h.estado, h.num_hora, h.id, e.id AS empleado, e.correo, e.nombre, e.apellido, e.cedula, ecr.id_departamento, ecr.id_sucursal, ecr.id AS cargo FROM empleados AS e, empl_cargos AS ecr, hora_extr_pedidos AS h WHERE h.id = $1 AND h.id_empl_cargo = ecr.id AND e.id = h.id_usua_solicita ORDER BY cargo DESC LIMIT 1', [id_hora_extra]);

    console.log(InfoHoraExtraReenviarEstadoEmpleado.rows)

    let estadoHoraExtra = [
      { valor: 1, nombre: 'Pendiente' },
      { valor: 2, nombre: 'Pre-Autorizado' },
      { valor: 3, nombre: 'Aceptado' },
      { valor: 4, nombre: 'Rechazado' }
    ]

    let nombreEstado = '';
    estadoHoraExtra.forEach(obj => {
      if (obj.valor === estado) {
        nombreEstado = obj.nombre
      }
      if (obj.valor === 3) { //cuando este en estado tres se registra la hora_extr_calculos.
        
      }
    });

    JefeDepartamento.rows.forEach(obj => {
      var url = `${process.env.URL_DOMAIN}/horaExtraEmpleado`;
      InfoHoraExtraReenviarEstadoEmpleado.rows.forEach(ele => {
        let notifi_realtime = {
          id_send_empl: obj.empleado,
          id_receives_depa: obj.id_dep,
          estado: nombreEstado,
          id_permiso: null,
          id_vacaciones: null,
          id_hora_extra: id_hora_extra
        }

        let data = {
          from: obj.correo,
          to: ele.correo,
          subject: 'Estado de solicitud de Hora Extra',
          html: `<p><b>${obj.nombre} ${obj.apellido}</b> jefe/a del departamento de <b>${obj.departamento}</b> con número de
                cédula ${obj.cedula} a cambiado el estado de su permiso a: <b>${nombreEstado}</b></p>
                <h4><b>Informacion del permiso</b></h4>
                <ul>
                    <li><b>Descripción</b>: ${ele.descripcion} </li>
                    <li><b>Empleado</b>: ${ele.nombre} ${ele.apellido} </li>
                    <li><b>Cédula</b>: ${ele.cedula} </li>
                    <li><b>Sucursal</b>: ${obj.sucursal} </li>
                    <li><b>Departamento</b>: ${obj.departamento} </li>
                    </ul>
                <a href="${url}">Ir a verificar estado hora extra</a>`
        };
        console.log(data);
        if (obj.hora_extra_mail === true && obj.hora_extra_noti === true) {
          enviarMail(data);
          res.json({ message: 'Estado de hora extra actualizado exitosamente', notificacion: true, realtime: [notifi_realtime] });
        } else if (obj.hora_extra_maill === true && obj.hora_extra_noti === false) {
          enviarMail(data);
          res.json({ message: 'Estado de hora extra actualizado exitosamente', notificacion: false, realtime: [notifi_realtime] });
        } else if (obj.hora_extra_mail === false && obj.hora_extra_noti === true) {
          res.json({ message: 'Estado de hora extra actualizado exitosamente', notificacion: true, realtime: [notifi_realtime] });

        } else if (obj.hora_extra_mail === false && obj.hora_extra_noti === false) {
          res.json({ message: 'Estado de hora extra actualizado exitosamente', notificacion: false, realtime: [notifi_realtime] });

        }
      });
    });
  }

  public async ObtenerAutorizacionHoraExtra(req: Request, res: Response) {
    const id = req.params.id_hora;
    const SOLICITUD = await pool.query('SELECT a.id AS id_autorizacion, a.id_documento AS empleado_estado, ' +
      'hp.id AS hora_extra FROM autorizaciones AS a, hora_extr_pedidos AS hp ' +
      'WHERE hp.id = a.id_hora_extra AND hp.id = $1', [id]);
    if (SOLICITUD.rowCount > 0) {
      return res.json(SOLICITUD.rows)
    }
    else {
      return res.status(404).json({ text: 'No se encuentran registros' });
    }
  }

  public async EliminarHoraExtra(req: Request, res: Response) {
    const { id_hora_extra } = req.params;
    await pool.query('DELETE FROM realtime_noti WHERE id_hora_extra = $1', [id_hora_extra])
    await pool.query('DELETE FROM hora_extr_pedidos WHERE id = $1', [id_hora_extra]);
    res.jsonp({ message: 'Registro eliminado' });
  }

  public async EditarHoraExtra(req: Request, res: Response): Promise<void> {
    const id = req.params.id
    const { fec_inicio, fec_final, num_hora, descripcion, estado, tipo_funcion } = req.body;
    console.log(fec_inicio, fec_final, num_hora, descripcion, estado, tipo_funcion);
    await pool.query('UPDATE hora_extr_pedidos SET fec_inicio = $1, fec_final = $2, num_hora = $3, descripcion = $4, estado = $5, tipo_funcion = $6 WHERE id = $7', [fec_inicio, fec_final, num_hora, descripcion, estado, tipo_funcion, id]);
    res.jsonp({ message: 'Hora Extra editado' });
  }

  public async ObtenerHorarioEmpleado(req: Request, res: Response) {
    const id_empl_cargo = parseInt(req.params.id_cargo);
    console.log('IDS: ', id_empl_cargo);
    // let respuesta = await ValidarHorarioEmpleado(id_empleado, id_empl_cargo)
    let respuesta = await VerificarHorario(id_empl_cargo)
    console.log(respuesta);

    res.jsonp(respuesta)
  }

  public async TiempoAutorizado(req: Request, res: Response) {
    const id_hora = parseInt(req.params.id_hora);
    const { hora } = req.body;
    console.log(id_hora);
    console.log(hora);
    let respuesta = await pool.query('UPDATE hora_extr_pedidos SET tiempo_autorizado = $2 WHERE id = $1', [id_hora, hora]).then(result => {
      return { message: 'Tiempo de hora autorizada confirmada' }
    });
    res.jsonp(respuesta)
  }


}

export const horaExtraPedidasControlador = new HorasExtrasPedidasControlador();

export default horaExtraPedidasControlador;