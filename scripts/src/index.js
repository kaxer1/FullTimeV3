// const db_fulltime = require('./database_Fulltime')
// const db_cliente = require('./database_cliente')

const Empleados = require('./Clientes/empleados')

async function main() {
    
    const empleados = new Empleados();
    let lista = await empleados.ObtenerEmpleados()
    empleados.SetEmpleados(lista);
    // console.log(lista)
}

main();