import fs from "fs"
import path from "path"

const pasta = path.join(process.cwd(), "public", "pokemon")

if (!fs.existsSync(pasta)) {
  fs.mkdirSync(pasta, { recursive: true })
}

async function baixarImagens() {
  for (let id = 1; id <= 151; id++) {
    const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

    const resposta = await fetch(url)
    const buffer = Buffer.from(await resposta.arrayBuffer())

    fs.writeFileSync(
      path.join(pasta, `${id}.png`),
      buffer
    )

    console.log(`Pokémon ${id} baixado`)
  }

  console.log("Todas as imagens foram baixadas!")
}

baixarImagens()