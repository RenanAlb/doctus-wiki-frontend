import { chamarPaginas, deletarPaginas } from "./requisicoes.js";
const containerListaPaginasHTML = document.getElementById(
  "container-lista-paginas"
);
const containerDocumentacaoHTML = document.getElementById(
  "bottom-container-documentacao"
);
const h2HTML = document.getElementById("h2");
const buttonRemoverPaginaHTML = document.getElementById("botao-remover");
const containerRemoverPaginaHTML = document.getElementById(
  "container-remover-pagina"
);
const pRemoverPaginaHTML = document.getElementById("p-remover-pagina");
const blurRemoverPagina = document.getElementById("blur-remover-pagina");
const buttonCancelar = document.getElementById("button-cancelar");
const buttonSim = document.getElementById("button-sim");
const pHistoricoHTML = document.getElementById("historico");
let paginaAtiva;

let paginasCarregadas;

function construirArvore(paginas) {
  const mapa = {};
  const raiz = [];

  // Primeiro, cria um mapa com cada página
  paginas.forEach((pagina) => {
    mapa[pagina._id] = { ...pagina, filhos: [] };
  });

  // Depois, distribui os filhos para seus respectivos pais
  paginas.forEach((pagina) => {
    if (pagina.ramificacao) {
      mapa[pagina.ramificacao].filhos.push(mapa[pagina._id]);
    } else {
      raiz.push(mapa[pagina._id]);
    }
  });

  console.log(raiz);

  return raiz;
}

function renderizarItem(pagina) {
  console.log(pagina);
  return `
    <details class="pagina-global" id="${pagina._id}">
      <summary>
      ${
        pagina.filhos.length > 0
          ? '<span class="material-symbols-outlined"> keyboard_arrow_right </span>'
          : ' <span class="material-symbols-outlined" style="color: transparent"> keyboard_arrow_right </span>'
      }
       
        ${pagina.titulo}
      </summary>
      <div class="submenu">
        ${
          pagina.filhos.length > 0
            ? pagina.filhos.map(renderizarItem).join("")
            : ``
        }
      </div>
    </details>
  `;
}

let historico = "";
let arvore;

const renderizarPaginas = async () => {
  try {
    const resposta = await chamarPaginas();
    paginasCarregadas = resposta.result;

    console.log(resposta);

    if (!resposta.ok) {
      throw new Error("Erro ao buscar as páginas");
    }

    arvore = construirArvore(resposta.result);
    containerListaPaginasHTML.innerHTML = arvore.map(renderizarItem).join("");

    function construirHistorico(paginaId, paginas) {
      const pagina = paginas.find((p) => p._id === paginaId);
      if (!pagina) return "";

      if (!pagina.ramificacao) {
        // Se não tem ramificação, é raiz
        return `-> ${pagina.titulo}`;
      } else {
        // Vai subindo até chegar na raiz
        return `${construirHistorico(pagina.ramificacao, paginas)} -> ${
          pagina.titulo
        }`;
      }
    }

    document.querySelectorAll(".pagina-global").forEach((e) => {
      e.addEventListener("click", (event) => {
        event.stopPropagation();
        const getID = e.getAttribute("id");

        if (getID) {
          const conteudoPagina = paginasCarregadas.find((p) => p._id === getID);
          if (!conteudoPagina) return;

          paginaAtiva = conteudoPagina;

          // Monta histórico recursivamente
          historico = construirHistorico(paginaAtiva._id, paginasCarregadas);

          pHistoricoHTML.innerHTML = historico;

          containerDocumentacaoHTML.innerHTML = conteudoPagina.conteudo;
          h2HTML.innerHTML = conteudoPagina.titulo;
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};

renderizarPaginas();

// Função auxiliar para buscar uma página na árvore
function encontrarPaginaNaArvore(arvore, id) {
  for (const pagina of arvore) {
    if (pagina._id === id) return pagina;
    if (pagina.filhos.length > 0) {
      const encontrada = encontrarPaginaNaArvore(pagina.filhos, id);
      if (encontrada) return encontrada;
    }
  }
  return null;
}

buttonRemoverPaginaHTML.addEventListener("click", () => {
  const idPaginaAtiva = paginaAtiva._id;

  // Encontra a página na árvore
  const paginaSelecionada = encontrarPaginaNaArvore(arvore, idPaginaAtiva);

  if (!paginaSelecionada) return;

  // Verifica se tem filhos
  if (paginaSelecionada.filhos.length > 0) {
    pRemoverPaginaHTML.innerHTML = `
      A página <strong>${paginaAtiva.titulo}</strong> possui <strong>${paginaSelecionada.filhos.length}</strong> subpágina(s).<br><br>
      <span style="color:red">Se você prosseguir, os filhos também serão excluídos!</span><br><br>
      Deseja mesmo excluir?`;
  } else {
    pRemoverPaginaHTML.innerHTML = `Deseja mesmo excluir a página <strong>${paginaAtiva.titulo}</strong>?`;
  }

  containerRemoverPaginaHTML.style.display = "block";
});

blurRemoverPagina.addEventListener("click", () => {
  containerRemoverPaginaHTML.style.display = "none";
});
buttonCancelar.addEventListener("click", () => {
  containerRemoverPaginaHTML.style.display = "none";
});
buttonSim.addEventListener("click", async () => {
  try {
    const resultadoDeletarPagina = await deletarPaginas(paginaAtiva._id);

    if (!resultadoDeletarPagina.ok) {
      throw new Error("Erro ao deletar a página");
    }

    window.location.reload();
  } catch (error) {
    console.error(error);
  }
});
