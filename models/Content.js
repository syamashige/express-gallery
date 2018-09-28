const bookshelf = require('./bookshelf');

const Content = bookshelf.Model.extend({
    tableName: 'content_table',
    hasTimestamps: true
});

module.exports = Content