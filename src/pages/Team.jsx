import {
  useEffect,
  useState
} from "react"

import pokemonsLocais from "../data/pokemons"

import {
  buscarPokemons,
  buscarDadosEquipe
} from "../services/pokemonService"


function Team() {

  // ============================================
  // TREINADOR
  // ============================================

  const [
    treinador,
    setTreinador
  ] = useState(() => {
    return (
      localStorage.getItem("nomeTreinador") ||
      ""
    )
  })


  // ============================================
  // POKÉMON DISPONÍVEIS
  // ============================================

  const [
    pokemons,
    setPokemons
  ] = useState([])


  const [
    pokemonSelecionado,
    setPokemonSelecionado
  ] = useState("")


  // ============================================
  // EQUIPE
  // ============================================

  const [
    equipe,
    setEquipe
  ] = useState(() => {

    const equipeSalva =
      localStorage.getItem(
        "equipePokemon"
      )

    return equipeSalva
      ? JSON.parse(equipeSalva)
      : []
  })


  // ============================================
  // ESTADOS
  // ============================================

  const [
    carregando,
    setCarregando
  ] = useState(true)


  const [
    adicionando,
    setAdicionando
  ] = useState(false)


  const [
    erro,
    setErro
  ] = useState("")


  const [
    mensagem,
    setMensagem
  ] = useState("")


  const [
    contingencia,
    setContingencia
  ] = useState(false)


  // ============================================
  // SALVAR EQUIPE
  // ============================================

  useEffect(() => {

    localStorage.setItem(
      "equipePokemon",
      JSON.stringify(equipe)
    )

  }, [equipe])


  // ============================================
  // SALVAR NOME DO TREINADOR
  // ============================================

  useEffect(() => {

    localStorage.setItem(
      "nomeTreinador",
      treinador
    )

  }, [treinador])


  // ============================================
  // CARREGAR LISTA DE POKÉMON
  // ============================================

  async function carregarPokemons() {

    setCarregando(true)

    setContingencia(false)


    try {

      const dados =
        await buscarPokemons()


      setPokemons(
        dados
      )

    } catch (error) {

      console.error(error)


      setPokemons(
        pokemonsLocais
      )


      setContingencia(
        true
      )

    } finally {

      setCarregando(false)

    }
  }


  useEffect(() => {

    carregarPokemons()

  }, [])


  // ============================================
  // ADICIONAR POKÉMON
  // ============================================

  async function enviarFormulario(
    event
  ) {

    event.preventDefault()

    setErro("")
    setMensagem("")


    // Nome do treinador

    if (
      treinador.trim() === ""
    ) {

      setErro(
        "Digite o nome do treinador."
      )

      return
    }


    // Pokémon selecionado

    if (
      pokemonSelecionado === ""
    ) {

      setErro(
        "Escolha um Pokémon."
      )

      return
    }


    // Limite de 6 Pokémon

    if (
      equipe.length >= 6
    ) {

      setErro(
        "Sua equipe já possui 6 Pokémon."
      )

      return
    }


    const id =
      Number(
        pokemonSelecionado
      )


    // Não permite Pokémon repetido

    const jaExiste =
      equipe.some(
        (pokemon) =>
          pokemon.id === id
      )


    if (jaExiste) {

      setErro(
        "Esse Pokémon já está na sua equipe."
      )

      return
    }


    setAdicionando(true)


    try {

      // Busca informações completas
      // evolução + itens + imagem

      const dados =
        await buscarDadosEquipe(
          id
        )


      setEquipe(
        [
          ...equipe,
          dados
        ]
      )


      setMensagem(
        `${dados.nome} foi adicionado à equipe!`
      )


      setPokemonSelecionado(
        ""
      )

    } catch (error) {

      console.error(error)


      // Se a API falhar, ainda tentamos
      // adicionar o Pokémon básico.

      const pokemonLocal =
        pokemons.find(
          (pokemon) =>
            pokemon.id === id
        )


      if (pokemonLocal) {

        const pokemonBasico = {

          id:
            pokemonLocal.id,

          nome:
            pokemonLocal.nome,

          imagem:
            pokemonLocal.imagem,

          evolucoes:
            [],

          itens:
            []

        }


        setEquipe(
          [
            ...equipe,
            pokemonBasico
          ]
        )


        setMensagem(
          `${pokemonLocal.nome} foi adicionado, mas os dados de evolução não puderam ser carregados.`
        )

      } else {

        setErro(
          "Não foi possível adicionar esse Pokémon."
        )
      }

    } finally {

      setAdicionando(false)

    }
  }


  // ============================================
  // REMOVER POKÉMON
  // ============================================

  function removerPokemon(id) {

    const novaEquipe =
      equipe.filter(
        (pokemon) =>
          pokemon.id !== id
      )


    setEquipe(
      novaEquipe
    )


    setMensagem(
      "Pokémon removido da equipe."
    )


    setErro("")
  }


  // ============================================
  // LIMPAR EQUIPE
  // ============================================

  function limparEquipe() {

    setEquipe([])

    setMensagem(
      "Equipe removida."
    )

    setErro("")
  }


  // ============================================
  // INTERFACE
  // ============================================

  return (
    <main className="container">

      <h1 className="titulo">
        Minha Equipe
      </h1>


      <p className="subtitulo">
        Monte sua equipe com até 6 Pokémon
      </p>


      {/* ======================================
          FORMULÁRIO
      ====================================== */}

      <div className="formulario">

        <form
          onSubmit={
            enviarFormulario
          }
        >

          <label>
            Nome do treinador
          </label>


          <input
            type="text"
            value={
              treinador
            }
            onChange={
              (event) =>
                setTreinador(
                  event.target.value
                )
            }
            placeholder="Digite seu nome"
          />


          <label>
            Escolha um Pokémon
          </label>


          <select
            value={
              pokemonSelecionado
            }
            onChange={
              (event) =>
                setPokemonSelecionado(
                  event.target.value
                )
            }
            disabled={
              carregando ||
              adicionando
            }
          >

            <option value="">

              {carregando
                ? "Carregando Pokémon..."
                : "Selecione um Pokémon"}

            </option>


            {pokemons.map(
              (pokemon) => (

                <option
                  key={
                    pokemon.id
                  }
                  value={
                    pokemon.id
                  }
                >

                  #{pokemon.id}
                  {" - "}
                  {pokemon.nome}

                </option>

              )
            )}

          </select>


          <button
            type="submit"
            disabled={
              carregando ||
              adicionando ||
              equipe.length >= 6
            }
          >

            {adicionando
              ? "Adicionando..."
              : equipe.length >= 6
                ? "Equipe completa"
                : "Adicionar à equipe"}

          </button>

        </form>


        {erro && (

          <p className="mensagem-erro">
            {erro}
          </p>

        )}


        {mensagem && (

          <p className="mensagem-sucesso">
            {mensagem}
          </p>

        )}


        {contingencia && (

          <p className="mensagem-contingencia">

            Modo de contingência:
            utilizando Pokémon locais.

          </p>

        )}

      </div>


      {/* ======================================
          EQUIPE
      ====================================== */}

      <section className="equipe-area">

        <h2>
          Equipe de{" "}
          {treinador || "Treinador"}
        </h2>


        <p className="contador-equipe">

          {equipe.length}
          {" / "}
          6 Pokémon

        </p>


        {equipe.length > 0 && (

          <button
            type="button"
            className="botao-limpar-equipe"
            onClick={
              limparEquipe
            }
          >
            Limpar equipe
          </button>

        )}


        {/* EQUIPE VAZIA */}

        {equipe.length === 0 ? (

          <div className="equipe-vazia">

            <p>
              Sua equipe ainda está vazia.
            </p>

            <p>
              Escolha um Pokémon acima para começar.
            </p>

          </div>

        ) : (

          <div className="equipe-grid">

            {equipe.map(
              (pokemon) => (

                <article
                  className="equipe-card"
                  key={
                    pokemon.id
                  }
                >

                  {/* IMAGEM */}

                  <img
                    src={
                      pokemon.imagem
                    }
                    alt={
                      pokemon.nome
                    }
                    className="equipe-pokemon-imagem"
                  />


                  {/* NOME */}

                  <h2>
                    {pokemon.nome}
                  </h2>


                  <p className="pokemon-numero">
                    Nº {pokemon.id}
                  </p>


                  {/* ===========================
                      EVOLUÇÕES
                  =========================== */}

                  <div className="evolucao-area">

                    <h3>
                      Linha evolutiva
                    </h3>


                    {pokemon.evolucoes &&
                    pokemon.evolucoes.length > 0 ? (

                      <div className="evolucao-lista">

                        {pokemon.evolucoes.map(
                          (evolucao) => (

                            <div
                              className="evolucao-item"
                              key={
                                evolucao.id
                              }
                            >

                              <img
                                src={
                                  evolucao.imagem
                                }
                                alt={
                                  evolucao.nome
                                }
                              />


                              <div>

                                <strong>
                                  {evolucao.nome}
                                </strong>


                                <small>
                                  {evolucao.metodo}
                                </small>

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    ) : (

                      <p className="sem-informacao">
                        Informações de evolução indisponíveis.
                      </p>

                    )}

                  </div>


                  {/* ===========================
                      ITENS
                  =========================== */}

                  <div className="itens-area">

                    <h3>
                      Itens
                    </h3>


                    {pokemon.itens &&
                    pokemon.itens.length > 0 ? (

                      <ul className="lista-itens">

                        {pokemon.itens.map(
                          (item) => (

                            <li
                              key={
                                item
                              }
                            >
                              {item}
                            </li>

                          )
                        )}

                      </ul>

                    ) : (

                      <p className="sem-informacao">
                        Nenhum item registrado.
                      </p>

                    )}

                  </div>


                  {/* REMOVER */}

                  <button
                    type="button"
                    className="botao-remover-equipe"
                    onClick={() =>
                      removerPokemon(
                        pokemon.id
                      )
                    }
                  >
                    Remover da equipe
                  </button>

                </article>

              )
            )}

          </div>

        )}

      </section>

    </main>
  )
}


export default Team