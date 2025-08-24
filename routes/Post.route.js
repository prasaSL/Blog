const express = require("express");
const router = express.Router();
const Authorization = require("../middleware/authMiddleware");
const PostController = require("../controllers/Post.Controller");

router.post("/create", Authorization(["admin"]), PostController.createPost);
router.get("/all-list",Authorization(["admin"]), PostController.getAllPosts);
router.put("/:id", Authorization(["admin"]), PostController.updatePost);
router.delete("/:id", Authorization(["admin"]), PostController.deletePost);


router.get("/:id", Authorization(["admin", "user"]), PostController.getPost);
router.get("/posts", Authorization(["admin", "user"]), PostController.getUserPosts);


module.exports = router;