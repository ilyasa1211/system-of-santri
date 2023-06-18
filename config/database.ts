import mongoose from "mongoose";

const connectionString: string = process.env.MONGODB_CONNECTION_STRING ||
  "mongodb://localhost:27017";

mongoose.set("strictQuery", true);

mongoose.connect(
  connectionString,
  () => console.info("Successfully establishing a database connection."),
);

export = mongoose;
