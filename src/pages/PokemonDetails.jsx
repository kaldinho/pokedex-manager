import {
  useEffect,
  useState
} from "react"

import {
  useParams,
  Link
} from "react-router-dom"

import pokemonsLocais from "../data/pokemons"

import {
  buscarPokemonPorId
} from "../services/pokemonService"


function PokemonDetails() {
  const { id } = useParams()

  const [
    pokemon,
    setPokemon
  ] = useState(null)

  const [
    carregando,
    setCarregando
  ] = useState(true)

  const [
    erro,
    setErro
  ] = useState("")

  const [
    contingencia,
    setContingencia
  ] = useState(false)

  const [
    mostrarShiny,
    setMostrarShiny
  ] = useState(false)

  const [
    mostrarTodosGolpes,
    setMostrarTodosGolpes
  ] = useState(false)


  // ============================================
  // CARREGAR POKÉMON
  // ============================================

  async function carregarPokemon() {
    setCarregando(true)
    setErro("")
    setContingencia(false)
    setMostrarShiny(false)
    setMostrarTodosGolpes(false)

    try {
      const dados =
        await buscarPokemonPorId(id)

      setPokemon(dados)

    } catch (error) {
      console.error(error)

      const local =
        pokemonsLocais.find(
          (item) =>
            item.id === Number(id)
        )

      setPokemon(
        local || null
      )

      setErro(
        "Não foi possível acessar a PokéAPI."
      )

      setContingencia(true)

    } finally {
      setCarregando(false)
    }
  }


  useEffect(() => {
    carregarPokemon()
  }, [id])


  // ============================================
  // CARREGAMENTO
  // ============================================

  if (carregando) {
    return (
      <main className="container">

        <div className="pokemon-detalhes">

          <h1 className="titulo">
            Carregando...
          </h1>

          <p>
            Buscando informações do Pokémon.
          </p>

        </div>

      </main>
    )
  }


  // ============================================
  // NÃO ENCONTRADO
  // ============================================

  if (!pokemon) {
    return (
      <main className="container">

        <div className="pokemon-detalhes">

          <h1 className="titulo">
            Pokémon não encontrado
          </h1>

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


  // ============================================
  // GOLPES VISÍVEIS
  // ============================================

  const golpesVisiveis =
    mostrarTodosGolpes
      ? pokemon.golpes || []
      : (pokemon.golpes || []).slice(
          0,
          12
        )


  // ============================================
  // INTERFACE
  // ============================================

  return (
    <main className="container">

      <div className="pokemon-detalhes pokemon-detalhes-completo">

        {/* =====================================
            IMAGEM
        ===================================== */}

        <div className="detalhes-imagem-area">

          <img
            className="pokemon-imagem-detalhes"
            src={
              mostrarShiny &&
              pokemon.imagemShiny
                ? pokemon.imagemShiny
                : pokemon.imagem
            }
            alt={
              mostrarShiny
                ? `${pokemon.nome} Shiny`
                : pokemon.nome
            }
          />


          {mostrarShiny && (
            <span className="shiny-label">
              ✨ SHINY
            </span>
          )}

        </div>


        <h1 className="titulo">
          {pokemon.nome}
        </h1>


        <p className="pokemon-numero-detalhes">
          Nº {pokemon.id}
        </p>


        {/* =====================================
            ERRO
        ===================================== */}

        {erro && (
          <>

            <p className="mensagem-erro">
              {erro}
            </p>

            <button
              type="button"
              className="botao-detalhes"
              onClick={
                carregarPokemon
              }
            >
              Tentar novamente
            </button>

          </>
        )}


        {!contingencia && (
          <>

            {/* =================================
                NORMAL / SHINY
            ================================= */}

            {pokemon.imagemShiny && (

              <div className="shiny-controles">

                <button
                  type="button"
                  className={
                    !mostrarShiny
                      ? "botao-forma ativo"
                      : "botao-forma"
                  }
                  onClick={() =>
                    setMostrarShiny(false)
                  }
                >
                  Normal
                </button>


                <button
                  type="button"
                  className={
                    mostrarShiny
                      ? "botao-forma ativo"
                      : "botao-forma"
                  }
                  onClick={() =>
                    setMostrarShiny(true)
                  }
                >
                  ✨ Shiny
                </button>

              </div>

            )}


            {/* =================================
                DESCRIÇÃO DA POKÉDEX
            ================================= */}

            <section className="detalhes-secao">

              <h2>
                📖 Pokédex
              </h2>

              <p className="descricao-pokedex">
                {pokemon.descricao ||
                  "Descrição não disponível."}
              </p>

            </section>


            {/* =================================
                INFORMAÇÕES
            ================================= */}

            <section className="detalhes-secao">

              <h2>
                Informações
              </h2>


              <div className="info-grid">

                <div className="info-box">
                  <strong>
                    Categoria
                  </strong>

                  <span>
                    {pokemon.categoria ||
                      "N/D"}
                  </span>
                </div>


                <div className="info-box">
                  <strong>
                    Geração
                  </strong>

                  <span>
                    {pokemon.geracao ||
                      "N/D"}
                  </span>
                </div>


                <div className="info-box">
                  <strong>
                    Região
                  </strong>

                  <span>
                    {pokemon.regiao ||
                      "N/D"}
                  </span>
                </div>


                <div className="info-box">
                  <strong>
                    Habitat
                  </strong>

                  <span>
                    {pokemon.habitat ||
                      "N/D"}
                  </span>
                </div>


                <div className="info-box">
                  <strong>
                    Altura
                  </strong>

                  <span>
                    {pokemon.altura} m
                  </span>
                </div>


                <div className="info-box">
                  <strong>
                    Peso
                  </strong>

                  <span>
                    {pokemon.peso} kg
                  </span>
                </div>


                <div className="info-box">
                  <strong>
                    Experiência base
                  </strong>

                  <span>
                    {pokemon.experienciaBase ??
                      "N/D"}
                  </span>
                </div>

              </div>

            </section>


            {/* =================================
                TIPOS
            ================================= */}

            <section className="detalhes-secao">

              <h2>
                Tipos
              </h2>

              <div className="tags-pokemon">

                {pokemon.tipos.map(
                  (tipo) => (

                    <span
                      className="tag-pokemon"
                      key={tipo}
                    >
                      {tipo}
                    </span>

                  )
                )}

              </div>

            </section>


            {/* =================================
                FRAQUEZAS
            ================================= */}

            <section className="detalhes-secao">

              <h2>
                Fraquezas
              </h2>


              {pokemon.fraquezas?.length > 0 ? (

                <div className="tags-pokemon">

                  {pokemon.fraquezas.map(
                    (tipo) => (

                      <span
                        className="tag-pokemon fraqueza"
                        key={tipo.nome}
                      >
                        {tipo.nome}
                        {" ×"}
                        {tipo.multiplicador}
                      </span>

                    )
                  )}

                </div>

              ) : (

                <p>
                  Nenhuma fraqueza registrada.
                </p>

              )}

            </section>


            {/* =================================
                RESISTÊNCIAS
            ================================= */}

            <section className="detalhes-secao">

              <h2>
                Resistências
              </h2>


              {pokemon.resistencias?.length > 0 ? (

                <div className="tags-pokemon">

                  {pokemon.resistencias.map(
                    (tipo) => (

                      <span
                        className="tag-pokemon resistencia"
                        key={tipo.nome}
                      >
                        {tipo.nome}
                        {" ×"}
                        {tipo.multiplicador}
                      </span>

                    )
                  )}

                </div>

              ) : (

                <p>
                  Nenhuma resistência registrada.
                </p>

              )}

            </section>


            {/* =================================
                IMUNIDADES
            ================================= */}

            <section className="detalhes-secao">

              <h2>
                Imunidades
              </h2>


              {pokemon.imunidades?.length > 0 ? (

                <div className="tags-pokemon">

                  {pokemon.imunidades.map(
                    (tipo) => (

                      <span
                        className="tag-pokemon imunidade"
                        key={tipo}
                      >
                        {tipo} ×0
                      </span>

                    )
                  )}

                </div>

              ) : (

                <p>
                  Nenhuma imunidade.
                </p>

              )}

            </section>


            {/* =================================
                HABILIDADES
            ================================= */}

            <section className="detalhes-secao">

              <h2>
                Habilidades
              </h2>


              <div className="habilidades-lista">

                {pokemon.habilidades.map(
                  (habilidade) => (

                    <div
                      className="habilidade-card"
                      key={
                        habilidade.nome
                      }
                    >

                      <h3>
                        {habilidade.nome}

                        {habilidade.oculta && (
                          <span className="habilidade-oculta">
                            Oculta
                          </span>
                        )}

                      </h3>


                      <p>
                        {habilidade.descricao}
                      </p>

                    </div>

                  )
                )}

              </div>

            </section>


            {/* =================================
                ATRIBUTOS
            ================================= */}

            <section className="detalhes-secao">

              <h2>
                Atributos
              </h2>


              <div className="stats-lista">

                {pokemon.stats.map(
                  (stat) => (

                    <div
                      className="stat-item"
                      key={
                        stat.nome
                      }
                    >

                      <div className="stat-cabecalho">

                        <strong>
                          {stat.nome}
                        </strong>

                        <span>
                          {stat.valor}
                        </span>

                      </div>


                      <div className="stat-barra">

                        <div
                          className="stat-preenchimento"
                          style={{
                            width:
                              `${Math.min(
                                stat.valor / 255 * 100,
                                100
                              )}%`
                          }}
                        />

                      </div>

                    </div>

                  )
                )}

              </div>

            </section>


            {/* =================================
                GOLPES
            ================================= */}

            <section className="detalhes-secao">

              <h2>
                ⚔️ Golpes por nível
              </h2>


              <p className="versao-golpes">
                Versão dos dados:{" "}
                <strong>
                  {pokemon.versaoGolpes ||
                    "Não disponível"}
                </strong>
              </p>


              {pokemon.golpes?.length > 0 ? (

                <>

                  <div className="golpes-lista">

                    {golpesVisiveis.map(
                      (
                        golpe,
                        index
                      ) => (

                        <div
                          className="golpe-item"
                          key={
                            `${golpe.nome}-${golpe.nivel}-${index}`
                          }
                        >

                          <span className="golpe-nivel">
                            {golpe.nivel === 0
                              ? "Inicial"
                              : `Nv. ${golpe.nivel}`}
                          </span>


                          <strong>
                            {golpe.nome}
                          </strong>

                        </div>

                      )
                    )}

                  </div>


                  {pokemon.golpes.length > 12 && (

                    <button
                      type="button"
                      className="botao-mostrar-golpes"
                      onClick={() =>
                        setMostrarTodosGolpes(
                          !mostrarTodosGolpes
                        )
                      }
                    >

                      {mostrarTodosGolpes
                        ? "Mostrar menos"
                        : `Ver todos os ${pokemon.golpes.length} golpes`}

                    </button>

                  )}

                </>

              ) : (

                <p>
                  Nenhum golpe por nível encontrado.
                </p>

              )}

            </section>


            {/* =================================
                SOM
            ================================= */}

            {pokemon.som && (

              <section className="detalhes-secao">

                <h2>
                  🔊 Som do Pokémon
                </h2>


                <audio
                  className="pokemon-audio"
                  controls
                  src={pokemon.som}
                >
                  Seu navegador não suporta áudio.
                </audio>

              </section>

            )}

          </>
        )}


        {/* =====================================
            VOLTAR
        ===================================== */}

        <Link
          className="botao-detalhes botao-voltar"
          to="/pokedex"
        >
          Voltar para a Pokédex
        </Link>

      </div>

    </main>
  )
}


export default PokemonDetails