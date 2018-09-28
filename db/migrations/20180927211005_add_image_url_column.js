exports.up = function(knex, Promise) {
    return knex.schema.table('content_table', function(table) {
      table.string('image_url', 1000);
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.table('content_table', function(table) {
      table.dropColumn('image_url');
    });
  };
  