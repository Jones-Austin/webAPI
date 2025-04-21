const { Router } = require('express');
const controller = require('./controller.js'); // Import the controller object

const router = Router(); // Create a new router object

// GET /api/v1/cars -> Get all brands (optionally filtered by query param ?id=X)
router.get('/', controller.getBrands);

// POST /api/v1/cars -> Add a new brand
// Expects { "name": "BrandName" } in the request body
router.post('/', controller.addBrand);

// PUT /api/v1/cars/:id -> Update an existing brand by ID
// Expects { "name": "NewBrandName" } in the request body
// The :id in the path will be available as req.params.id
router.put('/:id', controller.updateBrand);

module.exports = router; // Export the router object