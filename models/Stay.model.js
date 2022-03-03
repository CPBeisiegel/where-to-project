const mongoose = require("mongoose");
const { Schema, model, Types } = require("mongoose");

const StaySchema = new Schema({
  /* stayId: {type: String}, */
  stayTitle: { type: String, required: true, trim: true },
  stayCountry: { type: String, required: true, trim: true },
  stayCity: { type: String, required: true, trim: true },
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
  userId: { type: Types.ObjectId, ref: "User" },
});

const StayModel = model("Stay", StaySchema);

module.exports = StayModel;
