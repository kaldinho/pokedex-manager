import {
  AUTH_API_URL
} from "../config/api"


// ============================================
// USUÁRIOS LOCAIS
// ============================================

function obterUsuariosLocais() {
  const usuarios =
    localStorage.getItem("usuarios")

  return usuarios
    ? JSON.parse(usuarios)
    : []
}


function salvarUsuariosLocais(usuarios) {
  localStorage.setItem(
    "usuarios",
    JSON.stringify(usuarios)
  )
}


// ============================================
// PROTEÇÃO DA SENHA
// ============================================

function gerarSalt() {
  const valores =
    new Uint8Array(16)

  crypto.getRandomValues(valores)

  return Array.from(valores)
    .map((valor) =>
      valor
        .toString(16)
        .padStart(2, "0")
    )
    .join("")
}


async function gerarHashSenha(
  password,
  salt
) {
  const encoder =
    new TextEncoder()

  const chaveBase =
    await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    )

  const hash =
    await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",

        salt:
          encoder.encode(salt),

        iterations:
          100000,

        hash:
          "SHA-256"
      },

      chaveBase,

      256
    )

  return Array.from(
    new Uint8Array(hash)
  )
    .map((byte) =>
      byte
        .toString(16)
        .padStart(2, "0")
    )
    .join("")
}


// ============================================
// LOGIN
// ============================================

export async function login(
  username,
  password
) {
  const usuariosLocais =
    obterUsuariosLocais()

  const usuarioLocal =
    usuariosLocais.find(
      (usuario) =>
        usuario.username
          .toLowerCase() ===
        username
          .trim()
          .toLowerCase()
    )


  // ==========================================
  // LOGIN DE CONTA CRIADA NO PROJETO
  // ==========================================

  if (usuarioLocal) {
    const passwordHash =
      await gerarHashSenha(
        password,
        usuarioLocal.salt
      )

    if (
      passwordHash !==
      usuarioLocal.passwordHash
    ) {
      throw new Error(
        "Usuário ou senha inválidos."
      )
    }


    return {
      id:
        usuarioLocal.id,

      username:
        usuarioLocal.username,

      firstName:
        usuarioLocal.firstName,

      lastName:
        usuarioLocal.lastName,

      email:
        usuarioLocal.email,

      image:
        usuarioLocal.image,

      accessToken:
        `local-token:${usuarioLocal.id}`,

      refreshToken:
        null
    }
  }


  // ==========================================
  // LOGIN DUMMYJSON
  // ==========================================

  const resposta =
    await fetch(
      `${AUTH_API_URL}/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({
          username,
          password,
          expiresInMins: 60
        })
      }
    )


  if (!resposta.ok) {
    if (
      resposta.status === 400 ||
      resposta.status === 401
    ) {
      throw new Error(
        "Usuário ou senha inválidos."
      )
    }

    if (
      resposta.status === 403
    ) {
      throw new Error(
        "Acesso não autorizado."
      )
    }

    throw new Error(
      "Erro ao realizar login."
    )
  }


  return resposta.json()
}


// ============================================
// CRIAR USUÁRIO LOCAL
// ============================================

export async function criarUsuario(
  usuario
) {
  const usuarios =
    obterUsuariosLocais()


  const usernameExiste =
    usuarios.some(
      (item) =>
        item.username
          .toLowerCase() ===
        usuario.username
          .trim()
          .toLowerCase()
    )


  if (usernameExiste) {
    throw new Error(
      "Esse nome de usuário já está cadastrado."
    )
  }


  const emailExiste =
    usuarios.some(
      (item) =>
        item.email
          .toLowerCase() ===
        usuario.email
          .trim()
          .toLowerCase()
    )


  if (emailExiste) {
    throw new Error(
      "Esse e-mail já está cadastrado."
    )
  }


  const salt =
    gerarSalt()


  const passwordHash =
    await gerarHashSenha(
      usuario.password,
      salt
    )


  const novoUsuario = {
    id:
      Date.now(),

    firstName:
      usuario.firstName.trim(),

    lastName:
      usuario.lastName.trim(),

    username:
      usuario.username.trim(),

    email:
      usuario.email.trim(),

    salt,

    passwordHash,

    image:
      "/pokemon/25.png"
  }


  usuarios.push(
    novoUsuario
  )


  salvarUsuariosLocais(
    usuarios
  )


  return {
    id:
      novoUsuario.id,

    firstName:
      novoUsuario.firstName,

    lastName:
      novoUsuario.lastName,

    username:
      novoUsuario.username,

    email:
      novoUsuario.email,

    image:
      novoUsuario.image
  }
}


// ============================================
// RESTAURAR SESSÃO
// ============================================

export async function obterUsuario(
  accessToken
) {

  // Conta criada localmente

  if (
    accessToken.startsWith(
      "local-token:"
    )
  ) {
    const id =
      Number(
        accessToken.split(":")[1]
      )


    const usuarios =
      obterUsuariosLocais()


    const usuario =
      usuarios.find(
        (item) =>
          item.id === id
      )


    if (!usuario) {
      throw new Error(
        "Usuário não encontrado."
      )
    }


    return {
      id:
        usuario.id,

      username:
        usuario.username,

      firstName:
        usuario.firstName,

      lastName:
        usuario.lastName,

      email:
        usuario.email,

      image:
        usuario.image
    }
  }


  // Conta DummyJSON

  const resposta =
    await fetch(
      `${AUTH_API_URL}/auth/me`,
      {
        headers: {
          Authorization:
            `Bearer ${accessToken}`
        }
      }
    )


  if (
    resposta.status === 401
  ) {
    throw new Error(
      "Sessão expirada."
    )
  }


  if (
    resposta.status === 403
  ) {
    throw new Error(
      "Acesso negado."
    )
  }


  if (!resposta.ok) {
    throw new Error(
      "Erro ao validar sessão."
    )
  }


  return resposta.json()
}