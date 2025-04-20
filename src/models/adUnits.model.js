const { queryClient: pool } = require("../config/db");

class AdUnit {
  static async createAdUnit({
    name,
    code, // Add code
    ad_type,
    placement,
    custom_content,
    custom_file_id,
    dimensions,
    is_active,
    target_pages,
    target_audience,
    schedule,
    priority,
    status = "active",
  }) {
    const { rows } = await pool.query(
      `INSERT INTO ad_units (
        name, code, ad_type, placement, custom_content,custom_file_id, dimensions, is_active,
        target_pages, target_audience, schedule, priority, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        name,
        code,
        ad_type,
        placement,
        custom_content,
        custom_file_id,
        dimensions,
        is_active,
        target_pages,
        target_audience,
        schedule,
        priority,
        status,
      ]
    );
    return rows[0];
  }

  static async getAllAdUnits({ activeOnly = false, status = null }) {
    let query = `SELECT * FROM ad_units`;
    let conditions = [];
    let values = [];

    if (activeOnly) {
      conditions.push(`is_active = TRUE`);
    }

    if (status) {
      // push into values *first*, then use its new length for the $n
      values.push(status);
      conditions.push(`status = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
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

  static async getAdUnitById(id) {
    const { rows } = await pool.query(`SELECT * FROM ad_units WHERE id = $1`, [
      id,
    ]);
    return rows[0];
  }

  static async updateAdUnit(
    id,
    {
      name,
      code, // Add code
      ad_type,
      placement,
      custom_content,
      dimensions,
      is_active,
      target_pages,
      target_audience,
      schedule,
      priority,
      status,
    }
  ) {
    const { rows } = await pool.query(
      `UPDATE ad_units SET
        name = $1, code = $2, ad_type = $3, placement = $4, custom_content = $5,
        dimensions = $6, is_active = $7, target_pages = $8,
        target_audience = $9, schedule = $10, priority = $11, status = $12
      WHERE id = $13
      RETURNING *`,
      [
        name,
        code,
        ad_type,
        placement,
        custom_content,
        dimensions,
        is_active,
        target_pages,
        target_audience,
        schedule,
        priority,
        status,
        id,
      ]
    );
    return rows[0];
  }

  static async updateAdUnitStatus(id, status) {
    const is_active = status === "active";
    const { rows } = await pool.query(
      `UPDATE ad_units SET status = $1, is_active = $2
      WHERE id = $3 RETURNING *`,
      [status, is_active, id]
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

class AdSettings {
  static async getAdSettings() {
    const { rows } = await pool.query(
      `SELECT * FROM ad_settings ORDER BY updated_at DESC LIMIT 1`
    );
    return rows[0] || {};
  }

  static async upsertAdSettings({
    publisher_id,
    ad_client,
    placements,
    ad_density,
    ad_format,
    target_pages,
  }) {
    const { rows } = await pool.query(
      `INSERT INTO ad_settings (
        publisher_id, ad_client, placements, ad_density, ad_format, target_pages
      ) VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id)
      DO UPDATE SET
        publisher_id = EXCLUDED.publisher_id,
        ad_client = EXCLUDED.ad_client,
        placements = EXCLUDED.placements,
        ad_density = EXCLUDED.ad_density,
        ad_format = EXCLUDED.ad_format,
        target_pages = EXCLUDED.target_pages,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [publisher_id, ad_client, placements, ad_density, ad_format, target_pages]
    );
    return rows[0];
  }
 
}

module.exports = { AdUnit, AdSettings };
