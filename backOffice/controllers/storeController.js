// todas as funções em baixo vão ser métdodos do objeto storeController
const storeController = {};

storeController.list = async (req, res) => {
  const fetch = await import("node-fetch"); // import dinámico porque em cima não dá
  const { token, userType } = req.cookies;


  const response = await fetch.default(
    "http://localhost:5000/api/stores/list",
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
     },
    }
  );

  const data = await response.json();

  res.render("pages/adminArea", {
    title: "Store Manager",
    pageType: "store",
    userType: userType,
    token: token,
    stores: data,
  });
};

storeController.createStore = async (req, res) => {
  try {
    const { token } = req.cookies;
    // Renderiza o ficheiro createstorePage.ejs na pasta stores
    res.render("stores/createStorePage",{
      title: "Criar Loja",
      token: token
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({message: "Ocorreu um erro ao renderizar a página createStorePage."});
  }
};


storeController.editStore = async (req, res) => {
  const fetch = await import("node-fetch"); // import dinámico porque em cima não dá
  const { token } = req.cookies;
  
  try {
    const storeId = req.params.id;
    const response = await fetch.default(`http://localhost:5000/api/stores/${storeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
      }
    });

    const storeData = await response.json();
    
    // Renderiza a página editStore.ejs e passa os dados do store como parâmetro
    res.render("stores/editStorePage", { 
      title: "Editar Loja",
      store: storeData, 
      token: token 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Ocorreu um erro ao renderizar a página editStorePage." + err);
  }
};


storeController.deleteStore = async (req, res) => {
  const fetch = await import("node-fetch"); // import dinámico porque em cima não dá
  const { token } = req.cookies;
  
  try {
    const storeId = req.params.id;
    const response = await fetch.default(`http://localhost:5000/api/stores/${storeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
      }
    });

    const storeData = await response.json();
    
    res.redirect("/stores");
  } catch (err) {
    console.error(err);
    res.status(500).send({message: "Ocorreu um erro ao apagar." + err});
  }
};


module.exports = storeController;
