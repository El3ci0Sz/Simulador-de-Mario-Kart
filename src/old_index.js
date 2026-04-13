const player1 = {
  NOME: "Mario",
  VELOCIDADE: 4,
  MANOBRABILIDADE: 3,
  PODER: 3,
  PONTOS: 0,
};

const player2 = {
  NOME: "Luigi",
  VELOCIDADE: 3,
  MANOBRABILIDADE: 4,
  PODER: 4,
  PONTOS: 0,
};

//funcoes assincronas que nao acontecem ao mesmo tempo das outras
//Posso pedir para ela esperar outra acabar para depois essa iniciar
async function rollDice() {
  //Math.random, da valores de 0 a 1, para pegar outros valores temos que multiplicar e arredondar
  //floor para arredondar
  //Mais 1 pois como ele começa do 0, o nosso minimo tem de ser 1
  return Math.floor(Math.random() * 6) + 1;
}

async function getRandomBlock(params) {
  let random = Math.random();
  let result;

  switch (true) {
    case random < 0.33:
      result = "RETA";

      break;
    case random < 0.66:
      result = "CURVA";
      break;

    default:
      result = "CONFRONTO";
      break;
  }

  return result;
}

async function logRollResult(characterName, block, diceResult, Atributte) {
  console.log(
    `${characterName} 🎲 rolou um dado de ${block} ${diceResult} + ${Atributte} = ${diceResult + Atributte}`,
  );
}
async function playRaceEngine(character1, character2) {
  for (let round = 1; round <= 5; round++) {
    console.log(`🏁Rodada ${round}`);

    // sortear blobo
    let block = await getRandomBlock();
    console.log(`Bloco: ${block}`);

    //rolar os dados
    let diceResult1 = await rollDice();
    let diceResult2 = await rollDice();

    //teste de habilidade
    let TotalTestSkill1 = 0;
    let TotalTestSkill2 = 0;
    let powerResult1 = 0;
    let powerResult2 = 0;

    if (block === "RETA") {
      TotalTestSkill1 = diceResult1 + character1.VELOCIDADE;
      TotalTestSkill2 = diceResult2 + character2.VELOCIDADE;
      await logRollResult(
        character1.NOME,
        "velocidade",
        diceResult1,
        character1.VELOCIDADE,
      );
      await logRollResult(
        character2.NOME,
        "velocidade",
        diceResult2,
        character2.VELOCIDADE,
      );
      if (TotalTestSkill1 > TotalTestSkill2) {
        console.log(`${character1.NOME} marcou um ponto`);
        character1.PONTOS++;
      } else if (TotalTestSkill2 > TotalTestSkill1) {
        console.log(`${character2.NOME} marcou um ponto`);
        character2.PONTOS++;
      } else {
        console.log("Empate");
      }
    } else if (block === "CURVA") {
      TotalTestSkill1 = diceResult1 + character1.MANOBRABILIDADE;
      TotalTestSkill2 = diceResult2 + character2.MANOBRABILIDADE;

      await logRollResult(
        character1.NOME,
        "manobrabilidade",
        diceResult1,
        character1.MANOBRABILIDADE,
      );
      await logRollResult(
        character2.NOME,
        "manobrabilidade",
        diceResult2,
        character2.MANOBRABILIDADE,
      );
      if (TotalTestSkill1 > TotalTestSkill2) {
        console.log(`${character1.NOME} marcou um ponto`);
        character1.PONTOS++;
      } else if (TotalTestSkill2 > TotalTestSkill1) {
        console.log(`${character2.NOME} marcou um ponto`);
        character2.PONTOS++;
      } else {
        console.log("Empate");
      }
    } else if (block === "CONFRONTO") {
      //Essas variaveis powerResults, so existem dentor do blocos, escopo de variaveis, estao limitadas dentro desse bloco onde foram declaradas
      powerResult1 = diceResult1 + character1.PODER;
      powerResult2 = diceResult2 + character2.PODER;

      console.log(`${character1.NOME} confrontou ${character2.NOME}`);
      await logRollResult(
        character1.NOME,
        "poder",
        diceResult1,
        character1.PODER,
      );

      await logRollResult(
        character2.NOME,
        "poder",
        diceResult2,
        character2.PODER,
      );

      //Melhoria desse bloco de if
      //Caso sejam ambas verdades diminui por 1, se nao diminui por zero
      // character2.PONTOS -=
      //   powerResult1 > powerResult2 && character2.PONTOS > 0 ? 1 : 0;

      if (powerResult1 > powerResult2) {
        if (character2.PONTOS > 0) {
          console.log(
            `${character1.NOME} venceu o confronto, ${character2.NOME} perdeu um ponto`,
          );
          character2.PONTOS--;
        } else {
          console.log(
            `${character1.NOME} venceu o confronto. Mas ${character2.NOME} já não tinha ponto algum`,
          );
        }
      }
      if (powerResult2 > powerResult1) {
        if (character1.PONTOS > 0) {
          console.log(
            `${character2.NOME} venceu o confronto ${character1.NOME} perdeu um ponto`,
          );
          character1.PONTOS--;
        } else {
          console.log(
            `${character2.NOME} venceu o confronto. Mas ${character1.NOME} já não tinha ponto algum`,
          );
        }
      }

      console.log(powerResult2 == powerResult1 ? "Empate" : "");
    }

    console.log("----------------------------------");
  }
}

function imprime() {
  //Console é uma representacao do console/ do terminal, tem mais funcoes do que so o log.
  console.log(
    `🏁 Corrida entre ${player1.NOME} e ${player2.NOME} começando ...\n`,
  );
}

async function declareWinner(character1, character2) {
  console.log("Resultado Final");
  console.log(`${character1.NOME}: ${character1.PONTOS}`);
  console.log(`${character2.NOME}: ${character2.PONTOS}`);

  if (character1.PONTOS > character2.PONTOS)
    console.log(`\n${character1.NOME} venceu a corrida! Parabéns!`);
  else if (character2.PONTOS > character1.PONTOS)
    console.log(`\n${character2.NOME} venceu a corrida! Parabéns!`);
  else console.log("A corrida terminou em Empate");
}
//funcao de entrada
//Funcao auto invocavel
(async function main() {
  imprime();
  //significa falar pro codigo esperar a funcao playRaceEngine executar, antes de executar outras coisas
  await playRaceEngine(player1, player2);
  await declareWinner(player1, player2);
})();

// const player1 = new Player("Elecio", mario);
// player1.addPoints(100);
//
// // Criamos um array com o objeto para o console.table formatar as colunas
// console.table([{
//     Nome: player1.name,
//     Personagem: player1.character.nome,
//     Velocidade: player1.character.velocidade,
//     Peso: player1.character.peso,
//     Pontos: player1.points
// }]);
