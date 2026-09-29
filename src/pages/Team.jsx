import { useState } from "react"
import pokemons from "../data/pokemons"

function Team() {
  const [treinador, setTreinador] = useState("")
  const [pokemonSelecionado, setPokemonSelecionado] = useState("")
  const [erro, setErro] = useState("")
  const [mensagem, setMensagem] = useState("")

  function enviarFormulario(event) {
    event.preventDefault()

    if (treinador.trim() === "" || pokemonSelecionado === "") {
      setErro("Preencha todos os campos.")
      setMensagem("")
      return
    }

    setErro("")
    setMensagem(
      `${treinador} escolheu ${pokemonSelecionado} para sua equipe!`
    )
  }

  return (
    <div>
      <h1>Minha Equipe</h1>

      <form onSubmit={enviarFormulario}>
        <div>
          <label>Nome do treinador:</label>

          <br />

          <input
            type="text"
            value={treinador}
            onChange={(event) => setTreinador(event.target.value)}
            placeholder="Digite seu nome"
          />
        </div>

        <br />

        <div>
          <label>Escolha um Pokémon:</label>

          <br />

          <select
            value={pokemonSelecionado}
            onChange={(event) =>
              setPokemonSelecionado(event.target.value)
            }
          >
            <option value="">Selecione um Pokémon</option>

            {pokemons.map((pokemon) => (
              <option
                key={pokemon.id}
                value={pokemon.nome}
              >
                {pokemon.nome}
              </option>
            ))}
          </select>
        </div>

        <br />

        <button type="submit">
          Adicionar à equipe
        </button>
      </form>

      {erro && <p>{erro}</p>}

      {mensagem && <p>{mensagem}</p>}
    </div>
  )
}

export default Team