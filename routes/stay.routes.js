const router = require("express").Router();

const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

const StayModel = require("../models/Stay.model");
const UserModel = require("../models/User.model");
const ReviewModel = require("../models/Review.model");

router.post(
  "/create-stay",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      const loggedInUser = req.currentUser;

      const createStay = await StayModel.create({
        ...req.body,
        userId: loggedInUser._id,
      });

      await UserModel.findOneAndUpdate(
        {
          _id: loggedInUser._id,
        },
        {
          $push: { stays: createStay._id },
        },
        { new: true, runValidators: true }
      );

      return res.status(201).json(createStay);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: JSON.stringify(error) });
    }
  }
);

module.exports = router;
