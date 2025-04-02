-- migrations/create_tables.sql

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  bio TEXT,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  isActive BOOLEAN NOT NULL DEFAULT TRUE
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featuredImage TEXT,
  authorId INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  publishedAt TEXT,
  metaTitle TEXT,
  metaDescription TEXT,
  isCommentsEnabled BOOLEAN NOT NULL DEFAULT TRUE,
  viewCount INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT fk_author
    FOREIGN KEY(authorId) 
      REFERENCES users(id)
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  featuredImage TEXT,
  parentId INTEGER,
  CONSTRAINT fk_parent
    FOREIGN KEY(parentId) 
      REFERENCES categories(id)
);

-- Post-Categories junction table
CREATE TABLE IF NOT EXISTS post_categories (
  postId INTEGER NOT NULL,
  categoryId INTEGER NOT NULL,
  PRIMARY KEY (postId, categoryId),
  CONSTRAINT fk_post
    FOREIGN KEY(postId) 
      REFERENCES posts(id),
  CONSTRAINT fk_category
    FOREIGN KEY(categoryId) 
      REFERENCES categories(id)
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT
);

-- Post-Tags junction table
CREATE TABLE IF NOT EXISTS post_tags (
  postId INTEGER NOT NULL,
  tagId INTEGER NOT NULL,
  PRIMARY KEY (postId, tagId),
  CONSTRAINT fk_post
    FOREIGN KEY(postId) 
      REFERENCES posts(id),
  CONSTRAINT fk_tag
    FOREIGN KEY(tagId)
      REFERENCES tags(id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  postId INTEGER NOT NULL,
  authorId INTEGER,
  authorName TEXT,
  authorEmail TEXT,
  parentId INTEGER,
  status TEXT NOT NULL DEFAULT 'pending',
  createdAt TEXT NOT NULL,
  CONSTRAINT fk_post
    FOREIGN KEY(postId)
      REFERENCES posts(id)
);

-- Ad Units table
CREATE TABLE IF NOT EXISTS ad_units (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  placement TEXT NOT NULL,
  isActive BOOLEAN NOT NULL DEFAULT TRUE
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  "group" TEXT NOT NULL DEFAULT 'general'
);
