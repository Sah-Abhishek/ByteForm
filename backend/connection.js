const mongoose = require('mongoose');
require('dotenv').config;

const connectMongoDB = async (mongodbUri) => {
    try{
        await mongoose.connect(mongodbUri);
        console.log("Connected to mongodb");

    }catch(error){
        console.log("There was some problem while connecting to mongodb: ", error);
    }
}

module.exports = connectMongoDB;