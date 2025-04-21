// --- START OF FILE routers.js ---

const { Router } = require('express');
const controller = require('./controller.js'); // Import the controller object

const router = Router(); // Create a new router object

// GET /api/v1/cars -> Get ALL brands (no longer handles ?id= query param implicitly)
router.get('/', controller.getBrands);

// *** ADD THIS NEW ROUTE ***
// GET /api/v1/cars/:id -> Get a SINGLE brand by its ID in the path
router.get('/:id', controller.getBrandById); // Map to a new controller function

// POST /api/v1/cars -> Add a new brand
router.post('/', controller.addBrand);

// PUT /api/v1/cars/:id -> Update an existing brand by ID
router.put('/:id', controller.updateBrand);

module.exports = router; // Export the router object
// --- END OF FILE routers.js ---