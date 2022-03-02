const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const StaySchema = new Schema({
  stayTitle: { type: String, required: true, trim: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  stayType: {
    type: String,
    enum: ["House", "Apartament", "Motorhome"],
    required: true,
  },
  perNight: { type: Number },
  description: { type: String, maxLength: 500 },
  stayDetails: new Schema({
    guests: { type: Number },
    bedroom: { type: Number },
    bathroom: { type: Number },
  }),
  amenities: [{ type: String, maxLength: 64 }],
  stayImage: { type: String },
});

const StayModel = model("Stay", StaySchema);

module.exports = StayModel;
