// const client = require("../config/db");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const createUser = async ({ username, password, email, name, bio, avatar }) => {
//   const role = "user"; // fixed role
//   console.log("Creating regular user...");

//   // Step 1: Hash the password
//   const hashedPassword = await bcrypt.hash(password, 10);
//   console.log("Password hashed.");

//   // Step 2: Fetch role ID from roles table
//   const roleQuery = `SELECT id FROM roles WHERE name = $1;`;
//   console.log(`Fetching roleId for role: "${role}"`);
//   const roleResult = await client.query(roleQuery, [role]);
//   console.log("Role result:", roleResult);

//   if (roleResult.rows.length === 0) {
//     console.error(`Role "${role}" not found in roles table`);
//     throw new Error(`Role "${role}" not found in roles table`);
//   }

//   const roleId = roleResult.rows[0].id;
//   console.log(`Role ID for "${role}":`, roleId);

//   // Step 3: Insert user with both roleId and role name
//   const userQuery = `
//     INSERT INTO users(username, password, email, name, bio, avatar, roleId, role)
//     VALUES($1, $2, $3, $4, $5, $6, $7, $8)
//     RETURNING *;
//   `;
//   const values = [
//     username,
//     hashedPassword,
//     email,
//     name,
//     bio,
//     avatar,
//     roleId,
//     role,
//   ];
//   console.log("Inserting user into database...");

//   const { rows } = await client.query(userQuery, values);
//   console.log("User created successfully:", rows[0]);

//   return rows[0];
// };

// const createAdmin = async ({
//   username,
//   password,
//   email,
//   name,
//   bio,
//   avatar,
// }) => {
//   const role = "admin"; // fixed role
//   console.log("Creating admin user...");

//   // Step 1: Hash the password
//   const hashedPassword = await bcrypt.hash(password, 10);
//   console.log("Password hashed.");

//   // Step 2: Fetch role ID from roles table
//   const roleQuery = `SELECT id FROM roles WHERE name = $1;`;
//   console.log(`Fetching roleId for role: "${role}"`);
//   const roleResult = await client.query(roleQuery, [role]);
//   console.log("role result", roleResult);

//   if (roleResult.rows.length === 0) {
//     console.error(`Role "${role}" not found in roles table`);
//     throw new Error(`Role "${role}" not found in roles table`);
//   }

//   const roleId = roleResult.rows[0].id;
//   console.log(`Role ID for "${role}":`, roleId);

//   // Step 3: Insert user with both roleId and role name
//   const userQuery = `
//     INSERT INTO users(username, password, email, name, bio, avatar, roleId, role)
//     VALUES($1, $2, $3, $4, $5, $6, $7, $8)
//     RETURNING *;
//   `;
//   const values = [
//     username,
//     hashedPassword,
//     email,
//     name,
//     bio,
//     avatar,
//     roleId,
//     role,
//   ];
//   console.log("Inserting admin user into database...");

//   const { rows } = await client.query(userQuery, values);
//   console.log("Admin user created successfully:", rows[0]);

//   return rows[0];
// };

// const getUserById = async (id) => {
//   const query = `SELECT * FROM users WHERE id = $1;`;
//   const { rows } = await client.query(query, [id]);
//   return rows[0];
// };

// const loginUser = async ({ email, password }) => {
//   const query = `SELECT * FROM users WHERE email = $1;`;
//   const { rows } = await client.query(query, [email]);

//   if (rows.length === 0) return null; // User not found

//   const user = rows[0];
//   const isPasswordValid = await bcrypt.compare(password, user.password);

//   return isPasswordValid ? user : null;
// };

// const getPermissionsByRoleId = async (roleId) => {
//   const query = `
//     SELECT p.name, p.route
//     FROM permissions p
//     INNER JOIN role_permissions rp ON p.id = rp.permission_id
//     WHERE rp.role_id = $1;
//   `;
//   const { rows } = await client.query(query, [roleId]);
//   return rows;
// };

// const generateResetToken = async (userId) => {
//   return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15m" }); // Token valid for 15 mins
// };

// const getUserByEmail = async (email) => {
//   const query = `SELECT * FROM users WHERE email = $1;`;
//   const { rows } = await client.query(query, [email]);
//   return rows[0];
// };

// const updatePassword = async (userId, newPassword) => {
//   console.log("new password", newPassword);
//   const query = `UPDATE users SET password = $1 WHERE id = $2 RETURNING *;`;
//   const { rows } = await client.query(query, [newPassword, userId]);
//   return rows[0];
// };

// const getAllUsers = async () => {
//   const query = `
//     SELECT id, username, email, name, bio, avatar, role, roleId 
//     FROM users;
//   `;
//   const { rows } = await client.query(query);
//   return rows;
// };


