const bookshelf = require('./bookshelf');

const Users = bookshelf.Model.extend({
    tableName: 'users_table',
    hasTimestamps: true
});

module.exports = Users;