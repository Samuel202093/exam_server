/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    return await knex.schema.table("topics", (table)=>{
        table.renameColumn('title', 'topic_title')
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return await knex.schema.table('topics', (table)=> {
        table.renameColumn('title', 'topic_title');
      });
};
