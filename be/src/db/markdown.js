import mongoose from "mongoose";

const dbMarkdown = mongoose.createConnection(
  "mongodb://localhost:27017/markdown"
);

dbMarkdown.on("connected", () => {
  console.log("Connected to MongoDB");
})

dbMarkdown.on("error", (error) => {
  console.log(error);
})

export default dbMarkdown;