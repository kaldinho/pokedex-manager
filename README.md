# Pokédex Manager

Projeto desenvolvido para a **AV1 da disciplina Front-end Frameworks**.

O **Pokédex Manager** é uma aplicação web desenvolvida utilizando **React, JavaScript e Vite**, com o objetivo de permitir a consulta e organização dos **151 Pokémon da primeira geração**.

A aplicação permite visualizar Pokémon, realizar buscas por nome, acessar uma página individual de detalhes, adicionar Pokémon aos favoritos e escolher um Pokémon para uma equipe.

---

# 📌 Sobre o projeto

A proposta do Pokédex Manager é criar uma aplicação simples e organizada para consulta dos Pokémon da primeira geração.

Além da temática Pokémon, o projeto foi desenvolvido com o objetivo de aplicar na prática conceitos estudados na disciplina de Front-end Frameworks, como:

- Componentização
- Props
- Estado
- Eventos
- Renderização de listas
- Renderização condicional
- Rotas
- Formulários controlados
- Validação
- Persistência local
- Organização de componentes e páginas

A **AV1 utiliza dados locais**, sem necessidade de API para o funcionamento das funcionalidades principais.

---

# 🎯 Problema

Informações sobre Pokémon normalmente estão distribuídas em diferentes páginas e serviços.

O Pokédex Manager busca organizar algumas dessas informações em uma única aplicação simples, permitindo que o usuário:

- Consulte os Pokémon da primeira geração
- Pesquise um Pokémon específico
- Visualize seus detalhes
- Salve Pokémon favoritos
- Organize uma escolha de Pokémon para sua equipe

---

# 👥 Público-alvo

A aplicação é voltada principalmente para:

- Fãs da franquia Pokémon
- Pessoas interessadas nos Pokémon da primeira geração
- Usuários que desejam consultar rapidamente uma Pokédex
- Usuários que desejam organizar Pokémon favoritos

---

# 👤 Integrante

## Vitor

Projeto desenvolvido individualmente, com autorização do professor.

Responsável por todas as etapas do projeto, incluindo:

- Criação e configuração do projeto
- Estruturação da aplicação React
- Criação dos componentes
- Criação das páginas
- Implementação das rotas
- Organização dos dados locais
- Sistema de busca
- Página de detalhes
- Sistema de favoritos
- Persistência utilizando localStorage
- Desenvolvimento do formulário
- Validação dos campos
- Mensagens condicionais
- Estilização da aplicação
- Organização dos arquivos
- Versionamento com Git
- Repositório no GitHub
- Documentação do projeto

---

# 🚀 Funcionalidades

O Pokédex Manager possui as seguintes funcionalidades:

### Pokédex

- Exibição dos 151 Pokémon da primeira geração
- Imagem de cada Pokémon
- Número correspondente na Pokédex
- Navegação para uma página individual de detalhes

### Busca

- Pesquisa de Pokémon pelo nome
- Busca atualizada conforme o usuário digita
- Pesquisa sem diferença entre letras maiúsculas e minúsculas
- Mensagem quando nenhum Pokémon é encontrado

### Detalhes

- Página individual para cada Pokémon
- Nome
- Número da Pokédex
- Imagem
- Navegação para retornar à Pokédex

### Favoritos

- Adicionar Pokémon aos favoritos
- Remover Pokémon dos favoritos
- Página específica para favoritos
- Persistência dos favoritos mesmo após atualizar a página

### Minha Equipe

- Campo para nome do treinador
- Seleção de Pokémon
- Formulário controlado
- Validação dos campos
- Mensagem de erro
- Mensagem de sucesso

---

# 🗺️ Rotas da aplicação

A navegação da aplicação é realizada utilizando **React Router**.

| Rota | Página | Descrição |
|---|---|---|
| `/` | Home | Página inicial da aplicação |
| `/pokedex` | Pokédex | Lista os 151 Pokémon e permite busca |
| `/pokemon/:id` | Detalhes | Exibe o Pokémon correspondente ao ID |
| `/favoritos` | Favoritos | Exibe os Pokémon favoritados |
| `/equipe` | Minha Equipe | Formulário para escolha de Pokémon |

---

## Rota dinâmica

A página de detalhes utiliza uma rota dinâmica:

```text
/pokemon/:id
```

