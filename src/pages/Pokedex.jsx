import { useState } from "react"
import pokemons from "../data/pokemons"
import PokemonCard from "../components/PokemonCard"

function Pokedex({
  favoritos,
  adicionarFavorito,
  removerFavorito
}) {
  const [busca, setBusca] = useState("")

  const pokemonsFiltrados = pokemons.filter((pokemon) =>
    pokemon.nome
      .toLowerCase()
      .includes(busca.toLowerCase())
  )

 return (
  <main className="container">
    <h1 className="titulo">Pokédex</h1>

    <p className="subtitulo">
      Conheça os 151 Pokémon da primeira geração
    </p>

    <input
      className="busca"
      type="text"
      placeholder="Buscar Pokémon..."
      value={busca}
      onChange={(event) => setBusca(event.target.value)}
    />

    {pokemonsFiltrados.length === 0 ? (
      <p>Nenhum Pokémon encontrado.</p>
    ) : (
      <div className="pokemon-grid">
        {pokemonsFiltrados.map((pokemon) => {
          const favorito = favoritos.some(
            (item) => item.id === pokemon.id
          )

          return (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              favorito={favorito}
              adicionarFavorito={adicionarFavorito}
              removerFavorito={removerFavorito}
            />
          )
        })}
      </div>
    )}
  </main>
)
}

export default Pokedex