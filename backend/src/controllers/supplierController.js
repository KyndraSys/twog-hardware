const supplierModel = require('../models/supplierModel');

module.exports = {
  getSuppliers: async (req, res, next) => {
    try {
      const suppliers = await supplierModel.getAllSuppliers();
      res.json(suppliers);
    } catch (err) {
      next(err);
    }
  },
  getSupplier: async (req, res, next) => {
    try {
      const supplier = await supplierModel.getSupplierById(req.params.id);
      if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
      res.json(supplier);
    } catch (err) {
      next(err);
    }
  },
  addSupplier: async (req, res, next) => {
    try {
      const { name, contact_person, phone, email, address } = req.body;
      const newSupplier = await supplierModel.addSupplier({ name, contact_person, phone, email, address });
      res.status(201).json(newSupplier);
    } catch (err) {
      next(err);
    }
  },
  updateSupplier: async (req, res, next) => {
    try {
      const { name, contact_person, phone, email, address } = req.body;
      const updatedSupplier = await supplierModel.updateSupplier(req.params.id, { name, contact_person, phone, email, address });
      if (!updatedSupplier) return res.status(404).json({ error: 'Supplier not found' });
      res.json(updatedSupplier);
    } catch (err) {
      next(err);
    }
  },
  deleteSupplier: async (req, res, next) => {
    try {
      const deletedSupplier = await supplierModel.deleteSupplier(req.params.id);
      if (!deletedSupplier) return res.status(404).json({ error: 'Supplier not found' });
      res.json({ message: 'Supplier deleted' });
    } catch (err) {
      next(err);
    }
  },
};