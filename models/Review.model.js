const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const ReviewSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userImage: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  review: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now },
});

const ReviewModel = model("Review", ReviewSchema);

module.exports = ReviewModel;
