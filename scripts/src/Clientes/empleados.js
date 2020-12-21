const db = require('../database_cliente')
const bdd = require('../database_Fulltime');
const md5 = require('md5');

class Empleados {
    constructor() {}

    async ObtenerEmpleados() {
        return await db.cliente.query('SELECT e.cedula, e.nombre, e.apellido, e.estado_civil, e.sexo, e.correo, e.fecha_nacimiento, e.estado, e.correo_alternativo, e.codigo_empleado, u.usuario FROM empleado AS e, usuarios AS u WHERE e.id = u.id LIMIT 2')
            .then(result => { return result.rows})
    }

    async SetEmpleados(lista_empleados) {
        console.log(lista_empleados);
        lista_empleados.forEach(async(obj) => {
           

            await bdd.fulltime.query('INSERT INTO empleados(cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, id_nacionalidad, codigo) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', [obj.cedula, obj.apellido, obj.nombre, obj.estado_civil, obj.sexo, obj.correo, obj.fecha_nacimiento, obj.estado, obj.correo_alternativo, 94, obj.codigo_empleado])
            .then(result => {
                console.log(result.command);
            });

            await bdd.fulltime.query('SELECT id FROM empleados WHERE cedula = $1',[obj.cedula])
            .then(result => {
                result.rows.map(async(ele) => {
                    let clave = md5(obj.cedula);
                    console.log(clave);
                    await bdd.fulltime.query('INSERT INTO usuarios(usuario, contrasena, estado, id_rol, id_empleado, app_habilita) VALUES($1, $2, $3, $4, $5, $6)',[obj.usuario, clave, true, 2, ele.id, true])
                })
            })

        });
    }

}

module.exports = Empleados; 