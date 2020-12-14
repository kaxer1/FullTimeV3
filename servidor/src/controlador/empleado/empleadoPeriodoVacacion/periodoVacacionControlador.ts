import { Request, Response } from 'express';
import pool from '../../../database';
import excel from 'xlsx';
import fs from 'fs';

class PeriodoVacacionControlador {

    public async ListarPerVacaciones(req: Request, res: Response) {
        const VACACIONES = await pool.query('SELECT * FROM peri_vacaciones WHERE estado = 1 ORDER BY fec_inicio DESC');
        if (VACACIONES.rowCount > 0) {
            return res.jsonp(VACACIONES.rows)
        }
        else {
            return res.status(404).jsonp({ text: 'No se encuentran registros' });
        }
    }

    public async CrearPerVacaciones(req: Request, res: Response) {
        const { id_empl_contrato, descripcion, dia_vacacion, dia_antiguedad, estado, fec_inicio,
            fec_final, dia_perdido, horas_vacaciones, min_vacaciones, codigo } = req.body;
        await pool.query('INSERT INTO peri_vacaciones (id_empl_contrato, descripcion, dia_vacacion, ' +
            'dia_antiguedad, estado, fec_inicio, fec_final, dia_perdido, horas_vacaciones, min_vacaciones, codigo ) ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
            [id_empl_contrato, descripcion, dia_vacacion, dia_antiguedad, estado, fec_inicio, fec_final,
                dia_perdido, horas_vacaciones, min_vacaciones, codigo]);
        res.jsonp({ message: 'Período de Vacación guardado' });
    }

    public async EncontrarIdPerVacaciones(req: Request, res: Response): Promise<any> {
        const { id_empleado } = req.params;
        const VACACIONES = await pool.query('SELECT pv.id, ce.id AS idContrato FROM peri_vacaciones AS pv, empl_contratos AS ce, empleados AS e WHERE ce.id_empleado = e.id AND pv.id_empl_contrato = ce.id AND pv.estado = 1 AND e.id = $1 ORDER BY pv.fec_final DESC', [id_empleado]);
        if (VACACIONES.rowCount > 0) {
            return res.jsonp(VACACIONES.rows)
        }
        res.status(404).jsonp({ text: 'Registro no encontrado' });
    }

    public async EncontrarPerVacacionesPorIdContrato(req: Request, res: Response): Promise<any> {
        const { id_empl_contrato } = req.params;
        const PERIODO_VACACIONES = await pool.query('SELECT * FROM peri_vacaciones AS p WHERE p.id_empl_contrato = $1 AND p.estado = 1', [id_empl_contrato]);
        if (PERIODO_VACACIONES.rowCount > 0) {
            return res.jsonp(PERIODO_VACACIONES.rows)
        }
        res.status(404).jsonp({ text: 'Registro no encontrado' });
    }

    public async ActualizarPeriodo(req: Request, res: Response): Promise<any> {
        const { id_empl_contrato, descripcion, dia_vacacion, dia_antiguedad, estado, fec_inicio, fec_final, dia_perdido, horas_vacaciones, min_vacaciones, id } = req.body;
        await pool.query('UPDATE peri_vacaciones SET id_empl_contrato = $1, descripcion = $2, dia_vacacion = $3 , dia_antiguedad = $4, estado = $5, fec_inicio = $6, fec_final = $7, dia_perdido = $8, horas_vacaciones = $9, min_vacaciones = $10 WHERE id = $11', [id_empl_contrato, descripcion, dia_vacacion, dia_antiguedad, estado, fec_inicio, fec_final, dia_perdido, horas_vacaciones, min_vacaciones, id]);
        res.jsonp({ message: 'Registro Actualizado exitosamente' });
    }

    /** Verificar que los datos existan para registrar periodo de vacaciones */
    public async VerificarDatos(req: Request, res: Response) {
        let list: any = req.files;
        let cadena = list.uploads[0].path;
        let filename = cadena.split("\\")[1];
        var filePath = `./plantillas/${filename}`

        const workbook = excel.readFile(filePath);
        const sheet_name_list = workbook.SheetNames; // Array de hojas de calculo
        const plantilla = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        var contarDatos = 0;
        var contarCedula = 0;
        var contarContrato = 0;
        var contarPeriodos = 0;
        var contador = 1;
        /** Periodo de vacaciones */
        plantilla.forEach(async (data: any) => {
            // Datos obtenidos de la plantilla
            const { nombre_empleado, apellido_empleado, cedula, descripcion, vacaciones_tomadas,
                fecha_inicia_periodo, fecha_fin_periodo, dias_vacacion, horas_vacacion, minutos_vacacion,
                dias_por_antiguedad, dias_perdidos } = data;

            // Verificar si los datos obligatorios existen
            if (cedula != undefined && descripcion != undefined && vacaciones_tomadas != undefined &&
                fecha_inicia_periodo != undefined && fecha_fin_periodo != undefined && dias_vacacion != undefined &&
                horas_vacacion != undefined && minutos_vacacion != undefined && dias_por_antiguedad != undefined &&
                dias_perdidos != undefined) {
                contarDatos = contarDatos + 1;
            }

            // Verificar si la cédula del empleado existen dentro del sistema
            if (cedula != undefined) {
                const CEDULA = await pool.query('SELECT id, codigo FROM empleados WHERE cedula = $1', [cedula]);
                if (CEDULA.rowCount != 0) {
                    contarCedula = contarCedula + 1;
                    // Verificar si el empleado tiene un contrato
                    const CONTRATO = await pool.query('SELECT MAX(ec.id) FROM empl_contratos AS ec, empleados AS e WHERE ec.id_empleado = e.id AND e.id = $1', [CEDULA.rows[0]['id']]);
                    if (CONTRATO.rowCount != 0) {
                        contarContrato = contarContrato + 1;
                        // Verificar si el empleado ya tiene registrado un periodo de vacaciones
                        const PERIODO = await pool.query('SELECT * FROM peri_vacaciones WHERE codigo = $1', [parseInt(CEDULA.rows[0]['codigo'])]);
                        if (PERIODO.rowCount === 0) {
                            contarPeriodos = contarPeriodos + 1;
                        }
                    }
                }
            }
            // Verificar que todos los datos sean correctos
            console.log('datos', contarDatos, contarCedula, contarContrato)
            if (contador === plantilla.length) {
                if (contarDatos === plantilla.length && contarCedula === plantilla.length &&
                    contarContrato === plantilla.length && contarPeriodos === plantilla.length) {
                    return res.jsonp({ message: 'correcto' });
                } else {
                    return res.jsonp({ message: 'error' });
                }
            }
            contador = contador + 1;
        });
        fs.unlinkSync(filePath);
    }

