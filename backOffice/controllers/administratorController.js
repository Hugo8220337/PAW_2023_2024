// todas as funções em baixo vão ser métdodos do objeto administratorController
const administratorController = {};

administratorController.list = async (req, res) => {
  const fetch = await import("node-fetch"); // import dinámico porque em cima não dá
  const { token, userType } = req.cookies;


  const response = await fetch.default(
    "http://localhost:5000/api/administrators/list",
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
    title: "Administrator Manager",
    userType: userType,
    pageType: "admin",
    token: token,
    administrators: data,
  });
};

administratorController.createAdmin = async (req, res) => {
  try {
    const { token } = req.cookies;
    // Renderiza o ficheiro createAdminPage.ejs na pasta administrators
    res.render("administrators/createAdminPage",{
      title: "Criar Administrador",
      token: token
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Ocorreu um erro ao renderizar a página createAdminPage.");
  }
};


administratorController.editAdmin = async (req, res) => {
  const fetch = await import("node-fetch"); // import dinámico porque em cima não dá
  const { token } = req.cookies;
  
  try {
    const adminId = req.params.id;
    const response = await fetch.default(`http://localhost:5000/api/administrators/${adminId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
      }
    });

    const adminData = await response.json();
    
    // Renderiza a página editAdmin.ejs e passa os dados do administrador como parâmetro
    res.render("administrators/editAdminPage", { 
      title: "Editar Administrador",
      admin: adminData, 
      token: token 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Ocorreu um erro ao renderizar a página editAdminPage." + err);
  }
};


administratorController.deleteAdmin = async (req, res) => {
  const fetch = await import("node-fetch"); // import dinámico porque em cima não dá
  const { token } = req.cookies;
  
  try {
    const adminId = req.params.id;
    const response = await fetch.default(`http://localhost:5000/api/administrators/${adminId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
      }
    });

    const adminData = await response.json();
    
    res.redirect("/administrators");
  } catch (err) {
    console.error(err);
    res.status(500).send("Ocorreu um erro ao apagar." + err);
  }
};


module.exports = administratorController;
