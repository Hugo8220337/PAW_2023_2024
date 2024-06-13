/**
 * @swagger
 * tags:
 *   name: Administrators
 *   description: API para gerenciar administradores
 */

var express = require("express");
var router = express.Router();

const authentication = require("../controllers/authenticationController");
var administrator = require("../controllers/administratorController");

/* GET list vai ser a homepage dos administradores. Vai fazer a listagem */
router.get("/list", authentication.verifyAdminToken, administrator.list);

/*Rota para registar um administrador */
router.post("/register", authentication.verifyAdminToken, administrator.registerPost);

/** Rota para eliminar um administrador em especifico */
router.delete("/:id", authentication.verifyAdminToken, administrator.remove);

/* GET para procurar os dados de um administrador específico */
router.get("/:id", authentication.verifyAdminToken, administrator.getAdminById);

/**
 * Rota para alterar dados do administrador
 */
router.put("/:id", authentication.verifyAdminToken, administrator.editAdmin);

/**
 * Rota para alterar a senha da entidade
 */
router.put("/password/:id", authentication.verifyAdminToken, administrator.changePassword);


module.exports = router;