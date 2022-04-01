/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('users').insert([
    {
      id: 1,
      username: 'Anonymous',
      email: 'anonymous@somedomain.com',
      password:
        'f80f31c4d14d636edf9890bfdb35fd9eb5661ca15e3e55672983d877ebd10c44de031cc7b3c9cffd66af0423bbbe587abf62aeaa0bb4bd5db475b9e6f3d79736',
      salt: 'salt1',
    },
    {
      id: 2,
      username: 'Mike',
      email: 'mike@somedomain.com',
      password:
        '5a049d167d721bfadc1277408aa276a971904edeed4437d19966da04fff9616f22bb5bc30f0eba1cb53d5d2ff8978c250e0ba4aa81609c893c7e5f80136282ff',
      salt: 'salt2',
    },
    {
      id: 3,
      username: 'Mary',
      email: 'mary@somedomain.com',
      password:
        '98d9f1ef61fb18ca1d30bd67a19cf2aa385d30ca6552d99ef18ac8572a2e3109cf633baac75ab5876c8bde744a65fcc1b49abb6e90d07230386455144f997c66',
      salt: 'salt3',
    },
    {
      id: 4,
      username: 'John',
      email: 'john@somedomain.com',
      password:
        'ebcb5294456d654294828b9b6c856ae5f68253d8ca0f5a6a24312c74e163652d81d1bd4a82df83cb03ea79dffbfc42775e94b933491e1af3748ca7a739bf1c66',
      salt: 'salt4',
    },
  ]);
};
