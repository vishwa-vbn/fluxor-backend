const { queryClient: pool } = require("../config/db");

class Category {
  static async createCategory(name, slug, description, featuredImage, parentId) {
    try {
      // Verify pool has query method
      if (typeof pool.query !== "function") {
        throw new Error("pool.query is not a function");
      }

      const { rows } = await pool.query(
        `
        INSERT INTO categories (name, slug, description, featuredImage, parentId)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [name, slug, description, featuredImage, parentId]
      );
      await pool.query(
        `NOTIFY category_changes, '${JSON.stringify({
          operation: "create",
          category: rows[0],
        })}'`
      );
      return rows[0];
    } catch (err) {
      console.error("❌ Error in createCategory:", err.message, err.stack);
      throw err;
    }
  }

  static async getAllCategories() {
    try {
      if (typeof pool.query !== "function") {
        throw new Error("pool.query is not a function");
      }
      const { rows } = await pool.query(
        `SELECT * FROM categories ORDER BY id DESC`
      );
      return rows;
    } catch (err) {
      console.error("❌ Error in getAllCategories:", err.message, err.stack);
      throw err;
    }
  }

  static async getCategoryById(id) {
    try {
      if (typeof pool.query !== "function") {
        throw new Error("pool.query is not a function");
      }
      const { rows } = await pool.query(
        `SELECT * FROM categories WHERE id = $1`,
        [id]
      );
      return rows[0];
    } catch (err) {
      console.error("❌ Error in getCategoryById:", err.message, err.stack);
      throw err;
    }
  }

  static async updateCategory(id, name, slug, description, featuredImage, parentId) {
    try {
      if (typeof pool.query !== "function") {
        throw new Error("pool.query is not a function");
      }
      const { rows } = await pool.query(
        `
        UPDATE categories
        SET name = $1, slug = $2, description = $3, featuredImage = $4, parentId = $5
        WHERE id = $6
        RETURNING *
        `,
        [name, slug, description, featuredImage, parentId, id]
      );
      await pool.query(
        `NOTIFY category_changes, '${JSON.stringify({
          operation: "update",
          category: rows[0],
        })}'`
      );
      return rows[0];
    } catch (err) {
      console.error("❌ Error in updateCategory:", err.message, err.stack);
      throw err;
    }
  }

  static async deleteCategory(id) {
    try {
      if (typeof pool.query !== "function") {
        throw new Error("pool.query is not a function");
      }
      const { rows } = await pool.query(
        `DELETE FROM categories WHERE id = $1 RETURNING *`,
        [id]
      );
      await pool.query(
        `NOTIFY category_changes, '${JSON.stringify({
          operation: "delete",
          category: rows[0],
        })}'`
      );
      return rows[0];
    } catch (err) {
      console.error("❌ Error in deleteCategory:", err.message, err.stack);
      throw err;
    }
  }
}

module.exports = Category;