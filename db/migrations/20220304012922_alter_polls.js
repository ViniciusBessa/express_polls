/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('polls', (table) => {
    table.dropColumn('id_user');
    table.string('owner').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('polls', (table) => {
    table.bigInteger('id_user').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.dropColumn('owner');
  });
};
