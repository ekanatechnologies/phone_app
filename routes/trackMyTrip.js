const express = require("express");

const router = express.Router();

const {
  getTripCost,
  saveTripData,
  getAll,
} = require("../controller/trackMyTrip.js");

router.post("/get-value", getTripCost);
// router.post("/save", saveTripData);
// router.get("/get-all/:adminId", getAll);

module.exports = router;
