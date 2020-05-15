const sqlite3 = require('sqlite3').verbose();

let db;
if (process.env.NODE_ENV === 'test') {
    db = new sqlite3.Database(process.env.DB_FILE);
}
else {
    db = new sqlite3.Database(process.env.DB_FILE);
}

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS 
    equipments(
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        model TEXT, 
        category TEXT, 
        ppm INTEGER, 
        wifi BOOLEAN, 
        consumption REAL)`);
});

module.exports = db