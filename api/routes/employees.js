var express = require("express");
var router = express.Router();

const authentication = require("../controllers/authenticationController");
var employee = require("../controllers/employeeController");

/* GET list vai ser a homepage dos funcionários. Vai fazer a listagem */
router.get("/list", authentication.verifyAdminToken, employee.list);

/** Regista um funcionário */
router.post("/register", authentication.verifyAdminToken, employee.registerPost);

/** Procura um funcionário em especifico para remover */
router.delete("/:id", authentication.verifyAdminToken, employee.remove);

/* GET para buscar os dados de um funcionário específico */
router.get("/:id", authentication.verifyAdminToken, employee.getEmployeeById);

/**
 * Rota para alterar dados do funcionário
 */
router.put("/:id", authentication.verifyAdminToken, employee.editEmployee);

/**
 * Rota para alterar a senha do funcionário
 */
router.put("/password/:id", authentication.verifyAdminToken, employee.changePassword);


module.exports = router;