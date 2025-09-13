import { chamarPaginas, criarPaginas } from "./requisicoes.js";
const buttonCriarNovaPaginaHTML = document.getElementById("botao-nova-pagina");
const containerCriarPaginaHTML = document.getElementById(
  "container-criar-pagina"
);
const ramificacaoPaginaHTML = document.getElementById("ramificacao-pagina");
const inputTituloPaginaHTML = document.getElementById("titulo-pagina");
const textareaConteudoPaginaHTML = document.getElementById("conteudo-pagina");
const formCriarPaginaHTML = document.getElementById("form-criar-pagina");
const closeHTML = document.getElementById("close");
const blurHTML = document.getElementById("blur-criar-pagina");

function montarOpcoes(pagina, prefixo = "") {
  const caminho = prefixo ? `${prefixo} -> ${pagina.titulo}` : pagina.titulo;

  let html = `<option value="${pagina._id}">${caminho}</option>`;

  if (pagina.filhos.length > 0) {
    for (let filho of pagina.filhos) {
      html += montarOpcoes(filho, caminho);
    }
  }

  return html;
}

// Botão criar nova página
buttonCriarNovaPaginaHTML.addEventListener("click", async (e) => {
  e.preventDefault();
  containerCriarPaginaHTML.style.display = "block";

  const paginas = await chamarPaginas();

  const mapa = {};
  const raiz = [];

  // Mapeia
  paginas.result.forEach((pagina) => {
    mapa[pagina._id] = { ...pagina, filhos: [] };
  });

  // Liga pais e filhos
  paginas.result.forEach((pagina) => {
    if (pagina.ramificacao) {
      mapa[pagina.ramificacao].filhos.push(mapa[pagina._id]);
    } else {
      raiz.push(mapa[pagina._id]);
    }
  });

  // Monta o <select>
  ramificacaoPaginaHTML.innerHTML = ""; // limpar antes
  ramificacaoPaginaHTML.innerHTML +=
    '<option value="null">Sem ramificação</option>';
  for (let r of raiz) {
    ramificacaoPaginaHTML.innerHTML += montarOpcoes(r);
  }
});

closeHTML.addEventListener("click", (e) => {
  e.preventDefault();
  containerCriarPaginaHTML.style.display = "none";
});

blurHTML.addEventListener("click", (e) => {
  e.preventDefault();
  containerCriarPaginaHTML.style.display = "none";
});

// Enviar Form para criar a página
formCriarPaginaHTML.addEventListener("submit", async (e) => {
  e.preventDefault();
  const titulo = inputTituloPaginaHTML.value;
  let ramificacao = ramificacaoPaginaHTML.value;
  const conteudo = textareaConteudoPaginaHTML.value;

  if (ramificacao === "null") {
    ramificacao = undefined;
  }

  try {
    const respostaCriarPagina = await criarPaginas(
      titulo,
      ramificacao,
      conteudo
    );

    if (!respostaCriarPagina.ok) {
      throw new Error("Erro ao criar a página!");
    }

    window.location.reload();
  } catch (error) {
    console.error(error);
  }
});
