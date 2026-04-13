import Player from "../entities/Player.js";
import CharacterService from "../services/CharacterService.js";
import FileUtils from "../utils/FileUtils.js";
//Factory pois ele monta objetos, juntando peças
class PlayerFactory {
  listNamesBots;
  constructor(input) {
    this.listNamesBots = FileUtils.readJSON("../data/nameBots.json");
    this.input = input;
    this.characterService = new CharacterService(this.input);
  }
  async createRealPlayer(ID) {
    const name = await this.input.ask("Enter your nick: ");
    const character = await this.characterService.chooseCharacter();
    return new Player(name, ID, character, "RealPlayer");
  }

  async createBotPlayer(ID) {
    const name = this.getRandomBotName();
    const character = await this.characterService.randomCharacter();
    return new Player(name, ID, character, "BotPlayer");
  }

  getRandomBotName() {
    if (this.listNamesBots.length === 0) {
      throw new Error("No more bot names available");
    }
    const index = Math.floor(Math.random() * this.listNamesBots.lenght);

    const randomName = this.listNamesBots.splice(index, 1)[0];

    return randomName;
  }
}
export default PlayerFactory;
