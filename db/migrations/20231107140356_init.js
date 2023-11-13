const { table } = require("../db");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  return await knex.schema
    .createTable("admins", (table) => {
      table.increments("id").primary();
      table.string("first_name").notNullable();
      table.string("last_name").notNullable();
      table.string("email").notNullable();
      table.text("password").notNullable();
      table.enum("role", ["admin", "editor"]).defaultTo("editor");
      table.enum("status", ["active", "suspended"]).defaultTo("active");
      table.timestamps(true, true);
    })
    .createTable("exam_type", (table) => {
      table.increments("id").primary();
      table.text("type_of_exam").notNullable();
      table.timestamps(true, true);
    })
    .createTable("subjects", (table) => {
      table.increments("id").primary();
      table.text("subject_title").notNullable();
      table.timestamps(true, true);
    })
    .createTable("topics", (table) => {
      table.increments("id").primary();
      table.text("topic_title").notNullable();
      table.integer("subject_id").notNullable().references("subjects.id");
      table.timestamps(true, true);
    })
    .createTable("subject_and_exam_type", (table) => {
      table.increments("id").primary();
      table
        .integer("exam_id")
        .notNullable()
        .references("id")
      table
        .integer("subject_id")
        .notNullable()
        .references("id")
      table.timestamps(true, true);
    })
    .createTable("exam_questions", (table) => {
      table.increments("id").primary();
      table.text("question").notNullable();
      table.json("options").notNullable();
      table.string("correctAnswer").notNullable();
      table.integer("year").notNullable();
      table.string("image_url").notNullable();
      table
        .integer("topic_id")
        .notNullable()
        .references("topics.id")
      table
        .integer("subject_id")
        .notNullable()
        .references("subjects.id")
      table
        .integer("exam_id")
        .notNullable()
        .references("exam_type.id")
      table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  return await knex.schema
    .dropTable("exam_questions")
    .dropTable("topics")
    .dropTable("subject_and_exam_type")
    .dropTable("subjects")
    .dropTable("exam_type")
    .dropTable("admins");
};
