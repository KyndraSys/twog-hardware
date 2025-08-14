const db = require('../config/db');

module.exports = {
  getAllProducts: async () => {
    const result = await db.query('SELECT * FROM product_stock_status');
    return result.rows;
  },
  getProductById: async (id) => {
    const result = await db.query('SELECT * FROM products WHERE product_id = $1', [id]);
    return result.rows[0];
  },
  addProduct: async (product) => {
    const { code, name, category_id, supplier_id, price, stock, min_stock } = product;
    const result = await db.query(
      'INSERT INTO products (product_code, product_name, category_id, supplier_id, unit_price, quantity_in_stock, reorder_level) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [code, name, category_id, supplier_id, price, stock, min_stock]
    );
    return result.rows[0];
  },
  updateProduct: async (id, product) => {
    const { code, name, category_id, supplier_id, price, stock, min_stock } = product;
    const result = await db.query(
      'UPDATE products SET product_code = $1, product_name = $2, category_id = $3, supplier_id = $4, unit_price = $5, quantity_in_stock = $6, reorder_level = $7 WHERE product_id = $8 RETURNING *',
      [code, name, category_id, supplier_id, price, stock, min_stock, id]
    );
    return result.rows[0];
  },
  deleteProduct: async (id) => {
    const result = await db.query('DELETE FROM products WHERE product_id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};