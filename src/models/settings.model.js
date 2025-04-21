const { queryClient: pool } = require("../config/db");

class Setting {
  static async createSetting({ key, value, group = "general" }) {
    const { rows } = await pool.query(
      `INSERT INTO settings (key, value, "group") 
       VALUES ($1, $2, $3) RETURNING *`,
      [key, String(value), group] // Ensure value is a string
    );
    return rows[0];
  }

  static async getAllSettings(group = null) {
    let query = `SELECT * FROM settings`;
    let values = [];

    if (group) {
      query += ` WHERE "group" = $1`;
      values.push(group);
    }

    const { rows } = await pool.query(query, values);
    return rows;
  }

  static async getSettingByKey(key) {
    const { rows } = await pool.query(
      `SELECT * FROM settings WHERE key = $1`,
      [key]
    );
    return rows[0];
  }

  static async updateSetting(key, value) {
    const { rows } = await pool.query(
      `UPDATE settings SET value = $1 WHERE key = $2 RETURNING *`,
      [String(value), key] // Ensure value is a string
    );
    return rows[0];
  }

  static async deleteSetting(key) {
    const { rows } = await pool.query(
      `DELETE FROM settings WHERE key = $1 RETURNING *`,
      [key]
    );
    return rows[0];
  }
}

module.exports = Setting;