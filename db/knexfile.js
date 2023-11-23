// Update with your config settings.
const dotenv = require('dotenv').config()

// /**
//  * @type { Object.<string, import("knex").Knex.Config> }
//  */
module.exports = {

  development:{
    client: 'postgresql',
    connection: process.env.POSTGRES_URL,
    pool:{
      min: 2,
      max: 10
    },
    migrations:{
      tableName: 'knex_migrations'
    }
  },

};
