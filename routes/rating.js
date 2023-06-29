const express = require("express");

const router = express.Router();

const { addRatingLink, getRatingLink } = require("../controller/rating.js");

router.post("/add", addRatingLink);
router.get('/get/:agentId', getRatingLink)

module.exports = router;
