const mongoose = require("mongoose");

// Load environment variables
require('dotenv').config();

// MongoDB URI from environment variables
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://indrajapatil2204_db_user:ReserveDine22@cluster0.fcixtu1.mongodb.net/indrajasDineReserve22?retryWrites=true&w=majority&appName=Cluster0';

async function connectToMongo(){
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw err;
    }
}
module.exports = connectToMongo;