const express = require('express');
const userRoutes = require('./user.routes');
const postRoutes = require('./post.routes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/posts', postRoutes);

module.exports = router;