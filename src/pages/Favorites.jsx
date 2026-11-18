import PokemonCard from "../components/PokemonCard"

function Favorites({
  favoritos,
  removerFavorito
}) {
  return (
    <main className="container">

      <h1 className="titulo">
        Favoritos
      </h1>

      <p className="subtitulo">
        Seus Pokémon favoritos
      </p>

      {favoritos.length === 0 ? (
        <p>
          Nenhum Pokémon favoritado.
        </p>
      ) : (
        <div className="pokemon-grid">

          {favoritos.map(
            (pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                favorito={true}
                removerFavorito={
                  removerFavorito
                }
              />
            )
          )}

        </div>
      )}

    </main>
  )
}

export default Favorites