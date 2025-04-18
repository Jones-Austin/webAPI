const pool = require('../../db.js'); // Import the pool object from db.js
const queries = require('./queries.js'); // Import the queries object from queries.js

const getBrands = (req, res) => {
    pool.query(queries.getBrands, (error, results) => {
        if (error) {
            throw error; // Throw an error if the query fails
        }
        res.status(200).json(results.rows); // Send the results as a JSON response
    });
}

module.exports = {
    getBrands
}; // Export the getBrands function for use in other files.