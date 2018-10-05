const bookshelf = require('./bookshelf');

const Users = bookshelf.Model.extend({
    tableName: 'users_table',
    idAttribute: 'id',   
    hasTimestamps: true    
});

module.exports = Users;