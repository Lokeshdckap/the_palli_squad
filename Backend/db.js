const { Client } = require('pg');

const client = new Client({
    host: "127.0.0.1",
    port: 5432,
    database: "my_pgdb",
    user: "postgres",
    password: "postgres"
})
client.connect((err) => {
    if (err) {
        console.error("connection error", err.stack)
    }
    else {
        console.log("DB - connected")
    }
})
module.exports = client