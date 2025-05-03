const mongoose = require("mongoose");

const message = new mongoose.Schema({
    conversationId: {
        type: String,
    },
    sender: {
        type: String,
    },
    text: {
        type: String,
    },
    time:{
        type: String,
        default: new Date(),
    }
});

module.exports = mongoose.model("messageTB", message);