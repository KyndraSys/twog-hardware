// // const db = require('../config/db');

// // module.exports = {
// //   getAllProducts: async () => {
// //     try {
// //       const result = await db.query('SELECT * FROM product_stock_status ORDER BY product_name');
// //       return result.rows;
// //     } catch (error) {
// //       console.error('Error in getAllProducts:', error);
// //       throw error;
// //     }
// //   },

// //   getProductById: async (id) => {
// //     try {
// //       const result = await db.query('SELECT * FROM products WHERE product_id = $1', [id]);
// //       return result.rows[0];
// //     } catch (error) {
// //       console.error('Error in getProductById:', error);
// //       throw error;
// //     }
// //   },

// //   addProduct: async (product) => {
// //     try {
// //       // Match the field names that frontend sends
// //       const { 
// //         product_code, 
// //         product_name, 
// //         category_id, 
// //         supplier_id, 
// //         unit_price, 
// //         quantity_in_stock, 
// //         reorder_level 
// //       } = product;

// //       // Validate required fields
// //       if (!product_code || !product_name || !category_id || !supplier_id || !unit_price) {
// //         throw new Error('Missing required fields: product_code, product_name, category_id, supplier_id, unit_price');
// //       }

// //       const result = await db.query(
// //         'INSERT INTO products (product_code, product_name, category_id, supplier_id, unit_price, quantity_in_stock, reorder_level) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
// //         [
// //           product_code, 
// //           product_name, 
// //           parseInt(category_id), 
// //           parseInt(supplier_id), 
// //           parseFloat(unit_price), 
// //           parseInt(quantity_in_stock) || 0, 
// //           parseInt(reorder_level) || 5
// //         ]
// //       );
// //       return result.rows[0];
// //     } catch (error) {
// //       console.error('Error in addProduct:', error);
// //       throw error;
// //     }
// //   },

// //   updateProduct: async (id, product) => {
// //     try {
// //       // Match the field names that frontend sends
// //       const { 
// //         product_code, 
// //         product_name, 
// //         category_id, 
// //         supplier_id, 
// //         unit_price, 
// //         quantity_in_stock, 
// //         reorder_level 
// //       } = product;

// //       // Validate required fields
// //       if (!product_name || !category_id || !supplier_id || !unit_price) {
// //         throw new Error('Missing required fields: product_name, category_id, supplier_id, unit_price');
// //       }

// //       const result = await db.query(
// //         'UPDATE products SET product_code = $1, product_name = $2, category_id = $3, supplier_id = $4, unit_price = $5, quantity_in_stock = $6, reorder_level = $7, updated_at = CURRENT_TIMESTAMP WHERE product_id = $8 RETURNING *',
// //         [
// //           product_code, 
// //           product_name, 
// //           parseInt(category_id), 
// //           parseInt(supplier_id), 
// //           parseFloat(unit_price), 
// //           parseInt(quantity_in_stock) || 0, 
// //           parseInt(reorder_level) || 5, 
// //           parseInt(id)
// //         ]
// //       );
// //       return result.rows[0];
// //     } catch (error) {
// //       console.error('Error in updateProduct:', error);
// //       throw error;
// //     }
// //   },

// //   deleteProduct: async (id) => {
// //     try {
// //       // Check if product exists in any sales first
// //       const salesCheck = await db.query('SELECT COUNT(*) FROM sale_items WHERE product_id = $1', [id]);
// //       if (parseInt(salesCheck.rows[0].count) > 0) {
// //         throw new Error('Cannot delete product that has been sold');
// //       }

// //       const result = await db.query('DELETE FROM products WHERE product_id = $1 RETURNING *', [id]);
// //       if (!result.rows[0]) {
// //         throw new Error('Product not found');
// //       }
// //       return result.rows[0];
// //     } catch (error) {
// //       console.error('Error in deleteProduct:', error);
// //       throw error;
// //     }
// //   },

// //   // Additional helper method to check for duplicate product codes
// //   checkProductCodeExists: async (productCode, excludeId = null) => {
// //     try {
// //       let query = 'SELECT COUNT(*) FROM products WHERE product_code = $1';
// //       let params = [productCode];
      
// //       if (excludeId) {
// //         query += ' AND product_id != $2';
// //         params.push(excludeId);
// //       }
      
