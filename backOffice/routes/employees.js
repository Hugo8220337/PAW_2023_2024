var express = require("express");
var router = express.Router();

var authentication = require("../controllers/authenticationController")
var employee = require("../controllers/employeeController");

/* GET list vai ser a homepage dos funcionários. Vai fazer a listagem */
router.get("/", authentication.verifyToken, employee.list);

/**
 * Chamar o formulário para criar um funcionário
 */
router.get("/create", authentication.verifyToken, employee.createEmployee);

/**
 * Edit
 */
router.get('/edit/:id', authentication.verifyToken, employee.editEmployee)

router.get('/remove/:id', authentication.verifyToken, employee.deleteEmployee)

module.exports = router;
