import InputUtils from "../utils/InputUtils.js";
import MatchService from "../services/MatchService.js";
import PlayerService from "../services/PlayerService.js";
import TournamentService from "../services/TournamentSevice.js";

class GameController {
  constructor() {
    this.input = new InputUtils();
    this.playerService = new PlayerService(this.input);
  }

  showWelcome() {
    console.clear();
    console.log("=".repeat(60));
    console.log("🏁 WELCOME TO THE RACE GAME 🏁".padStart(45));
    console.log("=".repeat(60));
    console.log("\n🔥 Get ready to compete!");
    console.log("🎮 Choose your mode and dominate the race!\n");
    console.log("Press ENTER to continue...");
  }

  async waitForEnter() {
    await this.input.ask("");
  }

  async mainMenu() {
    console.clear();
    console.log("========== MAIN MENU ==========\n");
    console.log("[1] Start Game");
    console.log("[2] Exit\n");

    return await this.input.askNumber("Choose an option: ", 1, 2);
  }

  async selectGameMode() {
    console.clear();
    console.log("======= SELECT GAME MODE =======\n");
    console.log("[1] Quick Mode ⚡");
    console.log("    → Fast result, only the final ranking\n");
    console.log("[2] Detailed Mode 📊");
    console.log("    → Shows lap by lap progression\n");
    console.log("[3] Auto/Tournament Mode 🤖");
    console.log(
      "    → Runs multiple matches silently and generates a statistical log\n",
    );

    return await this.input.askNumber("Choose mode: ", 1, 3);
  }

  async selectMatchType() {
    console.clear();
    console.log("======= SELECT MATCH TYPE =======\n");
    console.log("[1] 1 vs 1 👥 (2 Players)");
    console.log("[2] Full Grand Prix 👥👥👥 (6 Players)\n");

    return await this.input.askNumber("Choose match type: ", 1, 2);
  }

  async choseOption() {
    console.log("\nDo you want to add a REAL player?");
    console.log("[1] Yes");
    console.log("[2] No (Fill with Bots)\n");

    return await this.input.askNumber("Choose: ", 1, 2);
  }

  async setupPlayers(maxPlayers) {
    console.clear();
    console.log("======= PLAYER SETUP =======\n");

    let count = 0;

    let option = await this.choseOption();

    if (option === 1) {
      while (count < maxPlayers) {
        console.clear();
        await this.playerService.addRealPlayer();
        count++;

        if (count >= maxPlayers) break;

        option = await this.choseOption();
        if (option === 2) break;
      }
    }

    // Preenche o resto das vagas com Bots!
    await this.playerService.addBotsUntilFull(maxPlayers);
    return this.playerService.getPlayers().length;
  }

  showPlayersTable(players) {
    console.clear();
    console.log("======= PLAYERS GRID =======\n");

    const displayData = players.map((p, index) => ({
      ID: index + 1,
      Name: p.name,
      Character: p.character.name,
      Type: p.type === "BotPlayer" ? "🤖 BOT" : "👤 REAL",
    }));

    console.table(displayData);
    console.log("\nPress ENTER to start the engines...");
  }

  async startFlow() {
    this.showWelcome();
    await this.waitForEnter();

    const menuOption = await this.mainMenu();

    if (menuOption === 2) {
      console.log("Exiting... See you next time! 🏁");
      this.input.close();
      return;
    }

    const mode = await this.selectGameMode();
    const matchType = await this.selectMatchType();
    const maxPlayers = matchType === 1 ? 2 : 6;

    const totalPlayers = await this.setupPlayers(maxPlayers);
    const players = this.playerService.getPlayers();

    this.showPlayersTable(players);
    await this.waitForEnter();

    console.clear();
    console.log("\n======= RACE SUMMARY =======");
    console.log(`Mode: ${mode === 1 ? "Quick" : "Detailed"}`);
    console.log(`Total Players: ${totalPlayers}`);
    console.log("==============================\n");
    if (mode === 3) {
      const numRaces = await this.input.askNumber(
        "\nHow many races to simulate? (e.g., 20): ",
        1,
        1000,
      );
      console.log("Starting in 3... 2... 1...");
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const tournament = new TournamentService(players, numRaces);
      await tournament.run();
      this.input.close();
    } else {
      console.log("Starting in 3... 2... 1...");

      // Pequeno delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const match = new MatchService(players, mode, this.input);

      await match.runRace(false);

      this.input.close();
    }
  }
}

export default GameController;
