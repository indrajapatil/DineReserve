const mongoose = require("mongoose");

const mongoURI = 'mongodb://localhost:27017/resto_backend';
async function connectToMongo(){
    await mongoose
        .connect(mongoURI)
        .then(() => console.log("Connected to MongoDB successfully"))
        .catch((err) => console.log(err));
}
module.exports = connectToMongo;