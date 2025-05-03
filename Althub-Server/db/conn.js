const mongoose = require("mongoose");

const connectToMongo = async () => {
    try {
        await mongoose.connect("mongodb+srv://202412020:3VaxJWTs1VHhJe6X@cluster0.bxshd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Connected To Althub !!!");
    } catch (error) {
        console.log("Error in connection : ", error);
    }
}

module.exports = connectToMongo;