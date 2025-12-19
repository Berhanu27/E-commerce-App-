// models/userModel.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} }
  },
  { minimize: false, timestamps: true } // ← adds createdAt & updatedAt
);

// This is the correct way (most used in 2025)
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;