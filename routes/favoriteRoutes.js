const express = require("express");

const {
  getFavorites,
  addFavorites,
  removeFavorite,
} = require("../controllers/favoriteController");

const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getFavorites);
router.post("/:productId", authMiddleware, addFavorites);
router.delete("/:productId", authMiddleware, removeFavorite);

module.exports = router;
