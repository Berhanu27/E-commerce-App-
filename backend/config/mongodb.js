import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Prevent multiple connections in serverless environment
    if (mongoose.connections[0].readyState) {
      console.log('Already connected to MongoDB');
      return;
    }

    await mongoose.connect(process.env.MONGO_URL, {
      bufferCommands: false, // Disable mongoose buffering for serverless
    });

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
    // Don't exit process in serverless environment
    throw error;
  }
};

export default connectDB;