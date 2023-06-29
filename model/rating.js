const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema(
  {
    agentId: { type: String, required: true },
    ratingLink: { type: String, required: true },
  },
  { timestamps: true }
);

var Ratings = mongoose.model("rating", ratingSchema);

module.exports = Ratings;
