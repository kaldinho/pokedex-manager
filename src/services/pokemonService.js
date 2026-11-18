import {
  POKE_API_URL
} from "../config/api"


// ============================================
// FORMATAR NOMES
// ============================================

function formatarNome(nome) {
  return nome
    .split("-")
    .map(
      (parte) =>
        parte.charAt(0).toUpperCase() +
        parte.slice(1)
    )
    .join(" ")
}


// ============================================
// EXTRAIR ID DA URL
// ============================================

function extrairIdDaUrl(url) {
  const partes =
    url
      .split("/")
      .filter(Boolean)

  return Number(
    partes[
      partes.length - 1
    ]
  )
}


// ============================================
// BUSCAR TODOS OS POKÉMON
// ============================================

export async function buscarPokemons() {

  const respostaQuantidade =
    await fetch(
      `${POKE_API_URL}/pokemon-species?limit=1&offset=0`
    )


  if (!respostaQuantidade.ok) {
    throw new Error(
      "Não foi possível acessar a PokéAPI."
    )
  }


  const dadosQuantidade =
    await respostaQuantidade.json()


  const quantidade =
    dadosQuantidade.count


  const resposta =
    await fetch(
      `${POKE_API_URL}/pokemon-species?limit=${quantidade}&offset=0`
    )


  if (!resposta.ok) {
    throw new Error(
      "Erro ao carregar os Pokémon."
    )
  }


  const dados =
    await resposta.json()


  return dados.results.map(
    (pokemon) => {

      const id =
        extrairIdDaUrl(
          pokemon.url
        )


      return {

        id,

        nome:
          formatarNome(
            pokemon.name
          ),

        imagem:
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

      }
    }
  )
}


// ============================================
// BUSCAR DETALHES DO POKÉMON
// ============================================

