import { useState } from "react"
import {
  Link,
  useNavigate
} from "react-router-dom"

import {
  criarUsuario
} from "../services/authService"

function Register() {
  const navigate = useNavigate()

  const [firstName, setFirstName] =
    useState("")
  const [lastName, setLastName] =
    useState("")
  const [username, setUsername] =
    useState("")
  const [email, setEmail] =
    useState("")
  const [password, setPassword] =
    useState("")

  const [erro, setErro] =
    useState("")
  const [mensagem, setMensagem] =
    useState("")
  const [carregando, setCarregando] =
    useState(false)

  async function enviarFormulario(event) {
    event.preventDefault()

    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    ) {
      setErro("Preencha todos os campos.")
      setMensagem("")
      return
    }

    if (password.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.")
      setMensagem("")
      return
    }

    setCarregando(true)
    setErro("")
    setMensagem("")

    try {
      await criarUsuario({
        firstName,
        lastName,
        username,
        email,
        password
      })

      setMensagem("Conta criada com sucesso!")

      setTimeout(() => {
        navigate("/login")
      }, 1200)

    } catch (error) {
      setErro(error.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-overlay">

        <div className="auth-layout">

          <div className="auth-pokemon-box">
            <h1 className="auth-title">
              Pokédex Manager
            </h1>

            <p className="auth-subtitle">
              Crie sua conta e monte sua equipe Pokémon.
            </p>

            <img
              src="/pokemon/6.png"
              alt="Charizard"
              className="auth-pokemon-image"
            />
          </div>

          <div className="formulario auth-card">
            <h2 className="titulo">
              Criar conta
            </h2>

            <form onSubmit={enviarFormulario}>

              <label>Nome</label>
              <input
                type="text"
                value={firstName}
                onChange={(event) =>
                  setFirstName(event.target.value)
                }
              />

              <label>Sobrenome</label>
              <input
                type="text"
                value={lastName}
                onChange={(event) =>
                  setLastName(event.target.value)
                }
              />

              <label>Usuário</label>
              <input
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
              />

              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />

              <label>Senha</label>
              <input
                type="password"
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

              {mensagem && (
                <p className="mensagem-sucesso">
                  {mensagem}
                </p>
              )}

              <button
                type="submit"
                disabled={carregando}
              >
                {carregando
                  ? "Criando..."
                  : "Criar conta"}
              </button>

            </form>

            <p className="auth-link">
              Já possui conta?{" "}
              <Link to="/login">
                Entrar
              </Link>
            </p>
          </div>

        </div>

      </div>
    </main>
  )
}

export default Register