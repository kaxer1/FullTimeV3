import pool from '../database'

const MINUTO_TIMER = 59;

export const NotificacionTimbreAutomatica =  function() {

    setInterval(async() => {
        
        var f = new Date();
        console.log(f.getMinutes());
        if (f.getMinutes() === MINUTO_TIMER) {
            console.log('FECHA:', f.toLocaleDateString(), 'HORA:', f.toLocaleTimeString());
            
            var d = f.toLocaleDateString().split('-')[2];
            var m = f.toLocaleDateString().split('-')[1];
            var a = f.toLocaleDateString().split('-')[0];
            f.setUTCDate(parseInt(d));
            // f.setUTCDate(15);
            f.setUTCMonth(parseInt(m) - 1);
            f.setUTCFullYear(parseInt(a));
            console.log(f.toJSON());
            
            let hora: number = parseInt(f.toLocaleTimeString().split(':')[0]);
            // let hora: number = 9; // =====> solo para probar
            f.setUTCHours(hora);
            console.log(f.toJSON());
            
            let fecha: string = f.toJSON().split('T')[0];
            var h = f.toJSON().split('T')[1];
            let retorno = await CalcularHoras(fecha, h.split(':')[0]);
            console.log(retorno);
        }
        
    }, 60000);

}

async function CalcularHoras(fecha: string, hora: string) {
    let datoConsulta = fecha + ' ' + hora;
    console.log('FECHA ====>', datoConsulta);
    let timbres = await pool.query('SELECT fec_hora_timbre, accion, id_empleado, id FROM timbres WHERE CAST(fec_hora_timbre AS VARCHAR) LIKE $1 || \'%\'', [datoConsulta])
        .then(result => {
            let res = result.rows.map(obj => {
                var f = new Date();
                obj.fec_hora_timbre.setUTCHours(f.getHours());
                // obj.fec_hora_timbre.setUTCHours(9); // =====> solo para probar
                obj.fec_hora_timbre.setUTCDate(f.getDate());
                // obj.fec_hora_timbre.setUTCDate(15);
                obj.fec_hora_timbre.setUTCMonth(f.getMonth());
                obj.fec_hora_timbre.setUTCFullYear(f.getFullYear());
                return obj
            })
            
            return res
        });

    if (timbres.length > 0) {
        timbres.forEach( async (obj) => {
            console.log(obj);
            var time = obj.fec_hora_timbre.toJSON().split('T')[1];
            let h = Transformar(time.split('.')[0])
            // console.log(time);
            // console.log(h);
            let tiempo_horario;
            let estado;
            switch ( obj.accion) {
                case 'E':
                    tiempo_horario = await HorarioEmpleado(obj.id_empleado, 1);
                    estado = Atrasos(tiempo_horario.tiempo, h)
                break;
                case 'S/A':
                    tiempo_horario = await HorarioEmpleado(obj.id_empleado, 2);
                    estado = SalidasAntes(tiempo_horario.tiempo, h)
                break;
                case 'E/A':
                    tiempo_horario = await HorarioEmpleado(obj.id_empleado, 3);
                    estado = Atrasos(tiempo_horario.tiempo, h)
                break;
                case 'S':
                    tiempo_horario = await HorarioEmpleado(obj.id_empleado, 4);
                    estado = SalidasAntes(tiempo_horario.tiempo, h)
                break;
                default:
                    let text = "El timbre es permiso";
            }
            console.log('Tiempo Horario =======>>>>>>>>>>>>>>',tiempo_horario);
            console.log('Estado =======>>>>>>>>>>>>>>',estado);

            if (estado?.bool === true) { //es atraso
                var mensaje = estado?.message;
                tiempo_horario?.arrayJefes.forEach( async (element) => {
                    await pool.query('INSERT INTO realtime_timbres(create_at, id_send_empl, id_receives_empl, descripcion, id_timbre) VALUES($1,$2,$3,$4,$5)', [obj.fec_hora_timbre, obj.id_empleado, element.empleado, mensaje, obj.id]);
                })
            }
        });
        return 0
    }
    return 0
}

