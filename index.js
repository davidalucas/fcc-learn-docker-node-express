const express = require("express")
const mongoose = require("mongoose")
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config")
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");
const redis = require('redis');
const session = require('express-session');

let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
});


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

connectWithRetry();

app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 3000000
    }
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h2>Hi there!</h2>");
})

// localhost:3000/api/v1/posts
app.use("/api/v1/posts", postRouter);

app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})