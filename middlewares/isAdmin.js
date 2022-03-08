module.exports = (req, res, next) => {
  if (req.currentUser.role === "ADMIN") {
    return next();
  } else {
    return res.status(401).json({ msg: "You do not have permission to this." });
    // Será que eu posso colocar um redirect para o login aqui
    // res.redirect("/login");
  }
};