export async function buscarPokemonPorId(id) {

  // ==========================================
  // POKÉMON + ESPÉCIE
  // ==========================================

  const [
    respostaPokemon,
    respostaEspecie
  ] = await Promise.all([

    fetch(
      `${POKE_API_URL}/pokemon/${id}`
    ),

    fetch(
      `${POKE_API_URL}/pokemon-species/${id}`
    )

  ])


  if (
    !respostaPokemon.ok ||
    !respostaEspecie.ok
  ) {
    throw new Error(
      "Não foi possível carregar esse Pokémon."
    )
  }


  const pokemon =
    await respostaPokemon.json()


  const especie =
    await respostaEspecie.json()


  // ==========================================
  // DESCRIÇÃO
  // ==========================================

  const descricaoEntrada =
    especie.flavor_text_entries.find(
      (entrada) =>
        entrada.language.name === "pt-br"
    )
    ||
    especie.flavor_text_entries.find(
      (entrada) =>
        entrada.language.name === "pt"
    )
    ||
    especie.flavor_text_entries.find(
      (entrada) =>
        entrada.language.name === "en"
    )


  const descricao =
    descricaoEntrada
      ? descricaoEntrada
          .flavor_text
          .replace(/\f/g, " ")
          .replace(/\n/g, " ")
          .replace(/\s+/g, " ")
          .trim()
      : "Descrição não disponível."


  // ==========================================
  // CATEGORIA
  // ==========================================

  const categoriaEntrada =
    especie.genera.find(
      (item) =>
        item.language.name === "pt-br"
    )
    ||
    especie.genera.find(
      (item) =>
        item.language.name === "pt"
    )
    ||
    especie.genera.find(
      (item) =>
        item.language.name === "en"
    )


  const categoria =
    categoriaEntrada?.genus ||
    "Não disponível"


  // ==========================================
  // HABITAT
  // ==========================================

  const habitat =
    especie.habitat?.name
      ? formatarNome(
          especie.habitat.name
        )
      : "Não informado"


  // ==========================================
  // GERAÇÃO
  // ==========================================

  const geracao =
    especie.generation?.name
      ? formatarNome(
          especie.generation.name
        )
      : "Desconhecida"


  // ==========================================
  // REGIÃO
  // ==========================================

  let regiao =
    "Desconhecida"


  if (
    especie.generation?.url
  ) {

    try {

      const respostaGeracao =
        await fetch(
          especie.generation.url
        )


      if (
        respostaGeracao.ok
      ) {

        const dadosGeracao =
          await respostaGeracao.json()


        if (
          dadosGeracao.main_region?.name
        ) {

          regiao =
            formatarNome(
              dadosGeracao
                .main_region
                .name
            )

        }
      }

    } catch (error) {

      console.error(
        "Erro ao carregar região:",
        error
      )

    }
  }


  // ==========================================
  // TIPOS
  // ==========================================

  const dadosTipos =
    await Promise.all(

      pokemon.types.map(
        async (item) => {

          const respostaTipo =
            await fetch(
              item.type.url
            )


          if (
            !respostaTipo.ok
          ) {
            return null
          }


          return respostaTipo.json()
        }
      )

    )


  // ==========================================
  // FRAQUEZAS / RESISTÊNCIAS / IMUNIDADES
  // ==========================================

  const multiplicadores = {}


  function garantirTipo(nome) {

    if (
      multiplicadores[nome] ===
      undefined
    ) {

      multiplicadores[nome] = 1

    }
  }


  dadosTipos
    .filter(Boolean)
    .forEach(
      (tipo) => {

        // FRAQUEZAS

        tipo.damage_relations
          .double_damage_from
          .forEach(
            (item) => {

              garantirTipo(
                item.name
              )

              multiplicadores[
                item.name
              ] *= 2

            }
          )


        // RESISTÊNCIAS

        tipo.damage_relations
          .half_damage_from
          .forEach(
            (item) => {

              garantirTipo(
                item.name
              )

              multiplicadores[
                item.name
              ] *= 0.5

            }
          )


        // IMUNIDADES

        tipo.damage_relations
          .no_damage_from
          .forEach(
            (item) => {

              garantirTipo(
                item.name
              )

              multiplicadores[
                item.name
              ] = 0

            }
          )

      }
    )


  const fraquezas =
    Object.entries(
      multiplicadores
    )
      .filter(
        ([, valor]) =>
          valor > 1
      )
      .map(
        ([nome, valor]) => ({

          nome:
            formatarNome(nome),

          multiplicador:
            valor

        })
      )


  const resistencias =
    Object.entries(
      multiplicadores
    )
      .filter(
        ([, valor]) =>
          valor > 0 &&
          valor < 1
      )
      .map(
        ([nome, valor]) => ({

          nome:
            formatarNome(nome),

          multiplicador:
            valor

        })
      )


  const imunidades =
    Object.entries(
      multiplicadores
    )
      .filter(
        ([, valor]) =>
          valor === 0
      )
      .map(
        ([nome]) =>
          formatarNome(nome)
      )


  // ==========================================
  // HABILIDADES
  // ==========================================

  const habilidades =
    await Promise.all(

      pokemon.abilities.map(
        async (item) => {

          try {

            const respostaHabilidade =
              await fetch(
                item.ability.url
              )


            if (
              !respostaHabilidade.ok
            ) {
              throw new Error(
                "Erro ao carregar habilidade."
              )
            }


            const habilidade =
              await respostaHabilidade.json()


            const efeito =
              habilidade.effect_entries.find(
                (entrada) =>
                  entrada.language.name === "en"
              )


            return {

              nome:
                formatarNome(
                  item.ability.name
                ),

              oculta:
                item.is_hidden,

              descricao:
                efeito?.short_effect ||
                "Descrição indisponível."

            }

          } catch (error) {

            console.error(error)


            return {

              nome:
                formatarNome(
                  item.ability.name
                ),

              oculta:
                item.is_hidden,

              descricao:
                "Descrição indisponível."

            }

          }
        }
      )

    )


  // ==========================================
  // GOLPES APRENDIDOS POR NÍVEL
  // ==========================================

  const golpesPorNivel = []


  pokemon.moves.forEach(
    (movimento) => {

      movimento
        .version_group_details
        .forEach(
          (detalhe) => {

            if (
              detalhe
                .move_learn_method
                .name === "level-up"
            ) {

              golpesPorNivel.push({

                nome:
                  formatarNome(
                    movimento.move.name
                  ),

                nivel:
                  detalhe
                    .level_learned_at,

                versao:
                  formatarNome(
                    detalhe
                      .version_group
                      .name
                  ),

                versaoId:
                  extrairIdDaUrl(
                    detalhe
                      .version_group
                      .url
                  )

              })

            }

          }
        )

    }
  )


  // ==========================================
  // VERSÃO MAIS RECENTE DOS GOLPES
  // ==========================================

  const versaoMaisRecente =
    golpesPorNivel.length > 0

      ? Math.max(
          ...golpesPorNivel.map(
            (golpe) =>
              golpe.versaoId
          )
        )

      : null


  const golpes =
    golpesPorNivel
      .filter(
        (golpe) =>
          golpe.versaoId ===
          versaoMaisRecente
      )
      .sort(
        (a, b) => {

          if (
            a.nivel === b.nivel
          ) {

            return (
              a.nome.localeCompare(
                b.nome
              )
            )

          }

          return (
            a.nivel -
            b.nivel
          )

        }
      )


  const versaoGolpes =
    golpes.length > 0
      ? golpes[0].versao
      : "Não disponível"


  // ==========================================
  // RESULTADO FINAL
  // ==========================================

  return {

    id:
      pokemon.id,


    nome:
      formatarNome(
        pokemon.name
      ),


    imagem:
      pokemon.sprites
        ?.other
        ?.["official-artwork"]
        ?.front_default
      ||
      pokemon.sprites
        ?.front_default
      ||
      `/pokemon/${pokemon.id}.png`,


    imagemShiny:
      pokemon.sprites
        ?.other
        ?.["official-artwork"]
        ?.front_shiny
      ||
      pokemon.sprites
        ?.front_shiny
      ||
      null,


    som:
      pokemon.cries
        ?.latest
      ||
      pokemon.cries
        ?.legacy
      ||
      null,


    altura:
      pokemon.height / 10,


    peso:
      pokemon.weight / 10,


    experienciaBase:
      pokemon.base_experience,


    tipos:
      pokemon.types.map(
        (item) =>
          formatarNome(
            item.type.name
          )
      ),


    habilidades,


    stats:
      pokemon.stats.map(
        (item) => ({

          nome:
            formatarNome(
              item.stat.name
            ),

          valor:
            item.base_stat

        })
      ),


    fraquezas,

    resistencias,

    imunidades,


    descricao,

    categoria,

    habitat,

    geracao,

    regiao,

    golpes,

    versaoGolpes
  }
}


