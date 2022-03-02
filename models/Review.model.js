const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const ReviewSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // colocando os reviews que a casa recebeu
  reviewStay: { type: mongoose.Schema.Types.ObjectId, ref: "Stay" },
  review: { type: String, required: true, trim: true },
  date: { type: Date, default: Date.now },
});

const ReviewModel = model("Review", ReviewSchema);

module.exports = ReviewModel;
