/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  return await knex.schema.table("exam_type", (table)=>{
    table.renameColumn('title', 'type_of_exam')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    return await knex.schema.table('exam_type', (table)=> {
        table.renameColumn('title', 'type_of_exam');
      });
};