// ============================================
// FORMATAR MÉTODO DE EVOLUÇÃO
// ============================================

function formatarMetodoEvolucao(
  detalhes
) {

  if (
    !detalhes ||
    detalhes.length === 0
  ) {

    return "Forma inicial"

  }


  const detalhe =
    detalhes[0]


  const partes = []


  // ==========================================
  // TIPO DA EVOLUÇÃO
  // ==========================================

  if (
    detalhe.trigger?.name ===
    "level-up"
  ) {

    partes.push(
      "Subir de nível"
    )

  } else if (
    detalhe.trigger?.name ===
    "use-item"
  ) {

    partes.push(
      "Usar item"
    )

  } else if (
    detalhe.trigger?.name ===
    "trade"
  ) {

    partes.push(
      "Troca"
    )

  } else if (
    detalhe.trigger?.name
  ) {

    partes.push(
      formatarNome(
        detalhe.trigger.name
      )
    )

  }


  // NÍVEL

  if (
    detalhe.min_level !== null &&
    detalhe.min_level !== undefined
  ) {

    partes.push(
      `Nível ${detalhe.min_level}`
    )

  }


  // ITEM

  if (
    detalhe.item?.name
  ) {

    partes.push(
      `Item: ${formatarNome(
        detalhe.item.name
      )}`
    )

  }


  // ITEM SEGURADO

  if (
    detalhe.held_item?.name
  ) {

    partes.push(
      `Segurando: ${formatarNome(
        detalhe.held_item.name
      )}`
    )

  }


  // FELICIDADE

  if (
    detalhe.min_happiness
  ) {

    partes.push(
      `Felicidade: ${detalhe.min_happiness}`
    )

  }


  // AFEIÇÃO

  if (
    detalhe.min_affection
  ) {

    partes.push(
      `Afeição: ${detalhe.min_affection}`
    )

  }


  // BELEZA

  if (
    detalhe.min_beauty
  ) {

    partes.push(
      `Beleza: ${detalhe.min_beauty}`
    )

  }


  // HORÁRIO

  if (
    detalhe.time_of_day
  ) {

    const horarios = {

      day:
        "Durante o dia",

      night:
        "Durante a noite",

      dusk:
        "Ao entardecer"

    }


    partes.push(

      horarios[
        detalhe.time_of_day
      ]
      ||
      formatarNome(
        detalhe.time_of_day
      )

    )

  }


  // MOVIMENTO

  if (
    detalhe.known_move?.name
  ) {

    partes.push(
      `Conhecer ${formatarNome(
        detalhe.known_move.name
      )}`
    )

  }


  // TIPO DO MOVIMENTO

  if (
    detalhe.known_move_type?.name
  ) {

    partes.push(
      `Conhecer movimento do tipo ${formatarNome(
        detalhe.known_move_type.name
      )}`
    )

  }


  // LOCAL

  if (
    detalhe.location?.name
  ) {

    partes.push(
      `Local: ${formatarNome(
        detalhe.location.name
      )}`
    )

  }


  // CHUVA

  if (
    detalhe.needs_overworld_rain
  ) {

    partes.push(
      "Durante chuva"
    )

  }


  // POKÉMON NA EQUIPE

  if (
    detalhe.party_species?.name
  ) {

    partes.push(
      `Ter ${formatarNome(
        detalhe.party_species.name
      )} na equipe`
    )

  }


  // TIPO NA EQUIPE

  if (
    detalhe.party_type?.name
  ) {

    partes.push(
      `Ter Pokémon do tipo ${formatarNome(
        detalhe.party_type.name
      )} na equipe`
    )

  }


  // TROCA

  if (
    detalhe.trade_species?.name
  ) {

    partes.push(
      `Trocar por ${formatarNome(
        detalhe.trade_species.name
      )}`
    )

  }


  // CONDIÇÃO ESPECIAL

  if (
    detalhe.turn_upside_down
  ) {

    partes.push(
      "Condição especial"
    )

  }


  return partes.length > 0
    ? partes.join(" • ")
    : "Condição especial"
}


