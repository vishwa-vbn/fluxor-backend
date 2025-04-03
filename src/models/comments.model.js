const pool = require("../config/db");

class Comment {
  static async createComment({ content, postId, authorId, authorName, authorEmail, parentId }) {
    const { rows } = await pool.query(
      `INSERT INTO comments (content, postId, authorId, authorName, authorEmail, parentId, status, createdAt)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW()) RETURNING *`,
      [content, postId, authorId, authorName, authorEmail, parentId]
    );
    return rows[0];
  }

  static async getCommentsByPost(postId, status = null) {
    let query = `SELECT * FROM comments WHERE postId = $1`;
    let values = [postId];

    if (status) {
      query += ` AND status = $2`;
      values.push(status);
    }

    const { rows } = await pool.query(query, values);
    return rows;
  }

  static async updateCommentStatus(commentId, status) {
    const { rows } = await pool.query(
      `UPDATE comments SET status = $1 WHERE id = $2 RETURNING *`,
      [status, commentId]
    );
    return rows[0];
  }

  static async deleteComment(commentId) {
    const { rows } = await pool.query(
      `DELETE FROM comments WHERE id = $1 RETURNING *`,
      [commentId]
    );
    return rows[0];
  }
}

module.exports = Comment;
