const { queryClient: pool } = require("../config/db");

class Comment {
  static async createComment({ content, postId, authorId, authorName, authorEmail, parentId }) {
    const { rows } = await pool.query(
      `INSERT INTO comments (content, postId, authorId, authorName, authorEmail, parentId, status, createdAt)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW()) RETURNING *`,
      [content, postId, authorId, authorName, authorEmail, parentId]
    );
    
    // Notify about new comment
    await pool.query(
      `SELECT pg_notify('comment_changes', $1::text)`,
      [JSON.stringify({ action: 'create', comment: rows[0] })]
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
    
    // Notify about status update
    await pool.query(
      `SELECT pg_notify('comment_changes', $1::text)`,
      [JSON.stringify({ action: 'update', comment: rows[0] })]
    );
    
    return rows[0];
  }

  static async deleteComment(commentId) {
    const { rows } = await pool.query(
      `DELETE FROM comments WHERE id = $1 RETURNING *`,
      [commentId]
    );
    
    // Notify about deletion
    await pool.query(
      `SELECT pg_notify('comment_changes', $1::text)`,
      [JSON.stringify({ action: 'delete', commentId })]
    );
    
    return rows[0];
  }
}

module.exports = Comment;