// //       const result = await db.query(query, params);
// //       return parseInt(result.rows[0].count) > 0;
// //     } catch (error) {
// //       console.error('Error in checkProductCodeExists:', error);
// //       throw error;
// //     }
// //   }
// // };



// const db = require('../config/db');

// module.exports = {
//   getAllProducts: async () => {
//     try {
//       const result = await db.query('SELECT * FROM product_stock_status ORDER BY product_name');
//       return result.rows;
//     } catch (error) {
//       console.error('Error in getAllProducts:', error.message, error.stack);
//       throw error;
//     }
//   },

//   getProductById: async (id) => {
//     try {
//       const result = await db.query('SELECT * FROM products WHERE product_id = $1', [id]);
//       return result.rows[0];
//     } catch (error) {
//       console.error('Error in getProductById:', error.message, error.stack);
//       throw error;
//     }
//   },

//   addProduct: async (product) => {
//     try {
//       const { 
//         product_code, 
//         product_name, 
//         category_id, 
//         supplier_id, 
//         unit_price, 
//         quantity_in_stock, 
//         reorder_level,
//         size_specification // Add if required by schema
//       } = product;

//       // Validate required fields
//       if (!product_code || !product_name || !category_id || !supplier_id || !unit_price) {
//         throw new Error('Missing required fields: product_code, product_name, category_id, supplier_id, unit_price');
//       }

//       // Check if category_id and supplier_id exist
//       const categoryCheck = await db.query('SELECT 1 FROM categories WHERE category_id = $1', [parseInt(category_id)]);
//       if (categoryCheck.rows.length === 0) {
//         throw new Error(`Invalid category_id: ${category_id} does not exist`);
//       }
//       const supplierCheck = await db.query('SELECT 1 FROM suppliers WHERE supplier_id = $1', [parseInt(supplier_id)]);
//       if (supplierCheck.rows.length === 0) {
//         throw new Error(`Invalid supplier_id: ${supplier_id} does not exist`);
//       }

//       // Check for duplicate product_code
//       const codeExists = await module.exports.checkProductCodeExists(product_code);
//       if (codeExists) {
//         throw new Error(`Product code ${product_code} already exists`);
//       }

//       const query = `
//         INSERT INTO products (
//           product_code, 
//           product_name, 
//           category_id, 
//           supplier_id, 
//           unit_price, 
//           quantity_in_stock, 
//           reorder_level,
//           size_specification
//         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
//         RETURNING *
//       `;
//       const values = [
//         product_code, 
//         product_name, 
//         parseInt(category_id), 
//         parseInt(supplier_id), 
//         parseFloat(unit_price), 
//         parseInt(quantity_in_stock) || 0, 
//         parseInt(reorder_level) || 5,
//         size_specification || null // Set to null if not provided
//       ];

//       const result = await db.query(query, values);
//       return result.rows[0];
//     } catch (error) {
//       console.error('Error in addProduct:', error.message, error.stack);
//       throw error;
//     }
//   },

//   updateProduct: async (id, product) => {
//     try {
//       const { 
//         product_code, 
//         product_name, 
//         category_id, 
//         supplier_id, 
//         unit_price, 
//         quantity_in_stock, 
//         reorder_level,
//         size_specification // Add if required by schema
//       } = product;

//       if (!product_name || !category_id || !supplier_id || !unit_price) {
//         throw new Error('Missing required fields: product_name, category_id, supplier_id, unit_price');
//       }

//       // Check if category_id and supplier_id exist
//       const categoryCheck = await db.query('SELECT 1 FROM categories WHERE category_id = $1', [parseInt(category_id)]);
//       if (categoryCheck.rows.length === 0) {
//         throw new Error(`Invalid category_id: ${category_id} does not exist`);
//       }
//       const supplierCheck = await db.query('SELECT 1 FROM suppliers WHERE supplier_id = $1', [parseInt(supplier_id)]);
//       if (supplierCheck.rows.length === 0) {
//         throw new Error(`Invalid supplier_id: ${supplier_id} does not exist`);
//       }

//       // Check for duplicate product_code (excluding current product)
//       const codeExists = await module.exports.checkProductCodeExists(product_code, id);
//       if (codeExists) {
//         throw new Error(`Product code ${product_code} already exists`);
//       }

