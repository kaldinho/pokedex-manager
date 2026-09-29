import { useParams, Link } from "react-router-dom"
import pokemons from "../data/pokemons"

function PokemonDetails() {
  const { id } = useParams()

  const pokemon = pokemons.find(
    (pokemon) => pokemon.id === Number(id)
  )

  if (!pokemon) {
    return (
      <main className="container">
        <h1 className="titulo">Pokémon não encontrado</h1>

        <Link className="botao-detalhes" to="/pokedex">
          Voltar para a Pokédex
        </Link>
      </main>
    )
  }

  return (
    <main className="container">
      <div className="pokemon-detalhes">
        <img
          className="pokemon-imagem-detalhes"
          src={pokemon.imagem}
          alt={pokemon.nome}
        />

        <h1 className="titulo">
          {pokemon.nome}
        </h1>

        <p className="pokemon-numero">
          Número da Pokédex: #{pokemon.id}
        </p>

        <Link
          className="botao-detalhes"
          to="/pokedex"
        >
          Voltar para a Pokédex
        </Link>
      </div>
    </main>
  )
}

export default PokemonDetails