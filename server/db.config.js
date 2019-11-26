let Datastore = require('nedb')
    , db = {},
    path = require('path');

// ARTICLES
// ===========================
db.users = new Datastore({ filename: path.resolve(__dirname, '../src/assets/data/users.db'), autoload: true });

// Load Articles database
db.users.loadDatabase(function (err) {
    if (err) {
        console.log("Users database error :", err);
    } else {
        console.log("Users database loaded successfuly.");
    }
});

db.users.ensureIndex({ fieldName: 'name' }, function (err) {
    // If there was an error, err is not null
    if (err) {
        console.log("Users Database indexing error :", err);
    }
});

module.exports = db;