async function HorarioEmpleado(id_empleado: number, orden: number) {
    let IdUltimoContrato = await pool.query('SELECT id FROM empl_contratos WHERE id_empleado = $1 ORDER BY fec_ingreso DESC LIMIT 1', [id_empleado])
    .then(result => {
        return result.rows[0].id
    });
    // console.log('id contrato ===>',IdUltimoContrato);
    
    let UltimoCargo = await pool.query('SELECT id, id_departamento, id_sucursal FROM empl_cargos WHERE id_empl_contrato = $1 ORDER BY fec_inicio DESC LIMIT 1', [IdUltimoContrato])
    .then(result => { return result.rows[0] });
    console.log('id cargo ===>',UltimoCargo);
    
    let IdCgHorario = await pool.query('SELECT id_horarios FROM empl_horarios WHERE id_empl_cargo = $1 ORDER BY fec_inicio DESC LIMIT 1', [UltimoCargo.id])
    .then(result => { return result.rows[0].id_horarios })
    // console.log('id Catalogo Horario ===>',IdCgHorario);
    
    let hora_detalle = await pool.query('SELECT hora, minu_espera FROM deta_horarios WHERE id_horario = $1 AND orden = $2', [IdCgHorario, orden])
    .then(result => {
        return result.rows.map(obj => {
            return HoraTotal(obj.hora, obj.minu_espera)
        })
    })
    // console.log('Hora detalle ===>',hora_detalle);

    const JefesDepartamentos = await pool.query('SELECT da.estado, cg.id AS id_dep, cg.depa_padre, cg.nivel, s.id AS id_suc, e.id AS empleado FROM depa_autorizaciones AS da, empl_cargos AS ecr, cg_departamentos AS cg, sucursales AS s, empl_contratos AS ecn, empleados AS e WHERE da.estado = true AND da.id_departamento = $1 AND da.id_empl_cargo = ecr.id AND da.id_departamento = cg.id AND cg.id_sucursal = s.id AND ecr.id_empl_contrato = ecn.id AND ecn.id_empleado = e.id ', [UltimoCargo.id_departamento])
    .then(result => { return result.rows });

    let depa_padre = JefesDepartamentos[0].depa_padre;
    let JefeDepaPadre;        
    
    if (depa_padre !== null) {
        console.log('ID PADRE >>>>>>>>>>>>>>>>>>>',depa_padre);
        do {
            JefeDepaPadre =  await pool.query('SELECT da.estado, cg.id AS id_dep, cg.depa_padre, cg.nivel, s.id AS id_suc, e.id AS empleado FROM depa_autorizaciones AS da, empl_cargos AS ecr, cg_departamentos AS cg, sucursales AS s, empl_contratos AS ecn, empleados AS e WHERE da.estado = true AND da.id_departamento = $1 AND da.id_empl_cargo = ecr.id AND da.id_departamento = cg.id AND cg.id_sucursal = s.id AND ecr.id_empl_contrato = ecn.id AND ecn.id_empleado = e.id', [depa_padre])
            .then(result => { return result.rows });

            if (JefeDepaPadre.length > 0) {
              depa_padre = JefeDepaPadre[0].depa_padre;
              JefesDepartamentos.push(JefeDepaPadre[0]);
            } else {
              depa_padre = null
            }
        } while (depa_padre !== null || JefeDepaPadre.length !== 0);        
    } 
    
    return {
        tiempo: hora_detalle[0],
        arrayJefes: JefesDepartamentos
    };
}

function HoraTotal(hora: string, minu_espera: string) {
    let total = Transformar(hora) + Transformar(minu_espera); 
    return total
}

function Transformar(tiempo: string) {
    let h = parseInt(tiempo.split(':')[0]);
    let m = parseInt(tiempo.split(':')[1]);
    return h + (m/60)
}

function Atrasos(hora: number, hora_timbre: number) {
    console.log('**************************', hora, '===', hora_timbre);
    if ( hora_timbre > hora) {
        return { bool: true, message: 'Llego atrasado'}
    }
    return { bool: false, message: 'Llego a tiempo'}
}

function SalidasAntes(hora: number, hora_timbre: number) {
    console.log('**************************', hora, '===', hora_timbre);
    if ( hora_timbre < hora) {
        return { bool: true, message: 'Salio antes'}
    } 
    return { bool: false, message: 'Salio despues'}
}