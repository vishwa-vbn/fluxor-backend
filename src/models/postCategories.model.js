const pool = require("../config/db");

class PostCategory {
  static async addCategoryToPost(postId, categoryId) {
    try {
      console.log(`Adding category ${categoryId} to post ${postId}`);
  
      const query = "INSERT INTO post_categories (postId, categoryId) VALUES ($1, $2) RETURNING *";
      console.log("Executing Query:", query, [postId, categoryId]);
  
      const { rows } = await pool.query(query, [postId, categoryId]);
  
      console.log("Insert Success:", rows[0]); // Log inserted row
      return rows[0];
    } catch (error) {
      console.error("Database Error:", error.stack); // Log full error
      throw error;
    }
  }
  

  static async removeCategoryFromPost(postId, categoryId) {
    try {
      const { rows } = await pool.query(
        "DELETE FROM post_categories WHERE postId = $1 AND categoryId = $2 RETURNING *",
        [postId, categoryId]
      );
  
      if (rows.length === 0) {
        return { error: `No relation found between post ${postId} and category ${categoryId}` };
      }
  
      return { message: `Category ${categoryId} removed from post ${postId}`, deleted: rows[0] };
    } catch (error) {
      console.error("Database Error:", error.stack);
      throw error;
    }
  }
  

  static async getCategoriesByPost(postId) {
    const { rows } = await pool.query(
      `SELECT c.* FROM categories c
      JOIN post_categories pc ON c.id = pc.categoryId
      WHERE pc.postId = $1`,
      [postId]
    );
    return rows;
  }

  static async getPostsByCategory(categoryId) {
    const { rows } = await pool.query(
      `SELECT p.* FROM posts p
      JOIN post_categories pc ON p.id = pc.postId
      WHERE pc.categoryId = $1`,
      [categoryId]
    );
    return rows;
  }
}

module.exports = PostCategory;
