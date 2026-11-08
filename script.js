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
/* ===== Players de áudio e vídeo ===== */
document.querySelectorAll(".player").forEach((player) => {
  const midia = player.querySelector("audio, video");
  const acao = (nome) => player.querySelector(`[data-acao="${nome}"]`);

  acao("tocar").addEventListener("click", () => midia.play().catch(() => {}));
  acao("pausar").addEventListener("click", () => midia.pause());

  acao("voltar").addEventListener("click", () => {
    midia.currentTime = Math.max(0, midia.currentTime - 5);
  });

  acao("avancar").addEventListener("click", () => {
    const fim = midia.duration || midia.currentTime + 5;
    midia.currentTime = Math.min(fim, midia.currentTime + 5);
  });

  acao("volume").addEventListener("input", (e) => {
    midia.volume = Number(e.target.value);
  });
});

/* ===== Formulario de contato ===== */
const formContato = document.getElementById("form-contato");
if (formContato) {
  const aviso = formContato.querySelector(".status");
  const botaoEnviar = formContato.querySelector('button[type="submit"]');

  formContato.addEventListener("submit", async (e) => {
    e.preventDefault();
    aviso.className = "status";

    if (formContato.action.includes("SEU_CODIGO")) {
      aviso.textContent = "O formulário ainda não foi configurado com o código do Formspree.";
      aviso.classList.add("erro");
      return;
    }

    botaoEnviar.disabled = true;
    botaoEnviar.textContent = "Enviando...";
    try {
      const resp = await fetch(formContato.action, {
        method: "POST",
        body: new FormData(formContato),
        headers: { Accept: "application/json" }
      });
      if (!resp.ok) throw new Error("falhou");
      formContato.reset();
      aviso.textContent = "Mensagem enviada com sucesso! Obrigada pelo contato, respondo em breve por e-mail.";
      aviso.classList.add("ok");
    } catch (erro) {
      aviso.textContent = "Não foi possível enviar agora. Tente novamente ou escreva para o e-mail ao lado.";
      aviso.classList.add("erro");
    }
    botaoEnviar.disabled = false;
    botaoEnviar.textContent = "Enviar mensagem";
  });
}
