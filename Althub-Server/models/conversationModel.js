const mongoose = require("mongoose");

const conversation = new mongoose.Schema({
    members: {
        type: Array,
    },
});

module.exports = mongoose.model("conversationTB", conversation);