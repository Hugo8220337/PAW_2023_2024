const bcrypt = require("bcrypt");
const saltRounds = 10; // numero de iterações usadas para calcular o hash para a encriptação da senha

var Entity = require("../models/entity");

// todas as funções em baixo vão ser métdodos do objeto entityController
const entityController = {};


entityController.list = async (req, res) => {
    try {
        const entities = await Entity.find({ isDeleted: false });

        // Convert Mongoose documents to plain JavaScript objects
        const entitiesArray = entities.map(entity => entity.toObject());

        console.log(entitiesArray);
        res.status(200).send(entitiesArray);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error! " + err);
    }
}

entityController.listFilter = async (req, res) => {
    const { fieldName, name } = req.query;

    try {
        const query = {};

        // Se não for mandado nada ent vai devolver todas as entidades
        if (!name || name == "") {
            const allEntities = await Entity.find({ isDeleted: false });
            return res.status(200).send(allEntities);
        }

        query["isDeleted"] = false
        query[fieldName] = name;

        // Find users that match the query
        const filteredEntities = await Entity.find(query);

        res.status(200).send(filteredEntities);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error! ' + error);
    }
}

entityController.getEntityById = async (req, res) => {
    try {
        const entityId = req.params.id;
        const entity = await Entity.findOne({ _id: entityId });

        if (!entity) {
            return res.status(404).json({ message: "Entidade não encontrada" });
        }

        // Se a entidade for encontrado, envie-o como resposta
        res.status(200).json(entity);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

entityController.registerPost = async (req, res) => {
    console.log(req.body)

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

entityController.editEntity = async (req, res) => {
    const entityId = req.params.id;
    const { name, contact, description, country, aditionalInfo, isActive, isAccepted } = req.body;

    if (!contact || !contact.email) {
        return res.status(400).send("O campo 'contact.email' é obrigatório.");
    }

    try {
        // Verificar se a entiadde existe
        const existingEntity = await Entity.findOne({ _id: entityId });

        console.log(existingEntity)

        if (!existingEntity) {
            return res.status(404).json({ message: "Entidade não encontrada" });
        }

        // Atualizar os campos existentes
        existingEntity.name = name;
        existingEntity.contact.email = contact.email;
        existingEntity.contact.phoneNumber = contact.phoneNumber;
        existingEntity.contact.address = contact.address;
        existingEntity.description = description;
        existingEntity.country = country;
        existingEntity.aditionalInfo = aditionalInfo;
        existingEntity.isActive = isActive;
        existingEntity.isAccepted = isAccepted;


        // salvar os dados alterados
        await existingEntity.save();

        res.status(200).json({ message: "Entidade atualizada com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error!\n" + error });
    }
};

entityController.remove = async (req, res) => {
    try {
        const entityId = req.params.id;
        const entity = await Entity.findOne({ _id: entityId });

        if (!entity) {
            return res.status(404).send("Entidade não encontrada.");
        }

        // Pseudonimizar dados sensíveis
        entity.name = "Entidade Removida";
        entity.contact.email = `${entity._id}@deleted.com`;
        entity.contact.phoneNumber = null;
        entity.contact.address = null;
        entity.aditionalInfo = null;
        entity.description = "Entidade Removida";
        entity.isActive = false;
        entity.isDeleted = true;


        // guardar os dados pseudonimizados
        await entity.save();

        res.status(200).json(entity);
    } catch (err) {
        console.error("Erro ao remover a entidade:" + err);
        res.status(500).send("Ocorreu um erro ao remover a entidade! " + err);
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
entityController.changePassword = async (req, res) => {
    const entityId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    try {
        // Encontrar a entidade pelo ID
        const entity = await Entity.findOne({ _id: entityId });

        if (!entity) {
            return res.status(404).json({ message: "Entidade não encontrado" });
        }

        // Verificar se a senha antiga corresponde à senha armazenada
        const isPasswordCorrect = await bcrypt.compare(oldPassword, entity.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "A senha antiga está incorreta" });
        }

        // Criptografar a nova senha
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // Atualizar a senha da entidade
        entity.password = newPasswordHash;

        // Salvar as alterações no banco de dados
        await entity.save();

        res.status(200).json({ message: "Senha alterada com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
};

module.exports = entityController;