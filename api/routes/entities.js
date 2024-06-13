var express = require("express");
var router = express.Router();

const authentication = require("../controllers/authenticationController");
var entity = require("../controllers/entityController");

/**
 * GET list vai ser a homepage dos administradores. Vai fazer a listagem
 */
router.get("/list", authentication.verifyToken, entity.list);

/**
 * GET lista todos os atributos encontrados que satisfaçam o critério passado como parâmetro
 */
router.get("/filter", authentication.verifyToken, entity.listFilter);

router.delete("/:id", authentication.verifyToken, entity.remove);

/**
 * GET para pesquisar os dados de uma entidade específico
 */
router.get("/:id", authentication.verifyToken, entity.getEntityById);

/**
 * Regista uma entidade
 */
router.post("/register", authentication.verifyToken, entity.registerPost);

/** A partir do id que recebe ele elimina essa entidade */
router.delete("/remove/:id", authentication.verifyToken, entity.remove);

/**
 * Rota para alterar dados da entidade
 */
router.put("/:id", authentication.verifyToken, entity.editEntity);

/**
 * Rota para alterar a senha da entidade
 */
router.put("/password/:id", authentication.verifyToken, entity.changePassword);

module.exports = router;
