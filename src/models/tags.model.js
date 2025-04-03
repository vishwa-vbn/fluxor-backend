const pool = require("../config/db");

class Tag {
  static async createTag(name, slug, description) {
    const { rows } = await pool.query(
      "INSERT INTO tags (name, slug, description) VALUES ($1, $2, $3) RETURNING *",
      [name, slug, description]
    );
    return rows[0];
  }

  static async getAllTags() {
    const { rows } = await pool.query("SELECT * FROM tags");
    return rows;
  }

  static async getTagById(id) {
    const { rows } = await pool.query("SELECT * FROM tags WHERE id = $1", [id]);
    return rows[0];
  }

  static async updateTag(id, name, slug, description) {
    const { rows } = await pool.query(
      "UPDATE tags SET name = $1, slug = $2, description = $3 WHERE id = $4 RETURNING *",
      [name, slug, description, id]
    );
    return rows[0];
  }

  static async deleteTag(id) {
    const { rows } = await pool.query(
      "DELETE FROM tags WHERE id = $1 RETURNING *",
      [id]
    );
    return rows[0];
  }
}

module.exports = Tag;
