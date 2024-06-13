const fs = require('fs');
const bcrypt = require("bcrypt");
const saltRounds = 10; // numero de iterações usadas para calcular o hash para a encriptação da senha
const { imageNameGenerator } = require('../utils/imageNameGenerator');
var path = require('path');

var User = require("../models/user");

// todas as funções em baixo vão ser métdodos do objeto employeeController
const employeeController = {};


employeeController.list = async (req, res) => {
    try {

        const employees = await User.find({ role: 'employee', isDeleted: false });

        // Convert Mongoose documents to plain JavaScript objects
        const employeesArray = employees.map(employee => employee.toObject());

        console.log(employeesArray);
        res.send(employeesArray);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

employeeController.registerPost = async (req, res) => {
    console.log(req.body)

    const { name, email, password, phoneNumber, address, country, dateOfBirthday } = req.body;
    const dateOfBirthdayV = new Date(dateOfBirthday);

    try {
        let profileImage;

        if(req.files && req.files.profileImage) {
            const uploadedFile = req.files.profileImage;
            const fileExtension = path.extname(uploadedFile.name);
            const profileImageName = imageNameGenerator(fileExtension); // Gera um nome de imagem de perfil único

            // Guarda o ficheiro enviado na pasta uploads
            uploadedFile.mv(`./images/uploads/${profileImageName}`);
            profileImage = profileImageName;
        }

        const passwordEncript = await bcrypt.hash(password, saltRounds);

        const newEmployee = await User.create({
            name: name,
            email: email,
            password: passwordEncript,
            role: 'employee',
            phoneNumber: phoneNumber,
            address: address,
            country: country,
            profileImage: profileImage,
            dateOfBirthday: dateOfBirthdayV
        });

        res.status(201).send(newEmployee);
    } catch (err) {
        console.error(err);
        res.status(500).send("Ocorreu um erro ao registar o funcionário");
    }
}

employeeController.remove = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const employee = await User.findOne({ _id: employeeId });

        if (!employee) {
            return res.status(404).send("Funcionário não encontrado.");
        }

        // Verifica se a imagem do perfil existe e elimina-a
        if (fs.existsSync(`./images/uploads/${employee.profileImage}`)) {
            fs.unlinkSync(`./images/uploads/${employee.profileImage}`);
        }

        // Pseudonimizar dados sensíveis
        employee.name = "Utilizador Removido";
        employee.email = `${employee._id}@deleted.com`;
        employee.phoneNumber = null;
        employee.address = null;
        employee.isDeleted = true;
        employee.profileImage = null;


        // guardar os dados pseudonimizados
        await employee.save();

        res.status(200).json(employee);
    } catch (err) {
        console.error("Erro ao remover o funcionário:" + err);
        res.status(500).send("Ocorreu um erro ao remover o funcionário! " + err);
    }
};

employeeController.getEmployeeById = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const employee = await User.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ message: "Funcionário não encontrado" });
        }

        // Se o funcionário for encontrado, envie-o como resposta
        res.status(200).json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


employeeController.editEmployee = async (req, res) => {
    const employeeId = req.params.id;
    const { name, email, phoneNumber, address, country, dateOfBirthday } = req.body;

    try {
        // verifica se o funcionário foi encontrado
        const existingEmployee = await User.findOne({ role: 'employee', _id: employeeId });

        if (!existingEmployee) {
            return res.status(404).json({ message: "Funcionário não encontrado" });
        }

        let profileImage = existingEmployee.profileImage;
        if (req.files && req.files.profileImage) {
        // Verifica se a imagem do perfil existe e elimina-a
        if (fs.existsSync(`./images/uploads/${existingEmployee.profileImage}`)) {
            fs.unlinkSync(`./images/uploads/${existingEmployee.profileImage}`);
        }

        const uploadedFile = req.files.profileImage;
        const fileExtension = path.extname(uploadedFile.name);
        const profileImageName = imageNameGenerator(fileExtension); // Gera um nome de imagem de perfil único

        // Guarda o atualiza enviado na pasta uploads
        uploadedFile.mv(`./images/uploads/${profileImageName}`);
        profileImage = profileImageName;
        }


        // Atualizar os campos existentes
        existingEmployee.name = name;
        existingEmployee.email = email;
        existingEmployee.phoneNumber = phoneNumber;
        existingEmployee.address = address;
        existingEmployee.country = country;
        existingEmployee.dateOfBirthday = dateOfBirthday;
        existingEmployee.profileImage = profileImage;


        // guardar os dados alterados
        await existingEmployee.save();

        res.status(200).json({ message: "Funcionário atualizado com sucesso!" });
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
employeeController.changePassword = async (req, res) => {
    const employeeId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    try {
        // Encontrar o utilizador pelo ID
        const user = await User.findOne({ role: 'employee', _id: employeeId });

        if (!user) {
            return res.status(404).json({ message: "Funcionário não encontrado" });
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

module.exports = employeeController;