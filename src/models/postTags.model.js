const pool = require("../config/db");

class PostTag {
  static async addTagToPost(postId, tagId) {
    const { rows } = await pool.query(
      "INSERT INTO post_tags (postId, tagId) VALUES ($1, $2) RETURNING *",
      [postId, tagId]
    );
    return rows[0];
  }

  static async removeTagFromPost(postId, tagId) {
    const { rows } = await pool.query(
      "DELETE FROM post_tags WHERE postId = $1 AND tagId = $2 RETURNING *",
      [postId, tagId]
    );
    return rows[0]; // Returns null if not found
  }

  static async getTagsByPost(postId) {
    const { rows } = await pool.query(
      `SELECT t.* FROM tags t
       JOIN post_tags pt ON t.id = pt.tagId
       WHERE pt.postId = $1`,
      [postId]
    );
    return rows;
  }

  static async getPostsByTag(tagId) {
    const { rows } = await pool.query(
      `SELECT p.* FROM posts p
       JOIN post_tags pt ON p.id = pt.postId
       WHERE pt.tagId = $1`,
      [tagId]
    );
    return rows;
  }
}

module.exports = PostTag;
