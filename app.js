const express = require('express');
const {json} = require("body-parser");
const authMiddleware = require("./src/middlewares/auth.middleware");
const app = express();
const mongoose = require('mongoose');
require("dotenv").config();

// database connection
if (!process.env.MONGO_URL) {
    console.error("MONGO_URL is required");
    process.exit(1);
}

const connectToDatabase = async () => {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected successfully");
    } catch (e) {
        console.error(e);
    }
}

connectToDatabase();

if (!process.env.API_KEY) {
    console.error("API_KEY is required");
    process.exit(1);
}

app.use(json())

// Serve static files from the public directory
app.use(express.static('public'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Access-Token');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Max-Age', 3600);
    res.setHeader('Access-Control-Expose-Headers', 'X-Access-Token');

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
})

app.use(authMiddleware);

app.use("/users", require("./src/routes/users.routes"))
app.use("/projects", require("./src/routes/projects.routes"))
app.use("/auth", require("./src/routes/auth.routes"))
app.use("/tasks", require("./src/routes/tasks.routes"))
app.use("/tags", require("./src/routes/tags.routes"))

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({message: err.message || "Something went wrong"})
})

app.use((req, res, next) => {
    res.status(404).send({message: "Requesteted page not found!"});
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
});
