const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const ReviewSchema = new Schema({
  review: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  stayReview: { type: mongoose.Schema.Types.ObjectId, ref: "Stay" },
});

const ReviewModel = model("Review", ReviewSchema);

module.exports = ReviewModel;