// const updateUser = async (id, userData) => {
//   const { username, email, name, bio, avatar, role, password } = userData;
  
//   // If password is provided, hash it
//   let hashedPassword = null;
//   if (password) {
//     hashedPassword = await bcrypt.hash(password, 10);
//   }

//   // Fetch roleId if role is provided
//   let roleId = null;
//   if (role) {
//     const roleQuery = `SELECT id FROM roles WHERE name = $1;`;
//     const roleResult = await client.query(roleQuery, [role]);
//     if (roleResult.rows.length === 0) {
//       throw new Error(`Role "${role}" not found`);
//     }
//     roleId = roleResult.rows[0].id;
//   }

//   const query = `
//     UPDATE users 
//     SET 
//       username = COALESCE($1, username),
//       email = COALESCE($2, email),
//       name = COALESCE($3, name),
//       bio = COALESCE($4, bio),
//       avatar = COALESCE($5, avatar),
//       role = COALESCE($6, role),
//       roleid = COALESCE($7, roleid),
//       password = COALESCE($8, password)
//     WHERE id = $9
//     RETURNING *;
//   `;

//   const values = [
//     username || null,
//     email || null,
//     name || null,
//     bio || null,
//     avatar || null,
//     role || null,
//     roleId || null,
//     hashedPassword || null,
//     id,
//   ];

//   const { rows } = await client.query(query, values);
//   if (rows.length === 0) throw new Error("User not found");
//   return rows[0];
// };


// const deleteUser = async (id) => {
//   const query = `DELETE FROM users WHERE id = $1 RETURNING *;`;
//   const { rows } = await client.query(query, [id]);
//   if (rows.length === 0) throw new Error("User not found");
//   return rows[0];
// };

// // Bulk delete users
// const bulkDeleteUsers = async (userIds) => {
//   const query = `DELETE FROM users WHERE id = ANY($1) RETURNING *;`;
//   const { rows } = await client.query(query, [userIds]);
//   return rows;
// };


// const getUserWithPermissionsById = async (id) => {
//   try {
//     // Step 1: Fetch user data
//     const userQuery = `
//       SELECT id, username, email, name, bio, avatar, role, roleid, isactive
//       FROM users 
//       WHERE id = $1;
//     `;
//     const userResult = await client.query(userQuery, [id]);

//     if (userResult.rows.length === 0) {
//       throw new Error("User not found");
//     }

//     const user = userResult.rows[0];

//     // Step 2: Fetch permissions using roleId
//     const permissionsQuery = `
//       SELECT p.name, p.route
//       FROM permissions p
//       INNER JOIN role_permissions rp ON p.id = rp.permission_id
//       WHERE rp.role_id = $1;
//     `;
//     const permissionsResult = await client.query(permissionsQuery, [user.roleid]);
//     const permissions = permissionsResult.rows;

//     // Step 3: Combine user data and permissions
//     return {
//       user,
//       permissions,
//     };
//   } catch (err) {
//     throw err; // Let the controller handle the error
//   }
// };

// module.exports = {
//   createUser,
//   createAdmin,
//   getUserById,
//   loginUser,
//   getUserByEmail,
//   generateResetToken,
//   getAllUsers,
//   updatePassword,
//   getPermissionsByRoleId,
//   getUserWithPermissionsById,
//   updateUser,         // New
//   deleteUser,         // New
//   bulkDeleteUsers,
// };


// backend/models/user.model.js
const { queryClient } = require("../config/db"); // Use queryClient for queries
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async ({ username, password, email, name, bio, avatar }) => {
  const role = "user";
  console.log("Creating regular user...");

  // Step 1: Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Password hashed.");

  // Step 2: Fetch role ID
  const roleQuery = `SELECT id FROM roles WHERE name = $1;`;
  console.log(`Fetching roleId for role: "${role}"`);
  const roleResult = await queryClient.query(roleQuery, [role]);
  console.log("Role result:", roleResult);

  if (roleResult.rows.length === 0) {
    console.error(`Role "${role}" not found`);
    throw new Error(`Role "${role}" not found`);
  }

  const roleId = roleResult.rows[0].id;
  console.log(`Role ID for "${role}":`, roleId);

  // Step 3: Insert user
  const userQuery = `
    INSERT INTO users(username, password, email, name, bio, avatar, roleId, role)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const values = [
    username,
    hashedPassword,
    email,
    name,
    bio,
    avatar,
    roleId,
    role,
  ];
  console.log("Inserting user...");

  const { rows } = await queryClient.query(userQuery, values);
  console.log("User created:", rows[0]);

  return rows[0];
};

const createAdmin = async ({ username, password, email, name, bio, avatar }) => {
  const role = "admin";
  console.log("Creating admin user...");

  // Step 1: Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Password hashed.");

  // Step 2: Fetch role ID
  const roleQuery = `SELECT id FROM roles WHERE name = $1;`;
  console.log(`Fetching roleId for role: "${role}"`);
  const roleResult = await queryClient.query(roleQuery, [role]);
  console.log("Role result:", roleResult);

  if (roleResult.rows.length === 0) {
    console.error(`Role "${role}" not found`);
    throw new Error(`Role "${role}" not found`);
  }

  const roleId = roleResult.rows[0].id;
  console.log(`Role ID for "${role}":`, roleId);

  // Step 3: Insert user
  const userQuery = `
    INSERT INTO users(username, password, email, name, bio, avatar, roleId, role)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const values = [
    username,
    hashedPassword,
    email,
    name,
    bio,
    avatar,
    roleId,
    role,
  ];
  console.log("Inserting admin user...");

  const { rows } = await queryClient.query(userQuery, values);
  console.log("Admin created:", rows[0]);

  return rows[0];
};

