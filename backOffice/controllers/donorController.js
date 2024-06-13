// todas as funções em baixo vão ser métdodos do objeto donorController
const donorController = {};

donorController.list = async (req, res) => {
  const fetch = await import("node-fetch"); // import dinámico porque em cima não dá
  const { token, userType } = req.cookies;

  const response = await fetch.default(
    "http://localhost:5000/api/donors/list",
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
    title: "Donor Manager",
    userType: userType,
    pageType: "donor",
    donors: data,
  });
};

donorController.createDonor = async (req, res) => {
  try {
    const { token } = req.cookies;
    // Renderiza o ficheiro createDonorPage.ejs na pasta Donors
    res.render("donors/createDonorPage", {
      title: "Criar Doador",
      token: token
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Ocorreu um erro ao renderizar a página. " + err);
  }
};

donorController.editDonor = async (req, res) => {
  const fetch = await import("node-fetch"); // import dinámico porque em cima não dá
  const { token } = req.cookies;

  try {
    const donorId = req.params.id;
    const response = await fetch.default(`http://localhost:5000/api/donors/${donorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
      }
    });

    const donorData = await response.json();
    console.log(donorData);

    // Renderiza a página editDonor.ejs e passa os dados do funcionário como parâmetro
    res.render("donors/editDonorPage", { title: "Editar Doador", donor: donorData, token: token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Ocorreu um erro ao renderizar a página." + err);
  }
};

donorController.deleteDonor = async (req, res) => { 
  const fetch = await import("node-fetch"); // import dinámico porque em cima não dá
  const { token } = req.cookies;
  
  try {
    const donorId = req.params.id;
    const response = await fetch.default(`http://localhost:5000/api/donors/${donorId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
      }
    });

    const donorData = await response.json();
    
    res.redirect("/donors");
  } catch (err) {
    console.error(err);
    res.status(500).send("Ocorreu um erro ao apagar." + err);
  }
};

module.exports = donorController;
