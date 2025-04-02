// models/post.model.js
const client = require("../config/db");

const createPost = async ({ title, content, authorId, publishedAt, status = "draft", slug, tags, categories, featuredImage }) => {
  const query = `
    INSERT INTO posts (title, content, author_id, published_at, status, slug, tags, categories, featured_image)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;
  const values = [title, content, authorId, publishedAt, status, slug, tags, categories, featuredImage];
  const { rows } = await client.query(query, values);
  return rows[0];
};

const getPostById = async (id) => {
  const query = `SELECT * FROM posts WHERE id = $1;`;
  const { rows } = await client.query(query, [id]);
  return rows[0];
};

const getPostBySlug = async (slug) => {
  const query = `SELECT * FROM posts WHERE slug = $1;`;
  const { rows } = await client.query(query, [slug]);
  return rows[0];
};

const getAllPublishedPosts = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const query = `
    SELECT * FROM posts WHERE status = 'published' ORDER BY published_at DESC LIMIT $1 OFFSET $2;
  `;
  const { rows } = await client.query(query, [limit, offset]);
  return rows;
};

const updatePost = async (id, { title, content, publishedAt, status, slug, tags, categories, featuredImage }) => {
  const query = `
    UPDATE posts SET title = $1, content = $2, published_at = $3, status = $4, slug = $5, tags = $6, categories = $7, featured_image = $8 WHERE id = $9 RETURNING *;
  `;
  const values = [title, content, publishedAt, status, slug, tags, categories, featuredImage, id];
  const { rows } = await client.query(query, values);
  return rows[0];
};

const deletePost = async (id) => {
  const query = `DELETE FROM posts WHERE id = $1 RETURNING *;`;
  const { rows } = await client.query(query, [id]);
  return rows[0];
};

module.exports = {
  createPost,
  getPostById,
  getPostBySlug,
  getAllPublishedPosts,
  updatePost,
  deletePost,
};
