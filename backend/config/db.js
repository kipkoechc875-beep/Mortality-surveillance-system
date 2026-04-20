require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mortality_surveillance',
});

db.connect((err) => {
    if(err) {
        console.log('Database connection failed: ', err);
    } else {
                console.log('Connected to database.');
                // Ensure `email` column exists on users table
                const dbName = process.env.DB_NAME || 'mortality_surveillance';
                db.query(
                    "SELECT COUNT(*) AS c FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'email'",
                    [dbName],
                    (err, results) => {
                        if (err) return console.warn('Error checking users.email column:', err);
                        const exists = results[0] && results[0].c > 0;
                        if (!exists) {
                            db.query("ALTER TABLE users ADD COLUMN email VARCHAR(255) NULL", (err) => {
                                if (err) console.warn('Failed to add users.email column:', err);
                                else console.log('Added users.email column');
                            });
                        }
                    }
                );
    }
});

module.exports = db;