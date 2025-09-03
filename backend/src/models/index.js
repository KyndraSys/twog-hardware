const express = require('express');
const router = express.Router();

router.use('/products', require('../routes/productRoutes'));
router.use('/categories', require('../routes/categoryRoutes'));
router.use('/suppliers', require('../routes/supplierRoutes'));
router.use('/sales', require('../routes/salesRoutes')); // Make sure this line exists

module.exports = router;