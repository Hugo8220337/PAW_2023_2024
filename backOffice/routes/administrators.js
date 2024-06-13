var express = require("express");
var router = express.Router();

var authentication = require("../controllers/authenticationController")
var administrator = require("../controllers/administratorController");

/* GET list vai ser a homepage dos administradores. Vai fazer a listagem */
router.get("/", authentication.verifyToken, administrator.list);

/**
 * Chamar o formulário para criar um administrador
 */
router.get("/create", authentication.verifyToken, administrator.createAdmin);

/**
 * Edit
 */
router.get('/edit/:id', authentication.verifyToken, administrator.editAdmin)

router.get('/delete/:id', authentication.verifyToken, administrator.deleteAdmin)


module.exports = router;
