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
  role = "user",
}) => {
  const hashedPassword = await bcrypt.hash(password, 10); // Hash password
  const query = `
    INSERT INTO users(username, password, email, name, bio, avatar, role)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const values = [username, hashedPassword, email, name, bio, avatar, role];
  const { rows } = await client.query(query, values);
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
};
