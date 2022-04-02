/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('polls').del();
  await knex('polls').insert([
    {
      id_user: 2,
      title: 'Poll 1',
    },
    {
      id_user: 3,
      title: 'Poll 2',
      is_active: false,
    },
    {
      id_user: 4,
      title: 'Poll 3',
    },
    {
      id_user: 2,
      title: 'Poll 4',
      is_active: false,
    },
  ]);
};
