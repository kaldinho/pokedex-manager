function Profile({ usuario }) {
  return (
    <main className="container">

      <h1 className="titulo">
        Meu Perfil
      </h1>

      <div className="pokemon-detalhes">

        {usuario?.image && (
          <img
            className="pokemon-imagem"
            src={usuario.image}
            alt={usuario.username}
          />
        )}

        <h2>
          {usuario?.firstName}{" "}
          {usuario?.lastName}
        </h2>

        <p>
          <strong>Usuário:</strong>{" "}
          {usuario?.username}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {usuario?.email}
        </p>

        <p className="mensagem-sucesso">
          Sessão autenticada com sucesso.
        </p>

      </div>

    </main>
  )
}

export default Profile