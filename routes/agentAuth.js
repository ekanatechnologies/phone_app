const express = require("express");

const router = express.Router();

const { signin, sendNotification } = require("../controller/agentAuth.js");

router.post("/signin", signin);

module.exports = router;
