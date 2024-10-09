import express from "express";
import { MongoClient } from "mongodb";
import { promises as fs } from "fs";  // Using promises for fs

const port = 500;
const app = express();
let mongoURL;

// Function to read config.json and connect to MongoDB
async function startServer() {
    try {
        // Read the config file asynchronously
        const data = await fs.readFile("config.json", "utf-8");
        const dataFetched = JSON.parse(data);
        mongoURL = dataFetched.mongourl;
        console.log("MongoDB URI:", mongoURL);

        // Ensure the mongoURL is defined
        if (!mongoURL) {
            throw new Error("MongoDB URI is not defined in config.json");
        }

        // Connect to MongoDB without deprecated options
        const client = new MongoClient(mongoURL);

        await client.connect();
        console.log("MongoDB Connected");

        const database = client.db("AndroidBackend");
        const cluster = database.collection("NodeData");

        const docs = await cluster.find({}).toArray();
        console.log("Documents found:", docs);

        // Close the connection after fetching data
        await client.close();
    } catch (error) {
        console.error("Error:", error);
    }
}

// Start the process
startServer();

app.get("/", (req, res) => {
    res.send("Hello User");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
