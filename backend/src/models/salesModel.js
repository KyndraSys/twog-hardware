const db = require('../config/db');

module.exports = {
  getSales: async (startDate, endDate) => {
    try {
      let queryText = 'SELECT * FROM sales_summary';
      const queryParams = [];
      if (startDate && endDate) {
        queryText += ' WHERE sale_date BETWEEN $1 AND $2';
        queryParams.push(startDate, endDate);
      }
      queryText += ' ORDER BY sale_date DESC';
      const result = await db.query(queryText, queryParams);
      return result.rows;
    } catch (error) {
      console.error('Error in getSales:', error);
      throw error;
    }
  },
  createSale: async ({ items, subtotal, tax, total, sale_date, user_id }) => {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      // Generate transaction number
      const txResult = await client.query('SELECT generate_transaction_number() AS transaction_number');
      const transaction_number = txResult.rows[0].transaction_number;

      // Insert sale
      const saleResult = await client.query(
        'INSERT INTO sales (transaction_number, sale_date, subtotal, tax, total, payment_method, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING sale_id',
        [transaction_number, sale_date, subtotal, tax, total, 'Cash', user_id]
      );
      const saleId = saleResult.rows[0].sale_id;

      // Insert sale items and update stock
      for (const item of items) {
        // Verify stock availability
        const productResult = await client.query(
          'SELECT quantity_in_stock FROM products WHERE product_id = $1',
          [item.product_id]
        );
        if (!productResult.rows[0] || productResult.rows[0].quantity_in_stock < item.quantity) {
          throw new Error(`Insufficient stock for product ID ${item.product_id}`);
        }

        await client.query(
          'INSERT INTO sale_items (sale_id, product_id, product_code, product_name, quantity, unit_price, subtotal) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [
            saleId,
            item.product_id,
            item.product_code || (await client.query('SELECT product_code FROM products WHERE product_id = $1', [item.product_id])).rows[0].product_code,
            item.product_name || (await client.query('SELECT product_name FROM products WHERE product_id = $1', [item.product_id])).rows[0].product_name,
            item.quantity,
            item.unit_price,
            item.quantity * item.unit_price
          ]
        );

        await client.query(
          'UPDATE products SET quantity_in_stock = quantity_in_stock - $1 WHERE product_id = $2',
          [item.quantity, item.product_id]
        );

        await client.query(
          'INSERT INTO inventory_logs (product_id, product_code, change_amount, reason, reference_type, reference_id, changed_by) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [
            item.product_id,
            item.product_code || (await client.query('SELECT product_code FROM products WHERE product_id = $1', [item.product_id])).rows[0].product_code,
            -item.quantity,
            'Sale transaction',
            'sale',
            saleId,
            user_id
          ]
        );
      }

      await client.query('COMMIT');
      return { sale_id: saleId };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in createSale:', error);
      throw error;
    } finally {const db = require('../config/db');

module.exports = {
  getSales: async (startDate, endDate) => {
    try {
      let queryText = 'SELECT * FROM sales_summary';
      const queryParams = [];
      if (startDate && endDate) {
        queryText += ' WHERE sale_date BETWEEN $1 AND $2';
        queryParams.push(startDate, endDate);
      }
      queryText += ' ORDER BY sale_date DESC';
      const result = await db.query(queryText, queryParams);
      return result.rows;
    } catch (error) {
      console.error('Error in getSales:', error);
      throw error;
    }
  },
  createSale: async ({ items, subtotal, tax, total, sale_date, user_id }) => {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      // Generate transaction number
      const txResult = await client.query('SELECT generate_transaction_number() AS transaction_number');
      const transaction_number = txResult.rows[0].transaction_number;

      // Insert sale
      const saleResult = await client.query(
        'INSERT INTO sales (transaction_number, sale_date, subtotal, tax, total, payment_method, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING sale_id',
        [transaction_number, sale_date, subtotal, tax, total, 'Cash', user_id || 1]
      );
      const saleId = saleResult.rows[0].sale_id;

      // Insert sale items and update stock
      for (const item of items) {
        // Verify stock availability
        const productResult = await client.query(
          'SELECT quantity_in_stock, product_code, product_name FROM products WHERE product_id = $1',
          [item.product_id]
        );
        if (!productResult.rows[0] || productResult.rows[0].quantity_in_stock < item.quantity) {
          throw new Error(`Insufficient stock for product ID ${item.product_id}`);
        }

        const { product_code, product_name } = productResult.rows[0];
        await client.query(
          'INSERT INTO sale_items (sale_id, product_id, product_code, product_name, quantity, unit_price, subtotal) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [saleId, item.product_id, product_code, product_name, item.quantity, item.unit_price, item.quantity * item.unit_price]
        );

        await client.query(
          'UPDATE products SET quantity_in_stock = quantity_in_stock - $1 WHERE product_id = $2',
          [item.quantity, item.product_id]
        );

        await client.query(
          'INSERT INTO inventory_logs (product_id, product_code, change_amount, reason, reference_type, reference_id, changed_by) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [item.product_id, product_code, -item.quantity, 'Sale transaction', 'sale', saleId, user_id || 1]
        );
      }

      await client.query('COMMIT');
      return { sale_id: saleId };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in createSale:', error);
      throw error;
    } finally {
      client.release();
    }
  },
};
      client.release();
    }
  },
};