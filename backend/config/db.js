const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "smart123",        // Put your MySQL password here if you have one
    database: "smartgate"
});

connection.connect((err) => {
    if (err) {
        console.log("❌ Database Connection Failed");
        console.log(err);
    } else {
        console.log("✅ MySQL Connected Successfully");
    }
});

module.exports = connection;