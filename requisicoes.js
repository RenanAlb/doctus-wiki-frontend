const url = "https://doctus-wiki-backend.onrender.com/api/pages";

export const chamarPaginas = async () => {
  try {
    const respostaChamarPaginas = await fetch(url);

    if (!respostaChamarPaginas.ok) {
      throw new Error("Erro ao buscar as páginas");
    }

    const respostaChamarPaginasJSON = await respostaChamarPaginas.json();

    return respostaChamarPaginasJSON;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const criarPaginas = async (titulo, ramificacao, conteudo) => {
  try {
    const respostaCriarPaginas = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, ramificacao, conteudo }),
    });

    if (!respostaCriarPaginas.ok) {
      throw new Error("Erro ao criar a página");
    }

    const respostaCriarPaginasJSON = await respostaCriarPaginas.json();

    return respostaCriarPaginasJSON;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const deletarPaginas = async (id) => {
  try {
    const respostaCriarPaginas = await fetch(`${url}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!respostaCriarPaginas.ok) {
      throw new Error("Erro ao criar a página");
    }

    const respostaCriarPaginasJSON = await respostaCriarPaginas.json();

    return respostaCriarPaginasJSON;
  } catch (error) {
    console.error(error);
    return [];
  }
};
