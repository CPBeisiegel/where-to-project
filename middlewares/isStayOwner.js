const StayModel = require("../models/Stay.model");

module.exports = async (req, res, next) => {
  try {
    const loggedInUser = req.currentUser;

    const stay = await StayModel.findOne({ userId: loggedInUser._id });

    const userId = loggedInUser._id;
    const stayId = stay._id;
    console.log(typeof userId);

    if (!loggedInUser.role === "ADMIN") {
      return res
        .status(401)
        .json({ msg: "You do not have permission to this." });
    }

    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
