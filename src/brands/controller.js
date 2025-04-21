// --- START OF FILE controller.js ---

const pool = require('../../db.js');

// --- GET Brands (Handles GET /api/v1/cars) ---
// Now primarily responsible for fetching ALL brands.
// The ?id= filtering logic might become redundant if you only use /api/v1/cars/:id for single items.
const getBrands = (req, res) => {
    let sqlQuery = 'SELECT * FROM carbrands ORDER BY id ASC';
    const values = [];

    // Optional: Keep ?id= logic if you still want to support it,
    // but the new route GET /:id is now the primary way for single items.
    const { id } = req.query;
    if (id) {
        const numericId = parseInt(id, 10);
        if (!isNaN(numericId)) {
            // If you keep this, it allows BOTH /api/v1/cars?id=1 AND /api/v1/cars/1
            // Consider if you want to remove this block for clarity.
            sqlQuery = 'SELECT * FROM carbrands WHERE id = $1';
            values.push(numericId);
        } else {
             return res.status(400).json({ error: "Invalid 'id' query parameter. Must be an integer." });
        }
    }

    console.log('Executing SQL (GET /):', sqlQuery);
    console.log('With Values:', values);

    pool.query(sqlQuery, values, (error, results) => {
        if (error) {
            console.error("Database Query Error (GET /):", error);
            return res.status(500).json({ error: 'An error occurred while fetching brands.' });
        }
        res.status(200).json(results.rows); // Returns array (empty or with results)
    });
};


// *** ADD THIS NEW FUNCTION ***
// --- GET Brand By ID (Handles GET /api/v1/cars/:id) ---
const getBrandById = (req, res) => {
    // Get ID from path parameters
    const { id } = req.params;
    const numericId = parseInt(id, 10);

    // Validate ID
    if (isNaN(numericId)) {
        return res.status(400).json({ error: "Invalid 'id' parameter in URL. Must be an integer." });
    }

    const sqlQuery = 'SELECT * FROM carbrands WHERE id = $1';
    const values = [numericId];

    console.log('Executing SQL (GET /:id):', sqlQuery);
    console.log('With Values:', values);

    pool.query(sqlQuery, values, (error, results) => {
        if (error) {
            console.error(`Database Query Error (GET /${numericId}):`, error);
            return res.status(500).json({ error: 'An error occurred while fetching the brand.' });
        }

        // Check if brand was found
        if (results.rows.length === 0) {
            return res.status(404).json({ error: `Brand with id ${numericId} not found.` });
        }

        // Send the single found brand object (not an array)
        res.status(200).json(results.rows[0]);
    });
};


// --- POST Brand (Handles POST /api/v1/cars) ---
const addBrand = (req, res) => {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: "Invalid input: 'name' is required and must be a non-empty string." });
    }
    const sqlQuery = 'INSERT INTO carbrands (carbrand) VALUES ($1) RETURNING *';
    const values = [name.trim()];
    console.log('Executing SQL (POST):', sqlQuery);
    console.log('With Values:', values);
    pool.query(sqlQuery, values, (error, results) => {
        if (error) {
            console.error("Database Query Error (POST):", error);
            if (error.code === '23505') { // Unique constraint violation (likely primary key or a unique constraint on name)
                 const constraint = error.constraint;
                 if (constraint === 'carbrands_pkey') { // Specific check for primary key
                    return res.status(409).json({ error: `Brand with ID already exists (Code: ${error.code})`}); // Should not happen with auto-ID normally
                 } else { // Assume other unique constraint (e.g., on carbrand name)
                    return res.status(409).json({ error: `Brand name '${name.trim()}' already exists.` });
                 }
            } else if (error.code === '23502') { // Not-null violation
                 return res.status(400).json({ error: `Database constraint violation: ${error.message}` });
            }
            return res.status(500).json({ error: 'An error occurred while adding the brand.' });
        }
        if (results.rows.length === 0) {
             // Should not happen with RETURNING * on successful insert, but good practice
             return res.status(500).json({ error: 'Failed to retrieve added brand.' });
        }
        res.status(201).json(results.rows[0]);
    });
};

// --- PUT Brand (Handles PUT /api/v1/cars/:id) ---
const updateBrand = (req, res) => {
    const idParam = req.params.id;
    const { name } = req.body;

    const numericId = parseInt(idParam, 10);
    if (isNaN(numericId)) {
        return res.status(400).json({ error: "Invalid 'id' parameter in URL. Must be an integer." });
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: "Invalid input: 'name' is required and must be a non-empty string." });
    }

    const sqlQuery = 'UPDATE carbrands SET carbrand = $1 WHERE id = $2 RETURNING *';
    const values = [name.trim(), numericId];
    console.log('Executing SQL (PUT):', sqlQuery);
    console.log('With Values:', values);
    pool.query(sqlQuery, values, (error, results) => {
        if (error) {
            console.error(`Database Query Error (PUT /${numericId}):`, error);
             if (error.code === '23505') { // Unique violation on update
                 return res.status(409).json({ error: `Another brand with name '${name.trim()}' already exists.` });
            }
            return res.status(500).json({ error: 'An error occurred while updating the brand.' });
        }
        if (results.rowCount === 0) {
            return res.status(404).json({ error: `Brand with id ${numericId} not found.` });
        }
        res.status(200).json(results.rows[0]);
    });
};

module.exports = {
    getBrands,
    getBrandById, // <-- Export the new function
    addBrand,
    updateBrand
};
// --- END OF FILE controller.js ---