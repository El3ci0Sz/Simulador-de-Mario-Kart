//File System
import Character from "../entities/Character.js";
import FileUtils from "../utils/FileUtils.js";

class CharacterRepository {
  static readFileData() {
    const data = FileUtils.readJSON("../data/characters.json");
    return data.map(
      (c) => new Character(c.name, c.speed, c.maneuverability, c.power),
    );
  }
}

export default CharacterRepository;
