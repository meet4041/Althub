const mongoose = require("mongoose");

const event = new mongoose.Schema({
    organizerid: {
        type: String
    },
    title: {
        type: String,
        // required: true
    },
    description: {
        type: String,
    },
    date: {
        type: String,
        default: new Date()
    },
    venue: {
        type: String,
    },
    photos: {
        type: Array
    },
    participants: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model("EventTB", event);