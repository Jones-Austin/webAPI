// --- START OF FILE controller.js ---

const pool = require('../../db.js'); // Import the pool object from db.js

const getBrands = (req, res) => {
    // Base SQL query
    let sqlQuery = 'SELECT * FROM carbrands'; // Select all columns from the brands table

    // Array to hold the value for the parameterized query
    const values = [];
    let whereClause = ''; // To store the WHERE condition if an ID is provided

    // --- Check specifically for the 'id' query parameter ---
    const { id } = req.query;

    if (id) {
        const numericId = parseInt(id, 10); // Convert id to an integer

        if (!isNaN(numericId)) {
            // IMPORTANT: Replace 'your_id_column_name' with the actual name of your ID column
            whereClause = ` WHERE id = $1`;
            values.push(numericId); // Add the numeric ID to the values array
        } else {
            // If 'id' is provided but it's not a valid number, return an error
            return res.status(400).json({ error: "Invalid 'id' parameter. Must be an integer." });
        }
    }
    // If no 'id' parameter is provided, the whereClause remains empty, and all brands will be returned.

    // --- Append WHERE clause if an ID was provided ---
    sqlQuery += whereClause;

    console.log('Executing SQL:', sqlQuery); // Log the final query
    console.log('With Values:', values);   // Log the values (will be empty if no ID filter)

    // --- Execute the database query ---
    // Pass the sqlQuery and the values array (which contains the ID if provided, or is empty otherwise)
    pool.query(sqlQuery, values, (error, results) => {
        if (error) {
            console.error("Database Query Error:", error);
            // Send a generic server error
            return res.status(500).json({ error: 'An error occurred while fetching data.' });
        }
        // Send the results (rows from the query) as a JSON response
        res.status(200).json(results.rows);
    });
};

module.exports = {
    getBrands // Export the updated getBrands function
};
// --- END OF FILE controller.js ---