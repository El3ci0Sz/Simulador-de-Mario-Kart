import CharacterRepository from "../repository/CharacterRepository.js";

class CharacterService {
  originalList = [];
  availableCharacters = [];

  constructor(input) {
    this.originalList = CharacterRepository.readFileData();
    this.resetCharacters();
    this.input = input;
  }

  resetCharacters() {
    // O operador spread (...) cria uma cópia superficial do array.
    this.availableCharacters = [...this.originalList];
  }
  removeCharacter(index) {
    //start in the index (index) and remove one element, [0] returns the element removed, from the list of removeds
    return this.availableCharacters.splice(index, 1)[0];
  }

  async randomCharacter() {
    if (this.availableCharacters.length === 0) {
      throw new Error("No characters available");
    }
    const index = Math.floor(Math.random() * this.availableCharacters.length);
    return this.removeCharacter(index);
  }

  async chooseCharacter() {
    this.showCharacters();

    console.log("[Enter [0] for a random character]");

    const index = await this.input.askNumber(
      "Enter the choosen: ",
      0,
      this.availableCharacters.length,
    );

    if (index === 0) {
      const character = await this.randomCharacter();
      console.log(`WOW!!!! you get the fabulous ${character.name}`);
      return character;
    } else {
      return this.removeCharacter(index - 1);
    }
  }

  showCharacters() {
    const COL_WIDTH = 20;
    const CHUNK_SIZE = 3;

    console.log("\n" + "=".repeat(COL_WIDTH * CHUNK_SIZE));
    console.log(
      "C H O O S E   Y O U R   C H A R A C T E R".padStart(COL_WIDTH * 2),
    );
    console.log("=".repeat(COL_WIDTH * CHUNK_SIZE) + "\n");

    for (let i = 0; i < this.availableCharacters.length; i += CHUNK_SIZE) {
      const grupo = this.availableCharacters.slice(i, i + CHUNK_SIZE);

      let lineName = "";
      let lineSpeed = "";
      let linePower = "";
      let lineDivide = "";
      let lineManeuverability = "";

      grupo.forEach((char, index) => {
        const id = i + index + 1;

        lineName += `[${id}] ${char.name.toUpperCase()}`.padEnd(COL_WIDTH);
        lineSpeed += `  Speed: ${char.speed}`.padEnd(COL_WIDTH);
        lineManeuverability +=
          `  Maneuverability: ${char.maneuverability}`.padEnd(COL_WIDTH);
        linePower += `  Power: ${char.power}`.padEnd(COL_WIDTH);
        lineDivide += "-".repeat(COL_WIDTH - 2).padEnd(COL_WIDTH);
      });

      console.log(lineName);
      console.log(lineSpeed);
      console.log(linePower);
      console.log(lineManeuverability);
      console.log(lineDivide);
      console.log("");
    }
  }
  getAvailableCharacters() {
    return this.availableCharacters;
  }
}

export default CharacterService;
