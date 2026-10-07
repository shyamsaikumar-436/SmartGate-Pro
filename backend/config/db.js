const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "smart123",
    database: process.env.DB_NAME || "smartgate"
});

connection.connect((err) => {
    if (err) {
        console.log("❌ Database Connection Failed");
        console.log(err);
    } else {
        console.log("✅ MySQL Connected Successfully");

        // Schema migration: ensure users.role supports 'customer'
        connection.query("SHOW COLUMNS FROM users LIKE 'role'", (err, results) => {
            if (!err && results.length > 0) {
                connection.query("ALTER TABLE users MODIFY COLUMN role ENUM('admin','security','customer','visitor') DEFAULT 'customer'", (alterErr) => {
                    if (alterErr) console.log("Role alter status:", alterErr.message);
                });
            }
        });

        // Schema migration: ensure users.phone exists
        connection.query("SHOW COLUMNS FROM users LIKE 'phone'", (err, results) => {
            if (!err && results.length === 0) {
                connection.query("ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL AFTER email", (alterErr) => {
                    if (alterErr) console.log("users.phone add status:", alterErr.message);
                });
            }
        });

        // Schema migration: ensure visitors.user_id exists
        connection.query("SHOW COLUMNS FROM visitors LIKE 'user_id'", (err, results) => {
            if (!err && results.length === 0) {
                connection.query("ALTER TABLE visitors ADD COLUMN user_id INT NULL AFTER id", (alterErr) => {
                    if (alterErr) console.log("user_id column status:", alterErr.message);
                });
            }
        });

        // Schema migration: ensure arrival_time & departure_time exist in visitors
        connection.query("SHOW COLUMNS FROM visitors LIKE 'arrival_time'", (err, results) => {
            if (!err && results.length === 0) {
                connection.query("ALTER TABLE visitors ADD COLUMN arrival_time VARCHAR(50) NULL AFTER visit_date, ADD COLUMN departure_time VARCHAR(50) NULL AFTER arrival_time", (alterErr) => {
                    if (alterErr) console.log("arrival_time add status:", alterErr.message);
                });
            }
        });

        // Schema migration: ensure status supports Pending, Approved, Entered, Exited, Rejected, Completed
        connection.query("SHOW COLUMNS FROM visitors LIKE 'status'", (err, results) => {
            if (!err && results.length > 0) {
                connection.query("ALTER TABLE visitors MODIFY COLUMN status ENUM('Pending','Approved','Entered','Exited','Rejected','Completed') DEFAULT 'Approved'", (alterErr) => {
                    if (alterErr) console.log("status alter status:", alterErr.message);
                });
            }
        });
    }
});

module.exports = connection;