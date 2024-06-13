const fs = require("fs");

var Store = require("../models/store");

// todas as funções em baixo vão ser métdodos do objeto storeController
const storeController = {};

storeController.list = async (req, res) => {
    try {
        const stores = await Store.find();

        // Convert Mongoose documents to plain JavaScript objects
        const storesArray = stores.map((store) => store.toObject());

        console.log(storesArray);
        res.send(storesArray);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error. " + error);
    }
};

storeController.registerPost = async (req, res) => {
    console.log(req.body);

    const { name, address } = req.body;

    try {

        const newStore = await Store.create({
            name: name,
            address: address
        });

        res.status(201).send(newStore);
    } catch (err) {
        console.error(err);
        res.status(500).send({message: "Ocorreu um erro ao registar a loja"});
    }
};

storeController.remove = async (req, res) => {
    try {
        const storeId = req.params.id;
        const store = await Store.deleteOne({ _id: storeId });

        res.status(200).json(store);
    } catch (err) {
        console.error(err);
        res.status(500).send({message: "Ocorreu um erro ao remover o loja! " + err});
    }
};

storeController.getStoreById = async (req, res) => {
    try {
        const storeId = req.params.id;
        const store = await Store.findById(storeId);

        if (!store) {
            return res.status(404).json({ message: "loja não encontrada" });
        }

        // Se a loja for encontrado, envie-a como resposta
        res.status(200).json(store);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

storeController.editStore = async (req, res) => {
    const storeId = req.params.id;
    const { name, address } = req.body;

    try {
        const existingstore = await Store.findOne({ _id: storeId });

        // Verifica se a loja existe
        if (!existingstore) {
            return res.status(404).json({ message: "Entidade não encontrada" });
        }

        // Atualizar os campos existentes
        existingstore.name = name;
        existingstore.address = address;

        // guardar os dados alterados
        await existingstore.save();

        res.status(200).json(existingstore);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error!\n" + error });
    }
};

module.exports = storeController;