    /** Verificar que no exista cedulas duplicadas en el registro */
    public async VerificarPlantilla(req: Request, res: Response) {
        let list: any = req.files;
        let cadena = list.uploads[0].path;
        let filename = cadena.split("\\")[1];
        var filePath = `./plantillas/${filename}`
        const workbook = excel.readFile(filePath);
        const sheet_name_list = workbook.SheetNames;
        const plantilla = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        var contarCedulaData = 0;
        var contador_arreglo = 1;
        var arreglos_datos: any = [];
        //Leer la plantilla para llenar un array con los datos nombre para verificar que no sean duplicados
        plantilla.forEach(async (data: any) => {
            // Datos que se leen de la plantilla ingresada
            const { nombre_empleado, apellido_empleado, cedula, descripcion, vacaciones_tomadas,
                fecha_inicia_periodo, fecha_fin_periodo, dias_vacacion, horas_vacacion, minutos_vacacion,
                dias_por_antiguedad, dias_perdidos } = data;
            let datos_array = {
                cedula: cedula,
            }
            arreglos_datos.push(datos_array);
        });

        // Vamos a verificar dentro de arreglo_datos que no se encuentren datos duplicados
        for (var i = 0; i <= arreglos_datos.length - 1; i++) {
            for (var j = 0; j <= arreglos_datos.length - 1; j++) {
                if (arreglos_datos[i].cedula === arreglos_datos[j].cedula) {
                    contarCedulaData = contarCedulaData + 1;
                }
            }
            contador_arreglo = contador_arreglo + 1;
        }

        // Cuando todos los datos han sido leidos verificamos si todos los datos son correctos
        console.log('nombre_data', contarCedulaData, plantilla.length, contador_arreglo);
        if ((contador_arreglo - 1) === plantilla.length) {
            if (contarCedulaData === plantilla.length) {
                return res.jsonp({ message: 'correcto' });
            } else {
                return res.jsonp({ message: 'error' });
            }
        }
        fs.unlinkSync(filePath);
    }

    public async CargarPeriodoVacaciones(req: Request, res: Response) {
        let list: any = req.files;
        let cadena = list.uploads[0].path;
        let filename = cadena.split("\\")[1];
        var filePath = `./plantillas/${filename}`

        const workbook = excel.readFile(filePath);
        const sheet_name_list = workbook.SheetNames; // Array de hojas de calculo
        const plantilla = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        /** Periodo de vacaciones */
        plantilla.forEach(async (data: any) => {
            // Datos obtenidos de la plantilla
            var estado;
            var { nombre_empleado, apellido_empleado, cedula, descripcion, vacaciones_tomadas,
                fecha_inicia_periodo, fecha_fin_periodo, dias_vacacion, horas_vacacion, minutos_vacacion,
                dias_por_antiguedad, dias_perdidos } = data;
            // Obtener id del empleado mediante la cédula
            const datosEmpleado = await pool.query('SELECT id, nombre, apellido, codigo, estado FROM empleados WHERE cedula = $1', [cedula]);
            let id_empleado = datosEmpleado.rows[0]['id'];
            // Obtener el id del contrato actual del empleado indicado
            const CONTRATO = await pool.query('SELECT MAX(ec.id) FROM empl_contratos AS ec, empleados AS e WHERE ec.id_empleado = e.id AND e.id = $1', [id_empleado]);
            let id_empl_contrato = CONTRATO.rows[0]['max'];
            // Cambiar el estado de vacaciones usadas a valores enteros
            if (vacaciones_tomadas === true) {
                estado = 1;
            }
            else {
                estado = 2;
            }
            // Registrar datos de periodo de vacación
            await pool.query('INSERT INTO peri_vacaciones (id_empl_contrato, descripcion, dia_vacacion, ' +
                'dia_antiguedad, estado, fec_inicio, fec_final, dia_perdido, horas_vacaciones, ' +
                'min_vacaciones, codigo ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', [id_empl_contrato,
                descripcion, dias_vacacion, dias_por_antiguedad, estado, fecha_inicia_periodo,
                fecha_fin_periodo, dias_perdidos, horas_vacacion, minutos_vacacion, datosEmpleado.rows[0]['codigo']]);
            return res.jsonp({ message: 'correcto' });
        });
        fs.unlinkSync(filePath);
    }
}

const PERIODO_VACACION_CONTROLADOR = new PeriodoVacacionControlador();

export default PERIODO_VACACION_CONTROLADOR;