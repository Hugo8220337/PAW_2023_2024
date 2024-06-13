var express = require("express");
var router = express.Router()

const authentication = require("../controllers/authenticationController");
var donations = require("../controllers/donationController");

/**
 * Lista as doações
 */
router.get("/list", authentication.verifyToken, donations.list);


/**
 * GET para buscar os dados de uma doação específico
 */
router.get("/:id", authentication.verifyToken, donations.getDonationById);

/**
 * Lista doações de um Doador em específico
 */
router.get("/donor/:donorId", authentication.verifyToken, donations.getUserDonations);

/**
 * Lista doações de uma Entidade em específico
 */
router.get("/entity/:entityId", authentication.verifyToken, donations.getEntityDonations);

/**
 * Cria uma doação
 */
router.post("/register", authentication.verifyToken, donations.registerDonation);

/** Procura uma donation em especifico para remover */
router.delete("/:id", authentication.verifyToken, donations.removeDonation);


/**
 * Atualizar a informação de uma doação específica
 */
router.put("/:id", authentication.verifyToken, donations.editDonation)

/**
 * PATCH: alterar o status do pedido de doação
 */
router.patch("/status/:id", authentication.verifyToken, donations.updateDonationStatus);

module.exports = router;