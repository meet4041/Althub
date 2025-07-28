const mongoose = require("mongoose");

const financialaid = new mongoose.Schema({
    institutename: {
        type: String,
    },
    name: {
        type: String,
    },
    image: {
        type: String,
    },
    aid: {
        type: String,
    },
    claimed: {
        type: String,
    },
    description: {
        type: String,
    },
    dueDate: {
        type: Date
    }
});

module.exports = mongoose.model("FinancialAidTB", financialaid);