const express = require("express");
const { getBestSellers } = require("../controllers/bestSellerController");
const router = express.Router();

router.get("/", getBestSellers);

module.exports = router;
