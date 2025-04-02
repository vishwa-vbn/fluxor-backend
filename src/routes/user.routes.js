const express = require("express");
const { createUserHandler, createAdminHandler, getUserByIdHandler, loginUserHandler } = require("../controllers/user.controller");

const router = express.Router();

router.post("/register", createUserHandler);
router.post("/register/admin", createAdminHandler);
router.post("/login", loginUserHandler);
router.get("/:id", getUserByIdHandler);

module.exports = router;
