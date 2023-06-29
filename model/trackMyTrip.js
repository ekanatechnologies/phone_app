const mongoose = require("mongoose");

const TrackMyTripSchema = new mongoose.Schema(
  {
    agentId: { type: String, required: true },
    start_latLong: String,
    end_latLong: String,
    start_address: String,
    end_address: String,
    total_miles: String,
    fuel_cost: String,
    total_cost: String,
    trip_purpose: String,
    brief_description: String,
  },
  { timestamps: true }
);

const TrackmyTrip = mongoose.model("TrackmyTrip", TrackMyTripSchema);
module.exports = TrackmyTrip;