Por exemplo:

```text
/pokemon/25
```

O número `25` representa o Pikachu.

O valor é obtido utilizando:

```javascript
useParams()
```

Depois o Pokémon correspondente é localizado nos dados locais utilizando:

```javascript
find()
```

---

# 🛠️ Tecnologias utilizadas

O projeto foi desenvolvido utilizando:

- React
- JavaScript
- Vite
- React Router
- HTML
- CSS
- localStorage
- Git
- GitHub

---

# ⚛️ Conceitos de React utilizados

## Componentes funcionais

A aplicação utiliza componentes funcionais.

Alguns exemplos são:

```text
Navbar
PokemonCard
Home
Pokedex
PokemonDetails
Favorites
Team
```

A separação em componentes facilita a organização e reutilização do código.

---

## Props

As `props` são utilizadas para enviar informações e funções entre componentes.

Exemplo:

```jsx
<PokemonCard
  pokemon={pokemon}
  favorito={favorito}
  adicionarFavorito={adicionarFavorito}
  removerFavorito={removerFavorito}
/>
```

Nesse caso, o componente `PokemonCard` recebe informações e funções vindas de outro componente.

---

# 🔄 Estado com useState

O projeto utiliza `useState` para armazenar informações que podem ser alteradas durante o uso da aplicação.

Um exemplo é o sistema de busca:

```javascript
const [busca, setBusca] = useState("")
```

O estado `busca` guarda o valor digitado pelo usuário.

O input atualiza esse estado através de:

```jsx
onChange={(event) => setBusca(event.target.value)}
```

---

# 🔎 Sistema de busca

A busca utiliza o texto digitado pelo usuário para filtrar a lista de Pokémon.

O código utiliza:

```javascript
filter()
```

junto com:

```javascript
includes()
```

Exemplo:

```javascript
const pokemonsFiltrados = pokemons.filter((pokemon) =>
  pokemon.nome
    .toLowerCase()
    .includes(busca.toLowerCase())
)
```

O método:

```javascript
toLowerCase()
```

faz com que a pesquisa funcione independentemente de letras maiúsculas ou minúsculas.

Por exemplo:

```text
pikachu
Pikachu
PIKACHU
```

retornam o mesmo Pokémon.

---

# 📋 Renderização de listas

A lista de Pokémon é exibida utilizando o método:

```javascript
map()
```

Exemplo:

```jsx
pokemonsFiltrados.map((pokemon) => (
  <PokemonCard
    key={pokemon.id}
    pokemon={pokemon}
  />
))
```

Cada item utiliza:

```javascript
pokemon.id
```

como chave estável da lista.

---

# ⭐ Sistema de favoritos

A aplicação permite adicionar e remover Pokémon dos favoritos.

Antes de adicionar um Pokémon, é verificado se ele já existe na lista:

```javascript
const jaExiste = favoritos.some(
  (favorito) => favorito.id === pokemon.id
)
```

Caso ainda não esteja presente:

```javascript
setFavoritos([...favoritos, pokemon])
```

é utilizado para criar uma nova lista contendo o Pokémon.

---

## Remoção de favoritos

Para remover um Pokémon é utilizado:

```javascript
filter()
```

Exemplo:

```javascript
const novaLista = favoritos.filter(
  (pokemon) => pokemon.id !== id
)
```

Depois o estado é atualizado:

```javascript
setFavoritos(novaLista)
```

---

# 💾 Persistência com localStorage

Os favoritos são armazenados no `localStorage` do navegador.

Isso permite que a lista continue salva mesmo após o usuário atualizar a página.

Para salvar:

```javascript
localStorage.setItem(
  "favoritos",
  JSON.stringify(favoritos)
)
```

Para recuperar:

```javascript
const favoritosSalvos =
  localStorage.getItem("favoritos")
```

Os dados são convertidos novamente para JavaScript através de:

```javascript
JSON.parse()
```

---

# 🔁 useEffect

O projeto utiliza `useEffect` para atualizar o localStorage sempre que a lista de favoritos é modificada.

```javascript
useEffect(() => {
  localStorage.setItem(
    "favoritos",
    JSON.stringify(favoritos)
  )
}, [favoritos])
```

O array:

```javascript
[favoritos]
```

