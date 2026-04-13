import RaceLapService from "./RaceLapService.js";
import PlayerService from "./PlayerService.js";
class MatchService {
  constructor(listPlayers, mode, input) {
    this.listPlayers = listPlayers;
    this.mode = mode; // 1: Quick, 2: Detailed
    this.input = input;
    this.playerService = new PlayerService();

    // State from Lap
    this.round = 0;
    this.activeTraps = []; // List of Banana in the lane: { distance, ownerId }
    this.powerAvailable = false;
  }
  startMatch() {
    console.log("\n🏁 Match started!\n");

    this.players.forEach((p) => {
      console.log(`Player: ${p.name}`);
    });

    console.log(`Mode: ${this.mode}`);
  }
  async runRace(silent = false) {
    if (!silent) console.log("\n🏁 THE RACE HAS STARTED! 🏁\n");
    while (true) {
      this.round++;

      const someAlmostWinning = this.listPlayers.some((p) => p.distance >= 80);

      //Instance of raceLap
      const raceLapService = new RaceLapService(
        this.listPlayers,
        this.activeTraps,
        this.powerAvailable,
        this.round,
        this.mode === 2 && !silent,
      );

      //Returns = Object
      const { updateTraps, powerState, logs, winnerFound } =
        await raceLapService.controlLaps(someAlmostWinning);

      this.activeTraps = updateTraps;
      this.powerAvailable = powerState;

      //if mode is detailed
      if (this.mode === 2 && !silent) {
        this.showRound();
        logs.forEach((log) => console.log(log));
        this.showRankingTable();
        console.log("Press ENTER for next round");
        //for the user to go to the next round
        await this.input.ask("");
      }
      if (winnerFound) {
        break;
      }
    }

    // Cheking winner
    // get the first place player
    // The game finish in distance 100
    const finalRanking = this.playerService.getRanking(this.listPlayers);
    const winner = finalRanking[0];
    if (!silent) {
      await this.finishGame();
    }
    return { winner, rounds: this.round };
  }

  showRound() {
    console.log(`\n------- ROUND ${this.round} -------`);
  }

  showRankingTable() {
    const ranking = this.playerService.getRanking(this.listPlayers);
    console.log("\n 🏆 Current Position:");
    console.table(
      ranking.map((p, i) => ({
        Pos: `${i + 1}º`,
        Name: p.name,
        Character: p.character.name,
        Distance: `${Math.floor(p.distance)}m`,
      })),
    );
  }

  async finishGame() {
    console.clear();
    console.log("=".repeat(40));
    console.log("🏁 FINISH! END OF THE RACE 🏁");
    console.log("=".repeat(40));

    const finalRanking = this.playerService.getRanking(this.listPlayers);

    console.log(`The race has been long ${this.round} rounds.`);
    this.showRankingTable();

    const winner = finalRanking[0];
    console.log(
      `\n👑 THE GRAND CHAMPION IS: ${winner.name.toUpperCase()} playing with ${winner.character.name} `,
    );

    console.log("=".repeat(40));
  }
}

export default MatchService;
