
//Conexión con la base de datos POstgreSQL

import Pool from 'pg-pool';

const pool = new Pool({

  user: 'fulltime',
  host: '192.168.0.156',
  database: 'fullTimeV3',
  password: 'fulltime',
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