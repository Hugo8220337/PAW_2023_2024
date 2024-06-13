// todas as funções em baixo vão ser métdodos do objeto statisticsController
const statisticsController = {};

statisticsController.list = async (req, res) => {
  try {
    const fetch = await import("node-fetch"); // import dinámico porque em cima não dá
    const { token, userType } = req.cookies;

    res.render("pages/adminArea", {
      title: "Statistics",
      userType: userType,
      token: token,
      pageType: "statistics"
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error! " + error);
  }
};

module.exports = statisticsController;
