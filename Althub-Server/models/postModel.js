const mongoose = require("mongoose");

const post = new mongoose.Schema({
    userid: {
        type: String,
        // required: true
    },
    fname: {
        type: String,
    },
    lname: {
        type: String,
    },
    companyname: {
        type: String,
    },
    profilepic: {
        type: String,
    },
    description: {
        type: String,
    },
    date: {
        type: String,
        default: new Date(),
    },
    photos: {
        type: Array
    },
    likes: {
        type: Array,
        default: []
    },
});


module.exports = mongoose.model("PostTB", post);