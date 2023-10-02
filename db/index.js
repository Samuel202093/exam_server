const { Pool } = require('pg')
 
const pool = new Pool() //connects to postgres

module.exports = {
    query: (text, params) => pool.query(text, params)
}