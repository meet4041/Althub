const mongoose = require("mongoose");

const connectToMongo = async () => {
    try {
        await mongoose.connect("-----your database api-----");
        console.log("Connected To Althub !!!");
    } catch (error) {
        console.log("Error in connection : ", error);
    }
}

module.exports = connectToMongo;
