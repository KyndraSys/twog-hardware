const db = require('../config/db');

module.exports = {
  getAllSuppliers: async () => {
    const result = await db.query('SELECT * FROM suppliers');
    return result.rows;
  },
  getSupplierById: async (id) => {
    const result = await db.query('SELECT * FROM suppliers WHERE supplier_id = $1', [id]);
    return result.rows[0];
  },
  addSupplier: async (supplier) => {
    const { name, contact_person, phone, email, address } = supplier;
    if (!name) throw new Error('Supplier name is required.');
    const result = await db.query(
      'INSERT INTO suppliers (supplier_name, contact_person, phone, email, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, contact_person || null, phone || null, email || null, address || null]
    );
    return result.rows[0];
  },
  updateSupplier: async (id, supplier) => {
    const { name, contact_person, phone, email, address } = supplier;
    const result = await db.query(
      'UPDATE suppliers SET supplier_name = $1, contact_person = $2, phone = $3, email = $4, address = $5 WHERE supplier_id = $6 RETURNING *',
      [name, contact_person || null, phone || null, email || null, address || null, id]
    );
    return result.rows[0];
  },
  deleteSupplier: async (id) => {
    const result = await db.query('DELETE FROM suppliers WHERE supplier_id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};