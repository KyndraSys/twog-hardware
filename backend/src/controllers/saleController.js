const { Sale, SaleItem, Product } = require('../models/saleModel');
const { Op } = require('sequelize');

exports.getSales = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let whereClause = {};

    if (startDate && endDate) {
      whereClause.sale_date = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    } else if (startDate) {
      whereClause.sale_date = { [Op.gte]: new Date(startDate) };
    } else if (endDate) {
      whereClause.sale_date = { [Op.lte]: new Date(endDate) };
    }

    const sales = await Sale.findAll({
      where: whereClause,
      include: [{
        model: Product,
        through: { attributes: ['quantity'] },
        as: 'items'
      }]
    });

    const formattedSales = sales.map(sale => ({
      sale_id: sale.sale_id,
      sale_date: sale.sale_date,
      items: sale.items.map(item => ({
        product_name: item.product_name,
        quantity: item.SaleItem.quantity
      })),
      subtotal: sale.subtotal,
      tax: sale.tax,
      total: sale.total
    }));

    res.json(formattedSales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createSale = async (req, res) => {
  const { items, total_amount, sale_date, tax_amount } = req.body;
  const subtotal = parseFloat(total_amount) - parseFloat(tax_amount);

  try {
    const result = await sequelize.transaction(async (t) => {
      const sale = await Sale.create({
        sale_date,
        subtotal,
        tax: tax_amount,
        total: total_amount
      }, { transaction: t });

      for (const item of items) {
        const product = await Product.findByPk(item.product_id, { transaction: t });
        if (product && product.quantity_in_stock >= item.quantity) {
          await product.update({
            quantity_in_stock: product.quantity_in_stock - item.quantity
          }, { transaction: t });
          await sale.addItem(product, { through: { quantity: item.quantity }, transaction: t });
        } else {
          throw new Error(`Insufficient stock for product ID: ${item.product_id}`);
        }
      }

      return sale;
    });

    const formattedSale = {
      sale_id: result.sale_id,
      sale_date: result.sale_date,
      items: items.map(item => ({ product_name: 'N/A', quantity: item.quantity })),
      subtotal,
      tax: tax_amount,
      total: total_amount
    };

    res.status(201).json(formattedSale);
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(400).json({ error: error.message || 'Failed to create sale' });
  }
};