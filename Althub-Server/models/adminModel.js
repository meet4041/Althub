const mongoose = require("mongoose");

const admin = new mongoose.Schema({
    name:
    {
        type: String,
    },
    phone: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    profilepic: {
        type: String,
    },
    token: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model("adminTB", admin);