var express = require("express");
var router = express.Router();

const authentication = require("../controllers/authenticationController");
var donnor = require("../controllers/donnorController");

/* GET list vai ser a homepage dos doadors. Vai fazer a listagem */
router.get("/list", authentication.verifyToken, donnor.list);

/* GET para buscar os dados de um doador específico */
router.get("/:id", authentication.verifyToken, donnor.getDonorById);

/** Rota para adicionar a foto de perfil do doador */
router.get("/image/:id", authentication.verifyToken, donnor.getDonorProfilePicture);

/** Rota para registar um doador */
router.post("/register", authentication.verifyToken, donnor.registerPost);

/** Procura um donor em especifico para remover */
router.delete("/:id", authentication.verifyToken, donnor.remove);

/** Rota para remover a foto de perfil do doador */
router.delete("/image/:id", authentication.verifyToken, donnor.removeProfileImage);


/**
 * Rota para alterar dados do doador
 */
router.put("/:id", authentication.verifyToken, donnor.editDonor);

/**
 * Rota para alterar a senha do doador
 */
router.put("/password/:id", authentication.verifyToken, donnor.changePassword);

module.exports = router;