const getUserById = async (id) => {
  const query = `SELECT * FROM users WHERE id = $1;`;
  const { rows } = await queryClient.query(query, [id]);
  return rows[0];
};

const loginUser = async ({ email, password }) => {
  const query = `SELECT * FROM users WHERE email = $1;`;
  const { rows } = await queryClient.query(query, [email]);

  if (rows.length === 0) return null;

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
  const { rows } = await queryClient.query(query, [roleId]);
  return rows;
};

const generateResetToken = async (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const getUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1;`;
  const { rows } = await queryClient.query(query, [email]);
  return rows[0];
};

const updatePassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const query = `UPDATE users SET password = $1 WHERE id = $2 RETURNING *;`;
  const { rows } = await queryClient.query(query, [hashedPassword, userId]);
  return rows[0];
};

const getAllUsers = async () => {
  const query = `
    SELECT id, username, email, name, bio, avatar, role, roleId 
    FROM users;
  `;
  const { rows } = await queryClient.query(query);
  return rows;
};

const updateUser = async (id, userData) => {
  const { username, email, name, bio, avatar, role, password } = userData;
  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  let roleId = null;
  if (role) {
    const roleQuery = `SELECT id FROM roles WHERE name = $1;`;
    const roleResult = await queryClient.query(roleQuery, [role]);
    if (roleResult.rows.length === 0) {
      throw new Error(`Role "${role}" not found`);
    }
    roleId = roleResult.rows[0].id;
  }

  const query = `
    UPDATE users 
    SET 
      username = COALESCE($1, username),
      email = COALESCE($2, email),
      name = COALESCE($3, name),
      bio = COALESCE($4, bio),
      avatar = COALESCE($5, avatar),
      role = COALESCE($6, role),
      roleid = COALESCE($7, roleid),
      password = COALESCE($8, password)
    WHERE id = $9
    RETURNING *;
  `;
  const values = [
    username || null,
    email || null,
    name || null,
    bio || null,
    avatar || null,
    role || null,
    roleId || null,
    hashedPassword || null,
    id,
  ];

  const { rows } = await queryClient.query(query, values);
  if (rows.length === 0) throw new Error("User not found");
  return rows[0];
};

const deleteUser = async (id) => {
  const query = `DELETE FROM users WHERE id = $1 RETURNING *;`;
  const { rows } = await queryClient.query(query, [id]);
  if (rows.length === 0) throw new Error("User not found");
  return rows[0];
};

const bulkDeleteUsers = async (userIds) => {
  const query = `DELETE FROM users WHERE id = ANY($1) RETURNING *;`;
  const { rows } = await queryClient.query(query, [userIds]);
  return rows;
};

const getUserWithPermissionsById = async (id) => {
  try {
    const userQuery = `
      SELECT id, username, email, name, bio, avatar, role, roleid, isactive
      FROM users 
      WHERE id = $1;
    `;
    const userResult = await queryClient.query(userQuery, [id]);

    if (userResult.rows.length === 0) {
      throw new Error("User not found");
    }

    const user = userResult.rows[0];

    const permissionsQuery = `
      SELECT p.name, p.route
      FROM permissions p
      INNER JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = $1;
    `;
    const permissionsResult = await queryClient.query(permissionsQuery, [user.roleid]);
    const permissions = permissionsResult.rows;

    return { user, permissions };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createUser,
  createAdmin,
  getUserById,
  loginUser,
  getUserByEmail,
  generateResetToken,
  getAllUsers,
  updatePassword,
  getPermissionsByRoleId,
  getUserWithPermissionsById,
  updateUser,
  deleteUser,
  bulkDeleteUsers,
};