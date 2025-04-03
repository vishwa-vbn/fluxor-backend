const client = require("../config/db");

// Create a new post
const createPost = async (data) => {
  const {
    title,
    slug,
    excerpt = null,
    content,
    featuredImage = null,
    authorId,
    status = 'draft',
    publishedAt = null,
    metaTitle = null,
    metaDescription = null,
    isCommentsEnabled = true,
    viewCount = 0,
  } = data;
  
  const query = `
    INSERT INTO posts 
      (title, slug, excerpt, content, featuredImage, authorId, status, publishedAt, metaTitle, metaDescription, isCommentsEnabled, viewCount)
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *;
  `;
  const values = [title, slug, excerpt, content, featuredImage, authorId, status, publishedAt, metaTitle, metaDescription, isCommentsEnabled, viewCount];
  const { rows } = await client.query(query, values);
  return rows[0];
};

// Get a post by ID
const getPostById = async (id) => {
  const query = `SELECT * FROM posts WHERE id = $1;`;
  const { rows } = await client.query(query, [id]);
  return rows[0];
};

// Get a post by slug
const getPostBySlug = async (slug) => {
  const query = `SELECT * FROM posts WHERE slug = $1;`;
  const { rows } = await client.query(query, [slug]);
  return rows[0];
};

// Get all published posts with pagination
const getAllPublishedPosts = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const query = `
    SELECT * FROM posts 
    WHERE status = 'published'
    ORDER BY publishedAt DESC NULLS LAST
    LIMIT $1 OFFSET $2;
  `;
  const { rows } = await client.query(query, [limit, offset]);
  return rows;
};

// Get all posts regardless of status
const getAllPosts = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const query = `
    SELECT * FROM posts
    ORDER BY publishedAt DESC NULLS LAST, id DESC
    LIMIT $1 OFFSET $2;
  `;

  const { rows } = await client.query(query, [limit, offset]);
  return rows;
};


// Update a post by ID
const updatePost = async (id, data) => {
  const {
    title,
    slug,
    excerpt,
    content,
    featuredImage,
    status,
    publishedAt,
    metaTitle,
    metaDescription,
    isCommentsEnabled,
    viewCount,
  } = data;
  
  const query = `
    UPDATE posts
    SET title = $1,
        slug = $2,
        excerpt = $3,
        content = $4,
        featuredImage = $5,
        status = $6,
        publishedAt = $7,
        metaTitle = $8,
        metaDescription = $9,
        isCommentsEnabled = $10,
        viewCount = $11
    WHERE id = $12
    RETURNING *;
  `;
  const values = [title, slug, excerpt, content, featuredImage, status, publishedAt, metaTitle, metaDescription, isCommentsEnabled, viewCount, id];
  const { rows } = await client.query(query, values);
  return rows[0];
};

// Delete a post by ID
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
  getAllPosts,
  updatePost,
  deletePost,
};
