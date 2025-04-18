const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Cars',
    port: 5432,
    password: 'austin12'
});


module.exports = pool; // Export the pool object for use in other files. 