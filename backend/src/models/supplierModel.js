const db = require('../config/db');

module.exports = {
  getAllSuppliers: async () => {
    try {
      const result = await db.query('SELECT * FROM suppliers ORDER BY supplier_name');
      return result.rows;
    } catch (error) {
      console.error('Error in getAllSuppliers:', error);
      throw error;
    }
  },

  getSupplierById: async (id) => {
    try {
      const result = await db.query('SELECT * FROM suppliers WHERE supplier_id = $1', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in getSupplierById:', error);
      throw error;
    }
  },

  addSupplier: async (supplier) => {
    try {
      const { supplier_name, contact_person, phone, email, address } = supplier;
      const result = await db.query(
        'INSERT INTO suppliers (supplier_name, contact_person, phone, email, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [supplier_name, contact_person, phone, email, address]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in addSupplier:', error);
      throw error;
    }
  },

  updateSupplier: async (id, supplier) => {
    try {
      const { supplier_name, contact_person, phone, email, address } = supplier;
      const result = await db.query(
        'UPDATE suppliers SET supplier_name = $1, contact_person = $2, phone = $3, email = $4, address = $5, updated_at = CURRENT_TIMESTAMP WHERE supplier_id = $6 RETURNING *',
        [supplier_name, contact_person, phone, email, address, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error in updateSupplier:', error);
      throw error;
    }
  },

  deleteSupplier: async (id) => {
    try {
      // Check if supplier has associated products
      const productsCheck = await db.query('SELECT COUNT(*) FROM products WHERE supplier_id = $1', [id]);
      if (parseInt(productsCheck.rows[0].count) > 0) {
        throw new Error('Cannot delete supplier with associated products');
      }
      
      const result = await db.query('DELETE FROM suppliers WHERE supplier_id = $1 RETURNING *', [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in deleteSupplier:', error);
      throw error;
    }
  }
};