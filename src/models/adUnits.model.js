const pool = require("../config/db");

class AdUnit {
  static async createAdUnit({ name, code, placement }) {
    const { rows } = await pool.query(
      `INSERT INTO ad_units (name, code, placement, isActive) 
       VALUES ($1, $2, $3, TRUE) RETURNING *`,
      [name, code, placement]
    );
    return rows[0];
  }

  static async getAllAdUnits(activeOnly = false) {
    let query = `SELECT * FROM ad_units`;
    let values = [];

    if (activeOnly) {
      query += ` WHERE isActive = TRUE`;
    }

    const { rows } = await pool.query(query, values);
    return rows;
  }

  static async getAdUnitsByPlacement(placement) {
    const { rows } = await pool.query(
      `SELECT * FROM ad_units WHERE placement = $1`,
      [placement]
    );
    return rows;
  }

  static async updateAdUnit(id, { name, code, placement }) {
    const { rows } = await pool.query(
      `UPDATE ad_units SET name = $1, code = $2, placement = $3 
       WHERE id = $4 RETURNING *`,
      [name, code, placement, id]
    );
    return rows[0];
  }

  static async updateAdUnitStatus(id, isActive) {
    const { rows } = await pool.query(
      `UPDATE ad_units SET isActive = $1 WHERE id = $2 RETURNING *`,
      [isActive, id]
    );
    return rows[0];
  }

  static async deleteAdUnit(id) {
    const { rows } = await pool.query(
      `DELETE FROM ad_units WHERE id = $1 RETURNING *`,
      [id]
    );
    return rows[0];
  }
}

module.exports = AdUnit;
