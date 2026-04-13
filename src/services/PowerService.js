//Vai lidar com a questao dos podere
import PlayerService from "./PlayerService.js";
import RandomServices from "./RandomServices.js";

class PowerService {
  getRandomPower() {
    const powerList = [
      { type: "rocket" },
      { type: "banana" },
      { type: "punch" },
      { type: "star" },
      { type: "turtleShell" },
    ];
    return powerList[RandomServices.getRandomIndex(powerList.length)];
  }

  async choosePower(currentPlayer, listPlayers, activeTraps, options = {}) {
    const { round = 0, someAlmostWinning = false } = options;

    if (currentPlayer.isItemsEmpty()) {
      return {
        log: `🤷 ${currentPlayer.name} tried to use a power, but their inventory is empty!`,
      };
    }

    let powerType = this.getPower(currentPlayer);

    if (someAlmostWinning && currentPlayer.distance < 80) {
      powerType = "rocket";
    }

    return await this.usePower(
      currentPlayer,
      listPlayers,
      activeTraps,
      powerType,
    );
  }

  async usePower(currentPlayer, listPlayers, activeTraps, type) {
    let log = "";

    if (!currentPlayer.available) {
      return {
        log: `🛑 ${currentPlayer.name} is knocked out and cannot use items!`,
      };
    }

    switch (type) {
      case "rocket":
        log = await this.powerRocket(currentPlayer);
        break;
      case "banana":
        log = this.powerBanana(currentPlayer, activeTraps);
        break;
      case "punch":
        log = this.powerPunch(currentPlayer, listPlayers);
        break;
      case "star":
        log = await this.powerStar(currentPlayer);
        break;
      case "turtleShell":
        log = await this.powerTurtleShell(currentPlayer, listPlayers);
        break;
      default:
        log = `❓ ${currentPlayer.name} tried to use an unknown anomaly!`;
    }

    currentPlayer.removeItem(type);

    return { type, log };
  }

  async powerRocket(currentPlayer) {
    const distanceFlight = await RandomServices.rollDice(8);
    currentPlayer.distance += distanceFlight;
    return `🚀 BLASTOFF! ${currentPlayer.name} used a ROCKET and flew ${distanceFlight}m!`;
  }

  powerBanana(currentPlayer, activeTraps) {
    activeTraps.push({
      type: "banana",
      distance: currentPlayer.distance,
      ownerId: currentPlayer.id,
    });
    return `🍌 SNEAKY! ${currentPlayer.name} dropped a BANANA at km ${Math.floor(currentPlayer.distance)}!`;
  }

  powerPunch(currentPlayer, listPlayers) {
    const listInRange = PlayerService.getPlayersInRange(
      currentPlayer,
      listPlayers,
      4,
    );

    if (listInRange.length === 0) {
      return `🥊 SWISH! threw a punch, but hit only the wind.`;
    }

    const targetIndex = RandomServices.getRandomIndex(listInRange.length);
    const targetPlayer = listInRange[targetIndex];

    if (targetPlayer.star) {
      return `🛡️ CLANG! punched, but ${targetPlayer.name} is INVINCIBLE!`;
    }

    const distanceDecreased = currentPlayer.character.power;
    targetPlayer.distance -= distanceDecreased;
    return `🥊 POW! punched ${targetPlayer.name}, sending them back ${distanceDecreased}m!`;
  }

  async powerStar(currentPlayer) {
    currentPlayer.star = true;
    const distanceIncreased = await RandomServices.rollDice(4);
    currentPlayer.distance += distanceIncreased;
    return `⭐ GLOWING! used a STAR, became invincible, and dashed +${distanceIncreased}m!`;
  }

  async powerTurtleShell(currentPlayer, listPlayers) {
    const roll = await RandomServices.rollDice(8);
    if (roll <= 2) {
      return `🐢💨 WHOOSH! threw a Turtle Shell, but missed terribly!`;
    }

    const listAhead = PlayerService.getPlayersAhead(currentPlayer, listPlayers);

    if (listAhead.length === 0) {
      return `🐢 CONFUSED! threw a shell, but is already in 1st place!`;
    }

    const targetIndex = RandomServices.getRandomIndex(listAhead.length);
    const targetPlayer = listAhead[targetIndex];

    if (targetPlayer.star) {
      return `🐢🛡️ BLOCKED! The shell hit ${targetPlayer.name}, but the STAR protected them!`;
    }

    const extraDamage = await RandomServices.rollDice(4);
    const distanceDecreased = currentPlayer.character.power + extraDamage;
    targetPlayer.distance -= distanceDecreased;

    return `🐢💥 BOOM! shell hit ${targetPlayer.name}, knocking them back ${distanceDecreased}m!`;
  }

  getPower(currentPlayer) {
    if (!currentPlayer.items || currentPlayer.items.length === 0) return null;
    return currentPlayer.items[0].type;
  }

  giveRandomItem(player) {
    const power = this.getRandomPower();
    const success = player.addItem(power);
    if (success) {
      return `🎁 grabbed a ${power.type.toUpperCase()}!`;
    } else {
      return `📦 inventory is full!`;
    }
  }
}
export default PowerService;
