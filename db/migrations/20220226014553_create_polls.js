/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('polls', (table) => {
    table.increments('id').primary();
    table.bigInteger('id_user').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('title', 60).notNullable();
    table.boolean('is_active').defaultTo(true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('polls');
};
