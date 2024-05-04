const express = require('express');
const router = express.Router();
const searchController = require('../controller/naturalSearchController');

// Endpoint for natural language search
router.post('/', searchController.search);

module.exports = router;
