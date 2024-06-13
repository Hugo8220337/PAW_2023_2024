const mongoose = require('mongoose');

var DonationRequest = require("../models/donationRequest");
var Item = require("../models/item");
var User = require("../models/user");
var Entity = require("../models/entity");
var donationController = require("../controllers/donationController");

// utils
const calculatePoints = require('../utils/itemsPointsCalculator');
const emailUtil = require('../utils/mail');

// todas as funções em baixo vão ser métdodos do objeto administratorController
const donationRequestController = {};

donationRequestController.listRequests = async (req, res) => {
    try {
        const donationsResquests = await DonationRequest.find();

        // converte documentos do Mongoose em objetos para poder retornar
        const donationsRequestsArray = donationsResquests.map((donation) =>
            donation.toObject()
        );

        console.log(donationsRequestsArray);
        res.send(donationsRequestsArray);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error. " + error);
    }
};

donationRequestController.getUserDonationRequests = async (req, res) => {
    try {

        const donorId = req.params.donorId;

        const donationRequests = await DonationRequest.aggregate([
            {
                $match: { donorId: new mongoose.Types.ObjectId(donorId) }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "donorId",
                    foreignField: "_id",
                    as: "donor"
                }
            },
            {
                $unwind: "$donor"
            },
            {
                $lookup: {
                    from: "entities",
                    localField: "entityId",
                    foreignField: "_id",
                    as: "entity"
                }
            },
            {
                $unwind: "$entity"
            },
            {
                $project: {
                    _id: 1,
                    donor: {
                        _id: "$donor._id",
                        name: "$donor.name"
                    },
                    entity: {
                        _id: "$entity._id",
                        name: "$entity.name"
                    },
                    numberOfItems: 1,
                    expectedPoints: 1,
                    created_at: 1,
                    pointsGiven: 1,
                    status: 1
                }
            },
            {
                $lookup: {
                    from: "items",
                    localField: "_id",
                    foreignField: "donationRequestId",
                    as: "items"
                }
            },
            {
                $unwind: {
                    path: '$items',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'conditions',
                    localField: 'items.conditionId',
                    foreignField: '_id',
                    as: 'condition'
                }
            },
            {
                $unwind: {
                    path: '$condition',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$_id',
                    donor: { $first: { _id: "$donor._id", name: "$donor.name" } },
                    entity: { $first: { _id: "$entity._id", name: "$entity.name" } },
                    numberOfItems: { $first: '$numberOfItems' },
                    status: { $first: '$status' },
                    expectedPoints: { $first: '$expectedPoints' },
                    created_at: { $first: '$created_at' },
                    items: {
                        $push: {
                            _id: '$items._id',
                            donationId: '$items.donationId',
                            donationRequestId: '$items.donationRequestId',
                            description: '$items.description',
                            weight: '$items.weight',
                            conditionId: '$items.conditionId',
                            condition: '$condition.condition'
                        }
                    }
                }
            },
        ]);

        console.log(donationRequests);
        res.send(donationRequests);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error. " + error);
    }
};

donationRequestController.getEntityDonationRequests = async (req, res) => {
    try {

        const entityId = req.params.entityId;

        const donationRequests = await DonationRequest.aggregate([
            {
                $match: { entityId: new mongoose.Types.ObjectId(entityId) }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "donorId",
                    foreignField: "_id",
                    as: "donor"
                }
            },
            {
                $unwind: "$donor"
            },
            {
                $lookup: {
                    from: "entities",
                    localField: "entityId",
                    foreignField: "_id",
                    as: "entity"
                }
            },
            {
                $unwind: "$entity"
            },
            {
                $project: {
                    _id: 1,
                    donor: {
                        _id: "$donor._id",
                        name: "$donor.name"
                    },
                    entity: {
                        _id: "$entity._id",
                        name: "$entity.name"
                    },
                    numberOfItems: 1,
                    expectedPoints: 1,
                    created_at: 1,
                    pointsGiven: 1,
                    status: 1
                }
            },
            {
                $lookup: {
                    from: "items",
                    localField: "_id",
                    foreignField: "donationRequestId",
                    as: "items"
                }
            },
            {
                $unwind: {
                    path: '$items',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'conditions',
                    localField: 'items.conditionId',
                    foreignField: '_id',
                    as: 'condition'
                }
            },
            {
                $unwind: {
                    path: '$condition',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$_id',
                    donor: { $first: { _id: "$donor._id", name: "$donor.name" } },
                    entity: { $first: { _id: "$entity._id", name: "$entity.name" } },
                    numberOfItems: { $first: '$numberOfItems' },
                    expectedPoints: { $first: '$expectedPoints' },
                    status: { $first: '$status' },
                    created_at: { $first: '$created_at' },
                    items: {
                        $push: {
                            _id: '$items._id',
                            donationId: '$items.donationId',
                            donationRequestId: '$items.donationRequestId',
                            description: '$items.description',
                            weight: '$items.weight',
                            conditionId: '$items.conditionId',
                            condition: '$condition.condition'
                        }
                    }
                }
            },
        ]);


        console.log(donationRequests);
        res.send(donationRequests);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error. " + error);
    }
};

