const fs = require('fs');
const bcrypt = require("bcrypt");
const saltRounds = 10; // numero de iterações usadas para calcular o hash para a encriptação da senha
const { imageNameGenerator } = require('../utils/imageNameGenerator');
var path = require('path');

var User = require("../models/user");

// todas as funções em baixo vão ser métdodos do objeto donorController
const donorController = {};


donorController.list = async (req, res) => {
    try {
        const donors = await User.find({ role: 'donor', isDeleted: false });

        // Convert Mongoose documents to plain JavaScript objects
        const donorsArray = donors.map(donor => donor.toObject());

        console.log(donorsArray);
        res.send(donorsArray);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

donorController.registerPost = async (req, res) => {
    console.log(req.body)

    const { name, email, password, phoneNumber, address, country, dateOfBirthday } = req.body;
    const dateOfBirthdayV = new Date(dateOfBirthday);

    try {
        let profileImage = null;

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

donorController.getDonorProfilePicture = async (req, res) => {
    try {
        const donorId = req.params.id;
        const donor = await User.findById(donorId);

        if (!donor) {
            return res.status(404).send('Doador não encontrado.');
        }

        const defaultImagePath = path.join(__dirname, '..', 'images', 'default_image.png');

        // se o path da imagem de perfil não for null vai buscar a imagem, se não, devolve a default_image.png
        const imagePath = donor.profileImage ? path.join(__dirname, '..', 'images', 'uploads', donor.profileImage)  : defaultImagePath;


        if(fs.existsSync(imagePath)) {
            res.sendFile(imagePath);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro interno do servidor.');
    }
};

donorController.remove = async (req, res) => {
    try {
        const donorId = req.params.id;
        const donor = await User.findOne({ _id: donorId });

        if (!donor) {
            return res.status(404).send("Doador não encontrado.");
        }

        // Verifica se a imagem do perfil existe e elimina-a
        if (fs.existsSync(`./images/uploads/${donor.profileImage}`)) {
            fs.unlinkSync(`./images/uploads/${donor.profileImage}`);
        }

        // Pseudonimizar dados sensíveis
        donor.name = "Utilizador Removido";
        donor.email = `${donor._id}@deleted.com`;
        donor.phoneNumber = null;
        donor.address = null;
        donor.isDeleted = true;
        donor.profileImage = null;


        // guardar os dados pseudonimizados
        await donor.save();

        res.status(200).json(donor);
    } catch (err) {
        console.error("Erro ao remover o doador:" + err);
        res.status(500).send("Ocorreu um erro ao remover o doador! " + err);
    }
};

donorController.getDonorById = async (req, res) => {
    try {
        const donorId = req.params.id;
        const donor = await User.findById(donorId);

        if (!donor) {
            return res.status(404).json({ message: "Doador não encontrado" });
        }

        // Se o doador for encontrado, envie-o como resposta
        res.status(200).json(donor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

donorController.removeProfileImage = async (req, res) => {
    const donorId = req.params.id;

    try {
        // verifica se o doador existe
        const existingDonor = await User.findOne({ role: 'donor', _id: donorId });

        if (!existingDonor) {
            return res.status(404).json({ message: "Doador não encontrado" });
        }

        const donorProfileImage = existingDonor.profileImage;
        // Verifica se a imagem do perfil existe e elimina-a
        if (fs.existsSync(`./images/uploads/${donorProfileImage}`)) {
            fs.unlinkSync(`./images/uploads/${donorProfileImage}`);
        }

        existingDonor.profileImage = null

        existingDonor.save();


        res.status(200).json({ message: "Doador atualizado com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error!\n" + error });
    }
};

donorController.editDonor = async (req, res) => {
    const donorId = req.params.id;
    const { name, email, phoneNumber, address, country, dateOfBirthday } = req.body;

    try {
        // verifica se o doador existe
        const existingDonor = await User.findOne({ role: 'donor', _id: donorId });

        if (!existingDonor) {
            return res.status(404).json({ message: "Doador não encontrado" });
        }

        let profileImage = existingDonor.profileImage;
        if (req.files && req.files.profileImage) {
            // Verifica se a imagem do perfil existe e elimina-a
            if (fs.existsSync(`./images/uploads/${existingDonor.profileImage}`)) {
                fs.unlinkSync(`./images/uploads/${existingDonor.profileImage}`);
            }

            const uploadedFile = req.files.profileImage;
            const fileExtension = path.extname(uploadedFile.name);
            const profileImageName = imageNameGenerator(fileExtension); // Gera um nome de imagem de perfil único

            // Guarda o atualiza enviado na pasta uploads
            uploadedFile.mv(`./images/uploads/${profileImageName}`);
            profileImage = profileImageName;
        }

        // Atualizar os campos existentes
        existingDonor.name = name;
        existingDonor.email = email;
        existingDonor.phoneNumber = phoneNumber;
        existingDonor.address = address;
        existingDonor.country = country;
        existingDonor.dateOfBirthday = dateOfBirthday;
        existingDonor.profileImage = profileImage;


        // guardar os dados alterados
        await existingDonor.save();

        res.status(200).json({ message: "Doador atualizado com sucesso!" });
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
donorController.changePassword = async (req, res) => {
    const donorId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    try {
        // Encontrar o utilizador pelo ID
        const user = await User.findOne({ role: 'donor', _id: donorId });

        if (!user) {
            return res.status(404).json({ message: "Doador não encontrado" });
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

module.exports = donorController;