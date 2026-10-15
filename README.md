# 🔴 Pokéguess

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

Pokéguess é uma aplicação web interativa concebida para testar o conhecimento dos usuários sobre o universo Pokémon. Os jogadores têm o desafio de adivinhar e preencher a Pokédex, com acompanhamento de progresso em tempo real e um sistema de conquistas em nuvem.

## Funcionalidades

- **Múltiplos Modos de Jogo:**
  - *Modo Clássico:* Adivinhe os 1025 Pokémon base.
  - *Modo Absoluto:* Desafio extremo incluindo Megas, Gigantamax e Formas Regionais (+1300 Pokémon).
- **Sistema de Autenticação:** Login e registro via Firebase Authentication, permitindo que os jogadores guardem o seu progresso na nuvem ou joguem como Visitantes.
- **Galeria de Troféus:** Sistema de conquistas (*achievements*) dinâmico com separação de platinas entre os modos Clássico e Absoluto.
- **Integração com PokéAPI:** Consumo da base de dados oficial e renderização de sprites em alta qualidade (incluindo versões *Shiny*).
- **Filtros e Ajuda:** Filtros por geração e tipo, além de um modo de silhuetas e assistência de nomes para novos jogadores.
- **Mascote Interativa:** Enfermeira Joy com diálogos dinâmicos com base no progresso do jogador.

## Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla).
- **Backend/BaaS:** Firebase (Authentication e Firestore) para gestão de sessão e persistência de dados.
- **API:** [PokéAPI](https://pokeapi.co/) para dados em tempo real.

## Como Executar e Jogar

**ATENÇÃO:** Devido às políticas de segurança do Firebase Authentication, este projeto **não pode ser executado apenas com um duplo clique no ficheiro `index.html`**. O jogo precisa de correr num servidor local para que o sistema de login, registro e troféus na nuvem funcione corretamente.

Para jogar localmente no seu computador com todas as funcionalidades:

1. Na página inicial deste repositório, clique no botão verde **"<> Code"** (no canto superior direito dos ficheiros) e selecione **"Download ZIP"**.
2. Extraia a pasta zipada que acabou de baixar.
3. Abra a pasta extraída no seu editor de código (recomendamos o **Visual Studio Code**).
4. Instale a extensão **Live Server** (caso não tenha).
5. No VS Code, clique com o botão direito sobre o ficheiro `index.html` e selecione **"Open with Live Server"**.
6. O jogo abrirá no seu navegador (normalmente em `http://127.0.0.1:5500`) com o Firebase 100% funcional!

## Aviso Legal e Isenção de Responsabilidade

Este é um projeto **puramente educacional e sem fins lucrativos**.
- Todos os direitos autorais, marcas registadas, nomes de personagens, sprites e imagens relacionadas à franquia Pokémon pertencem legalmente à **Nintendo, Game Freak e The Pokémon Company**.
- Este projeto não gera qualquer tipo de receita, não comercializa dados e utiliza exclusivamente APIs públicas (PokéAPI) para o seu funcionamento.
- Nenhuma infração de direitos autorais é intencionada.
