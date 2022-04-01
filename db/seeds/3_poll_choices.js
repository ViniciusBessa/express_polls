/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('poll_choices').del();
  await knex('poll_choices').insert([
    { id: 1, id_poll: 1, description: 'Choice 1' },
    { id: 2, id_poll: 1, description: 'Choice 2', number_of_votes: 10 },
    { id: 3, id_poll: 2, description: 'Choice 3' },
    { id: 4, id_poll: 2, description: 'Choice 4' },
    { id: 5, id_poll: 2, description: 'Choice 5' },
    { id: 6, id_poll: 3, description: 'Choice 6' },
    { id: 7, id_poll: 3, description: 'Choice 7' },
    { id: 8, id_poll: 3, description: 'Choice 8' },
    { id: 9, id_poll: 4, description: 'Choice 9' },
    { id: 10, id_poll: 4, description: 'Choice 10' },
  ]);
};
