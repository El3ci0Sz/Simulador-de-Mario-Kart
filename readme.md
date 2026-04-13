<h1>Desafio de projeto do Felipão: Mario Kart.JS</h1>

  <table>
        <tr>
            <td>
                <img src="./docs/header.gif" alt="Mario Kart" width="200">
            </td>
            <td>
                <b>Objetivo:</b>
                <p>Mario Kart é uma série de jogos de corrida desenvolvida e publicada pela Nintendo. Nosso desafio será criar uma lógica de um jogo de vídeo game para simular corridas de Mario Kart, levando em consideração as regras e mecânicas abaixo.</p>
            </td>
        </tr>
    </table>

<h2>Players</h2>
      <table style="border-collapse: collapse; width: 800px; margin: 0 auto;">
        <tr>
            <td style="border: 1px solid black; text-align: center;">
                <p>Mario</p>
                <img src="./docs/mario.gif" alt="Mario Kart" width="60" height="60">
            </td>
            <td style="border: 1px solid black; text-align: center;">
                <p>Velocidade: 4</p>
                <p>Manobrabilidade: 3</p>
                <p>Poder: 3</p>
            </td>
             <td style="border: 1px solid black; text-align: center;">
                <p>Peach</p>
                <img src="./docs/peach.gif" alt="Mario Kart" width="60" height="60">
            </td>
            <td style="border: 1px solid black; text-align: center;">
                <p>Velocidade: 3</p>
                <p>Manobrabilidade: 4</p>
                <p>Poder: 2</p>
            </td>
              <td style="border: 1px solid black; text-align: center;">
                <p>Yoshi</p>
                <img src="./docs/yoshi.gif" alt="Mario Kart" width="60" height="60">
            </td>
            <td style="border: 1px solid black; text-align: center;">
                <p>Velocidade: 2</p>
                <p>Manobrabilidade: 4</p>
                <p>Poder: 3</p>
            </td>
        </tr>
        <tr>
            <td style="border: 1px solid black; text-align: center;">
                <p>Bowser</p>
                <img src="./docs/bowser.gif" alt="Mario Kart" width="60" height="60">
            </td>
            <td style="border: 1px solid black; text-align: center;">
                <p>Velocidade: 5</p>
                <p>Manobrabilidade: 2</p>
                <p>Poder: 5</p>
            </td>
            <td style="border: 1px solid black; text-align: center;">
                <p>Luigi</p>
                <img src="./docs/luigi.gif" alt="Mario Kart" width="60" height="60">
            </td>
            <td style="border: 1px solid black; text-align: center;">
                <p>Velocidade: 3</p>
                <p>Manobrabilidade: 4</p>
                <p>Poder: 4</p>
            </td>
            <td style="border: 1px solid black; text-align: center;">
                <p>Donkey Kong</p>
                <img src="./docs/dk.gif" alt="Mario Kart" width="60" height="60">
            </td>
            <td style="border: 1px solid black; text-align: center;">
                <p>Velocidade: 2</p>
                <p>Manobrabilidade: 2</p>
                <p>Poder: 5</p>
            </td>
        </tr>
    </table>

<p></p>


Este projeto é um simulador de corridas do Mario Kart executado inteiramente no terminal, desenvolvido em **Node.js**.

## 📌 Sobre o Projeto e Créditos

Este projeto nasceu como parte do desafio do curso **Formação Node.js Fundamentals da DIO**

* **Nota Histórica:** O código original e estruturalmente básico do desafio está preservado no arquivo `old_index.js` para fins de comparação didática.

* **Evolução** Esta versão atual (no diretório `src/`) evoluiu para uma arquitetura orientada a objetos, e com muitas lógicas implementadas para enriquecer o simulador.

* **A interface visual no terminal foi construída com o auxílio de Inteligência Artificial**, para garantir uma experiência de log muito mais imersiva e legível.

---

## ✨ Principais Funcionalidades

* 🎮 **3 Modos de Jogo**:
  
  * ⚡ **Modo Rápido**: Computa a corrida instantaneamente e exibe o pódio.
    
  * 📊 **Modo Detalhado**: Acompanhe a corrida rodada a rodada. Veja cada jogador avançar, escorregar em cascas de banana ou fazer *drifts* em
  * curvas perigosas, com direito a um **minimapa visual** `[---🚗------🏆]`.
    
  * 🤖 **Modo Torneio (Auto)**: Ferramenta de análise de dados. Simula dezenas ou centenas de corridas silenciosamente em milissegundos e gera um relatório estatístico de *Win Rate* e *Distância Total* de cada Player.
    
* 👥 **Modo Grand Prix (Até 6 Carros)**: Corra no modo 1x1 ou enfrente um grid completo de Bots controlados pelo computador (até 6 personagens).
  
* 🍄 **Sistema de Itens e Colisões**: Sistema de inventário onde caixas surpresas dão itens. Estrelas para invencibilidade, atire Cascos de Tartaruga em quem está na frente, ou deixe Bananas físicas na pista que param quem vier atrás!

---

## 🏁 Como Executar na Sua Máquina

**Pré-requisitos:** Você precisa ter o [Node.js](https://nodejs.org/) instalado na sua máquina.

1. **Clone este repositório:**
   git clone https://github.com/El3ci0Sz/Simulador-de-Mario-Kart.git
   
2. Navegue até a pasta do projeto:
  cd Simulador-de-Mario-Kart
  
3. Execute o codigo principal:
  node src/index.js

3.1 Execute a versão inicial do codigo:
  node src/old_index.js
