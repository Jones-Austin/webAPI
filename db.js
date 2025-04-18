const Pool = require('pg').Pool;


const databaseConnectionString = 'postgresql://austin:H2eIFey1XEhawQ4bgFqeqrVvA65OyVYW@dpg-d017uqa4d50c73as3q30-a.ohio-postgres.render.com/cars_cn15';


const pool = new Pool({
    connectionString: databaseConnectionString,
    // Add SSL configuration if required by your provider (e.g., Render usually requires it for external connections)
    ssl: {
        rejectUnauthorized: false // Necessary for Render default SSL unless you configure certificates properly
    }
});

module.exports = pool; // Export the pool object