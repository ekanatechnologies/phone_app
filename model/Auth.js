const mongoose = require("mongoose");

const auth_schema = new mongoose.Schema(
    {
        agentId: { type: String, required: true },
        token: String,
        expiration_date: String,
        device_id: { type: String, default: null }

    },
    { timestamps: true }
);

const User = mongoose.model("auth", auth_schema);
module.exports = User;