indica que o efeito será executado quando o estado `favoritos` sofrer alteração.

---

# 📝 Formulário controlado

A página **Minha Equipe** utiliza um formulário controlado pelo React.

O nome do treinador é armazenado em um estado:

```javascript
const [treinador, setTreinador] = useState("")
```

O campo utiliza:

```jsx
value={treinador}
```

e:

```jsx
onChange={(event) =>
  setTreinador(event.target.value)
}
```

Dessa maneira, o React controla o valor do formulário.

---

# ✅ Validação

Antes de concluir o formulário, o sistema verifica se os campos obrigatórios foram preenchidos.

Caso algum campo esteja vazio:

```javascript
if (
  treinador.trim() === "" ||
  pokemonSelecionado === ""
)
```

o sistema apresenta:

```text
Preencha todos os campos.
```

Quando os campos estão corretos, uma mensagem de sucesso é exibida.

Exemplo:

```text
Vitor escolheu Pikachu para sua equipe!
```

---

# ⚠️ Mensagens condicionais

A aplicação utiliza renderização condicional para fornecer feedback ao usuário.

## Nenhum Pokémon encontrado

```text
Nenhum Pokémon encontrado.
```

## Nenhum Pokémon favorito

```text
Nenhum Pokémon favoritado.
```

## Pokémon inexistente

```text
Pokémon não encontrado.
```

## Formulário incompleto

```text
Preencha todos os campos.
```

## Formulário enviado corretamente

Uma mensagem é exibida informando o treinador e o Pokémon escolhido.

---

# 📊 Dados locais

Os dados utilizados na AV1 ficam armazenados localmente no arquivo:

```text
src/data/pokemons.js
```

A aplicação possui os **151 Pokémon da primeira geração**.

A estrutura gerada para cada Pokémon segue o formato:

```javascript
{
  id: 25,
  nome: "Pikachu",
  imagem: "/pokemon/25.png"
}
```

Os IDs são gerados de acordo com a posição do Pokémon na lista.

---

# 🖼️ Imagens

As imagens dos Pokémon ficam armazenadas localmente em:

```text
public/pokemon/
```

Exemplo:

```text
public/pokemon/1.png
public/pokemon/2.png
public/pokemon/3.png
...
public/pokemon/25.png
...
public/pokemon/151.png
```

O caminho é associado automaticamente aos Pokémon:

```javascript
imagem: `/pokemon/${index + 1}.png`
```

---

## Script auxiliar de imagens

Foi criado um script auxiliar:

```text
baixar-imagens.js
```

para realizar o download inicial das imagens dos 151 Pokémon.

Após o download, as imagens ficam armazenadas localmente na aplicação.

O sistema não precisa realizar uma requisição de API para exibir essas imagens durante a execução normal da AV1.

---

# 📂 Estrutura do projeto

