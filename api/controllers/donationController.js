const mongoose = require('mongoose');

// models
var Donation = require("../models/donation");
var Item = require("../models/item");
var User = require("../models/user");
var Condition = require("../models/condition");
const donationRequest = require('../models/donationRequest');

//utils
const calculatePoints = require('../utils/itemsPointsCalculator');
const emailUtil = require('../utils/mail');


// todas as funções em baixo vão ser métdodos do objeto administratorController
const donationController = {};

donationController.list = async (req, res) => {
  try {
    const donations = await Donation.aggregate([
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
          pointsGiven: 1,
          status: 1
        }
      },
      {
        $lookup: {
          from: "items",
          localField: "_id",
          foreignField: "donationId",
          as: "items"
        }
      }
    ]);

    // converte documentos do Mongoose em objetos para poder retornar
    //const donationsArray = donations.map((donation) => donation.toObject());

    console.log(donations);
    res.send(donations);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error. " + error);
  }
};

donationController.getUserDonations = async (req, res) => {
  try {

    const donorId = req.params.donorId;

    const donations = await Donation.aggregate([
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
          recieved_at: 1,
          pointsGiven: 1,
          status: 1
        }
      },
      {
        $lookup: {
          from: "items",
          localField: "_id",
          foreignField: "donationId",
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
          pointsGiven: { $first: '$pointsGiven' },
          status: { $first: '$status' },
          recieved_at: { $first: '$recieved_at' },
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


    console.log(donations);
    res.send(donations);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error. " + error);
  }
};

donationController.getEntityDonations = async (req, res) => {
  try {

    const entityId = req.params.entityId;

    const donations = await Donation.aggregate([
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
          recieved_at: 1,
          pointsGiven: 1,
          status: 1
        }
      },
      {
        $lookup: {
          from: "items",
          localField: "_id",
          foreignField: "donationId",
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
          pointsGiven: { $first: '$pointsGiven' },
          status: { $first: '$status' },
          recieved_at: { $first: '$recieved_at' },
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


    console.log(donations);
    res.send(donations);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error. " + error);
  }
};

donationController.registerDonation = async (req, res) => {
  console.log(req.body);

  // const token = req.headers['x-access-token'];
  const { donorId, entityId, items } = req.body;

  try {
    // inserir a doação na base de dados
    const newDonation = await Donation.create({
      donorId: donorId,
      entityId: entityId,
      donationRequestId: null,
      numberOfItems: items.length,
      pointsGiven: 0, // é atualizado mais tarde, quando a doação for adicionada
      status: "Recebido"
    });

    // formatar cada item para ficar de acordo com o model dos items
    const itemObjects = items.map(item => ({
      donationId: newDonation._id,
      donationRequestId: null,
      conditionId: item.conditionId,
      description: item.description,
      weight: item.weight
    }));

    // inserir os items na coleção de items 
    const insertedItems = await Item.insertMany(itemObjects);

    // Calculate os pontos por cada item
    totalPoints = await calculatePoints(insertedItems);

    // Obtém o doador a partir do Id
    const donor = await User.findById(donorId);

    // Adiciona os pontos concedidos ao doador
    donor.points += totalPoints;

    // Guarda o doador com os pontos atualizados na base de dados
    await donor.save();

    newDonation.pointsGiven = totalPoints;
    newDonation.save();

    res.status(201).json(newDonation);
  } catch (error) {
    console.error(error);
    res.status(500).send("Ocorreu um erro ao registar a doação. " + error);
  }
};

donationController.getDonationById = async (req, res) => {
  try {
    const donationId = req.params.id;

    const donationsWithItems = await Donation.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(donationId) // Match by specific donation _id
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
          recieved_at: 1,
          pointsGiven: 1,
          status: 1
        }
      },
      {
        $lookup: {
          from: "items",
          localField: "_id",
          foreignField: "donationId",
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
          recieved_at: { $first: '$recieved_at' },
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

    if (!donationsWithItems) {
      return res.status(404).json({ message: "Doação não encontrada" });
    }

    console.log(donationsWithItems[0])

    // Se o doador for encontrado, envie-o como resposta, o [0] servve para mandar o objeto e não o array
    res.status(200).json(donationsWithItems[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

donationController.editDonation = async (req, res) => {
  try {
    const donationId = req.params.id;
    const { donorId, entityId, items } = req.body;


    const existingDonation = await Donation.findOne({ _id: donationId });

    if (!existingDonation) {
      return res.status(404).json({ message: "Doação não encontrada" });
    }

    // Atualizar os campos existentes da doação
    existingDonation.donorId = donorId
    existingDonation.entityId = entityId
    existingDonation.numberOfItems = items.length;

    // Apagar os items da doação
    await Item.deleteMany({ donationId: donationId })

    // formatar cada item para ficar de acordo com o model dos items
    const itemObjects = items.map(item => ({
      donationId: existingDonation._id,
      donationRequestId: item.donationRequestId,
      conditionId: item.conditionId,
      description: item.description,
      weight: item.weight
    }));

    // inserir os items atualizados na coleção de items
    await Item.insertMany(itemObjects);


    // guardar os dados alterados
    await existingDonation.save();

    res.status(200).json(existingDonation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!\n" + error });
  }
};

donationController.removeDonation = async (req, res) => {
  try {
    const donationId = req.params.id;

    const deletedDonation = await Donation.deleteOne({ _id: donationId });

    const deletedItems = await Item.deleteMany({ donationId: donationId });

    console.log(deletedDonation);
    console.log(deletedItems);

    res.status(200).send(deletedDonation)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!\n" + error });
  }
}

donationController.updateDonationStatus = async (req, res) => {
  try {
    const donationId = req.params.id;
    const { status } = req.body;

    if (!donationId || !status) {
      return res.status(400).json({ message: "Existem campos não preenchidos" });
    }

    if (status !== "Recebido" && status !== "Entregue" && status !== "Perdido") {
      return res.status(400).json({ message: "Status foi mal inserido" })
    }

    // Encontra a doadção pelo ID
    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    } else if (!donation) {
      return res.status(404).json({ message: "Donation request not found" });
    } else if (donation.status === 'Recebido') {
      return res.status(406).json({ message: "Não se pode alterar o status depois que é Entregue!" });
    }

    // atualiza o status
    donation.status = status;

    // guarda a doação atualizada na BD
    const updatedDonation = await donation.save();

    // encontrar utilizador para saber o email
    const user = await User.findById(updatedDonation.donorId)

    // mandar email se o utilizador ainda existir
    if (user) {
      let subject = "";
      let html = ""
      if (status === "Perdido") {
        subject = 'Doação Perdida';
        html = `<p>O pedido de doação que realizou foi perdida</p>`;
      } else if (status === "Recebido") {
        subject = 'Doação Recebida';
        html = `<p>A doação que realizou foi recebida. Ganhou ${updatedDonation.pointsGiven} pontos</p>`;
      }

      /**
       * Mandar email ao doador a dizer que houve uma alteração no status da sua doação
       */
      sendMail(user.email, subject, html).catch(err => {
        console.log(err) // se der erro não vai parar, porque não é assim muito importante o email
      });

    }

    res.status(200).json(updatedDonation);
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


module.exports = donationController;