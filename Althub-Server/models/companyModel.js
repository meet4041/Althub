const mongoose = require("mongoose");

const company = new mongoose.Schema({
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
    website: {
        type: String
    },
    image: {
        type: String
    }
});

module.exports = mongoose.model("CompanyTB", company);