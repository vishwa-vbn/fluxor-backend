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
}) => {
  const role = "user"; // fixed role
  console.log("Creating regular user...");

  // Step 1: Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Password hashed.");

  // Step 2: Fetch role ID from roles table
  const roleQuery = `SELECT id FROM roles WHERE name = $1;`;
  console.log(`Fetching roleId for role: "${role}"`);
  const roleResult = await client.query(roleQuery, [role]);
  console.log("Role result:", roleResult);

  if (roleResult.rows.length === 0) {
    console.error(`Role "${role}" not found in roles table`);
    throw new Error(`Role "${role}" not found in roles table`);
  }

  const roleId = roleResult.rows[0].id;
  console.log(`Role ID for "${role}":`, roleId);

  // Step 3: Insert user with both roleId and role name
  const userQuery = `
    INSERT INTO users(username, password, email, name, bio, avatar, roleId, role)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const values = [username, hashedPassword, email, name, bio, avatar, roleId, role];
  console.log("Inserting user into database...");

  const { rows } = await client.query(userQuery, values);
  console.log("User created successfully:", rows[0]);

  return rows[0];
};


const createAdmin = async ({
  username,
  password,
  email,
  name,
  bio,
  avatar,
}) => {
  const role = "admin"; // fixed role
  console.log("Creating admin user...");

  // Step 1: Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Password hashed.");

  // Step 2: Fetch role ID from roles table
  const roleQuery = `SELECT id FROM roles WHERE name = $1;`;
  console.log(`Fetching roleId for role: "${role}"`);
  const roleResult = await client.query(roleQuery, [role]);
  console.log("role result", roleResult);

  if (roleResult.rows.length === 0) {
    console.error(`Role "${role}" not found in roles table`);
    throw new Error(`Role "${role}" not found in roles table`);
  }

  const roleId = roleResult.rows[0].id;
  console.log(`Role ID for "${role}":`, roleId);

  // Step 3: Insert user with both roleId and role name
  const userQuery = `
    INSERT INTO users(username, password, email, name, bio, avatar, roleId, role)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const values = [username, hashedPassword, email, name, bio, avatar, roleId, role];
  console.log("Inserting admin user into database...");

  const { rows } = await client.query(userQuery, values);
  console.log("Admin user created successfully:", rows[0]);

  return rows[0];
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
