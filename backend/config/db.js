const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',         // MySQL username
    password: "41036085C@18",         // MySQL password
    database: 'mortality_surveillance'
});

db.connect((err) => {
    if(err) {
        console.log('Database connection failed: ', err);
    } else {
        console.log('Connected to database.');
    }
});

module.exports = db;