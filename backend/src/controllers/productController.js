// const productModel = require('../models/productModel');

// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await productModel.getAllProducts();
//     res.status(200).json(products);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ message: 'Failed to fetch products', error: error.message });
//   }
// };

// exports.getProductById = async (req, res) => {
//   try {
//     const product = await productModel.getProductById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.status(200).json(product);
//   } catch (error) {
//     console.error('Error fetching product:', error);
//     res.status(500).json({ message: 'Failed to fetch product', error: error.message });
//   }
// };

// exports.addProduct = async (req, res) => {
//   try {
//     const product = await productModel.addProduct(req.body);
//     res.status(201).json(product);
//   } catch (error) {
//     console.error('Error adding product:', error);
//     if (error.message.includes('Product code') || error.message.includes('category_id') || error.message.includes('supplier_id')) {
//       res.status(400).json({ message: error.message });
//     } else {
//       res.status(500).json({ message: 'Failed to add product', error: error.message });
//     }
//   }
// };

// exports.updateProduct = async (req, res) => {
//   try {
//     const product = await productModel.updateProduct(req.params.id, req.body);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//     res.status(200).json(product);
//   } catch (error) {
//     console.error('Error updating product:', error);
//     if (error.message.includes('Product code') || error.message.includes('category_id') || error.message.includes('supplier_id')) {
//       res.status(400).json({ message: error.message });
//     } else {
//       res.status(500).json({ message: 'Failed to update product', error: error.message });
//     }
//   }
// };

// exports.deleteProduct = async (req, res) => {
//   try {
//     const product = await productModel.deleteProduct(req.params.id);
//     res.status(200).json({ message: 'Product deleted successfully', product });
//   } catch (error) {
//     console.error('Error deleting product:', error);
//     if (error.message.includes('Product not found') || error.message.includes('Cannot delete')) {
//       res.status(400).json({ message: error.message });
//     } else {
//       res.status(500).json({ message: 'Failed to delete product', error: error.message });
//     }
//   }
// };

// exports.checkProductCode = async (req, res) => {
//   try {
//     const { code } = req.query;
//     if (!code) {
//       return res.status(400).json({ message: 'Product code is required' });
//     }
//     const exists = await productModel.checkProductCodeExists(code);
//     res.status(200).json({ exists });
//   } catch (error) {
//     console.error('Error checking product code:', error);
//     res.status(500).json({ message: 'Failed to check product code', error: error.message });
//   }
// };

const productModel = require('../models/productModel');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message, error.stack);
    res.status(500).json({ message: `Failed to fetch products: ${error.message}` });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productModel.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error.message, error.stack);
    res.status(500).json({ message: `Failed to fetch product: ${error.message}` });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const product = await productModel.addProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error adding product:', error.message, error.stack);
    if (error.message.includes('Missing required fields') || 
        error.message.includes('Invalid category_id') || 
        error.message.includes('Invalid supplier_id') || 
        error.message.includes('Product code')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: `Failed to add product: ${error.message}` });
    }
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await productModel.updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error updating product:', error.message, error.stack);
    if (error.message.includes('Missing required fields') || 
        error.message.includes('Invalid category_id') || 
        error.message.includes('Invalid supplier_id') || 
        error.message.includes('Product code') || 
        error.message.includes('Product not found')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: `Failed to update product: ${error.message}` });
    }
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await productModel.deleteProduct(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully', product });
  } catch (error) {
    console.error('Error deleting product:', error.message, error.stack);
    if (error.message.includes('Product not found') || error.message.includes('Cannot delete')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: `Failed to delete product: ${error.message}` });
    }
  }
};

exports.checkProductCode = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ message: 'Product code is required' });
    }
    const exists = await productModel.checkProductCodeExists(code);
    res.status(200).json({ exists });
  } catch (error) {
    console.error('Error checking product code:', error.message, error.stack);
    res.status(500).json({ message: `Failed to check product code: ${error.message}` });
  }
};