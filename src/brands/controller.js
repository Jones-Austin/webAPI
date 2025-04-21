const pool = require('../../db.js'); // Import the pool object from db.js

// --- GET Brands (Existing + Refined Table Name) ---
const getBrands = (req, res) => {
    // Base SQL query - Using 'carbrands' consistently
    let sqlQuery = 'SELECT * FROM carbrands';

    const values = [];
    let whereClause = '';

    const { id } = req.query;

    if (id) {
        const numericId = parseInt(id, 10);
        if (!isNaN(numericId)) {
            // Assuming your ID column is named 'id'
            whereClause = ` WHERE id = $1`;
            values.push(numericId);
        } else {
            return res.status(400).json({ error: "Invalid 'id' query parameter. Must be an integer." });
        }
    }

    sqlQuery += whereClause;
    sqlQuery += ' ORDER BY id ASC'; // Optional: Add ordering

    console.log('Executing SQL:', sqlQuery);
    console.log('With Values:', values);

    pool.query(sqlQuery, values, (error, results) => {
        if (error) {
            console.error("Database Query Error (GET):", error);
            return res.status(500).json({ error: 'An error occurred while fetching brands.' });
        }
        res.status(200).json(results.rows);
    });
};

// --- POST Brand (New Function) ---
const addBrand = (req, res) => {
    const { name } = req.body; // Extract 'name' from the request body

    // Basic validation
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: "Invalid input: 'name' is required and must be a non-empty string." });
    }

    // SQL query to insert a new brand
    // Assuming 'name' is the column for the brand name
    // RETURNING * returns the newly inserted row
    const sqlQuery = 'INSERT INTO carbrands (carbrand) VALUES ($1) RETURNING *';
    const values = [name.trim()]; // Use trimmed name

    console.log('Executing SQL:', sqlQuery);
    console.log('With Values:', values);

    pool.query(sqlQuery, values, (error, results) => {
        if (error) {
            console.error("Database Query Error (POST):", error);
             // Check for specific errors if needed, e.g., unique constraint violation
            if (error.code === '23505') { // Unique violation code in PostgreSQL
                 return res.status(409).json({ error: `Brand with name '${name.trim()}' already exists.` });
            }
            return res.status(500).json({ error: 'An error occurred while adding the brand.' });
        }
        // Send back the newly created brand object
        res.status(201).json(results.rows[0]); // 201 Created status
    });
};

// --- PUT Brand (New Function) ---
const updateBrand = (req, res) => {
    const id = parseInt(req.params.id, 10); // Get ID from URL path parameter
    const { name } = req.body; // Get new name from request body

    // Validate ID
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid 'id' parameter in URL. Must be an integer." });
    }

    // Validate name
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: "Invalid input: 'name' is required and must be a non-empty string." });
    }

    // SQL query to update a brand by its ID
    // Assuming 'id' and 'name' are the column names
    // RETURNING * returns the updated row
    const sqlQuery = 'UPDATE carbrands SET carbrand = $1 WHERE id = $2 RETURNING *';
    const values = [name.trim(), id];

    console.log('Executing SQL:', sqlQuery);
    console.log('With Values:', values);

    pool.query(sqlQuery, values, (error, results) => {
        if (error) {
            console.error("Database Query Error (PUT):", error);
             // Check for specific errors if needed, e.g., unique constraint violation on update
            if (error.code === '23505') { // Unique violation code in PostgreSQL
                 return res.status(409).json({ error: `Another brand with name '${name.trim()}' already exists.` });
            }
            return res.status(500).json({ error: 'An error occurred while updating the brand.' });
        }

        // Check if any row was actually updated
        if (results.rowCount === 0) {
            // If no rows were affected, the ID likely doesn't exist
            return res.status(404).json({ error: `Brand with id ${id} not found.` });
        }

        // Send back the updated brand object
        res.status(200).json(results.rows[0]); // 200 OK status
    });
};


module.exports = {
    getBrands,
    addBrand,    // Export the new add function
    updateBrand  // Export the new update function
};
// --- END OF FILE controller.js ---