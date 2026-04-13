import PlayerFactory from "../repository/PlayerFactory.js";
class PlayerService {
  constructor(input) {
    this.input = input;
    this.listPlayer = [];
    this.playerFactory = new PlayerFactory(this.input);
  }
  async addRealPlayer() {
    const player = await this.playerFactory.createRealPlayer(
      this.listPlayer.length + 1,
    );
    this.listPlayer.push(player);
  }

  async addBotPlayer() {
    const player = await this.playerFactory.createBotPlayer(
      this.listPlayer.length + 1,
    );

    this.listPlayer.push(player);
  }

  async addBotsUntilFull(maxPlayers) {
    while (this.listPlayer.length != maxPlayers) {
      await this.addBotPlayer();
    }
  }
  getPlayers() {
    return this.listPlayer;
  }

  static getPlayersInRange(currentPlayer, players, range = 5) {
    return players.filter(
      (player) =>
        player.id !== currentPlayer.id &&
        Math.abs(player.distance - currentPlayer.distance) <= range &&
        player.available === true,
    );
  }

  static getPlayersAhead(currentPlayer, players) {
    return players.filter((player) => player.distance > currentPlayer.distance);
  }

  getRanking(players) {
    return [...players].sort((a, b) => b.distance - a.distance);
  }

  getClosestPlayer(currentPlayer, players) {
    let closest = null;
    let minDistance = Infinity;

    players.forEach((player) => {
      if (player.id === currentPlayer.id) return;

      const distance = Math.abs(player.distance - currentPlayer.distance);

      if (distance < minDistance) {
        minDistance = distance;
        closest = player;
      }
    });

    return closest;
  }
}

export default PlayerService;
