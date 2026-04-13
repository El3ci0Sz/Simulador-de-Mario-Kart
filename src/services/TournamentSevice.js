import MatchService from "./MatchService.js";

class TournamentService {
  constructor(players, numRaces) {
    this.players = players;
    this.numRaces = numRaces;

    this.stats = {};
    this.players.forEach((p) => {
      this.stats[p.name] = {
        name: p.name,
        character: p.character.name,
        wins: 0,
        totalDistance: 0,
      };
    });
  }

  async run() {
    console.clear();
    console.log(
      `\n⏳ Simulating Tournament of ${this.numRaces} races... Calculating physics under the hood.\n`,
    );

    for (let i = 0; i < this.numRaces; i++) {
      this.players.forEach((p) => p.reset());

      const match = new MatchService(this.players, 1, null);
      const { winner } = await match.runRace(true);

      if (winner && this.stats[winner.name]) {
        this.stats[winner.name].wins += 1;
      }

      this.players.forEach((p) => {
        if (this.stats[p.name]) {
          this.stats[p.name].totalDistance += p.distance;
        }
      });
    }

    this.showReport();
  }

  showReport() {
    console.log("=".repeat(70));
    console.log("📊 TOURNAMENT LOG REPORT (AUTO MODE) 📊".padStart(55));
    console.log("=".repeat(70));
    console.log(`Total Races Simulated: ${this.numRaces}\n`);

    const ranking = Object.values(this.stats).sort((a, b) => {
      if (b.wins !== a.wins) {
        return b.wins - a.wins;
      }
      return b.totalDistance - a.totalDistance;
    });

    console.table(
      ranking.map((s, index) => ({
        Pos: `${index + 1}º`,
        Bot: s.name,
        Character: s.character,
        Wins: s.wins,
        WinRate: `${((s.wins / this.numRaces) * 100).toFixed(1)}%`,
        TotalDistance: `${Math.floor(s.totalDistance)}m`,
      })),
    );

    console.log("\n");
  }
}

export default TournamentService;
