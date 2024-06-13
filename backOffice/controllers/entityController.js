// todas as funções em baixo vão ser métdodos do objeto entityController
const entityController = {};

entityController.list = async (req, res) => {
  try {
    const fetch = await import("node-fetch"); // import dinámico porque em cima não dá
    const { token, userType } = req.cookies;

    const response = await fetch.default(
      "http://localhost:5000/api/entities/list",
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      }
    );

    const data = await response.json();

    res.render("pages/adminArea", {
      title: "Entity Manager",
      userType: userType,
      pageType: "entity",
      entities: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error! " + error);
  }
};

entityController.listFilter = async (req, res) => {
  const { fieldName, name } = req.query; // query é para o get
  const { token, userType } = req.cookies;

  try {
    const fetch = await import("node-fetch"); // import dinámico porque em cima não dá

    // Construir o URL com os parâmetros passados no url
    const url = new URL("http://localhost:5000/api/entities/filter");
    url.searchParams.append("fieldName", fieldName);
    url.searchParams.append("name", name);

    const response = await fetch.default(url.toString(), {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    });

    const data = await response.json();

    res.render("pages/adminArea", {
      title: "Entity Manager",
      userType: userType,
      pageType: "entity",
      entities: data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error! " + error);
  }
};

entityController.createEntity = async (req, res) => {
  try {
    const { token } = req.cookies;
    // Renderiza o ficheiro createEntityPage.ejs na pasta administrators
    res.render("entities/createEntityPage", {
      title: "Criar Entidade",
      token: token
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send("Ocorreu um erro ao renderizar a página createEntityPage.");
  }
};

entityController.editEntity = async (req, res) => {
  const fetch = await import("node-fetch"); // import dinámico porque em cima não dá
  const { token } = req.cookies;

  try {
    const entityId = req.params.id;
    const response = await fetch.default(
      `http://localhost:5000/api/entities/${entityId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token
        }
      }
    );

    const entityData = await response.json();
    console.log(entityData);

    // Renderiza a página editAdmin.ejs e passa os dados do administrador como parâmetro
    res.render("entities/editEntityPage", { title:"Editar Entidade", entity: entityData, token: token });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send("Ocorreu um erro ao renderizar a página editEntityPage." + err);
  }
};

entityController.deleteEntity = async (req, res) => {
  const fetch = await import("node-fetch"); // import dinámico porque em cima não dá
  const { token } = req.cookies;
  
  try {
    const entityId = req.params.id;
    const response = await fetch.default(`http://localhost:5000/api/entities/${entityId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
      }
    });

    const entityData = await response.json();
    
    res.redirect("/entities");
  } catch (err) {
    console.error(err);
    res.status(500).send("Ocorreu um erro ao apagar." + err);
  }
};

module.exports = entityController;
