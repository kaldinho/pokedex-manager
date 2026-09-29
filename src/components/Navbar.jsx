import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Início</Link>
      <Link to="/pokedex">Pokédex</Link>
      <Link to="/favoritos">Favoritos</Link>
      <Link to="/equipe">Minha Equipe</Link>
    </nav>
  )
}

export default Navbar