//       const query = `
//         UPDATE products 
//         SET 
//           product_code = $1, 
//           product_name = $2, 
//           category_id = $3, 
//           supplier_id = $4, 
//           unit_price = $5, 
//           quantity_in_stock = $6, 
//           reorder_level = $7, 
//           size_specification = $8,
//           updated_at = CURRENT_TIMESTAMP 
//         WHERE product_id = $9 
//         RETURNING *
//       `;
//       const values = [
//         product_code, 
//         product_name, 
//         parseInt(category_id), 
//         parseInt(supplier_id), 
//         parseFloat(unit_price), 
//         parseInt(quantity_in_stock) || 0, 
//         parseInt(reorder_level) || 5,
//         size_specification || null,
//         parseInt(id)
//       ];

//       const result = await db.query(query, values);
//       return result.rows[0];
//     } catch (error) {
//       console.error('Error in updateProduct:', error.message, error.stack);
//       throw error;
//     }
//   },

//   deleteProduct: async (id) => {
//     try {
//       const salesCheck = await db.query('SELECT COUNT(*) FROM sale_items WHERE product_id = $1', [id]);
//       if (parseInt(salesCheck.rows[0].count) > 0) {
//         throw new Error('Cannot delete product that has been sold');
//       }

//       const result = await db.query('DELETE FROM products WHERE product_id = $1 RETURNING *', [id]);
//       if (!result.rows[0]) {
//         throw new Error('Product not found');
//       }
//       return result.rows[0];
//     } catch (error) {
//       console.error('Error in deleteProduct:', error.message, error.stack);
//       throw error;
//     }
//   },

//   checkProductCodeExists: async (productCode, excludeId = null) => {
//     try {
//       let query = 'SELECT COUNT(*) FROM products WHERE product_code = $1';
//       let params = [productCode];
      
//       if (excludeId) {
//         query += ' AND product_id != $2';
//         params.push(excludeId);
//       }
      
//       const result = await db.query(query, params);
//       return parseInt(result.rows[0].count) > 0;
//     } catch (error) {
//       console.error('Error in checkProductCodeExists:', error.message, error.stack);
//       throw error;
//     }
//   }
// };


const db = require('../config/db');

