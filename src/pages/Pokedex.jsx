import { useEffect, useState } from "react"

import PokemonCard from "../components/PokemonCard"

import pokemonsLocais from "../data/pokemons"

import {
  buscarPokemons
} from "../services/pokemonService"

function Pokedex({
  favoritos,
  adicionarFavorito,
  removerFavorito
}) {
  // Lista principal de Pokémon
  const [pokemons, setPokemons] =
    useState([])

  // Campo de busca
  const [busca, setBusca] =
    useState("")

  // Estado de carregamento
  const [carregando, setCarregando] =
    useState(true)

  // Mensagem de erro
  const [erro, setErro] =
    useState("")

  // Indica se estamos usando os dados locais
  const [
    usandoContingencia,
    setUsandoContingencia
  ] = useState(false)


  // ============================================
  // CARREGAR POKÉMON
  // ============================================

  async function carregarPokemons() {
    setCarregando(true)
    setErro("")
    setUsandoContingencia(false)

    try {
      const dados =
        await buscarPokemons()

      setPokemons(dados)

    } catch (error) {
      console.error(error)

      setErro(
        "Não foi possível acessar a PokéAPI. Os dados locais estão sendo utilizados."
      )

      // Fallback da AV1
      setPokemons(
        pokemonsLocais
      )

      setUsandoContingencia(
        true
      )

    } finally {
      setCarregando(false)
    }
  }


  // ============================================
  // CARREGAR AO ABRIR A PÁGINA
  // ============================================

  useEffect(() => {
    carregarPokemons()
  }, [])


  // ============================================
  // FILTRO DA BUSCA
  // ============================================

  const pokemonsFiltrados =
    pokemons.filter(
      (pokemon) =>
        pokemon.nome
          .toLowerCase()
          .includes(
            busca
              .trim()
              .toLowerCase()
          )
    )


  // ============================================
  // CARREGAMENTO
  // ============================================

  if (carregando) {
    return (
      <main className="container">

        <h1 className="titulo">
          Pokédex
        </h1>

        <p className="subtitulo">
          Carregando Pokémon...
        </p>

      </main>
    )
  }


  // ============================================
  // INTERFACE
  // ============================================

  return (
    <main className="container">

      <h1 className="titulo">
        Pokédex
      </h1>


      {/* QUANTIDADE DINÂMICA */}

      <p className="subtitulo">

        {usandoContingencia
          ? `${pokemons.length} Pokémon disponíveis no modo de contingência`
          : `Explore ${pokemons.length} espécies Pokémon disponíveis na PokéAPI`
        }

      </p>


      {/* ERRO DA API */}

      {erro && (
        <div className="aviso-api">

          <p className="mensagem-erro">
            {erro}
          </p>

          <button
            type="button"
            className="botao-detalhes"
            onClick={
              carregarPokemons
            }
          >
            Tentar novamente
          </button>

        </div>
      )}


      {/* API FUNCIONANDO */}

      {!erro && (
        <p className="mensagem-sucesso">
          Dados carregados pela PokéAPI.
        </p>
      )}


      {/* CONTINGÊNCIA */}

      {usandoContingencia && (
        <p className="mensagem-contingencia">
          Modo de contingência ativo:
          utilizando dados locais da AV1.
        </p>
      )}


      {/* BUSCA */}

      <input
        className="busca"
        type="text"
        placeholder="Buscar Pokémon pelo nome..."
        value={busca}
        onChange={(event) =>
          setBusca(
            event.target.value
          )
        }
      />


      {/* QUANTIDADE DA BUSCA */}

      {busca && (
        <p className="resultado-busca">

          {pokemonsFiltrados.length}
          {" "}
          resultado(s) encontrado(s)

        </p>
      )}


      {/* LISTA */}

      {pokemonsFiltrados.length === 0 ? (

        <p className="mensagem-erro">
          Nenhum Pokémon encontrado.
        </p>

      ) : (

        <div className="pokemon-grid">

          {pokemonsFiltrados.map(
            (pokemon) => {

              const favorito =
                favoritos.some(
                  (item) =>
                    item.id ===
                    pokemon.id
                )

              return (
                <PokemonCard
                  key={
                    pokemon.id
                  }

                  pokemon={
                    pokemon
                  }

                  favorito={
                    favorito
                  }

                  adicionarFavorito={
                    adicionarFavorito
                  }

                  removerFavorito={
                    removerFavorito
                  }
                />
              )
            }
          )}

        </div>
      )}

    </main>
  )
}

export default Pokedex