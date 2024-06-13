var express = require("express");
var router = express.Router();

var authentication = require("../controllers/authenticationController");
var condition = require("../controllers/conditionController");

/* GET list vai ser a homepage das doações. Vai fazer a listagem */
router.get("/", authentication.verifyToken, condition.list);

/**
 * Chamar o formulário para criar uma doação
 */
router.get("/create", authentication.verifyToken, condition.createCondition);

/**
 * Edit
 */
router.get('/edit/:id', authentication.verifyToken, condition.editCondition)

/**
 * Remover a condição
 */
router.get('/remove/:id', authentication.verifyToken, condition.removeCondition)


module.exports = router;
