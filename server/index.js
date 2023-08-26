const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");

dotenv.config();

const app = express();

// Demonstrate the readyState and on event emitters
console.log(mongoose.connection.readyState); //logs 0
mongoose.connection.on('connecting', () => {
    console.log('connecting')
    console.log(mongoose.connection.readyState); //logs 2
});
mongoose.connection.on('connected', () => {
    console.log('connected');
    console.log(mongoose.connection.readyState); //logs 1
});
mongoose.connection.on('disconnecting', () => {
    console.log('disconnecting');
    console.log(mongoose.connection.readyState); // logs 3
});
mongoose.connection.on('disconnected', () => {
    console.log('disconnected');
    console.log(mongoose.connection.readyState); //logs 0
});
// Connect to a MongoDB server running on 'localhost:27017' and use the
// 'test' database.
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true // Boilerplate for Mongoose 5.x
});

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to homepage");
});



app.listen(8800, () => {
    console.log("Backend server is running!");
    console.log("On port 8800");
});
