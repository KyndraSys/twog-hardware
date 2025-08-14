const supplierModel = require('../models/supplierModel');

module.exports = {
  getSuppliers: async (req, res) => {
    try {
      const suppliers = await supplierModel.getAllSuppliers();
      res.json(suppliers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getSupplier: async (req, res) => {
    try {
      const supplier = await supplierModel.getSupplierById(req.params.id);
      if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
      res.json(supplier);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  addSupplier: async (req, res) => {
    try {
      const newSupplier = await supplierModel.addSupplier(req.body);
      res.status(201).json(newSupplier);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  updateSupplier: async (req, res) => {
    try {
      const updatedSupplier = await supplierModel.updateSupplier(req.params.id, req.body);
      if (!updatedSupplier) return res.status(404).json({ error: 'Supplier not found' });
      res.json(updatedSupplier);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  deleteSupplier: async (req, res) => {
    try {
      const deletedSupplier = await supplierModel.deleteSupplier(req.params.id);
      if (!deletedSupplier) return res.status(404).json({ error: 'Supplier not found' });
      res.json({ message: 'Supplier deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};