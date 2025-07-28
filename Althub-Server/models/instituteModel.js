const mongoose = require("mongoose");

const institute = new mongoose.Schema({
    name: {
        type: String,
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    website: {
        type: String
    },
    image: {
        type: String
    },
    active: {
        type: Boolean,
        default: false
    },
    token: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model("InstituteTB1", institute);
