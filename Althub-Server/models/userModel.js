const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const user = new mongoose.Schema({
    fname:
    {
        type: String,
    },
    lname: {
        type: String,
    },
    gender: {
        type: String,
    },
    dob: {
        type: Date,
    },
    city: { type: String },
    state: { type: String },
    nation: { type: String },
    profilepic: {
        type: String,
        default: ""
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
    languages: {
        type: String,
    },
    github: {
        type: String,
    },
    linkedin: {
        type: String,
    },
    portfolioweb: {
        type: String,
    },
    skills: {
        type: String,
    },
    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
    role: {
        type: String,
        default: "student"
    },
    about: {
        type: String,
        default: ''
    },
    institute: {
        type: String
    },
    token: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model("usersTB1", user);