// ============================================
// MONTAR LINHA EVOLUTIVA
// ============================================

function montarLinhaEvolutiva(
  no,
  resultado = []
) {

  const id =
    extrairIdDaUrl(
      no.species.url
    )


  resultado.push({

    id,

    nome:
      formatarNome(
        no.species.name
      ),

    imagem:
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,

    metodo:
      formatarMetodoEvolucao(
        no.evolution_details
      )

  })


  no.evolves_to.forEach(
    (proximo) => {

      montarLinhaEvolutiva(
        proximo,
        resultado
      )

    }
  )


  return resultado
}


// ============================================
// BUSCAR DADOS DA EQUIPE
// ============================================

export async function buscarDadosEquipe(id) {

  const [
    respostaPokemon,
    respostaEspecie
  ] = await Promise.all([

    fetch(
      `${POKE_API_URL}/pokemon/${id}`
    ),

    fetch(
      `${POKE_API_URL}/pokemon-species/${id}`
    )

  ])


  if (
    !respostaPokemon.ok ||
    !respostaEspecie.ok
  ) {

    throw new Error(
      "Não foi possível carregar os dados do Pokémon."
    )

  }


  const pokemon =
    await respostaPokemon.json()


  const especie =
    await respostaEspecie.json()


  // ==========================================
  // EVOLUÇÕES
  // ==========================================

  let evolucoes = []


  if (
    especie.evolution_chain?.url
  ) {

    const respostaEvolucao =
      await fetch(
        especie.evolution_chain.url
      )


    if (
      respostaEvolucao.ok
    ) {

      const dadosEvolucao =
        await respostaEvolucao.json()


      evolucoes =
        montarLinhaEvolutiva(
          dadosEvolucao.chain
        )

    }
  }


  // ==========================================
  // ITENS
  // ==========================================

  const itens =
    pokemon.held_items.map(
      (item) =>
        formatarNome(
          item.item.name
        )
    )


  // ==========================================
  // RESULTADO
  // ==========================================

  return {

    id:
      pokemon.id,


    nome:
      formatarNome(
        pokemon.name
      ),


    imagem:
      pokemon.sprites
        ?.other
        ?.["official-artwork"]
        ?.front_default
      ||
      pokemon.sprites
        ?.front_default
      ||
      `/pokemon/${pokemon.id}.png`,


    tipos:
      pokemon.types.map(
        (item) =>
          formatarNome(
            item.type.name
          )
      ),


    evolucoes,

    itens
  }
}