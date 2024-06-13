const User = require('../models/user');
const Entity = require('../models/entity');
const Donation = require('../models/donation');
const DonationRequest = require('../models/donationRequest');
const Item = require('../models/item')


// todas as funções em baixo vão ser métdodos do objeto administratorController
const statisticsController = {};

statisticsController.getNumbers = async (req, res) => {
    try {
        const numDonors = await User.countDocuments({role: "donor", isDeleted: false});
        const numEntities = await Entity.countDocuments({isDeleted: false});
        const numDonations = await Donation.countDocuments({});
        const numItems = await Item.countDocuments({});

        const data = {
            numDonors,
            numEntities,
            numDonations,
            numItems
          };

        res.status(200).send(data);
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error! " + error);
    }
};

statisticsController.donorsCountries = async (req, res) => {
    try {

        const data = await User.aggregate([
            {
                $match: { role: "donor" } // Match documents with role: donor
            },
            {
                $group: {
                    _id: '$country', // Group by country field
                    count: { $sum: 1 } // Count the documents for each country
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field from the result
                    country: '$_id', // Rename _id to country
                    count: 1 // Include the count field
                }
            }
        ])

        res.status(200).send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error! " + err);
    }
}

statisticsController.entitiesCountries = async (req, res) => {
    try {

        const data = await Entity.aggregate([
            {
                $group: {
                    _id: '$country', // Group by country field
                    count: { $sum: 1 } // Count the documents for each country
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field from the result
                    country: '$_id', // Rename _id to country
                    count: 1 // Include the count field
                }
            }
        ])

        res.status(200).send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error! " + err);
    }
}

statisticsController.donationsYear = async (req, res) => {
    try {
        // Pipeline de agregação para agrupar doações por ano
        const data = await Donation.aggregate([
            {
                $group: {
                    _id: { $year: "$recieved_at" }, // Agrupar pelo ano da data recieved_at
                    count: { $sum: 1 } // Contar o número de doações em cada ano
                }
            },
            {
                $project: {
                    _id: 0, // Excluir o campo _id do resultado final
                    year: "$_id", // Renomear _id para year
                    count: 1 // Incluir o campo de contagem no resultado final
                }
            },
            {
                $sort: { "year": 1 } // Classificar os resultados por ano
            }
        ]);

        res.status(200).send(data);
    } catch (error) {
        console.error(error);
        throw new Error("Erro ao contar as doações por ano.");
    }
}

statisticsController.donationsMonth = async (req, res) => {
    try {
        const data = await Donation.aggregate([
            {
                $group: {
                    _id: { $month: "$recieved_at" }, // Group by the month of received_at date
                    count: { $sum: 1 } // Count the number of donations in each month
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field from the final result
                    month: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$_id", 1] }, then: "Janeiro" },
                                { case: { $eq: ["$_id", 2] }, then: "Fevereiro" },
                                { case: { $eq: ["$_id", 3] }, then: "Março" },
                                { case: { $eq: ["$_id", 4] }, then: "Abril" },
                                { case: { $eq: ["$_id", 5] }, then: "Maio" },
                                { case: { $eq: ["$_id", 6] }, then: "Junho" },
                                { case: { $eq: ["$_id", 7] }, then: "Julho" },
                                { case: { $eq: ["$_id", 8] }, then: "Agosto" },
                                { case: { $eq: ["$_id", 9] }, then: "Setembro" },
                                { case: { $eq: ["$_id", 10] }, then: "Outubro" },
                                { case: { $eq: ["$_id", 11] }, then: "Novembro" },
                                { case: { $eq: ["$_id", 12] }, then: "Dezembro" }
                            ],
                            default: "Unknown" // Default case if month is not found
                        }
                    },
                    count: 1 // Include the count field in the final result
                }
            },
            {
                $sort: { "_id": 1 } // Sort the results by month
            }
        ]);

        res.status(200).send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error! " + err);
    }
}


module.exports = statisticsController;