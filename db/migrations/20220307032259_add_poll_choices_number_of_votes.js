/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('poll_choices', (table) => {
    table.integer('number_of_votes').defaultTo(0);
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('poll_choices', (table) => {
    table.dropColumn('number_of_votes');
  })
};
