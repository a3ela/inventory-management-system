const express = require("express");
const router = express.Router();
const { createUser, getUsers } = require("../controllers/user.controller");
const userValidator = require("../middleware/validators/userValidator");
const validate = require("../middleware/validate.middleware");

router.post("/", userValidator, validate, createUser);
router.get("/", getUsers);

module.exports = router;
