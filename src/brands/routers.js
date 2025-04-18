const {Router} = require('express');
const controller = require('./controller.js'); // Import the controller object from controller.js

const router = Router(); // Create a new router object
router.get('/', controller.getBrands); // Define a GET route for the root path that calls the getBrands function from the controller

module.exports = router; // Export the router object for use in other files.