const ReviewModel = require("../models/Review.model");

module.exports = async (req, res, next) => {
  try {
    const loggedInUser = req.currentUser;

    const review = await ReviewModel.findOne({ _id: req.params.reviewId });

    const userId = loggedInUser._id;
    const ownerId = review.userId;
    console.log(typeof userId);
    console.log(typeof ownerId);

    if (String(userId) !== String(ownerId)) {
      return res
        .status(401)
        .json({ msg: "You do not have access to this review." });
    }

    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
