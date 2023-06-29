const express = require("express");
const router = express.Router();
const data = require("../zipcode_us.json");

router.get("/:initialDigit", (req, res) => {
  const initialDigit = req.params.initialDigit;
  const zip = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i].zip_code.toString().startsWith(initialDigit)) {
      zip.push(data[i]);
    }
  }
  res.send(zip);
});

module.exports = router;
