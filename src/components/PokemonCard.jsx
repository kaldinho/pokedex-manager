import { Link } from "react-router-dom"

function PokemonCard({
  pokemon,
  favorito,
  adicionarFavorito,
  removerFavorito
}) {
  return (
    <div className="pokemon-card">

      <img
        className="pokemon-imagem"
        src={pokemon.imagem}
        alt={pokemon.nome}
        loading="lazy"
      />

      <h2>
        {pokemon.nome}
      </h2>

      <p className="pokemon-numero">
        Nº {pokemon.id}
      </p>

      <div className="pokemon-card-acoes">

        <Link
          className="botao-detalhes"
          to={`/pokemon/${pokemon.id}`}
        >
          Ver detalhes
        </Link>

        {favorito ? (
          <button
            type="button"
            className="botao-favorito"
            onClick={() =>
              removerFavorito(
                pokemon.id
              )
            }
          >
            Remover favorito
          </button>
        ) : (
          <button
            type="button"
            className="botao-favorito"
            onClick={() =>
              adicionarFavorito(
                pokemon
              )
            }
          >
            Favoritar
          </button>
        )}

      </div>

    </div>
  )
}

export default PokemonCard