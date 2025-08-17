const express = require('express');
const router = express.Router();

const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const supplierRoutes = require('./supplierRoutes');
const userRoutes = require('./userRoutes');
const saleRoutes = require('./saleRoutes');

router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/users', userRoutes);
router.use('/sales', saleRoutes);

module.exports = router;