import {
  Navigate
} from "react-router-dom"

function ProtectedRoute({
  autenticado,
  validando,
  children
}) {
  if (validando) {
    return (
      <main className="container">
        <p>Validando sessão...</p>
      </main>
    )
  }

  if (!autenticado) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  return children
}

export default ProtectedRoute