const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'austin',
    host: 'dpg-d017uqa4d50c73as3q30-a',
    database: 'cars_cn15',
    port: 5432,
    password: 'H2eIFey1XEhawQ4bgFqeqrVvA65OyVYW'
});


module.exports = pool; // Export the pool object for use in other files. 