const botao = document.getElementById("tema");
const raiz = document.documentElement;

function aplicarTema(tema) {
  raiz.dataset.tema = tema;
  botao.textContent = tema === "escuro" ? "☀️" : "🌙";
  localStorage.setItem("tema", tema);
}

aplicarTema(localStorage.getItem("tema") || "claro");

botao.addEventListener("click", () => {
  aplicarTema(raiz.dataset.tema === "escuro" ? "claro" : "escuro");
});