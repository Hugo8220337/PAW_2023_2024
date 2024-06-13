
var express = require("express");
var router = express.Router();

const authentication = require("../controllers/authenticationController");
var store = require("../controllers/storeController");

/* GET list vai ser a homepage das lojas. Vai fazer a listagem */
router.get("/list", authentication.verifyToken, store.list);

/*Rota para registar uma loja */
router.post("/", authentication.verifyAdminToken, store.registerPost);

/** Rota para eliminar uma loja em especifico */
router.delete("/:id", authentication.verifyAdminToken, store.remove);

/* GET para procurar os dados de uma loja específico */
router.get("/:id", authentication.verifyToken, store.getStoreById);

/**
 * Rota para alterar dados da loja
 */
router.put("/:id", authentication.verifyAdminToken, store.editStore);



module.exports = router;