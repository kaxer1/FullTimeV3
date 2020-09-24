//Conexión con la base de datos PostgreSQL

import Pool from 'pg-pool';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  port: 5432,  
  database: 'full',
  password: 'fulltime'
})
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log("Error durante la conexión", err)
      } else {
        console.log("Conexión exitosa")
      }
})

export default pool;