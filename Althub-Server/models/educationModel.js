const mongoose = require("mongoose");

const education = new mongoose.Schema({
    userid: {
        type: String
    },
    institutename: {
        type: String
    },
    course: {
        type: String
    },
    joindate: {
        type: String
    },
    enddate: {
        type: String
    },
    collagelogo: {
        type: String
    }
});

module.exports = mongoose.model("educationTB", education);