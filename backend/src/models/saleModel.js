const db = require('../config/db');

module.exports = {
  getAllSales: async (startDate = '', endDate = '') => {
    let query = 'SELECT s.sale_id, s.sale_date, s.subtotal, s.tax, s.total, json_agg(json_build_object(\'product_id\', si.product_id, \'quantity\', si.quantity, \'product_name\', p.product_name)) as items FROM sales s LEFT JOIN sale_items si ON s.sale_id = si.sale_id LEFT JOIN products p ON si.product_id = p.product_id';
    const params = [];

    if (startDate && endDate) {
      query += ' WHERE s.sale_date BETWEEN $1 AND $2';
      params.push(startDate, endDate);
    } else if (startDate) {
      query += ' WHERE s.sale_date >= $1';
      params.push(startDate);
    } else if (endDate) {
      query += ' WHERE s.sale_date <= $1';
      params.push(endDate);
    }

    query += ' GROUP BY s.sale_id, s.sale_date, s.subtotal, s.tax, s.total';
    const result = await db.query(query, params);
    return result.rows;
  },
  createSale: async (saleData) => {
    const { items, total_amount, sale_date, tax_amount } = saleData;
    const subtotal = parseFloat(total_amount) - parseFloat(tax_amount);

    const client = await db.connect();
    try {
      await client.query('BEGIN');

      const saleResult = await client.query(
        'INSERT INTO sales (sale_date, subtotal, tax, total) VALUES ($1, $2, $3, $4) RETURNING *',
        [sale_date, subtotal, tax_amount, total_amount]
      );
      const sale = saleResult.rows[0];

      for (const item of items) {
        const productResult = await client.query(
          'SELECT quantity_in_stock FROM products WHERE product_id = $1',
          [item.product_id]
        );
        const product = productResult.rows[0];
        if (!product || product.quantity_in_stock < item.quantity) {
          throw new Error(`Insufficient stock for product ID: ${item.product_id}`);
        }

        await client.query(
          'INSERT INTO sale_items (sale_id, product_id, quantity) VALUES ($1, $2, $3)',
          [sale.sale_id, item.product_id, item.quantity]
        );

        await client.query(
          'UPDATE products SET quantity_in_stock = quantity_in_stock - $1 WHERE product_id = $2',
          [item.quantity, item.product_id]
        );
      }

      await client.query('COMMIT');
      return {
        sale_id: sale.sale_id,
        sale_date: sale.sale_date,
        items: items.map(item => ({ product_name: 'N/A', quantity: item.quantity })),
        subtotal,
        tax: tax_amount,
        total: total_amount
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};