/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    return await knex.schema.table("subjects", (table)=>{
        table.renameColumn('title', 'subject_title')
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return await knex.schema.table('subjects', (table)=> {
        table.renameColumn('title', 'subject_title');
      });
};
