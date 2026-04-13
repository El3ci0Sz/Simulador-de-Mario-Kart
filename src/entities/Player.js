//class Player [src/entities/Player.js]
import Character from "./Character.js";

class Player {
  //Atributos
  name;
  constructor(name, id, character, type) {
    this.name = name;
    this.id = id;
    this.type = type;
    this.distance = 0;
    this.items = [];
    this.available = true;
    this.star = false;

    if (!(character instanceof Character))
      throw new Error("O atributo deve ser uma instancia da classe Character");
    this.character = character;
  }

  reset() {
    this.distance = 0;
    this.items = [];
    this.available = true;
    this.star = false;
  }

  addDistance(value) {
    this.distance += value;
  }

  removeDistance(value) {
    this.distance -= value;
  }

  addItem(item) {
    if (this.items.length >= 2) {
      return false;
    }

    this.items.push(item);
    return true;
  }

  //Return true if find a item
  hasItem(type) {
    return this.items.some((item) => item.type === type);
  }

  removeItem(type) {
    const index = this.items.findIndex((item) => item.type === type);

    if (index === -1) return null;

    return this.items.splice(index, 1)[0];
  }

  useItem(type) {
    const item = this.removeItem(type);

    if (!item) {
      console.log("Item not found!");
      return null;
    }

    return item;
  }

  isItemsEmpty() {
    return this.items.length === 0;
  }
  getItems() {
    return this.items;
  }
}
export default Player;
