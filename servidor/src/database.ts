
//Conexión con la base de datos POstgreSQL

import Pool from 'pg-pool';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fulltim3',
  password: 'admin',
  port: 5432,
  
})
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log("Error durante la conexión", err)
      } else {
        console.log("Conexión exitosa")
      }
    //pool.end()
})

export default pool;