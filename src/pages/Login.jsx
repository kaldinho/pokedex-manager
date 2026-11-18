import { useState } from "react"

import {
  Link,
  useNavigate
} from "react-router-dom"

import {
  login
} from "../services/authService"

function Login({ onLogin }) {
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)

  async function enviarFormulario(event) {
    event.preventDefault()

    if (
      username.trim() === "" ||
      password.trim() === ""
    ) {
      setErro("Preencha usuário e senha.")
      return
    }

    setCarregando(true)
    setErro("")

    try {
      const dados = await login(
        username,
        password
      )

      onLogin(dados)

      navigate("/pokedex")

    } catch (error) {

      setErro(error.message)

    } finally {

      setCarregando(false)

    }
  }

  return (
    <main className="auth-page">

      <div className="login-container">

        <h1 className="auth-title">
          Pokédex Manager
        </h1>

        <p className="auth-subtitle">
          Sua jornada Pokémon começa aqui.
        </p>

        <div className="formulario auth-card">

          <h2 className="titulo">
            Entrar
          </h2>

          <form onSubmit={enviarFormulario}>

            <label>
              Usuário
            </label>

            <input
              type="text"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
            />

            <label>
              Senha
            </label>

            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />

            {erro && (
              <p className="mensagem-erro">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
            >
              {carregando
                ? "Entrando..."
                : "Entrar"}
            </button>

          </form>

          <p className="auth-link">
            Ainda não possui conta?{" "}

            <Link to="/cadastro">
              Criar conta
            </Link>
          </p>

        </div>

      </div>

    </main>
  )
}

export default Login