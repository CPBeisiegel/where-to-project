const router = require("express").Router();
const bcrypt = require("bcryptjs");
const uploadCloud = require("../config/cloudinary.config");

const UserModel = require("../models/User.model");
const generateToken = require("../config/jwt.config");
const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

const salt_rounds = 10;

// Crud (CREATE) - HTTP POST
// Criar um novo usuário
router.post("/signup", async (req, res) => {
  // Requisições do tipo POST tem uma propriedade especial chamada body, que carrega a informação enviada pelo cliente
  console.log(req.body);

  try {
    // Recuperar a senha que está vindo do corpo da requisição
    const { password } = req.body;

    // Verifica se a senha não está em branco ou se a senha não é complexa o suficiente
    if (
      !password ||
      !password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
      )
    ) {
      // O código 400 significa Bad Request
      return res.status(400).json({
        msg: "Password is required and must have at least 8 characters, uppercase and lowercase letters, numbers and special characters.",
      });
    }

    // Gera o salt
    const salt = await bcrypt.genSalt(salt_rounds);

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, salt);

    // Salva os dados de usuário no banco de dados (MongoDB) usando o body da requisição como parâmetro
    const result = await UserModel.create({
      ...req.body,
      passwordHash: hashedPassword,
    });

    // Responder o usuário recém-criado no banco para o cliente (solicitante). O status 201 significa Created
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    // O status 500 signifca Internal Server Error
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

router.post("/pictures", uploadCloud.single("picture"), (req, res) => {
  if (!req.file) {
    return res.status(500).json({ message: "Upload falhou" });
  }

  return res.status(201).json({ url: req.file.path });
});

// Login
router.post("/login", async (req, res) => {
  try {
    // Extraindo o email e senha do corpo da requisição
    const { email, password } = req.body;

    // Pesquisar esse usuário no banco pelo email
    const user = await UserModel.findOne({ email });

    console.log(user);

    // Se o usuário não foi encontrado, significa que ele não é cadastrado
    if (!user) {
      return res
        .status(400)
        .json({ msg: "This email is not yet registered in our website;" });
    }

    // Verificar se a senha do usuário pesquisado bate com a senha recebida pelo formulário

    if (await bcrypt.compare(password, user.passwordHash)) {
      delete user._doc.passwordHash;
      // Gerando o JWT com os dados do usuário que acabou de logar
      const token = generateToken(user);

      return res.status(200).json({
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
          role: user.role,
        },
        token: token,
      });
    } else {
      // 401 Significa Unauthorized
      return res.status(401).json({ msg: "Wrong password or email" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

// cRud (READ) - HTTP GET
// Buscar dados do usuário
router.get("/profile/:id", isAuthenticated, attachCurrentUser, (req, res) => {
  console.log(req.headers);

  try {
    // Buscar o usuário logado que está disponível através do middleware attachCurrentUser
    const loggedInUser = req.currentUser;

    if (loggedInUser) {
      // Responder o cliente com os dados do usuário. O status 200 significa OK
      return res.status(200).json(loggedInUser);
    } else {
      return res.status(404).json({ msg: "User not found." });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});

router.patch(
  "/profile/update/:id",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      const loggedInUser = req.currentUser;

      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: loggedInUser._id },
        { ...req.body },
        { new: true, runValidators: true }
      );

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: JSON.stringify(error) });
    }
  }
);

/* Soft delete */

router.delete(
  "/disable-account",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    // o attachCurrentUser colocou o loggedInUser
    try {
      const loggedInUser = req.currentUser;

      await UserModel.findOneAndUpdate(
        {
          _id: loggedInUser._id,
        },
        {
          isDisable: true,
          disableAt: Date.now(),
        }
      );

      return res.status(200).json({ msg: "Deletado com sucesso!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: JSON.stringify(error) });
    }
  }
);

module.exports = router;
