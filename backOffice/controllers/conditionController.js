// todas as funções em baixo vão ser métdodos do objeto conditionController
const conditionControler = {};

conditionControler.list = async (req, res) => {
    const fetch = await import("node-fetch"); // import dinámico porque em cima não dá
    const { token, userType } = req.cookies;

    const response = await fetch.default(
        "http://localhost:5000/api/conditions/list",
        {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": token
            }
        }
    );

    const data = await response.json();

    res.render("pages/adminArea", {
        title: "Conditions Manager",
        userType: userType,
        pageType: "condition",
        conditions: data,
    });
};

conditionControler.createCondition = async (req, res) => {
    try {
        const { token } = req.cookies;
        // Renderiza o ficheiro createConditionPage.ejs na pasta conditions
        res.render("conditions/createConditionPage", {
            title: "Criar Condição",
            token: token
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Ocorreu um erro ao renderizar a página. " + err);
    }
}

conditionControler.editCondition = async (req, res) => {
    const fetch = await import("node-fetch"); // import dinámico porque em cima não dá
    const { token } = req.cookies;

    try {
        const conditionId = req.params.id;
        const response = await fetch.default(`http://localhost:5000/api/conditions/${conditionId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": token
            }
        });

        const conditionData = await response.json();

        // Renderiza a página editCondition.ejs e passa os dados do funcionário como parâmetro
        res.render("conditions/editConditionPage", { 
            title: "Editar Condição",
            condition: conditionData, 
            token: token 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Ocorreu um erro ao renderizar a página." + err);
    }
};

conditionControler.removeCondition = async (req, res) => {
    const fetch = await import("node-fetch"); // import dinámico porque em cima não dá
    const { token } = req.cookies;

    try {
        const conditionId = req.params.id;
        const response = await fetch.default(`http://localhost:5000/api/conditions/${conditionId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": token
            }
        });

        const conditionData = await response.json();

        res.redirect("/conditions");
    } catch (err) {
        console.error(err);
        res.status(500).send("Ocorreu um erro ao apagar." + err);
    }
};

module.exports = conditionControler;