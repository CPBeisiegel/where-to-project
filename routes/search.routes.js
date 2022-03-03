const router = require("express").Router();

const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

const ReviewModel = require("../models/Review.model");
const StayModel = require("../models/Stay.model");
const UserModel = require("../models/User.model");

router.get("/search", (req, res) => {
  try {
    if (req.query.search) {
      const searchResult = StayModel.filter((currentSearch) => {
        for (let key in currentSearch) {
          const result = String(currentSearch[key])
            .toLowerCase()
            .includes(req.query.search.toLowerCase());
          if (result) {
            return result;
          }
        }
      });
      return res.status(200).json(searchResult);
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ msg: "Nao encontramos o que procura" });
  }
});

module.exports = router;
