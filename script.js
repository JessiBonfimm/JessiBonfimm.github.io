const botao = document.getElementById("tema");
const raiz = document.documentElement;

function aplicarTema(tema) {
  raiz.dataset.tema = tema;
    botao.textContent = tema === "escuro" ? "\u2600\uFE0F" : "\uD83C\uDF19";
  localStorage.setItem("tema", tema);
}

aplicarTema(localStorage.getItem("tema") || "claro");

botao.addEventListener("click", () => {
  aplicarTema(raiz.dataset.tema === "escuro" ? "claro" : "escuro");
});
/* ===== Players de Ã¡udio e vÃ­deo ===== */
document.querySelectorAll(".player").forEach((player) => {
  const midia = player.querySelector("audio, video");
  if (!midia) return;

  const acao = (nome) => player.querySelector(`[data-acao="${nome}"]`);
  const progresso = acao("progresso");
  const tempoAtual = player.querySelector(".tempo-atual");
  const duracaoMidia = player.querySelector(".duracao-midia");

  const formatarTempo = (segundos) => {
    if (!Number.isFinite(segundos)) return "0:00";
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = Math.floor(segundos % 60);
    return minutos + ":" + String(segundosRestantes).padStart(2, "0");
  };

  const atualizarProgresso = () => {
    const duracao = midia.duration;
    const atual = midia.currentTime || 0;

    if (tempoAtual) tempoAtual.textContent = formatarTempo(atual);
    if (duracaoMidia) duracaoMidia.textContent = formatarTempo(duracao);

    if (progresso) {
      progresso.value = Number.isFinite(duracao) && duracao > 0
        ? (atual / duracao) * 100
        : 0;
    }
  };

  acao("tocar")?.addEventListener("click", () => midia.play().catch(() => {}));
  acao("pausar")?.addEventListener("click", () => midia.pause());

  acao("voltar")?.addEventListener("click", () => {
    midia.currentTime = Math.max(0, midia.currentTime - 5);
  });

  acao("avancar")?.addEventListener("click", () => {
    if (Number.isFinite(midia.duration)) {
      midia.currentTime = Math.min(midia.duration, midia.currentTime + 5);
    }
  });

  acao("volume")?.addEventListener("input", (e) => {
    midia.volume = Number(e.target.value);
  });

  progresso?.addEventListener("input", () => {
    if (Number.isFinite(midia.duration) && midia.duration > 0) {
      midia.currentTime = (Number(progresso.value) / 100) * midia.duration;
    }
  });

  midia.addEventListener("timeupdate", atualizarProgresso);
  midia.addEventListener("loadedmetadata", atualizarProgresso);
  midia.addEventListener("durationchange", atualizarProgresso);
  midia.addEventListener("seeked", atualizarProgresso);

  atualizarProgresso();
});
const formContato = document.getElementById("form-contato");
if (formContato) {
  const aviso = formContato.querySelector(".status");
  const botaoEnviar = formContato.querySelector('button[type="submit"]');

  formContato.addEventListener("submit", async (e) => {
    e.preventDefault();
    aviso.className = "status";

    if (formContato.action.includes("SEU_CODIGO")) {
      aviso.textContent = "O formulÃ¡rio ainda nÃ£o foi configurado com o cÃ³digo do Formspree.";
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
      aviso.textContent = "NÃ£o foi possÃ­vel enviar agora. Tente novamente ou escreva para o e-mail ao lado.";
      aviso.classList.add("erro");
    }
    botaoEnviar.disabled = false;
    botaoEnviar.textContent = "Enviar mensagem";
  });
}


