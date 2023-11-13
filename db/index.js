const { Pool } = require('pg');


 

 //connecting to neon-postgres-db
 
// const pool = new Pool({
//     connectionString: process.env.POSTGRES_URL,
//     ssl:{
//       rejectUnauthorized:false
//     },
//   })

// const pool = new Pool() 

//   pool.connect((err)=>{
//     if (err){
//         console.log({err:err.message ||"cannot connect to database"})
//     }else{
//         console.log("database connected successfully")
//     }
    
//   })

// module.exports = {
//     query: (text, params) => pool.query(text, params)
// }


// const pg = require('knex')({
//   client: 'pg',
//   connection: {
//     connectionString: config.POSTGRES_URL,
//     host: config['ep-round-dawn-16251330.us-west-2.aws.neon.tech'],
//     port: config['ep-round-dawn-16251330'],
//     user: config['Samuel202093'],
//     database: config['neondb'],
//     password: config['<% PASSWORD %>'],
//     ssl: true,
//     sslmode: 'require'
//     // ssl:{
//     //       rejectUnauthorized:false
//     //       },
//     // ssl: config["require"] ? { rejectUnauthorized: false } : false,
//   }
// });

// module.exports = pg
