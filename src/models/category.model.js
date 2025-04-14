// const client = require("../config/db");

// // Create a new category
// const createCategory = async ({ name, slug, description, featuredImage, parentId }) => {
//   const query = `
//     INSERT INTO categories (name, slug, description, featuredImage, parentId)
//     VALUES ($1, $2, $3, $4, $5) RETURNING *;
//   `;
//   const values = [name, slug, description, featuredImage, parentId];
//   const { rows } = await client.query(query, values);
//   return rows[0];
// };

// // Get all categories
// const getAllCategories = async () => {
//   const query = `SELECT * FROM categories ORDER BY id DESC;`;
//   const { rows } = await client.query(query);
//   return rows;
// };

// // Get category by ID
// const getCategoryById = async (id) => {
//   const query = `SELECT * FROM categories WHERE id = $1;`;
//   const { rows } = await client.query(query, [id]);
//   return rows[0];
// };

// // Update a category
// const updateCategory = async (id, { name, slug, description, featuredImage, parentId }) => {
//   const query = `
//     UPDATE categories 
//     SET name = $1, slug = $2, description = $3, featuredImage = $4, parentId = $5
//     WHERE id = $6 RETURNING *;
//   `;
//   const values = [name, slug, description, featuredImage, parentId, id];
//   const { rows } = await client.query(query, values);
//   return rows[0];
// };

// // Delete a category
// const deleteCategory = async (id) => {
//   const query = `DELETE FROM categories WHERE id = $1 RETURNING *;`;
//   const { rows } = await client.query(query, [id]);
//   return rows[0];
// };

// module.exports = {
//   createCategory,
//   getAllCategories,
//   getCategoryById,
//   updateCategory,
//   deleteCategory,
// };



const { queryClient: pool } = require("../config/db");

class Category {
  static async createCategory(name, slug, description, featuredImage, parentId) {
    const { rows } = await pool.query(
      `
      INSERT INTO categories (name, slug, description, featuredImage, parentId)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [name, slug, description, featuredImage, parentId]
    );
    // Notify Socket.IO listeners
    await pool.query(
      `NOTIFY category_changes, '${JSON.stringify({
        operation: "create",
        category: rows[0],
      })}'`
    );
    return rows[0];
  }

  static async getAllCategories() {
    const { rows } = await pool.query(
      `SELECT * FROM categories ORDER BY id DESC`
    );
    return rows;
  }

  static async getCategoryById(id) {
    const { rows } = await pool.query(
      `SELECT * FROM categories WHERE id = $1`,
      [id]
    );
    return rows[0];
  }

  static async updateCategory(id, name, slug, description, featuredImage, parentId) {
    const { rows } = await pool.query(
      `
      UPDATE categories
      SET name = $1, slug = $2, description = $3, featuredImage = $4, parentId = $5
      WHERE id = $6
      RETURNING *
      `,
      [name, slug, description, featuredImage, parentId, id]
    );
    // Notify Socket.IO listeners
    await pool.query(
      `NOTIFY category_changes, '${JSON.stringify({
        operation: "update",
        category: rows[0],
      })}'`
    );
    return rows[0];
  }

  static async deleteCategory(id) {
    const { rows } = await pool.query(
      `DELETE FROM categories WHERE id = $1 RETURNING *`,
      [id]
    );
    // Notify Socket.IO listeners
    await pool.query(
      `NOTIFY category_changes, '${JSON.stringify({
        operation: "delete",
        category: rows[0],
      })}'`
    );
    return rows[0];
  }
}

module.exports = Category;