module.exports = {
  getAllProducts: async () => {
    try {
      const result = await db.query('SELECT * FROM product_stock_status ORDER BY product_name');
      return result.rows;
    } catch (error) {
      console.error('Error in getAllProducts:', error.message, error.stack);
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  },

  getProductById: async (id) => {
    try {
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        throw new Error('Invalid product ID: must be a number');
      }
      const result = await db.query('SELECT * FROM products WHERE product_id = $1', [parsedId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in getProductById:', error.message, error.stack);
      throw new Error(`Failed to fetch product ${id}: ${error.message}`);
    }
  },

  addProduct: async (product) => {
    try {
      const { 
        product_code, 
        product_name, 
        category_id, 
        supplier_id, 
        unit_price, 
        quantity_in_stock, 
        reorder_level,
        size_specification
      } = product;

      if (!product_code || !product_name || !category_id || !supplier_id || !unit_price) {
        throw new Error('Missing required fields: product_code, product_name, category_id, supplier_id, unit_price');
      }

      const parsedCategoryId = parseInt(category_id);
      const parsedSupplierId = parseInt(supplier_id);
      if (isNaN(parsedCategoryId) || isNaN(parsedSupplierId)) {
        throw new Error('Invalid category_id or supplier_id: must be numbers');
      }

      const categoryCheck = await db.query('SELECT 1 FROM categories WHERE category_id = $1', [parsedCategoryId]);
      if (categoryCheck.rows.length === 0) {
        throw new Error(`Invalid category_id: ${category_id} does not exist`);
      }
      const supplierCheck = await db.query('SELECT 1 FROM suppliers WHERE supplier_id = $1', [parsedSupplierId]);
      if (supplierCheck.rows.length === 0) {
        throw new Error(`Invalid supplier_id: ${supplier_id} does not exist`);
      }

      const codeExists = await module.exports.checkProductCodeExists(product_code);
      if (codeExists) {
        throw new Error(`Product code ${product_code} already exists`);
      }

      const query = `
        INSERT INTO products (
          product_code, 
          product_name, 
          category_id, 
          supplier_id, 
          unit_price, 
          quantity_in_stock, 
          reorder_level,
          size_specification
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *
      `;
      const values = [
        product_code, 
        product_name, 
        parsedCategoryId, 
        parsedSupplierId, 
        parseFloat(unit_price), 
        parseInt(quantity_in_stock) || 0, 
        parseInt(reorder_level) || 5,
        size_specification || null
      ];

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error in addProduct:', error.message, error.stack);
      throw new Error(`Failed to add product: ${error.message}`);
    }
  },

  updateProduct: async (id, product) => {
    try {
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        throw new Error('Invalid product ID: must be a number');
      }

      const { 
        product_code, 
        product_name, 
        category_id, 
        supplier_id, 
        unit_price, 
        quantity_in_stock, 
        reorder_level,
        size_specification
      } = product;

      if (!product_code || !product_name || !category_id || !supplier_id || !unit_price) {
        throw new Error('Missing required fields: product_code, product_name, category_id, supplier_id, unit_price');
      }

      const parsedCategoryId = parseInt(category_id);
      const parsedSupplierId = parseInt(supplier_id);
      if (isNaN(parsedCategoryId) || isNaN(parsedSupplierId)) {
        throw new Error('Invalid category_id or supplier_id: must be numbers');
      }

      const categoryCheck = await db.query('SELECT 1 FROM categories WHERE category_id = $1', [parsedCategoryId]);
      if (categoryCheck.rows.length === 0) {
        throw new Error(`Invalid category_id: ${category_id} does not exist`);
      }
      const supplierCheck = await db.query('SELECT 1 FROM suppliers WHERE supplier_id = $1', [parsedSupplierId]);
      if (supplierCheck.rows.length === 0) {
        throw new Error(`Invalid supplier_id: ${supplier_id} does not exist`);
      }

      const codeExists = await module.exports.checkProductCodeExists(product_code, parsedId);
      if (codeExists) {
        throw new Error(`Product code ${product_code} already exists`);
      }

      const query = `
        UPDATE products 
        SET 
          product_code = $1, 
          product_name = $2, 
          category_id = $3, 
          supplier_id = $4, 
          unit_price = $5, 
          quantity_in_stock = $6, 
          reorder_level = $7, 
          size_specification = $8,
          updated_at = CURRENT_TIMESTAMP 
        WHERE product_id = $9 
        RETURNING *
      `;
      const values = [
        product_code, 
        product_name, 
        parsedCategoryId, 
        parsedSupplierId, 
        parseFloat(unit_price), 
        parseInt(quantity_in_stock) || 0, 
        parseInt(reorder_level) || 5,
        size_specification || null,
        parsedId
      ];

      const result = await db.query(query, values);
      if (!result.rows[0]) {
        throw new Error(`Product ${id} not found`);
      }
      return result.rows[0];
    } catch (error) {
      console.error('Error in updateProduct:', error.message, error.stack);
      throw new Error(`Failed to update product: ${error.message}`);
    }
  },

  deleteProduct: async (id) => {
    try {
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        throw new Error('Invalid product ID: must be a number');
      }

      const salesCheck = await db.query('SELECT COUNT(*) FROM sale_items WHERE product_id = $1', [parsedId]);
      if (parseInt(salesCheck.rows[0].count) > 0) {
        throw new Error('Cannot delete product that has been sold');
      }

      const result = await db.query('DELETE FROM products WHERE product_id = $1 RETURNING *', [parsedId]);
      if (!result.rows[0]) {
        throw new Error('Product not found');
      }
      return result.rows[0];
    } catch (error) {
      console.error('Error in deleteProduct:', error.message, error.stack);
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  },

  checkProductCodeExists: async (productCode, excludeId = null) => {
    try {
      if (!productCode) {
        throw new Error('Product code is required');
      }
      let query = 'SELECT COUNT(*) FROM products WHERE product_code = $1';
      let params = [productCode];
      
      if (excludeId) {
        const parsedExcludeId = parseInt(excludeId);
        if (isNaN(parsedExcludeId)) {
          throw new Error('Invalid exclude ID: must be a number');
        }
        query += ' AND product_id != $2';
        params.push(parsedExcludeId);
      }
      
      const result = await db.query(query, params);
      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      console.error('Error in checkProductCodeExists:', error.message, error.stack);
      throw new Error(`Failed to check product code: ${error.message}`);
    }
  }
};