const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');

router.get('/sales', saleController.getSales);
router.post('/sales', saleController.createSale);
router.get('/sales/export', saleController.exportSalesData);

module.exports = router;