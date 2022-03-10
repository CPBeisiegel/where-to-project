const router = require("express").Router();

const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

const ReviewModel = require("../models/Review.model");
const StayModel = require("../models/Stay.model");
const UserModel = require("../models/User.model");
const isOwner = require("../middlewares/isOwner");

//CREATE
router.post(
  "/:stayId/create-review",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      const loggedInUser = req.currentUser;

      const createReview = await ReviewModel.create({
        ...req.body,
        userId: loggedInUser._id,
        stayReview: req.params.stayId,
      });
      console.log("console", req.currentUser);
      return res.status(201).json(createReview);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

//READ
router.get(
  "/:stayId/reviews",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      const allReviews = await ReviewModel.find({
        stayReview: req.params.stayId,
      }).populate("userId", { passwordHash: 0 });
      console.log(allReviews);
      return res.status(201).json(allReviews);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

router.get(
  "/:reviewId",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      const review = await ReviewModel.findOne({ _id: req.params.reviewId });

      return res.status(200).json(review);
    } catch {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

//UPDATE
router.patch(
  "/:stayId/edit-review/:reviewId",
  isAuthenticated,
  attachCurrentUser,
  isOwner,
  async (req, res) => {
    try {
      const editReview = await ReviewModel.findOneAndUpdate(
        { _id: req.params.reviewId },
        { ...req.body },
        { new: true, runValidators: true }
      );
      return res.status(201).json(editReview);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

//DELETE
router.delete(
  "/:stayId/delete-review/:reviewId",
  isAuthenticated,
  attachCurrentUser,
  isOwner,
  async (req, res) => {
    try {
      const deletedReview = await ReviewModel.deleteOne({
        _id: req.params.reviewId,
      });
      console.log(deletedReview);
      return res.status(200).json({ msg: "Review deleted" });
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  }
);

module.exports = router;
