import {
  Link,
  useNavigate
} from "react-router-dom"

function Navbar({
  sessao,
  onLogout
}) {
  const navigate = useNavigate()

  function sair() {
    onLogout()
    navigate("/login")
  }

  return (
    <nav className="navbar">

      <Link to="/pokedex">
        Pokédex
      </Link>

      <Link to="/favoritos">
        Favoritos
      </Link>

      <Link to="/equipe">
        Minha Equipe
      </Link>

      <Link to="/perfil">
        Perfil
      </Link>

      <span className="navbar-usuario">
        Olá,{" "}
        {sessao?.usuario?.firstName ||
          sessao?.usuario?.username}
      </span>

      <button
        type="button"
        onClick={sair}
      >
        Sair
      </button>

    </nav>
  )
}

export default Navbar