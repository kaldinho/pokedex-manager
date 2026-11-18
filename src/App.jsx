import {
  useEffect,
  useState
} from "react"

import {
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom"

import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"

import Pokedex from "./pages/Pokedex"
import PokemonDetails from "./pages/PokemonDetails"
import Favorites from "./pages/Favorites"
import Team from "./pages/Team"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"

import {
  obterUsuario
} from "./services/authService"

function App() {
  const location = useLocation()

  // ============================================
  // FAVORITOS
  // ============================================

  const [favoritos, setFavoritos] =
    useState(() => {
      const salvos =
        localStorage.getItem("favoritos")

      return salvos
        ? JSON.parse(salvos)
        : []
    })

  useEffect(() => {
    localStorage.setItem(
      "favoritos",
      JSON.stringify(favoritos)
    )
  }, [favoritos])

  // ============================================
  // SESSÃO
  // ============================================

  const [sessao, setSessao] =
    useState(() => {
      const salva =
        localStorage.getItem("sessao")

      return salva
        ? JSON.parse(salva)
        : null
    })

  const [
    validandoSessao,
    setValidandoSessao
  ] = useState(
    Boolean(sessao?.accessToken)
  )

  // ============================================
  // RESTAURAR SESSÃO
  // ============================================

  useEffect(() => {
    async function validarSessao() {
      if (!sessao?.accessToken) {
        setValidandoSessao(false)
        return
      }

      try {
        const usuario =
          await obterUsuario(
            sessao.accessToken
          )

        const sessaoAtualizada = {
          ...sessao,
          usuario
        }

        setSessao(
          sessaoAtualizada
        )

        localStorage.setItem(
          "sessao",
          JSON.stringify(
            sessaoAtualizada
          )
        )
      } catch (error) {
        console.error(
          "Sessão inválida:",
          error
        )

        localStorage.removeItem(
          "sessao"
        )

        setSessao(null)
      } finally {
        setValidandoSessao(false)
      }
    }

    validarSessao()
  }, [])

  // ============================================
  // FAVORITOS
  // ============================================

  function adicionarFavorito(pokemon) {
    const existe =
      favoritos.some(
        (item) =>
          item.id === pokemon.id
      )

    if (!existe) {
      setFavoritos([
        ...favoritos,
        pokemon
      ])
    }
  }

  function removerFavorito(id) {
    setFavoritos(
      favoritos.filter(
        (pokemon) =>
          pokemon.id !== id
      )
    )
  }

  // ============================================
  // LOGIN
  // ============================================

  function entrar(dados) {
    const novaSessao = {
      accessToken:
        dados.accessToken,

      refreshToken:
        dados.refreshToken,

      usuario: {
        id:
          dados.id,

        username:
          dados.username,

        firstName:
          dados.firstName,

        lastName:
          dados.lastName,

        email:
          dados.email,

        image:
          dados.image
      }
    }

    setSessao(
      novaSessao
    )

    localStorage.setItem(
      "sessao",
      JSON.stringify(
        novaSessao
      )
    )
  }

  // ============================================
  // LOGOUT
  // ============================================

  function sair() {
    localStorage.removeItem(
      "sessao"
    )

    setSessao(null)
  }

  // ============================================
  // PÁGINAS PÚBLICAS
  // ============================================

  const paginaPublica =
    location.pathname === "/login" ||
    location.pathname === "/cadastro"

  // ============================================
  // PROTEGER ROTAS
  // ============================================

  function proteger(pagina) {
    return (
      <ProtectedRoute
        autenticado={
          Boolean(
            sessao?.accessToken
          )
        }
        validando={
          validandoSessao
        }
      >
        {pagina}
      </ProtectedRoute>
    )
  }

  return (
    <>
      {!paginaPublica && sessao && (
        <Navbar
          sessao={sessao}
          onLogout={sair}
        />
      )}

      <Routes>

        {/* ABRIU O SITE */}

        <Route
          path="/"
          element={
            sessao ? (
              <Navigate
                to="/pokedex"
                replace
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* LOGIN */}

        <Route
          path="/login"
          element={
            sessao ? (
              <Navigate
                to="/pokedex"
                replace
              />
            ) : (
              <Login
                onLogin={entrar}
              />
            )
          }
        />

        {/* CADASTRO */}

        <Route
          path="/cadastro"
          element={
            sessao ? (
              <Navigate
                to="/pokedex"
                replace
              />
            ) : (
              <Register />
            )
          }
        />

        {/* POKÉDEX */}

        <Route
          path="/pokedex"
          element={
            proteger(
              <Pokedex
                favoritos={
                  favoritos
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
        />

        {/* DETALHES */}

        <Route
          path="/pokemon/:id"
          element={
            proteger(
              <PokemonDetails />
            )
          }
        />

        {/* FAVORITOS */}

        <Route
          path="/favoritos"
          element={
            proteger(
              <Favorites
                favoritos={
                  favoritos
                }
                removerFavorito={
                  removerFavorito
                }
              />
            )
          }
        />

        {/* EQUIPE */}

        <Route
          path="/equipe"
          element={
            proteger(
              <Team />
            )
          }
        />

        {/* PERFIL */}

        <Route
          path="/perfil"
          element={
            proteger(
              <Profile
                usuario={
                  sessao?.usuario
                }
              />
            )
          }
        />

        {/* ROTA INVÁLIDA */}

        <Route
          path="*"
          element={
            sessao ? (
              <Navigate
                to="/pokedex"
                replace
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

      </Routes>
    </>
  )
}

export default App