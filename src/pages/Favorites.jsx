import PokemonCard from "../components/PokemonCard"

function Favorites({ favoritos, removerFavorito }) {
  return (
    <div>
      <h1>Favoritos</h1>

      {favoritos.length === 0 ? (
        <p>Nenhum Pokémon favoritado.</p>
      ) : (
        favoritos.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            favorito={true}
            removerFavorito={removerFavorito}
          />
        ))
      )}
    </div>
  )
}

export default Favorites