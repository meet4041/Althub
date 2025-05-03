const mongoose = require("mongoose");

const feedback = new mongoose.Schema({
    userid: {
        type: String,
    },
    message: {
        type: String,
    },
    rate: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("FeedbackTB", feedback);