const express = require('express');
const postController = require('../controllers/postController');
const protect = require("./middleware/authMiddleware");

const router = express.Router();

// baseurl/
router.route("/")
    .get(protect, postController.getAllPosts)
    .post(protect, postController.createPost);

// baseurl/uniquepostid1/
router.route("/:id")
    .get(protect, postController.getOnePost)
    .patch(protect, postController.updatePost)
    .delete(protect, postController.deletePost);

module.exports = router;