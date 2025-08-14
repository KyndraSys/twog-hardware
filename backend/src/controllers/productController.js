const productModel = require('../models/productModel');

module.exports = {
  getProducts: async (req, res, next) => {
    try {
      const products = await productModel.getAllProducts();
      res.json(products);
    } catch (err) {
      next(err);
    }
  },
  getProduct: async (req, res, next) => {
    try {
      const product = await productModel.getProductById(req.params.id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    } catch (err) {
      next(err);
    }
  },
  addProduct: async (req, res, next) => {
    try {
      const newProduct = await productModel.addProduct(req.body);
      res.status(201).json(newProduct);
    } catch (err) {
      next(err);
    }
  },
  updateProduct: async (req, res, next) => {
    try {
      const updatedProduct = await productModel.updateProduct(req.params.id, req.body);
      if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
      res.json(updatedProduct);
    } catch (err) {
      next(err);
    }
  },
  deleteProduct: async (req, res, next) => {
    try {
      const deletedProduct = await productModel.deleteProduct(req.params.id);
      if (!deletedProduct) return res.status(404).json({ error: 'Product not found' });
      res.json({ message: 'Product deleted' });
    } catch (err) {
      next(err);
    }
  },
};