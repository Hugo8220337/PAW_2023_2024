var express = require("express");
var router = express.Router();

var authentication = require("../controllers/authenticationController")
var donation = require("../controllers/donationController");

/* GET list vai ser a homepage das doações. Vai fazer a listagem */
router.get("/", authentication.verifyToken, donation.list);

/**
 * Chamar o formulário para criar uma doação
 */
router.get("/create", authentication.verifyToken, donation.createDonation);

/**
 * Edit
 */
router.get('/edit/:id', authentication.verifyToken, donation.editDonation)

/**
 * Remover a doação
 */
router.get('/remove/:id', authentication.verifyToken, donation.removeDonation)

router.get('/invoice', authentication.verifyToken, donation.generateInvoice)

router.get('/invoiceCSV', authentication.verifyToken, donation.generateInvoiceCSV)


module.exports = router;
