const API_URL = "https://pokeapi.co/api/v2/pokemon/";

const form = document.getElementById("form-busca");
const input = document.getElementById("input-pokemon");
const mensagem = document.getElementById("mensagem-status");
const card = document.getElementById("card-pokemon");
const pokeId = document.getElementById("poke-id");
const pokeImg = document.getElementById("poke-img");
const pokeNome = document.getElementById("poke-nome");
const pokeTipo = document.getElementById("poke-tipo");

const TIPOS = {
  normal: "Normal", fire: "Fogo", water: "Água", electric: "Elétrico",
  grass: "Planta", ice: "Gelo", fighting: "Lutador", poison: "Veneno",
  ground: "Terra", flying: "Voador", psychic: "Psíquico", bug: "Inseto",
  rock: "Pedra", ghost: "Fantasma", dragon: "Dragão", dark: "Sombrio",
  steel: "Aço", fairy: "Fada",
};



function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}


function mostrarMensagem(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.classList.toggle("erro", erro);
}

function esconderCard() {
    card.classList.add("oculto");
}

function renderizarPokemon(dados) {
  const imagem =
    dados.sprites.other["official-artwork"].front_default ||
    dados.sprites.front_default;

  pokeId.textContent = `#${String(dados.id).padStart(3, "0")}`;
  pokeImg.src = imagem;
  pokeImg.alt = `Imagem de ${dados.name}`;
  pokeNome.textContent = capitalizar(dados.name);
  pokeTipo.textContent = dados.types
    .map((t) => TIPOS[t.type.name] || capitalizar(t.type.name))
    .join(" / ");

    card.classList.remove("oculto");

}

async function buscarPokemon(termo) {
  mostrarMensagem("Buscando...");
  esconderCard();

  try {
    const resposta = await fetch(API_URL + termo);

    if (!resposta.ok) {
      throw new Error(
        resposta.status === 404
          ? "Pokémon não encontrado. Confira o nome ou ID."
          : "Erro ao consultar a API."
      );
    }

    const dados = await resposta.json();
    renderizarPokemon(dados);
    mostrarMensagem("");
  } catch (erro) {
    const semConexao = erro instanceof TypeError;
    mostrarMensagem(
      semConexao ? "Falha de conexão. Tente novamente." : erro.message,
      true
    );
  }
}


form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const termo = input.value.trim().toLowerCase();
  if (termo) buscarPokemon(termo);
});