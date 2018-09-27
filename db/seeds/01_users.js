
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users_table').del()
    .then(function () {
      // Inserts seed entries
      return knex('users_table').insert([
        {
          fullname: 'Romeo Corpuz',
          username:'rcorpuz'
        },
        {
          fullname: 'Sarah Yamashige',
          username:'syamashige'
        },
        {
          fullname: 'John Doe',
          username:'admin'
        }
      ]);
    });
};
