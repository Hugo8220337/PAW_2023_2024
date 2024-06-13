const fs = require("fs");
const bcrypt = require("bcrypt");
const saltRounds = 10; // numero de iterações usadas para calcular o hash para a encriptação da senha
const { imageNameGenerator } = require("../utils/imageNameGenerator");
var path = require("path");

var User = require("../models/user");

// todas as funções em baixo vão ser métdodos do objeto administratorController
const administratorController = {};

administratorController.list = async (req, res) => {
  try {
    const administrators = await User.find({ role: "admin", isDeleted: false });

    // Convert Mongoose documents to plain JavaScript objects
    const administratorsArray = administrators.map((admin) => admin.toObject());

    console.log(administratorsArray);
    res.send(administratorsArray);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error. " + error);
  }
};

administratorController.registerPost = async (req, res) => {
  console.log(req.body);

  const {
    name,
    email,
    password,
    phoneNumber,
    address,
    country,
    dateOfBirthday,
  } = req.body;
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

    const newAdmin = await User.create({
      name: name,
      email: email,
      password: passwordEncript,
      role: "admin",
      phoneNumber: phoneNumber,
      address: address,
      country: country,
      profileImage: profileImage,
      dateOfBirthday: dateOfBirthdayV,
    });

    res.status(201).send(newAdmin);
  } catch (err) {
    console.error(err);
    res.status(500).send("Ocorreu um erro ao registar o administrador");
  }
};

administratorController.remove = async (req, res) => {
  try {
    const adminId = req.params.id;
    const admin = await User.findOne({ _id: adminId });

    if (!admin) {
      return res.status(404).send("Administrador não encontrado.");
    }

    // Verifica se a imagem do perfil existe e elimina-a
    if (fs.existsSync(`./images/uploads/${admin.profileImage}`)) {
      fs.unlinkSync(`./images/uploads/${admin.profileImage}`);
    }

    // Pseudonimizar dados sensíveis
    admin.name = "Utilizador Removido";
    admin.email = `${admin._id}@deleted.com`;
    admin.phoneNumber = null;
    admin.address = null;
    admin.isDeleted = true;
    admin.profileImage = null;

    // guardar os dados pseudonimizados
    await admin.save();

    res.status(200).json(admin);
  } catch (err) {
    console.error("Erro ao remover o administrador:" + err);
    res.status(500).send("Ocorreu um erro ao remover o administrador! " + err);
  }
};

administratorController.getAdminById = async (req, res) => {
  try {
    const adminId = req.params.id;
    const admin = await User.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: "Administrador não encontrado" });
    }

    // Se o administrador for encontrado, envie-o como resposta
    res.status(200).json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

administratorController.editAdmin = async (req, res) => {
  const adminId = req.params.id;
  const { name, email, phoneNumber, address, country, dateOfBirthday } =
    req.body;

  try {
    const existingAdmin = await User.findOne({ role: "admin", _id: adminId });

    // Verifica se o administrador existe
    if (!existingAdmin) {
      return res.status(404).json({ message: "Entidade não encontrada" });
    }

    let profileImage = existingAdmin.profileImage;
    if (req.files && req.files.profileImage) {
      // Verifica se a imagem do perfil existe e elimina-a
      if (fs.existsSync(`./images/uploads/${existingAdmin.profileImage}`)) {
        fs.unlinkSync(`./images/uploads/${existingAdmin.profileImage}`);
      }

      const uploadedFile = req.files.profileImage;
      const fileExtension = path.extname(uploadedFile.name);
      const profileImageName = imageNameGenerator(fileExtension); // Gera um nome de imagem de perfil único

      // Guarda o atualiza enviado na pasta uploads
      uploadedFile.mv(`./images/uploads/${profileImageName}`);
      profileImage = profileImageName;
    }

    // Atualizar os campos existentes
    existingAdmin.name = name;
    existingAdmin.email = email;
    existingAdmin.phoneNumber = phoneNumber;
    existingAdmin.address = address;
    existingAdmin.country = country;
    existingAdmin.dateOfBirthday = dateOfBirthday;
    existingAdmin.profileImage = profileImage;

    // guardar os dados alterados
    await existingAdmin.save();

    res.status(200).json(existingAdmin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!\n" + error });
  }
};

/**
 * Função para alterar a senha de uma entidade
 *
 * @param {*} req
 * @param {*} res
 * @returns 404 se não encontrou a entidade, 400 se a senha antiga está incorreta,
 *          200 se mudança efetuada com sucesso, ou 500 se ocorreu um erro no servidor
 */
administratorController.changePassword = async (req, res) => {
  const adminId = req.params.id;
  const { oldPassword, newPassword } = req.body;

  try {
    // Encontrar o utilizador pelo ID
    const user = await User.findOne({ role: "admin", _id: adminId });

    if (!user) {
      return res.status(404).json({ message: "Administrador não encontrado" });
    }

    // Verificar se a password antiga corresponde à password armazenada
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "A senha antiga está incorreta" });
    }

    // Criptografar a nova password
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Atualizar a password do utilizador
    user.password = newPasswordHash;

    // guardar as alterações na base de dados
    await user.save();

    res.status(200).json({ message: "Password alterada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

module.exports = administratorController;
