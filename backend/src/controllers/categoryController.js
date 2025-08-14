const categoryModel = require('../models/categoryModel');

module.exports = {
  getCategories: async (req, res, next) => {
    try {
      const categories = await categoryModel.getAllCategories();
      res.json(categories);
    } catch (err) {
      next(err);
    }
  },
  getCategory: async (req, res, next) => {
    try {
      const category = await categoryModel.getCategoryById(req.params.id);
      if (!category) return res.status(404).json({ error: 'Category not found' });
      res.json(category);
    } catch (err) {
      next(err);
    }
  },
  addCategory: async (req, res, next) => {
    try {
      const newCategory = await categoryModel.addCategory(req.body);
      res.status(201).json(newCategory);
    } catch (err) {
      next(err);
    }
  },
  updateCategory: async (req, res, next) => {
    try {
      const updatedCategory = await categoryModel.updateCategory(req.params.id, req.body);
      if (!updatedCategory) return res.status(404).json({ error: 'Category not found' });
      res.json(updatedCategory);
    } catch (err) {
      next(err);
    }
  },
  deleteCategory: async (req, res, next) => {
    try {
      const deletedCategory = await categoryModel.deleteCategory(req.params.id);
      if (!deletedCategory) return res.status(404).json({ error: 'Category not found' });
      res.json({ message: 'Category deleted' });
    } catch (err) {
      next(err);
    }
  },
};