donationRequestController.getDonationById = async (req, res) => {
    try {

        const donationRequestId = req.params.id;

        const donationRequestsWithItems = await DonationRequest.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(donationRequestId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "donorId",
                    foreignField: "_id",
                    as: "donor"
                }
            },
            {
                $unwind: "$donor"
            },
            {
                $lookup: {
                    from: "entities",
                    localField: "entityId",
                    foreignField: "_id",
                    as: "entity"
                }
            },
            {
                $unwind: "$entity"
            },
            {
                $project: {
                    _id: 1,
                    donor: {
                        _id: "$donor._id",
                        name: "$donor.name"
                    },
                    entity: {
                        _id: "$entity._id",
                        name: "$entity.name"
                    },
                    numberOfItems: 1,
                    expectedPoints: 1,
                    created_at: 1,
                    pointsGiven: 1,
                    status: 1
                }
            },
            {
                $lookup: {
                    from: "items",
                    localField: "_id",
                    foreignField: "donationRequestId",
                    as: "items"
                }
            },
            {
                $unwind: {
                    path: '$items',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'conditions',
                    localField: 'items.conditionId',
                    foreignField: '_id',
                    as: 'condition'
                }
            },
            {
                $unwind: {
                    path: '$condition',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$_id',
                    donor: { $first: { _id: "$donor._id", name: "$donor.name" } },
                    entity: { $first: { _id: "$entity._id", name: "$entity.name" } },
                    numberOfItems: { $first: '$numberOfItems' },
                    expectedPoints: { $first: '$expectedPoints' },
                    status: { $first: '$status' },
                    created_at: { $first: '$created_at' },
                    items: {
                        $push: {
                            _id: '$items._id',
                            donationId: '$items.donationId',
                            donationRequestId: '$items.donationRequestId',
                            description: '$items.description',
                            weight: '$items.weight',
                            conditionId: '$items.conditionId',
                            condition: '$condition.condition'
                        }
                    }
                }
            },
        ]);

        if (!donationRequestsWithItems) {
            return res.status(404).json({ message: "Pedido de doação não encontrada" });
        }

        // Se o doador for encontrado, envie-o como resposta, o [0] servve para mandar o objeto e não o array
        res.status(200).json(donationRequestsWithItems[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

donationRequestController.registerDonationRequest = async (req, res) => {
    console.log(req.body);

    const { donorId, entityId, items } = req.body;

    try {
        const entityData = await Entity.findById(entityId);
        const expectedPoints = await calculatePoints(items);

        const newDonationRequest = await DonationRequest.create({
            donorId: donorId,
            entityId: entityId,
            numberOfItems: items.length,
            expectedPoints: expectedPoints
        });

        // formatar cada item para ficar de acordo com o model dos items
        const itemObjects = items.map(item => ({
            donationRequestId: newDonationRequest._id,
            conditionId: item.conditionId,
            description: item.description,
            condition: item.condition,
            weight: item.weight
        }));

        // inserir os items na coleção de items
        await Item.insertMany(itemObjects);

        let subject = 'Novo pedido de doação';
        let html = `<h1>Pedido de doação</h1>\n
        <p>Tem um novo pedido de doação para responder</p>`;

        /**
         * Mandar email à entidade a dizer que tem um novo pedido de doação
         */
        sendMail(entityData.contact.email, subject, html).catch(err => {
            console.log(err) // se der erro não vai parar, porque não é assim muito importante o email
        });

        res.status(201).json(newDonationRequest);
    } catch (error) {
        console.error(error);
        res.status(500).send("Ocorreu um erro ao registar a doação. " + error);
    }
};

donationRequestController.removeDonationRequest = async (req, res) => {
    try {
        const donationRequestId = req.params.id;

        const deletedDonationRequest = await DonationRequest.deleteOne({ _id: donationRequestId });

        const deletedItems = await Item.deleteMany({ donationRequestId: donationRequestId });

        console.log(deletedDonationRequest);
        console.log(deletedItems);

        res.status(200).send(deletedDonationRequest)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error!\n" + error });
    }
}

donationRequestController.updateDonationRequestStatus = async (req, res) => {
    try {
        const donationRequestId = req.params.id;
        const { status } = req.body;

        if (!donationRequestId || !status) {
            return res.status(400).json({ message: "Existem campos não preenchidos" });
        }

        if (status !== "Pendente" && status !== "Aceite" && status !== "Rejeitado") {
            return res.status(400).json({ message: "Status foi mal inserido" })
        }

        // Encontra a doadção pelo ID
        const donationRequest = await DonationRequest.findById(donationRequestId);

        if (!donationRequest) {
            return res.status(404).json({ message: "Donation request not found" });
        } else if (donationRequest.status !== 'Pendente') {
            return res.status(406).json({ message: "Não se pode alterar o status de um pedido duas vezes!" });
        }

        // atualiza o status
        donationRequest.status = status;

        // Guarda o pedido de doação atualizado na BD
        const updatedDonationRequest = await donationRequest.save();

        // encontrar utilizador para saber o email
        const user = await User.findById(updatedDonationRequest.donorId)

        // manda email ao utilizador se ele ainda existir
        if(user) {
            let subject = "";
            let html = "";
            if (status === "Aceite") {
                subject = 'Pedido de doação aceite';
                html = `<p>O pedido de doação que realizou foi aceite.</p>`;
            } else if (status === "Rejeitado") {
                subject = 'Pedido de doação rejeitado';
                html = `<p>O pedido de doação que realizou foi rejeitado</p>`;
            }
    
            /**
             * Mandar email ao doador a dizer que houve uma alteração no status do seu pedido
             */
            sendMail(user.email, subject, html).catch(err => { //TODO
                console.log(err) // se der erro não vai parar, porque não é assim muito importante o email
            });
        }

        res.status(200).json(updatedDonationRequest);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error! " + error })
    }
};

/**
 * vai mandar email
 * 
 * @param {*} from reciclaTextil
 * @param {*} to pessoa quem vai recber
 * @param {*} html o que vai ser enviado por email
 */
async function sendMail(to, subject, html) {
    return emailUtil.sendMail(to, subject, html)
}

module.exports = donationRequestController;