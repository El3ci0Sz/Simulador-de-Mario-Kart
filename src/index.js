import GameController from "./controllers/GameController.js";

const game = new GameController();

await game.startFlow();
