var express = require("express");
var router = express.Router();

var authentication = require("../controllers/authenticationController")
var store = require("../controllers/storeController");

/* GET list vai ser a homepage das lojas. Vai fazer a listagem */
router.get("/", authentication.verifyToken, store.list);

/**
 * Chamar o formulário para criar uma loja
 */
router.get("/create", authentication.verifyToken, store.createStore);

/**
 * Edit
 */
router.get('/edit/:id', authentication.verifyToken, store.editStore)

router.get('/delete/:id', authentication.verifyToken, store.deleteStore)


module.exports = router;
