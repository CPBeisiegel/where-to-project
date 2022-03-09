const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");

const UserSchema = new Schema({
  userName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
  },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ["ADMIN", "USER"],
    required: true,
    default: "USER",
  },
  userPhone: { type: Number },
  userImage: { type: String },
  stays: [{ type: Types.ObjectId, ref: "Stay" }],
  isDisable: { type: Boolean, required: true, default: false },
  disableAt: { type: Date },
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
