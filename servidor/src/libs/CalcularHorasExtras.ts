import pool from '../database';

export const CalcularHoraExtra = async function(id_empleado: number, fec_desde: string, fec_hasta: string) {
    console.log(id_empleado, fec_desde, fec_hasta);
    
}

/**************************************************************************
 *        /\                     _______________  _________
 *       /  \       |          |        |        |         |
 *      /    \      |          |        |        |         |
 *     /      \     |          |        |        |         |
 *    /--------\    |          |        |        |         |
 *   /          \   |          |        |        |         |
 *  /            \  |          |        |        |         |
 * /              \ |__________|        |        |_________|
 ***************************************************************************/


 export const GenerarHoraExtraCalulo = async function(id_hora_extr_pedido: number) {

    // let hora_extra_pedida = await pool.query('SELECT fec_inicio, fec_final')
 }