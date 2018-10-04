const bookshelf = require('./bookshelf');

const Users = bookshelf.Model.extend({
    tableName: 'users_table',
    idAttribute: 'username',
    hasTimestamps: true
});

module.exports = Users;