var express = require("express");
var router = express.Router();

var authentication = require("../controllers/authenticationController")
var donor = require("../controllers/donorController");

/* GET list vai ser a homepage dos doadores. Vai fazer a listagem */
router.get("/", authentication.verifyToken, donor.list);

/**
 * Chamar o formulário para criar um doador
 */
router.get("/create", authentication.verifyToken, donor.createDonor);

/**
 * Edit
 */
router.get('/edit/:id', authentication.verifyToken, donor.editDonor)

router.get('/remove/:id', authentication.verifyToken, donor.deleteDonor)


module.exports = router;
