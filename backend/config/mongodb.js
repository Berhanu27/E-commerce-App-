import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);   // ← THIS USES "ecommerce" FROM .env

    console.log("DB Connected Successfully");

    // NUCLEAR CLEANUP — removes any old broken cached model
    delete mongoose.connection.models["product"];
    delete mongoose.connection.models["Product"];
    delete mongoose.models["product"];
    delete mongoose.models["Product"];
    mongoose.models = {};
    mongoose.modelSchemas = {};

  } catch (error) {
    console.error("DB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;