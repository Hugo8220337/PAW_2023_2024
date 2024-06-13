var express = require("express");
var router = express.Router();

var authentication = require("../controllers/authenticationController")
var entity = require("../controllers/entityController");

/* GET list vai ser a homepage das entidades. Vai fazer a listagem */
router.get("/", authentication.verifyToken, entity.list);

router.get("/filter", authentication.verifyToken, entity.listFilter)

/**
 * Chamar o formulário para criar um administrador
 */
router.get("/create", authentication.verifyToken, entity.createEntity);

/**
 * Edit
 */
router.get('/edit/:id', authentication.verifyToken, entity.editEntity)

router.get('/remove/:id', authentication.verifyToken, entity.deleteEntity)

module.exports = router;