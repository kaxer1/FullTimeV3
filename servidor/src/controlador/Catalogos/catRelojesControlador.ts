import { Request, Response, text } from 'express';
import pool from '../../database';
import excel from 'xlsx';
import fs from 'fs';
const builder = require('xmlbuilder');

class RelojesControlador {

    public async ListarRelojes(req: Request, res: Response) {
        const RELOJES = await pool.query('SELECT * FROM NombreDispositivos');
        if (RELOJES.rowCount > 0) {
            return res.jsonp(RELOJES.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarUnReloj(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const RELOJES = await pool.query('SELECT * FROM cg_relojes WHERE id = $1', [id]);
        if (RELOJES.rowCount > 0) {
            return res.jsonp(RELOJES.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async ListarDatosUnReloj(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        const RELOJES = await pool.query('SELECT * FROM NombreDispositivos WHERE id = $1', [id]);
        if (RELOJES.rowCount > 0) {
            return res.jsonp(RELOJES.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearRelojes(req: Request, res: Response) {
        try {
            const { nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac,
                tien_funciones, id_sucursal, id_departamento, id, numero_accion } = req.body;
            await pool.query('INSERT INTO cg_relojes (nombre, ip, puerto, contrasenia, marca, modelo, serie, ' +
                'id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento, id, numero_accion ) ' +
                'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
                [nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac,
                    tien_funciones, id_sucursal, id_departamento, id, numero_accion]);
            return res.jsonp({ message: 'guardado' });
        }
        catch (error) {
            return res.jsonp({ message: 'error' });
        }
    }

    public async ActualizarReloj(req: Request, res: Response) {
        try {
            const { nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac,
                tien_funciones, id_sucursal, id_departamento, id, numero_accion, id_real } = req.body;
            await pool.query('UPDATE cg_relojes SET nombre = $1, ip = $2, puerto = $3, contrasenia = $4, ' +
                'marca = $5, modelo = $6, serie = $7, id_fabricacion = $8, fabricante = $9, mac = $10, ' +
                'tien_funciones = $11, id_sucursal = $12, id_departamento = $13, id = $14, ' +
                'numero_accion = $15 WHERE id = $16',
                [nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac,
                    tien_funciones, id_sucursal, id_departamento, id, numero_accion, id_real]);
            return res.jsonp({ message: 'actualizado' });
        }
        catch (error) {
            return res.jsonp({ message: 'error' });
        }
    }

    public async CargaPlantillaRelojes(req: Request, res: Response): Promise<void> {
        let list: any = req.files;
        let cadena = list.uploads[0].path;
        let filename = cadena.split("\\")[1];
        var filePath = `./plantillas/${filename}`

        const workbook = excel.readFile(filePath);
        const sheet_name_list = workbook.SheetNames;
        const plantilla = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        plantilla.forEach(async (data: any) => {
            // Dtaos de la plantilla ingresada
            const { nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante,
                mac, tiene_funciones, sucursal, departamento, codigo_reloj, numero_accion } = data;

            // Buscar id de la sucursal ingresada
            const id_sucursal = await pool.query('SELECT id FROM sucursales WHERE UPPER(nombre) = $1', [sucursal.toUpperCase()]);

            const id_departamento = await pool.query('SELECT id FROM cg_departamentos WHERE UPPER(nombre) = $1 AND ' +
                'id_sucursal = $2', [departamento.toUpperCase(), id_sucursal.rows[0]['id']]);

            // Verificar que se haya ingresado némero de acciones si el dispositivo las tiene
            if (tiene_funciones === true) {
                var accion = numero_accion;
            }
            else {
                accion = 0;
            }

            await pool.query('INSERT INTO cg_relojes (nombre, ip, puerto, contrasenia, marca, modelo, serie, ' +
                'id_fabricacion, fabricante, mac, tien_funciones, id_sucursal, id_departamento, id, numero_accion) ' +
                'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
                [nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante, mac,
                    tiene_funciones, id_sucursal.rows[0]['id'], id_departamento.rows[0]['id'], codigo_reloj, accion]);
            res.jsonp({ message: 'correcto' });
        });
        fs.unlinkSync(filePath);
    }

    public async VerificarDatos(req: Request, res: Response): Promise<void> {
        let list: any = req.files;
        let cadena = list.uploads[0].path;
        let filename = cadena.split("\\")[1];
        var filePath = `./plantillas/${filename}`
        const workbook = excel.readFile(filePath);
        const sheet_name_list = workbook.SheetNames;
        const plantilla = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        var contarNombre = 0;
        var contarAccion = 0;
        var contarCodigo = 0;
        var contarIP = 0;
        var contarSucursal = 0;
        var contarDepartamento = 0;
        var contarLlenos = 0;
        var contador = 1;
        plantilla.forEach(async (data: any) => {
            // Datos que se leen de la plantilla ingresada
            const { nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante,
                mac, tiene_funciones, sucursal, departamento, codigo_reloj, numero_accion } = data;

            //Verificar que los datos obligatorios no esten vacios
            if (nombre != undefined && ip != undefined && puerto != undefined && sucursal != undefined &&
                departamento != undefined && tiene_funciones != undefined && codigo_reloj != undefined) {
                contarLlenos = contarLlenos + 1;
            }

            //Verificar que el codigo no se encuentre registrado
            const VERIFICAR_CODIGO = await pool.query('SELECT * FROM cg_relojes WHERE id = $1', [codigo_reloj]);
            if (VERIFICAR_CODIGO.rowCount === 0) {
                contarCodigo = contarCodigo + 1;
            }

            //Verificar que el nombre del equipo no se encuentre registrado
            const VERIFICAR_NOMBRE = await pool.query('SELECT * FROM cg_relojes WHERE UPPER(nombre) = $1', [nombre.toUpperCase()]);
            if (VERIFICAR_NOMBRE.rowCount === 0) {
                contarNombre = contarNombre + 1;
            }

            //Verificar que la IP del dispositivo no se encuentre registrado
            const VERIFICAR_IP = await pool.query('SELECT * FROM cg_relojes WHERE ip = $1', [ip]);
            if (VERIFICAR_IP.rowCount === 0) {
                contarIP = contarIP + 1;
            }

            //Verificar que la sucursal exista dentro del sistema
            const VERIFICAR_SUCURSAL = await pool.query('SELECT id FROM sucursales WHERE UPPER(nombre) = $1', [sucursal.toUpperCase()]);
            if (VERIFICAR_SUCURSAL.rowCount > 0) {
                contarSucursal = contarSucursal + 1;
                // Verificar que el departamento exista dentro del sistema
                const VERIFICAR_DEPARTAMENTO = await pool.query('SELECT id FROM cg_departamentos WHERE UPPER(nombre) = $1 AND id_sucursal = $2',
                    [departamento.toUpperCase(), VERIFICAR_SUCURSAL.rows[0]['id']]);
                if (VERIFICAR_DEPARTAMENTO.rowCount > 0) {
                    contarDepartamento = contarDepartamento + 1;
                }
            }

            // Verificar que se haya ingresado némero de acciones si el dispositivo las tiene
            if (tiene_funciones === true) {
                if (numero_accion != undefined || numero_accion != '') {
                    contarAccion = contarAccion + 1;
                }
            }
            else {
                contarAccion = contarAccion + 1;
            }

            // Cuando todos los datos han sido leidos verificamos si todos los datos son correctos
            console.log('nombre', contarNombre, plantilla.length, contador);
            console.log('ip', contarIP, plantilla.length, contador);
            console.log('sucursal', contarSucursal, plantilla.length, contador);
            console.log('departamento', contarDepartamento, plantilla.length, contador);
            console.log('llenos', contarLlenos, plantilla.length, contador);
            console.log('codigo', contarCodigo, plantilla.length, contador);
            console.log('accion', contarAccion, plantilla.length, contador);
            if (contador === plantilla.length) {
                if (contarNombre === plantilla.length && contarIP === plantilla.length &&
                    contarSucursal === plantilla.length && contarLlenos === plantilla.length &&
                    contarDepartamento === plantilla.length && contarCodigo === plantilla.length &&
                    contarAccion === plantilla.length) {
                    return res.jsonp({ message: 'correcto' });
                } else {
                    return res.jsonp({ message: 'error' });
                }
            }
            contador = contador + 1;
        });
        fs.unlinkSync(filePath);
    }

    public async VerificarPlantilla(req: Request, res: Response) {
        let list: any = req.files;
        let cadena = list.uploads[0].path;
        let filename = cadena.split("\\")[1];
        var filePath = `./plantillas/${filename}`
        const workbook = excel.readFile(filePath);
        const sheet_name_list = workbook.SheetNames;
        const plantilla = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        var contarNombreData = 0;
        var contarCodigoData = 0;
        var contarIP_Data = 0;
        var contador_arreglo = 1;
        var arreglos_datos: any = [];
        //Leer la plantilla para llenar un array con los datos cedula y usuario para verificar que no sean duplicados
        plantilla.forEach(async (data: any) => {
            // Datos que se leen de la plantilla ingresada
            const { nombre, ip, puerto, contrasenia, marca, modelo, serie, id_fabricacion, fabricante,
                mac, tiene_funciones, sucursal, departamento, codigo_reloj, numero_accion } = data;
            let datos_array = {
                nombre: nombre,
                ip: ip,
                codigo: codigo_reloj
            }
            arreglos_datos.push(datos_array);
        });

        // Vamos a verificar dentro de arreglo_datos que no se encuentren datos duplicados
        for (var i = 0; i <= arreglos_datos.length - 1; i++) {
            for (var j = 0; j <= arreglos_datos.length - 1; j++) {
                if (arreglos_datos[i].nombre.toUpperCase() === arreglos_datos[j].nombre.toUpperCase()) {
                    contarNombreData = contarNombreData + 1;
                }
                if (arreglos_datos[i].ip === arreglos_datos[j].ip) {
                    contarIP_Data = contarIP_Data + 1;
                }
                if (arreglos_datos[i].codigo === arreglos_datos[j].codigo) {
                    contarCodigoData = contarCodigoData + 1;
                }
            }
            contador_arreglo = contador_arreglo + 1;
        }

        // Cuando todos los datos han sido leidos verificamos si todos los datos son correctos
        console.log('nombre_data', contarNombreData, plantilla.length, contador_arreglo);
        console.log('ip', contarIP_Data, plantilla.length, contador_arreglo);
        if ((contador_arreglo - 1) === plantilla.length) {
            if (contarNombreData === plantilla.length && contarIP_Data === plantilla.length &&
                contarCodigoData === plantilla.length) {
                return res.jsonp({ message: 'correcto' });
            } else {
                return res.jsonp({ message: 'error' });
            }
        }
        fs.unlinkSync(filePath);
    }

    public async FileXML(req: Request, res: Response): Promise<any> {
        var xml = builder.create('root').ele(req.body).end({ pretty: true });
        console.log(req.body.userName);
        let filename = "Dispositivos-" + req.body.userName + '-' + req.body.userId + '-' + new Date().getTime() + '.xml';
        fs.writeFile(`xmlDownload/${filename}`, xml, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("Archivo guardado");
        });
        res.jsonp({ text: 'XML creado', name: filename });
    }

    public async downloadXML(req: Request, res: Response): Promise<any> {
        const name = req.params.nameXML;
        let filePath = `servidor\\xmlDownload\\${name}`
        res.sendFile(__dirname.split("servidor")[0] + filePath);
    }

    public async EliminarRegistros(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        await pool.query('DELETE FROM cg_relojes WHERE id = $1', [id]);
        res.jsonp({ message: 'Registro eliminado' });
    }

}

const RELOJES_CONTROLADOR = new RelojesControlador();

export default RELOJES_CONTROLADOR;