```text
pokemon/
│
├── public/
│   │
│   └── pokemon/
│       ├── 1.png
│       ├── 2.png
│       ├── 3.png
│       ├── ...
│       └── 151.png
│
├── src/
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── PokemonCard.jsx
│   │
│   ├── data/
│   │   └── pokemons.js
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Pokedex.jsx
│   │   ├── PokemonDetails.jsx
│   │   ├── Favorites.jsx
│   │   └── Team.jsx
│   │
│   ├── styles/
│   │   └── global.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── baixar-imagens.js
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

# ▶️ Como executar o projeto

## Pré-requisitos

É necessário possuir:

- Node.js
- npm
- Git

instalados no computador.

---

## 1. Clonar o repositório

Execute:

```bash
git clone https://github.com/kaldinho/pokedex-manager.git
```

---

## 2. Entrar na pasta do projeto

```bash
cd pokemon
```

---

## 3. Instalar as dependências

```bash
npm install
```

Esse comando instalará as dependências registradas no projeto.

---

## 4. Executar a aplicação

```bash
npm run dev
```

O Vite irá iniciar o servidor de desenvolvimento.

Será exibido um endereço semelhante a:

```text
http://localhost:5173/
```

Abra esse endereço no navegador.

---

# 📦 Dependências

Entre as principais dependências utilizadas estão:

```text
react
react-dom
react-router-dom
```

As dependências e suas versões podem ser consultadas no arquivo:

```text
package.json
```

O arquivo:

```text
package-lock.json
```

também está versionado para manter o registro das versões utilizadas durante a instalação.

---

# 🧭 Navegação

A navegação principal contém:

```text
Início
Pokédex
Favoritos
Minha Equipe
```

Todos os links utilizam o React Router, permitindo a navegação sem necessidade de digitar manualmente os endereços.

---

# 🎨 Interface

A estilização está concentrada principalmente em:

```text
src/styles/global.css
```

A interface utiliza:

- Grid para organização dos Pokémon
- Cards individuais
- Barra de navegação
- Botões estilizados
- Campo de busca
- Formulários
- Efeitos de hover
- Organização responsiva dos cards

---

# 🚨 Tratamento de estados

A aplicação trata diferentes situações que podem ocorrer durante o uso.

### Lista sem resultado

Caso a pesquisa não encontre um Pokémon:

```text
Nenhum Pokémon encontrado.
```

### Favoritos vazios

Caso nenhum Pokémon tenha sido favoritado:

```text
Nenhum Pokémon favoritado.
```

### ID inválido

Caso o usuário tente acessar um Pokémon inexistente:

```text
Pokémon não encontrado.
```

### Formulário inválido

Caso os campos obrigatórios não sejam preenchidos:

```text
Preencha todos os campos.
```


# 🛟 Contingência

Os dados principais e as imagens da Pokédex estão armazenados localmente.

Por esse motivo, a aplicação não depende de uma API externa para demonstrar suas funcionalidades principais durante a AV1.

Em outra máquina será necessário:

```bash
npm install
```

para instalar as dependências antes de executar:

```bash
npm run dev
```

---

# 🤖 Uso de Inteligência Artificial

Durante o desenvolvimento do projeto foi utilizada **Inteligência Artificial como ferramenta de apoio**.

A IA foi utilizada para:

- Explicação de conceitos de React
- Explicação de JavaScript
- Auxílio na organização do projeto
- Sugestões de implementação
- Revisão de código
- Identificação de erros
- Diagnóstico de mensagens do navegador
- Explicação de erros relacionados a props
- Auxílio na configuração do React Router
- Sugestões de CSS
- Auxílio na documentação
- Explicações sobre Git e GitHub

A Inteligência Artificial foi utilizada como suporte ao processo de desenvolvimento.

As funcionalidades implementadas foram testadas durante o desenvolvimento, e o responsável pelo projeto estudou o funcionamento das partes utilizadas.

---

# 🔧 Versionamento

O projeto utiliza **Git** para controle de versão.

O repositório remoto está hospedado no **GitHub**.

O fluxo básico utilizado durante o desenvolvimento é:

```bash
git status
```

Verifica alterações.

```bash
git add .
```

Adiciona as alterações para o próximo commit.

```bash
git commit -m "descricao da alteracao"
```

Registra uma nova versão local.

```bash
git push
```

Envia os commits para o GitHub.

---

# 🏷️ Entrega da AV1

A versão final da AV1 será identificada utilizando a tag:

```text
entrega-av1
```

Ao finalizar a versão da entrega:

```bash
git tag entrega-av1
```

e depois:

```bash
git push origin entrega-av1
```

---

# 🔮 Evolução planejada para a AV2

A AV2 será uma evolução do mesmo projeto.

O tema e a base funcional serão preservados.

Entre as evoluções planejadas estão:

- Consumo de API utilizando `fetch`
- Organização das requisições em `services`
- Uso de dados remotos
- Estados de carregamento
- Estado de sucesso
- Estado vazio
- Tratamento de erro
- Botão para tentar novamente
- Autenticação
- Login
- Logout
- Persistência de sessão
- Rota protegida
- Tratamento de respostas de autenticação
- Configuração centralizada da URL da API
- Dados locais de contingência

A integração poderá utilizar a **PokéAPI** para dados relacionados aos Pokémon.

---





---

## AV2

⏳ Desenvolvimento futuro.

A AV2 utilizará a mesma aplicação como base para implementação de API e autenticação.

---

# 🎓 Disciplina

**Front-end Frameworks**

Projeto Evolutivo — AV1 

Curso: **Ciência da Computação**

Tecnologias principais:

```text
React
JavaScript
Vite
React Router
```

---

# 📄 Licença

Projeto desenvolvido para fins acadêmicos.