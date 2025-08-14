const express = require('express');
const router = express.Router();

router.use('/products', require('./productRoutes'));
router.use('/categories', require('./categoryRoutes'));
router.use('/suppliers', require('./supplierRoutes'));

module.exports = router;