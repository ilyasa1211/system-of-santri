import mongoose from "mongoose";
const connectionString = process.env.MONGODB_CONNECTION_STRING;
mongoose.set("strictQuery", true);
mongoose.connect(connectionString, () => console.info("Successfully establishing a database connection."));
mongoose.connection.on("connecting", () => {
    console.info("Starts making initial connection to the MongoDB server");
});
mongoose.connection.on("connected", () => {
    console.info("Successfully makes initial connection to the MongoDB server");
});
mongoose.connection.on("reconnected", () => {
    console.info("Connectivity to MongoDB and successfully reconnected");
});
mongoose.connection.on("error", (err) => {
    console.error("Error occurs on a MongoDB connection");
    console.error(err);
});
export default mongoose;
