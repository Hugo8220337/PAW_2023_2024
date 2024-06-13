var Condition = require('../models/condition');

// todas as funções em baixo vão ser métdodos do objeto conditionController
const conditionController = {};

conditionController.listConditions = async (req, res) => {
    try {
        const conditions = await Condition.find({ isDeleted: false });

        // Convert Mongoose documents to plain JavaScript objects
        const conditionsArray = conditions.map(condition => condition.toObject());

        console.log(conditionsArray);
        res.status(200).send(conditionsArray);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error! " + err);
    }
};

conditionController.getConditionById = async (req, res) => {
    try {
        const conditionId = req.params.id;
        const condition = await Condition.findOne({ _id: conditionId });

        if (!condition) {
            return res.status(404).json({ message: "Entidade não encontrada" });
        }

        // Se a condição for encontrado, envie-o como resposta
        res.status(200).json(condition);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

conditionController.registerCondition = async (req, res) => {
    console.log(req.body)

    const { condition, pointsPerKg } = req.body;

    if (!condition || !pointsPerKg) {
        return res.status(400).send("Nome e pontos são campos obrigatórios");
    }

    try {

        const newCondition = await Condition.create({
            condition: condition,
            pointsPerKg: pointsPerKg
        });

        res.status(201).send(newCondition);
    } catch (err) {
        console.error(err);
        res.status(500).send("Ocorreu um erro ao registar a condição \n" + err);
    }
};

conditionController.editCondition = async (req, res) => {
    const conditionId = req.params.id;
    const { condition, pointsPerKg } = req.body;

    if (!condition || !pointsPerKg) {
        return res.status(400).send("Nome e pontos são campos obrigatórios");
    }


    try {
        // Verificar se a condição existe
        const existingCondition = await Condition.findOne({ _id: conditionId });

        if (!existingCondition) {
            return res.status(404).json({ message: "Condição não encontrada" });
        }

        // Atualizar os campos existentes
        existingCondition.condition = condition;
        existingCondition.pointsPerKg = pointsPerKg;


        // salvar os dados alterados
        await existingCondition.save();

        res.status(200).json({ message: "Condição atualizada com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error!\n" + error });
    }
};

conditionController.removeCondition = async (req, res) => {
    try {
        const conditionId = req.params.id;
        const condition = await Condition.findOne({ _id: conditionId });

        if (!condition) {
            return res.status(404).send("Condição não encontrada.");
        }

        /**
         * colocar como removida, porque ao apagar poderiam haver
         * problemas de integridade referencial
         */
        condition.isDeleted = true;


        // guardar como eliminada
        await condition.save();

        res.status(200).json(condition);
    } catch (err) {
        console.error("Erro ao remover a condição:" + err);
        res.status(500).send("Ocorreu um erro ao remover a condição! " + err);
    }
};

module.exports = conditionController;