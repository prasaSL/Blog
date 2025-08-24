const express = require("express");
const router = express.Router();
const Authorization = require("../middleware/authMiddleware");
const UserController = require("../controllers/User.Controller");

router.post("/signup", UserController.signUp);
router.post("/login", UserController.login);
router.post("/admin/login", UserController.adminLogin);


module.exports = router;