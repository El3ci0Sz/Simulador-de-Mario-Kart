class RandomServices {
  //True for sucess, false for faill.

  static async tryChance(chance) {
    const number = await this.rollDice(100);
    return number <= chance;
  }
  static async getRandomBlock() {
    const random = Math.random();
    if (random < 0.33) return "RETA";
    if (random < 0.66) return "CURVA";
    return "CONFRONTO";
  }

  static getRandomIndex(range) {
    const numberRandom = Math.floor(Math.random() * range);
    return numberRandom;
  }

  //funcoes assincronas que nao acontecem ao mesmo tempo das outras
  //Posso pedir para ela esperar outra acabar para depois essa iniciar
  static async rollDice(range) {
    //Math.random, da valores de 0 a 1, para pegar outros valores temos que multiplicar e arredondar
    //floor para arredondar
    //Mais 1 pois como ele começa do 0, o nosso minimo tem de ser 1
    return Math.floor(Math.random() * range) + 1;
  }

  static async rollDiceWithCritic(range) {
    const randomNumber = Math.floor(Math.random() * range) + 1;
    if (randomNumber === range) {
      const crictBonus = await this.rollDice(4);
      return randomNumber + crictBonus;
    }
    return randomNumber;
  }
}
export default RandomServices;
