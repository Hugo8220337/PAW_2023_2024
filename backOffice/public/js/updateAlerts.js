/**
 * Obtem o url caso tenha haja algum parametro add, edit ou delete, vai mostrar o respetivo alerta
 */
const dataAlert = document.getElementById("alert-updated");
const urlParams = new URLSearchParams(window.location.search);
const addParam = urlParams.get("add");
const deleteParam = urlParams.get("delete");
const editParam = urlParams.get("edit");

if (addParam === "true") {
  dataAlert.hidden = false; // vai tornar visível
  dataAlert.innerHTML += "Dados adicionados com sucesso!";
} else if (deleteParam === "true") {
  dataAlert.hidden = false;
  dataAlert.innerHTML += "Dados apagados com sucesso!";
} else if (editParam === "true") {
  dataAlert.hidden = false;
  dataAlert.innerHTML += "Dados alterados com sucesso!";
}
