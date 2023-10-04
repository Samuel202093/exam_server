const { Pool } = require('pg')
 
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
  }) //connects to postgres

  pool.connect((err)=>{
    if (err){
        console.log({err:err.message ||"cannot connect to database"})
    }else{
        console.log("database connected successfully")
    }
    
  })

module.exports = {
    query: (text, params) => pool.query(text, params)
}