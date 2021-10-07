const express = require("express")
const mongoose = require("mongoose")
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require("./config/config")

const app = express()
const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}?authSource=admin`;

const connectWithRetry = () => {
    mongoose.connect(mongoUrl)
        .then(() => console.log("successfully connected to MongoDB"))
        .catch((e) => {
            console.log(e)
            setTimeout(connectWithRetry, 5000) //this is just going to loop forever until it connects to mongo
        })
}

connectWithRetry()

app.get("/", (req, res) => {
    res.send("<h2>Hi there!</h2>");
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})