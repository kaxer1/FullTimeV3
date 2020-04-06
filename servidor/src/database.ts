//Conexión con la base de datos PostgreSQL

import Pool from 'pg-pool';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
<<<<<<< HEAD
  database: 'fullTime3',
  password: 'fulltime',
  port: 5432,  
=======
  database: 'fulltime3',
  password: 'admin',
>>>>>>> c29b15ad8eabcdfdd5f224e4dfe6e549e4b31197
})
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log("Error durante la conexión", err)
      } else {
        console.log("Conexión exitosa")
      }
})

export default pool;