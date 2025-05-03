const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const experience = new mongoose.Schema({
    userid: { type: String },
    companyname: { type: String },
    position: { type: String },
    joindate: { type: String },
    enddate: { type: String },
    companylogo: { type: String },
    description: { type: String }
});

module.exports = mongoose.model("experienceTB", experience);