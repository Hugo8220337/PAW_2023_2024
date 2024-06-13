// todas as funções em baixo vão ser métdodos do objeto employeeControler
const employeeControler = {};

employeeControler.list = async (req, res) => {
  const fetch = await import("node-fetch"); // import dinámico porque em cima não dá
  const { token, userType } = req.cookies;

  const response = await fetch.default(
    "http://localhost:5000/api/employees/list",
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
    title: "Employee Manager",
    userType: userType,
    pageType: "employee",
    employees: data,
  });
};

employeeControler.createEmployee = async (req, res) => {
  try {
    const { token } = req.cookies;
    // Renderiza o ficheiro createEmployeePage.ejs na pasta employees
    res.render("employees/createEmployeePage", {
      title: "Criar Funcionário",
      token: token
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Ocorreu um erro ao renderizar a página. " + err);
  }
};

employeeControler.editEmployee = async (req, res) => {
  const fetch = await import("node-fetch"); // import dinámico porque em cima não dá
  const { token } = req.cookies;

  try {
    const employeeId = req.params.id;
    const response = await fetch.default(`http://localhost:5000/api/employees/${employeeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
      }
    });

    const employeeData = await response.json();

    // Renderiza a página editEmployee.ejs e passa os dados do funcionário como parâmetro
    res.render("employees/editEmployeePage", { title: "Editar Funcionário", employee: employeeData, token: token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Ocorreu um erro ao renderizar a página." + err);
  }
};

employeeControler.deleteEmployee = async (req, res) => { 
  const fetch = await import("node-fetch"); // import dinámico porque em cima não dá
  const { token } = req.cookies;
  
  try {
    const employeeId = req.params.id;
    const response = await fetch.default(`http://localhost:5000/api/employees/${employeeId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token
      }
    });

    const employeeData = await response.json();
    
    res.redirect("/employees");
  } catch (err) {
    console.error(err);
    res.status(500).send("Ocorreu um erro ao apagar." + err);
  }
};

module.exports = employeeControler;
