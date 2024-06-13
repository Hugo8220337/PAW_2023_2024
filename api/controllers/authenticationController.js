const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
var path = require('path');
const { imageNameGenerator } = require('../utils/imageNameGenerator');

const config = require("../jwt_secret/config");
var User = require("../models/user");
var Entity = require("../models/entity")

const emailUtil = require('../utils/mail');


const saltRounds = 10; // numero de iterações usadas para calcular o hash para a encriptação da senha

// todas as funções em baixo vão ser métdodos do objeto authenticationController
const authenticationController = {};

authenticationController.loginAdminArea = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email, isDeleted: false });

    if (!user) {
      // throw new Error("Utilizador não encontrado");
      res.status(400).send("Utilizador não encontrado");
      return;
    }

    var passwordIsValid = bcrypt.compareSync(password, user.password); // verifica se a password é válida

    if (!passwordIsValid) {
      // throw new Error("Password inválida.");
      res.status(400).send("Password inválida.");
      return;
    }

    // só administradores e funcionários podem aceder à área de administração
    if (user.role !== 'admin' && user.role !== 'employee') {
      res.status(401).send("Unauthorized");
      return;
    }

    var token = jwt.sign({ id: user._id, role: user.role }, config.secret, {
      expiresIn: 86400, // 24 horas
    });

    res.send({ "auth": true, "token": token, "userId": user._id, "userType": user.role });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

authenticationController.loginDonor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email, isDeleted: false });

    if (!user) {
      // throw new Error("Utilizador não encontrado");
      res.status(400).send("Utilizador não encontrado");
      return;
    }


    var passwordIsValid = bcrypt.compareSync(password, user.password); // verifica se a password é válida

    if (!passwordIsValid) {
      // throw new Error("Password inválida.");
      res.status(400).send("Password inválida.");
      return;
    }

    // só doadores podem entrar
    if (user.role !== 'donor') {
      res.status(401).send("Unauthorized");
      return;
    }

    var token = jwt.sign({ id: user._id, role: user.role }, config.secret, {
      expiresIn: 86400, // 24 horas
    });

    res.send({ "auth": true, "token": token, "userId": user._id, "userType": user.role });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

authenticationController.loginEntity = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Entity.findOne({ 'contact.email': email, isDeleted: false });

    if (!user) {
      res.status(400).send("Entidade não encontrado");
      return;
    }


    var passwordIsValid = bcrypt.compareSync(password, user.password); // verifica se a password é válida

    if (!passwordIsValid) {
      res.status(400).send("Password inválida.");
      return;
    }

    var token = jwt.sign({ id: user._id, role: "entity" }, config.secret, {
      expiresIn: 86400, // 24 horas
    });

    res.send({ "auth": true, "token": token, "userId": user._id, "userType": "entity" });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

authenticationController.verifyAdminToken = (req, res, next) => {
  var token = req.headers["x-access-token"];

  if (!token) {
    return res
      .status(403)
      .send({ auth: false, message: "Não foi provido nenhum token" });
  }

  // verifies secret and checks exp
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err)
      return res
        .status(403)
        .send({ auth: false, message: "Falha ao autenticar o token." });

    // verificar se é um administrador a fazer o pedido
    if (decoded.role == "admin") {

      // verificaar se o utilizador existe na base de dados
      User.findOne({ _id: decoded.id, role: "admin", isDeleted: false })
        .then(user => {

          if (!user) {
            return res.status(401).send({ auth: false, message: "Não tem permissão para entrar" });
          }

          // guarda para solicitar em outras rotas se não houverem erros
          req.userId = decoded.id;
          req.role = decoded.role;

          return next();
        })
        .catch(err => {
          console.error(err);
          return res.status(500).send({ auth: false, message: "Erro interno do servidor." });
        });
    } else {
      return res.status(401).send({ auth: false, message: "Não tem permissão para entrar" });
    }
  });
}

// TODO a dar um erro estranho no terminal, mas funciona
authenticationController.verifyToken = (req, res, next) => {
  var token = req.headers["x-access-token"];

  if (!token) {
    return res
      .status(403)
      .send({ auth: false, message: "Não foi provido nenhum token" });
  }

  // verificar se o token está bem preenchido
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err)
      return res
        .status(403)
        .send({ auth: false, message: "Falha ao autenticar." });


    if (decoded.role === "entity") {
      // Verificar se a entidade existe na base de dados
      Entity.findOne({ _id: decoded.id, isDeleted: false })
        .then(user => {

          if (!user) {
            return res.status(401).send({ auth: false, message: "Não tem permissão para entrar" });
          }

          // guarda para solicitar em outras rotas se não houverem erros
          req.userId = decoded.id;
          req.role = decoded.role;

          return next();
        })
        .catch(err => {
          console.error(err);
          return res.status(500).send({ auth: false, message: "Erro interno do servidor." });
        });

    } else {
      // verificar se o utilizador existe na base de dados
      User.findOne({ _id: decoded.id, isDeleted: false })
        .then(user => {

          if (!user) {
            return res.status(401).send({ auth: false, message: "Não tem permissão para entrar" });
          }

          // guarda para solicitar em outras rotas se não houverem erros
          req.userId = decoded.id;
          req.role = decoded.role;

          return next();
        })
        .catch(err => {
          console.error(err);
          return res.status(500).send({ auth: false, message: "Erro interno do servidor." });
        });
    }
  });
};


