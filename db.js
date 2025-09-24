const Pool = require('pg').Pool;

// Use this connection string to connect to your local PostgreSQL database
const databaseConnectionString = 'postgresql://postgres:austin12@localhost:5432/Cars';

const pool = new Pool({
    connectionString: databaseConnectionString,
});

module.exports = pool;