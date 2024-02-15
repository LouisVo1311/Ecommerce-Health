const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
require("dotenv").config()

async function connect() {
    try {
        await mongoose.connect(`mongodb+srv://LouisVo:${process.env.MONGO_DB}@cluster0.mcveeie.mongodb.net/?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connect successfully')
    } catch (error) {
        console.log('Connect Failure')
    }
}

module.exports = { connect };