authenticationController.registerEntity = async (req, res) => {
  

  const { name, contact, country, description, password, aditionalInfo } = req.body;

  if (!contact || !contact.email) {
    return res.status(400).send("O campo 'contact.email' é obrigatório.");
  }

  try {
    const passwordEncript = await bcrypt.hash(password, saltRounds);

      const newEntity = await Entity.create({
          name: name,
          contact: {
              email: contact.email,
              phoneNumber: contact.phoneNumber,
              address: contact.address
          },
          country: country,
          description: description,
          password: passwordEncript,
          aditionalInfo: aditionalInfo
      });

    res.status(201).send(newEntity);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ocorreu um erro ao registar a entidade \n" + err);
  }
}


authenticationController.registerDonor = async (req, res) => {
  console.log(req.body)

  const { name, email, password, phoneNumber, address, country, dateOfBirthday } = req.body;
  const dateOfBirthdayV = new Date(dateOfBirthday);

  try {
    let profileImage;

    if (req.files && req.files.profileImage) {
      const uploadedFile = req.files.profileImage;
      const fileExtension = path.extname(uploadedFile.name);
      const profileImageName = imageNameGenerator(fileExtension); // Gera um nome de imagem de perfil único

      // Guarda o ficheiro enviado na pasta uploads
      uploadedFile.mv(`./images/uploads/${profileImageName}`);
      profileImage = profileImageName;
    }

    const passwordEncript = await bcrypt.hash(password, saltRounds);

    const newDonnor = await User.create({
      name: name,
      email: email,
      password: passwordEncript,
      role: 'donor',
      phoneNumber: phoneNumber,
      address: address,
      country: country,
      profileImage: profileImage,
      dateOfBirthday: dateOfBirthdayV
    });

    res.status(201).send(newDonnor);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ocorreu um erro ao registar o doador. " + err);
  }
}

authenticationController.forgotPassword = async (req, res) => {
  const { host, email, userType } = req.body;
  var user;

  try {
    // encontra o utilizador ou entidade pelo email
    switch (userType) {
      case 'donor':
        user = await User.findOne({ email: email, isDeleted: false });
        break;
      case 'entity':
        user = await Entity.findOne({ 'contact.email': email, isDeleted: false });
        break;
    }

    if (!user) {
      return res.status(404).send('Utilizador não encontrado');
    }

    // gerar token
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save(); // guardar token e data de expiração no user

    // Mandar email com o link com o token
    let to = email;
    let subject = "Password Reset";
    let html = `<p>Está a receber isto porque você (ou outra pessoa) solicitou a redefinição da senha da sua conta.</p></br>` +
      `<p>Por favor, clique no link a seguir ou cole-o no seu navegador para concluir o processo:</p></br><br>` +
      `${host}/auth/passwordRecovery/${userType}/${token}\n\n` +
      `<p>Se não solicitou isso, ignore este e-mail e sua senha permanecerá inalterada.</p><br>`;

    await sendMail(to, subject, html);

    res.status(200).send({message: "Token enviado"});
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro no pedido de reposição de password");
  }
};

authenticationController.resetPassword = async (req, res) => {
  const { password, userType } = req.body;
  var user = null;

  try {

    // encontra o utilizador ou entidade pelo reset token passado como parametro
    switch (userType) {
      case 'donor':
        user = await User.findOne({
          resetPasswordToken: req.params.token,
          resetPasswordExpires: { $gt: Date.now() },
          isDeleted: false
        });
        break;
      case 'entity':
        user = await Entity.findOne({
          resetPasswordToken: req.params.token,
          resetPasswordExpires: { $gt: Date.now() },
          isDeleted: false
        });
        break;
    }


    if (!user) {
      return res.status(400).send('Token de reset é inválido, ou expirou');
    }

    // validar e atualizar password
    user.password = await bcrypt.hash(password, saltRounds);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).send({message: "Password redefinida com sucesso"});
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao fazer reset da password");
  }
};

async function sendMail(to, subject, html) {
  return emailUtil.sendMail(to, subject, html)
}

module.exports = authenticationController;
