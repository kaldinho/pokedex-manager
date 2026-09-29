import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Pokedex from "./pages/Pokedex"
import PokemonDetails from "./pages/PokemonDetails"
import Favorites from "./pages/Favorites"
import Team from "./pages/Team"
function App() {
  const [favoritos, setFavoritos] = useState(() => {
    const favoritosSalvos = localStorage.getItem("favoritos")

    return favoritosSalvos
      ? JSON.parse(favoritosSalvos)
      : []
  })

  useEffect(() => {
    localStorage.setItem(
      "favoritos",
      JSON.stringify(favoritos)
    )
  }, [favoritos])

  function adicionarFavorito(pokemon) {
    const jaExiste = favoritos.some(
      (favorito) => favorito.id === pokemon.id
    )

    if (!jaExiste) {
      setFavoritos([...favoritos, pokemon])
    }
  }

  function removerFavorito(id) {
    const novaLista = favoritos.filter(
      (pokemon) => pokemon.id !== id
    )

    setFavoritos(novaLista)
  }

  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
<Route
  path="/equipe"
  element={<Team />}
/>
        <Route
          path="/pokedex"
          element={
            <Pokedex
              favoritos={favoritos}
              adicionarFavorito={adicionarFavorito}
              removerFavorito={removerFavorito}
            />
          }
        />

        <Route
          path="/pokemon/:id"
          element={
            <PokemonDetails
              favoritos={favoritos}
              adicionarFavorito={adicionarFavorito}
              removerFavorito={removerFavorito}
            />
          }
        />

        <Route
          path="/favoritos"
          element={
            <Favorites
              favoritos={favoritos}
              removerFavorito={removerFavorito}
            />
          }
        />
      </Routes>
    </>
  )
}

export default App