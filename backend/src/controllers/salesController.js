const salesModel = require('../models/salesModel');

module.exports = {
  getSales: async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query;
      const sales = await salesModel.getSales(startDate, endDate);
      res.json(sales);
    } catch (err) {
      console.error('Error fetching sales:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  createSale: async (req, res, next) => {
    try {
      const { items, total_amount, sale_date, tax_amount } = req.body;

      // Validate required fields
      if (!items || !Array.isArray(items) || items.length === 0 || !total_amount || !sale_date || !tax_amount) {
        return res.status(400).json({ error: 'Missing required fields: items, total_amount, sale_date, tax_amount' });
      }

      // Map frontend payload to schema
      const saleData = {
        items,
        subtotal: items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0),
        tax: tax_amount,
        total: total_amount,
        sale_date,
        user_id: 1 // Adjust based on auth setup (e.g., req.user.id)
      };

      const sale = await salesModel.createSale(saleData);
      res.status(201).json({ message: 'Sale processed successfully', sale_id: sale.sale_id });
    } catch (err) {
      console.error('Error creating sale:', err);
      res.status(400).json({ error: err.message || 'Failed to create sale' });
    }
  },
};