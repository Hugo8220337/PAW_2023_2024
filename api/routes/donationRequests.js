var express = require("express");
var router = express.Router()

const authentication = require("../controllers/authenticationController");
var donationRequests = require("../controllers/donationRequestController");
const authenticationController = require("../controllers/authenticationController");

/**
 * Lista os pedidos de doações
 */
router.get("/list", authentication.verifyToken, donationRequests.listRequests);

/**
 * Lista pedidos de doação um Doador em específico
 */
router.get("/donor/:donorId", authentication.verifyToken, donationRequests.getUserDonationRequests);

/**
 * Lista pedidos de doação uma Entidade em específico
 */
router.get("/entity/:entityId", authentication.verifyToken, donationRequests.getEntityDonationRequests);

router.get("/:id", authentication.verifyToken, donationRequests.getDonationById)

/**
 * Cria um registo de doação
 */
router.post("/", authentication.verifyToken, donationRequests.registerDonationRequest);

/** Procura uma especifica donation */
router.delete("/:id", authentication.verifyToken, donationRequests.removeDonationRequest);

/**
 * PATCH: alterar o status do pedido de doação
 */
router.patch("/status/:id", authentication.verifyToken, donationRequests.updateDonationRequestStatus);

module.exports = router;