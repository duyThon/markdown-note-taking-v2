import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;
const FE_PORT = process.env.FE_PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log(error);
    });

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log("Server is running on port", process.env.PORT);
});