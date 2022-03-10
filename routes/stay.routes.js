const router = require("express").Router();
const uploadCloud = require("../config/cloudinary.config");
const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

const StayModel = require("../models/Stay.model");
const UserModel = require("../models/User.model");
const ReviewModel = require("../models/Review.model");
const isStayOwner = require("../middlewares/isStayOwner");

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

      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: loggedInUser._id },
        { $push: { stays: createStay._id } }
      );

      return res.status(201).json(createStay);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: JSON.stringify(error) });
    }
  }
);

router.get("/list-stays", async (req, res) => {
  try {
    const stays = await StayModel.find().populate("user");

    return res.status(200).json(stays);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.post("/pictures", uploadCloud.single("picture"), (req, res) => {
  console.log(req.file);
  if (!req.file) {
    return res.status(500).json({ message: "Upload falhou" });
  }

  return res.status(201).json({ url: req.file.path });
});
/* Esta com problemas */
router.get(
  "/user-stay/:id",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      const userStays = await StayModel.find({ _id: req.params.id }).populate(
        "userId"
      );

      return res.status(200).json(userStays);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);
/* Esta com problemas */
router.get("/myStays", isAuthenticated, attachCurrentUser, async (req, res) => {
  try {
    const loggedInUser = req.currentUser;

    const myStays = await StayModel.find({ userId: loggedInUser._id });
    return res.status(200).json(myStays);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

router.patch(
  "/user-stay/update/:id",
  isAuthenticated,
  attachCurrentUser,
  isStayOwner,
  async (req, res) => {
    try {
      const stayUpdated = await StayModel.findOneAndUpdate(
        { _id: req.params.id },
        { ...req.body },
        { new: true, runValidators: true }
      );

      if (!stayUpdated) {
        return res.status(404).json({ msg: "Stay not found" });
      }

      return res.status(200).json(stayUpdated);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

router.delete(
  "/user-stay/delete/:id",
  isAuthenticated,
  attachCurrentUser,
  isStayOwner,
  async (req, res) => {
    try {
      const removedStay = await StayModel.deleteOne({ _id: req.params.id });

      const updatedUser = await UserModel.findAndUpdate(
        { _id: loggedInUser._id },
        { $pull: { stays: req.params.id } }
      );

      return res.status(200).json(removedStay);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
);

module.exports = router;
