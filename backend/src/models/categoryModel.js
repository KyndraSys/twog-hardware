const db = require('../config/db');

module.exports = {
  getAllCategories: async () => {
    try {
      const result = await db.query('SELECT * FROM categories ORDER BY category_name');
      return result.rows;
    } catch (error) {
      console.error('Error in getAllCategories:', error);
      throw error;
    }
  },

  getCategoryById: async (id) => {
    try {
      const result = await db.query('SELECT * FROM categories WHERE category_id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in getCategoryById:', error);
      throw error;
    }
  },

  addCategory: async (category) => {
    try {
      const { category_name, description } = category;
      
      if (!category_name) {
        throw new Error('Category name is required');
      }

      const result = await db.query(
        'INSERT INTO categories (category_name, description) VALUES ($1, $2) RETURNING *',
        [category_name, description]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in addCategory:', error);
      throw error;
    }
  },

  updateCategory: async (id, category) => {
    try {
      const { category_name, description } = category;
      
      if (!category_name) {
        throw new Error('Category name is required');
      }

      const result = await db.query(
        'UPDATE categories SET category_name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE category_id = $3 RETURNING *',
        [category_name, description, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in updateCategory:', error);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      // Check if category has associated products
      const productsCheck = await db.query('SELECT COUNT(*) FROM products WHERE category_id = $1', [id]);
      if (parseInt(productsCheck.rows[0].count) > 0) {
        throw new Error('Cannot delete category with associated products');
      }

      const result = await db.query('DELETE FROM categories WHERE category_id = $1 RETURNING *', [id]);
      if (!result.rows[0]) {
        throw new Error('Category not found');
      }
      return result.rows[0];
    } catch (error) {
      console.error('Error in deleteCategory:', error);
      throw error;
    }
  }
};