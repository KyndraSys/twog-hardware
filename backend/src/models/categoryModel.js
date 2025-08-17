const db = require('../config/db');

module.exports = {
  getAllCategories: async () => {
    const result = await db.query('SELECT * FROM categories');
    return result.rows;
  },
  getCategoryById: async (id) => {
    const result = await db.query('SELECT * FROM categories WHERE category_id = $1', [id]);
    return result.rows[0];
  },
  addCategory: async (category) => {
    const { name, description } = category;
    if (!name) throw new Error('Category name is required.');
    const result = await db.query(
      'INSERT INTO categories (category_name, description) VALUES ($1, $2) RETURNING *',
      [name, description || null]
    );
    return result.rows[0];
  },
  updateCategory: async (id, category) => {
    const { name, description } = category;
    const result = await db.query(
      'UPDATE categories SET category_name = $1, description = $2 WHERE category_id = $3 RETURNING *',
      [name, description || null, id]
    );
    return result.rows[0];
  },
  deleteCategory: async (id) => {
    const result = await db.query('DELETE FROM categories WHERE category_id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};