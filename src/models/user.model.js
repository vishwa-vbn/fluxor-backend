const client = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async ({
  username,
  password,
  email,
  name,
  bio,
  avatar,
  role = "user", // role name, like 'admin' or 'user'
}) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  // Step 1: Get roleId from roles table
  const roleQuery = `SELECT id FROM roles WHERE name = $1;`;
  const roleResult = await client.query(roleQuery, [role]);

  if (roleResult.rows.length === 0) {
    throw new Error(`Role "${role}" not found in roles table`);
  }

  const roleId = roleResult.rows[0].id;

  // Step 2: Insert new user with roleId
  const userQuery = `
    INSERT INTO users(username, password, email, name, bio, avatar, roleId)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const values = [username, hashedPassword, email, name, bio, avatar, roleId];
  const { rows } = await client.query(userQuery, values);
  return rows[0];
};

const createAdmin = async (userData) => {
  return createUser({ ...userData, role: "admin" });
};

const getUserById = async (id) => {
  const query = `SELECT * FROM users WHERE id = $1;`;
  const { rows } = await client.query(query, [id]);
  return rows[0];
};

const loginUser = async ({ email, password }) => {
  const query = `SELECT * FROM users WHERE email = $1;`;
  const { rows } = await client.query(query, [email]);

  if (rows.length === 0) return null; // User not found

  const user = rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);

  return isPasswordValid ? user : null;
};

const getPermissionsByRoleId = async (roleId) => {
  const query = `
    SELECT p.name, p.route
    FROM permissions p
    INNER JOIN role_permissions rp ON p.id = rp.permission_id
    WHERE rp.role_id = $1;
  `;
  const { rows } = await client.query(query, [roleId]);
  return rows;
};


const generateResetToken = async (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15m" }); // Token valid for 15 mins
};

const getUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1;`;
  const { rows } = await client.query(query, [email]);
  return rows[0];
};

const updatePassword = async (userId, newPassword) => {
  console.log("new password", newPassword)
  const query = `UPDATE users SET password = $1 WHERE id = $2 RETURNING *;`;
  const { rows } = await client.query(query, [newPassword, userId]);
  return rows[0];
};

module.exports = {
  createUser,
  createAdmin,
  getUserById,
  loginUser,
  getUserByEmail,
  generateResetToken,
  updatePassword,
  getPermissionsByRoleId,
};
