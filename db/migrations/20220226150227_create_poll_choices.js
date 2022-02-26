/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('poll_choices', (table) => {
    table.increments('id').primary();
    table.bigInteger('id_poll').notNullable().references('id').inTable('polls').onDelete('CASCADE');
    table.string('description', 100).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('poll_choices');
};
