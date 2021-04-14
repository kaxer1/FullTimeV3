"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMPLEADO_CONTROLADOR = void 0;
const database_1 = __importDefault(require("../../../database"));
const xlsx_1 = __importDefault(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
const ts_md5_1 = require("ts-md5");
const MetodosHorario_1 = require("../../../libs/MetodosHorario");
const builder = require('xmlbuilder');
class EmpleadoControlador {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empleado = yield database_1.default.query('SELECT * FROM empleados WHERE estado = 1 ORDER BY id');
            res.jsonp(empleado.rows);
        });
    }
    // BÚSQUEDA DE DATOS DE EMPLEADO INGRESANDO EL NOMBRE
    BuscarEmpleadoNombre(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { informacion } = req.body;
            const EMPLEADO = yield database_1.default.query('SELECT * FROM empleados WHERE ' +
                '(UPPER (apellido) || \' \' || UPPER (nombre)) = $1', [informacion]);
            if (EMPLEADO.rowCount > 0) {
                return res.jsonp(EMPLEADO.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'El empleado no ha sido encontrado' });
            }
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const EMPLEADO = yield database_1.default.query('SELECT * FROM empleados WHERE id = $1', [id]);
            if (EMPLEADO.rowCount > 0) {
                return res.jsonp(EMPLEADO.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'El empleado no ha sido encontrado' });
            }
        });
    }
    getImagen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const imagen = req.params.imagen;
            let filePath = `servidor\\imagenesEmpleados\\${imagen}`;
            res.sendFile(__dirname.split("servidor")[0] + filePath);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad, codigo } = req.body;
                yield database_1.default.query('INSERT INTO empleados ( cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad, codigo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad, codigo]);
                const oneEmpley = yield database_1.default.query('SELECT id FROM empleados WHERE cedula = $1', [cedula]);
                const idEmployGuardado = oneEmpley.rows[0].id;
                res.jsonp({ message: 'Empleado guardado', id: idEmployGuardado });
            }
            catch (error) {
                return res.jsonp({ message: 'error' });
            }
        });
    }
    editar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad, codigo } = req.body;
                yield database_1.default.query('UPDATE empleados SET cedula = $2, apellido = $3, nombre = $4, esta_civil = $5, genero = $6, correo = $7, fec_nacimiento = $8, estado = $9, mail_alternativo = $10, domicilio = $11, telefono = $12, id_nacionalidad = $13, codigo = $14 WHERE id = $1 ', [id, cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad, codigo]);
                res.jsonp({ message: 'Empleado Actualizado' });
            }
            catch (error) {
                return res.jsonp({ message: 'error' });
            }
        });
    }
    crearImagenEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let imagen = list.image[0].path.split("\\")[1];
            let id = req.params.id_empleado;
            const unEmpleado = yield database_1.default.query('SELECT * FROM empleados WHERE id = $1', [id]);
            if (unEmpleado.rowCount > 0) {
                unEmpleado.rows.map((obj) => __awaiter(this, void 0, void 0, function* () {
                    if (obj.imagen != null) {
                        try {
                            console.log(obj.imagen);
                            let filePath = `servidor\\imagenesEmpleados\\${obj.imagen}`;
                            let direccionCompleta = __dirname.split("servidor")[0] + filePath;
                            fs_1.default.unlinkSync(direccionCompleta);
                            yield database_1.default.query('Update empleados Set imagen = $2 Where id = $1 ', [id, imagen]);
                            res.jsonp({ message: 'Imagen Actualizada' });
                        }
                        catch (error) {
                            yield database_1.default.query('Update empleados Set imagen = $2 Where id = $1 ', [id, imagen]);
                            res.jsonp({ message: 'Imagen Actualizada' });
                        }
                    }
                    else {
                        yield database_1.default.query('Update empleados Set imagen = $2 Where id = $1 ', [id, imagen]);
                        res.jsonp({ message: 'Imagen Actualizada' });
                    }
                }));
            }
        });
    }
    VerificarPlantilla_Automatica(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames;
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            var contarCodigo = 0;
            var contarCedula = 0;
            var contarUsuario = 0;
            var contarRol = 0;
            var contarLlenos = 0;
            var contador = 1;
            const VALOR = yield database_1.default.query('SELECT * FROM codigo');
            var codigo = parseInt(VALOR.rows[0].valor);
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                // Datos que se leen de la plantilla ingresada
                const { cedula, estado_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, nacionalidad, usuario, estado_user, rol, app_habilita } = data;
                //Verificar que la cédula no se encuentre registrada
                const VERIFICAR_CEDULA = yield database_1.default.query('SELECT * FROM empleados WHERE cedula = $1', [cedula]);
                if (VERIFICAR_CEDULA.rowCount === 0) {
                    contarCedula = contarCedula + 1;
                }
                //Verificar que el usuario no se encuentre registrado
                const VERIFICAR_USUARIO = yield database_1.default.query('SELECT * FROM usuarios WHERE usuario = $1', [usuario]);
                if (VERIFICAR_USUARIO.rowCount === 0) {
                    contarUsuario = contarUsuario + 1;
                }
                //Verificar que el rol exista dentro del sistema
                const VERIFICAR_ROL = yield database_1.default.query('SELECT * FROM cg_roles WHERE UPPER(nombre) = $1', [rol.toUpperCase()]);
                if (VERIFICAR_ROL.rowCount > 0) {
                    contarRol = contarRol + 1;
                }
                // Verificar que el código no se duplique en los registros
                codigo = codigo + 1;
                console.log('codigo_ver', codigo);
                const VERIFICAR_CODIGO = yield database_1.default.query('SELECT * FROM empleados WHERE codigo::int = $1', [codigo]);
                if (VERIFICAR_CODIGO.rowCount === 0) {
                    contarCodigo = contarCodigo + 1;
                }
                //Verificar que los datos no esten vacios a excepción del dato mail_alternativo
                if (cedula != undefined && estado_civil != undefined && genero != undefined && correo != undefined &&
                    fec_nacimiento != undefined && estado != undefined && domicilio != undefined && telefono != undefined &&
                    nacionalidad != undefined && usuario != undefined && estado_user != undefined && rol != undefined &&
                    app_habilita != undefined && data.nombre != undefined && data.apellido != undefined) {
                    contarLlenos = contarLlenos + 1;
                }
                // Cuando todos los datos han sido leidos verificamos si todos los datos son correctos
                console.log('codigo', contarCodigo, plantilla.length, contador);
                console.log('cedula', contarCedula, plantilla.length, contador);
                console.log('usuario', contarUsuario, plantilla.length, contador);
                console.log('rol', contarRol, plantilla.length, contador);
                console.log('llenos', contarLlenos, plantilla.length, contador);
                if (contador === plantilla.length) {
                    if (contarCodigo === plantilla.length && contarCedula === plantilla.length &&
                        contarUsuario === plantilla.length && contarLlenos === plantilla.length &&
                        contarRol === plantilla.length) {
                        return res.jsonp({ message: 'correcto' });
                    }
                    else {
                        return res.jsonp({ message: 'error' });
                    }
                }
                contador = contador + 1;
            }));
            fs_1.default.unlinkSync(filePath);
        });
    }
    VerificarPlantilla_DatosAutomatico(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames;
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            var contarCedulaData = 0;
            var contarUsuarioData = 0;
            var contador_arreglo = 1;
            var arreglos_datos = [];
            //Leer la plantilla para llenar un array con los datos cedula y usuario para verificar que no sean duplicados
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                // Datos que se leen de la plantilla ingresada
                const { cedula, estado_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, nacionalidad, usuario, estado_user, rol, app_habilita } = data;
                let datos_array = {
                    cedula: cedula,
                    usuario: usuario,
                };
                arreglos_datos.push(datos_array);
            }));
            // Vamos a verificar dentro de arreglo_datos que no se encuentren datos duplicados
            for (var i = 0; i <= arreglos_datos.length - 1; i++) {
                for (var j = 0; j <= arreglos_datos.length - 1; j++) {
                    if (arreglos_datos[i].cedula === arreglos_datos[j].cedula) {
                        contarCedulaData = contarCedulaData + 1;
                    }
                    if (arreglos_datos[i].usuario === arreglos_datos[j].usuario) {
                        contarUsuarioData = contarUsuarioData + 1;
                    }
                }
                contador_arreglo = contador_arreglo + 1;
            }
            // Cuando todos los datos han sido leidos verificamos si todos los datos son correctos
            console.log('cedula_data', contarCedulaData, plantilla.length, contador_arreglo);
            console.log('usuario_data', contarUsuarioData, plantilla.length, contador_arreglo);
            if ((contador_arreglo - 1) === plantilla.length) {
                if (contarCedulaData === plantilla.length && contarUsuarioData === plantilla.length) {
                    return res.jsonp({ message: 'correcto' });
                }
                else {
                    return res.jsonp({ message: 'error' });
                }
            }
            fs_1.default.unlinkSync(filePath);
        });
    }
    CargarPlantilla_Automatico(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames;
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            const VALOR = yield database_1.default.query('SELECT * FROM codigo');
            var codigo = parseInt(VALOR.rows[0].valor);
            var contador = 1;
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                // Realiza un capital letter a los nombres y apellidos
                var nombreE;
                let nombres = data.nombre.split(' ');
                if (nombres.length > 1) {
                    let name1 = nombres[0].charAt(0).toUpperCase() + nombres[0].slice(1);
                    let name2 = nombres[1].charAt(0).toUpperCase() + nombres[1].slice(1);
                    nombreE = name1 + ' ' + name2;
                }
                else {
                    let name1 = nombres[0].charAt(0).toUpperCase() + nombres[0].slice(1);
                    nombreE = name1;
                }
                var apellidoE;
                let apellidos = data.apellido.split(' ');
                if (apellidos.length > 1) {
                    let lastname1 = apellidos[0].charAt(0).toUpperCase() + apellidos[0].slice(1);
                    let lastname2 = apellidos[1].charAt(0).toUpperCase() + apellidos[1].slice(1);
                    apellidoE = lastname1 + ' ' + lastname2;
                }
                else {
                    let lastname1 = apellidos[0].charAt(0).toUpperCase() + apellidos[0].slice(1);
                    apellidoE = lastname1;
                }
                // Encriptar contraseña
                const md5 = new ts_md5_1.Md5();
                const contrasena = md5.appendStr(data.contrasena).end();
                // Datos que se leen de la plantilla ingresada
                const { cedula, estado_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, nacionalidad, usuario, estado_user, rol, app_habilita } = data;
                //Obtener id del rol
                const id_rol = yield database_1.default.query('SELECT * FROM cg_roles WHERE UPPER(nombre) = $1', [rol.toUpperCase()]);
                // Incrementar el valor del código
                codigo = codigo + 1;
                // Registro de nuevo empleado
                yield database_1.default.query('INSERT INTO empleados ( cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad, codigo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [cedula, apellidoE, nombreE, estado_civil.split(' ')[0], genero.split(' ')[0], correo, fec_nacimiento, estado.split(' ')[0], mail_alternativo, domicilio, telefono, nacionalidad.split(' ')[0], codigo]);
                // Obtener el id del empleado ingresado
                const oneEmpley = yield database_1.default.query('SELECT id FROM empleados WHERE cedula = $1', [cedula]);
                const id_empleado = oneEmpley.rows[0].id;
                // Registro de los datos de usuario
                yield database_1.default.query('INSERT INTO usuarios ( usuario, contrasena, estado, id_rol, id_empleado, app_habilita ) VALUES ($1, $2, $3, $4, $5, $6)', [usuario, contrasena, estado_user, id_rol.rows[0]['id'], id_empleado, app_habilita]);
                if (contador === plantilla.length) {
                    console.log('codigo_ver', codigo, VALOR.rows[0].id);
                    // Actualización del código
                    yield database_1.default.query('UPDATE codigo SET valor = $1 WHERE id = $2', [codigo, VALOR.rows[0].id]);
                    return res.jsonp({ message: 'correcto' });
                }
                contador = contador + 1;
            }));
            fs_1.default.unlinkSync(filePath);
        });
    }
    /** MÉTODOS PARA VERIFICAR PLANTILLA CON CÓDIGO INGRESADO DE FORMA MANUAL */
    VerificarPlantilla_Manual(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames;
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            var contarCodigo = 0;
            var contarCedula = 0;
            var contarUsuario = 0;
            var contarRol = 0;
            var contarLlenos = 0;
            var contador = 1;
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                // Datos que se leen de la plantilla ingresada
                const { cedula, codigo, estado_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, nacionalidad, usuario, estado_user, rol, app_habilita } = data;
                //Verificar que la cédula no se encuentre registrada
                const VERIFICAR_CEDULA = yield database_1.default.query('SELECT * FROM empleados WHERE cedula = $1', [cedula]);
                if (VERIFICAR_CEDULA.rowCount === 0) {
                    contarCedula = contarCedula + 1;
                }
                // Verificar que el código no se duplique en los registros
                const VERIFICAR_CODIGO = yield database_1.default.query('SELECT * FROM empleados WHERE codigo::int = $1', [codigo]);
                if (VERIFICAR_CODIGO.rowCount === 0) {
                    contarCodigo = contarCodigo + 1;
                }
                //Verificar que el usuario no se encuentre registrado
                const VERIFICAR_USUARIO = yield database_1.default.query('SELECT * FROM usuarios WHERE usuario = $1', [usuario]);
                if (VERIFICAR_USUARIO.rowCount === 0) {
                    contarUsuario = contarUsuario + 1;
                }
                //Verificar que el rol exista dentro del sistema
                const VERIFICAR_ROL = yield database_1.default.query('SELECT * FROM cg_roles WHERE UPPER(nombre) = $1', [rol.toUpperCase()]);
                if (VERIFICAR_ROL.rowCount > 0) {
                    contarRol = contarRol + 1;
                }
                //Verificar que los datos no esten vacios a excepción del dato mail_alternativo
                if (cedula != undefined && estado_civil != undefined && genero != undefined && correo != undefined &&
                    fec_nacimiento != undefined && estado != undefined && domicilio != undefined && telefono != undefined &&
                    nacionalidad != undefined && usuario != undefined && estado_user != undefined && rol != undefined &&
                    app_habilita != undefined && data.nombre != undefined && data.apellido != undefined) {
                    contarLlenos = contarLlenos + 1;
                }
                // Cuando todos los datos han sido leidos verificamos si todos los datos son correctos
                console.log('codigo', contarCodigo, plantilla.length, contador);
                console.log('cedula', contarCedula, plantilla.length, contador);
                console.log('usuario', contarUsuario, plantilla.length, contador);
                console.log('rol', contarRol, plantilla.length, contador);
                console.log('llenos', contarLlenos, plantilla.length, contador);
                if (contador === plantilla.length) {
                    if (contarCodigo === plantilla.length && contarCedula === plantilla.length &&
                        contarUsuario === plantilla.length && contarLlenos === plantilla.length &&
                        contarRol === plantilla.length) {
                        return res.jsonp({ message: 'correcto' });
                    }
                    else {
                        return res.jsonp({ message: 'error' });
                    }
                }
                contador = contador + 1;
            }));
            fs_1.default.unlinkSync(filePath);
        });
    }
    VerificarPlantilla_DatosManual(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames;
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            var contarCedulaData = 0;
            var contarUsuarioData = 0;
            var contarCodigoData = 0;
            var contador_arreglo = 1;
            var arreglos_datos = [];
            //Leer la plantilla para llenar un array con los datos cedula y usuario para verificar que no sean duplicados
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                // Datos que se leen de la plantilla ingresada
                const { cedula, codigo, estado_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, nacionalidad, usuario, estado_user, rol, app_habilita } = data;
                let datos_array = {
                    cedula: cedula,
                    usuario: usuario,
                    codigo: codigo
                };
                arreglos_datos.push(datos_array);
            }));
            // Vamos a verificar dentro de arreglo_datos que no se encuentren datos duplicados
            for (var i = 0; i <= arreglos_datos.length - 1; i++) {
                for (var j = 0; j <= arreglos_datos.length - 1; j++) {
                    if (arreglos_datos[i].cedula === arreglos_datos[j].cedula) {
                        contarCedulaData = contarCedulaData + 1;
                    }
                    if (arreglos_datos[i].usuario === arreglos_datos[j].usuario) {
                        contarUsuarioData = contarUsuarioData + 1;
                    }
                    if (arreglos_datos[i].codigo === arreglos_datos[j].codigo) {
                        contarCodigoData = contarCodigoData + 1;
                    }
                }
                contador_arreglo = contador_arreglo + 1;
            }
            // Cuando todos los datos han sido leidos verificamos si todos los datos son correctos
            console.log('cedula_data', contarCedulaData, plantilla.length, contador_arreglo);
            console.log('usuario_data', contarUsuarioData, plantilla.length, contador_arreglo);
            console.log('codigo_data', contarCodigoData, plantilla.length, contador_arreglo);
            if ((contador_arreglo - 1) === plantilla.length) {
                if (contarCedulaData === plantilla.length && contarUsuarioData === plantilla.length && contarCodigoData === plantilla.length) {
                    return res.jsonp({ message: 'correcto' });
                }
                else {
                    return res.jsonp({ message: 'error' });
                }
            }
            fs_1.default.unlinkSync(filePath);
        });
    }
    CargarPlantilla_Manual(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = req.files;
            let cadena = list.uploads[0].path;
            let filename = cadena.split("\\")[1];
            var filePath = `./plantillas/${filename}`;
            const workbook = xlsx_1.default.readFile(filePath);
            const sheet_name_list = workbook.SheetNames;
            const plantilla = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            var contador = 1;
            plantilla.forEach((data) => __awaiter(this, void 0, void 0, function* () {
                // Realiza un capital letter a los nombres y apellidos
                var nombreE;
                let nombres = data.nombre.split(' ');
                if (nombres.length > 1) {
                    let name1 = nombres[0].charAt(0).toUpperCase() + nombres[0].slice(1);
                    let name2 = nombres[1].charAt(0).toUpperCase() + nombres[1].slice(1);
                    nombreE = name1 + ' ' + name2;
                }
                else {
                    let name1 = nombres[0].charAt(0).toUpperCase() + nombres[0].slice(1);
                    nombreE = name1;
                }
                var apellidoE;
                let apellidos = data.apellido.split(' ');
                if (apellidos.length > 1) {
                    let lastname1 = apellidos[0].charAt(0).toUpperCase() + apellidos[0].slice(1);
                    let lastname2 = apellidos[1].charAt(0).toUpperCase() + apellidos[1].slice(1);
                    apellidoE = lastname1 + ' ' + lastname2;
                }
                else {
                    let lastname1 = apellidos[0].charAt(0).toUpperCase() + apellidos[0].slice(1);
                    apellidoE = lastname1;
                }
                // Encriptar contraseña
                const md5 = new ts_md5_1.Md5();
                const contrasena = md5.appendStr(data.contrasena).end();
                // Datos que se leen de la plantilla ingresada
                const { cedula, codigo, estado_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, nacionalidad, usuario, estado_user, rol, app_habilita } = data;
                //Obtener id del rol
                const id_rol = yield database_1.default.query('SELECT * FROM cg_roles WHERE UPPER(nombre) = $1', [rol.toUpperCase()]);
                // Registro de nuevo empleado
                yield database_1.default.query('INSERT INTO empleados ( cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, domicilio, telefono, id_nacionalidad, codigo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [cedula, apellidoE, nombreE, estado_civil.split(' ')[0], genero.split(' ')[0], correo, fec_nacimiento, estado.split(' ')[0], mail_alternativo, domicilio, telefono, nacionalidad.split(' ')[0], codigo]);
                // Obtener el id del empleado ingresado
                const oneEmpley = yield database_1.default.query('SELECT id FROM empleados WHERE cedula = $1', [cedula]);
                const id_empleado = oneEmpley.rows[0].id;
                // Registro de los datos de usuario
                yield database_1.default.query('INSERT INTO usuarios ( usuario, contrasena, estado, id_rol, id_empleado, app_habilita ) VALUES ($1, $2, $3, $4, $5, $6)', [usuario, contrasena, estado_user, id_rol.rows[0]['id'], id_empleado, app_habilita]);
                if (contador === plantilla.length) {
                    // Actualización del código
                    yield database_1.default.query('UPDATE codigo SET valor = null WHERE id = 1');
                    return res.jsonp({ message: 'correcto' });
                }
                contador = contador + 1;
            }));
            fs_1.default.unlinkSync(filePath);
        });
    }
    createEmpleadoTitulos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { observacion, id_empleado, id_titulo } = req.body;
            yield database_1.default.query('INSERT INTO empl_titulos ( observacion, id_empleado, id_titulo ) VALUES ($1, $2, $3)', [observacion, id_empleado, id_titulo]);
            res.jsonp({ message: 'Titulo del empleado Guardado' });
        });
    }
    editarTituloDelEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id_empleado_titulo;
            const { observacion, id_titulo } = req.body;
            yield database_1.default.query('UPDATE empl_titulos SET observacion = $1, id_titulo = $2 WHERE id = $3 ', [observacion, id_titulo, id]);
            res.jsonp({ message: 'Titulo del empleado Actualizado' });
        });
    }
    eliminarTituloDelEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id_empleado_titulo;
            yield database_1.default.query('DELETE FROM empl_titulos WHERE id = $1', [id]);
            res.jsonp({ message: 'Registro eliminado' });
        });
    }
    getTitulosDelEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const unEmpleadoTitulo = yield database_1.default.query('SELECT et.id, et.observacion As observaciones, et.id_titulo, et.id_empleado, ct.nombre, nt.nombre as nivel FROM empl_titulos AS et, cg_titulos AS ct, nivel_titulo AS nt WHERE et.id_empleado = $1 and et.id_titulo = ct.id and ct.id_nivel = nt.id ORDER BY id', [id_empleado]);
            if (unEmpleadoTitulo.rowCount > 0) {
                return res.jsonp(unEmpleadoTitulo.rows);
            }
            else {
                res.status(404).jsonp({ text: 'El empleado no tiene titulos asignados' });
            }
        });
    }
    FileXML(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var xml = builder.create('root').ele(req.body).end({ pretty: true });
            console.log(req.body.userName);
            let filename = "Empleado-" + req.body.userName + '-' + req.body.userId + '-' + new Date().getTime() + '.xml';
            fs_1.default.writeFile(`xmlDownload/${filename}`, xml, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("Archivo guardado");
            });
            res.jsonp({ text: 'XML creado', name: filename });
        });
    }
    downloadXML(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const name = req.params.nameXML;
            let filePath = `servidor\\xmlDownload\\${name}`;
            res.sendFile(__dirname.split("servidor")[0] + filePath);
        });
    }
    ObtenerDepartamentoEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_emple, id_cargo } = req.body;
            const DEPARTAMENTO = yield database_1.default.query('SELECT *FROM VistaDepartamentoEmpleado WHERE id_emple = $1 AND id_cargo = $2', [id_emple, id_cargo]);
            if (DEPARTAMENTO.rowCount > 0) {
                return res.jsonp(DEPARTAMENTO.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'Registros no encontrados' });
            }
        });
    }
    // CREAR CÓDIGO
    CrearCodigo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, valor, automatico, manual } = req.body;
            yield database_1.default.query('INSERT INTO codigo ( id, valor, automatico, manual) VALUES ($1, $2, $3, $4)', [id, valor, automatico, manual]);
            res.jsonp({ message: 'Codigo guardado' });
        });
    }
    ActualizarCodigoTotal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { valor, automatico, manual, id } = req.body;
            yield database_1.default.query('UPDATE codigo SET valor = $1, automatico = $2, manual = $3 WHERE id = $4', [valor, automatico, manual, id]);
            res.jsonp({ message: 'Codigo guardado' });
        });
    }
    ActualizarCodigo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { valor, id } = req.body;
            yield database_1.default.query('UPDATE codigo SET valor = $1 WHERE id = $2', [valor, id]);
            res.jsonp({ message: 'Codigo actualizado' });
        });
    }
    ObtenerCodigo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const VALOR = yield database_1.default.query('SELECT *FROM codigo');
            if (VALOR.rowCount > 0) {
                return res.jsonp(VALOR.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'Registros no encontrados' });
            }
        });
    }
    ObtenerMAXCodigo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const VALOR = yield database_1.default.query('SELECT MAX(codigo) AS codigo FROM empleados');
            if (VALOR.rowCount > 0) {
                return res.jsonp(VALOR.rows);
            }
            else {
                return res.status(404).jsonp({ text: 'Registros no encontrados' });
            }
        });
    }
    ListaBusquedaEmpleados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empleado = yield database_1.default.query('SELECT id, nombre, apellido FROM empleados ORDER BY apellido')
                .then(result => {
                return result.rows.map(obj => {
                    return {
                        id: obj.id,
                        empleado: obj.apellido + ' ' + obj.nombre
                    };
                });
            });
            res.jsonp(empleado);
        });
    }
    DesactivarMultiplesEmpleados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const arrayIdsEmpleados = req.body;
            console.log(arrayIdsEmpleados);
            if (arrayIdsEmpleados.length > 0) {
                arrayIdsEmpleados.forEach((obj) => __awaiter(this, void 0, void 0, function* () {
                    yield database_1.default.query('UPDATE empleados SET estado = 2 WHERE id = $1', [obj]) // 2 => desactivado o inactivo
                        .then(result => {
                        console.log(result.command, 'EMPLEADO ====>', obj);
                    });
                    yield database_1.default.query('UPDATE usuarios SET estado = false, app_habilita = false WHERE id_empleado = $1', [obj]) // false => Ya no tiene acceso
                        .then(result => {
                        console.log(result.command, 'USUARIO ====>', obj);
                    });
                }));
                return res.jsonp({ message: 'Todos los empleados han sido desactivados' });
            }
            return res.jsonp({ message: 'No ha sido desactivado ningún empleado' });
        });
    }
    listaEmpleadosDesactivados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empleado = yield database_1.default.query('SELECT * FROM empleados WHERE estado = 2 ORDER BY id');
            res.jsonp(empleado.rows);
        });
    }
    ActivarMultiplesEmpleados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const arrayIdsEmpleados = req.body;
            console.log(arrayIdsEmpleados);
            if (arrayIdsEmpleados.length > 0) {
                arrayIdsEmpleados.forEach((obj) => __awaiter(this, void 0, void 0, function* () {
                    yield database_1.default.query('UPDATE empleados SET estado = 1 WHERE id = $1', [obj]) // 1 => activado 
                        .then(result => {
                        console.log(result.command, 'EMPLEADO ====>', obj);
                    });
                    yield database_1.default.query('UPDATE usuarios SET estado = true, app_habilita = true WHERE id_empleado = $1', [obj]) // true => Tiene acceso
                        .then(result => {
                        console.log(result.command, 'USUARIO ====>', obj);
                    });
                }));
                // var tiempo = 1000 * arrayIdsEmpleados.length
                // setInterval(() => {
                // }, tiempo)
                return res.jsonp({ message: 'Todos los empleados han sido activados' });
            }
            return res.jsonp({ message: 'No ha sido activado ningún empleado' });
        });
    }
    ReactivarMultiplesEmpleados(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const arrayIdsEmpleados = req.body;
            console.log(arrayIdsEmpleados);
            if (arrayIdsEmpleados.length > 0) {
                arrayIdsEmpleados.forEach((obj) => __awaiter(this, void 0, void 0, function* () {
                    yield database_1.default.query('UPDATE empleados SET estado = 1 WHERE id = $1', [obj]) // 1 => activado 
                        .then(result => {
                        console.log(result.command, 'EMPLEADO ====>', obj);
                    });
                    yield database_1.default.query('UPDATE usuarios SET estado = true, app_habilita = true WHERE id_empleado = $1', [obj]) // true => Tiene acceso
                        .then(result => {
                        console.log(result.command, 'USUARIO ====>', obj);
                    });
                    MetodosHorario_1.EstadoHorarioPeriVacacion(obj);
                }));
                return res.jsonp({ message: 'Todos los empleados seleccionados han sido reactivados' });
            }
            return res.jsonp({ message: 'No ha sido reactivado ningún empleado' });
        });
    }
    GeolocalizacionCrokis(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            let { lat, lng } = req.body;
            console.log(lat, lng, id);
            try {
                yield database_1.default.query('UPDATE empleados SET latitud = $1, longitud = $2 WHERE id = $3', [lat, lng, id])
                    .then(result => {
                    console.log(result.command);
                });
                res.status(200).jsonp({ message: 'Geolocalizacion actulizada' });
            }
            catch (error) {
                res.status(400).jsonp({ message: error });
            }
        });
    }
}
exports.EMPLEADO_CONTROLADOR = new EmpleadoControlador();
exports.default = exports.EMPLEADO_CONTROLADOR;
