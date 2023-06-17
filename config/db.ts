import mongoose from "mongoose";

const uri: string = process.env.MONGODB_CONNECTION_STRING ||
  "mongodb://localhost:27017";

mongoose.set("strictQuery", true);
mongoose.connect(
  uri,
  () => console.info("Successfully establishing a database connection."),
);

export = mongoose;
