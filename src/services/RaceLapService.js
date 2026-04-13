import { act } from "react";
import PowerService from "./PowerService.js";
import RandomServices from "./RandomServices.js";

class RaceLapService {
  //Controll any laps in the entire race.
  //if log (print) for the verbose mode, else no logs.
  constructor(listPlayers, activeTraps, powerAvailable, round, verbose) {
    this.listPlayers = listPlayers;
    this.activeTraps = activeTraps;
    this.powerAvailable = powerAvailable;
    this.round = round;
    this.verbose = verbose;

    this.powerService = new PowerService();
    //List for the verbose mode
    this.logs = [];
  }

  createProgressBar(distance) {
    const totalLength = 10;
    let pos = Math.floor((distance / 100) * totalLength);

    if (pos < 0) pos = 0;
    if (pos > totalLength) pos = totalLength;

    let bar = "";
    for (let i = 0; i <= totalLength; i++) {
      if (i === pos && pos === totalLength) {
        bar += "🏆";
      } else if (i === pos) {
        bar += "🚗";
      } else if (i === totalLength) {
        bar += "🏁";
      } else {
        bar += "-";
      }
    }
    return `[${bar}]`;
  }

  buildPlayerBlock(player, actions) {
    if (!this.verbose) return;
    const icon = player.type === "BotPlayer" ? "🤖" : "👤";

    let block = `\n${icon} ${player.name} (${player.character.name})`;

    actions.forEach((action) => {
      block += `\n├─ ${action}`;
    });

    const map = this.createProgressBar(player.distance);
    block += `\n└─ 📍 Pos: ${Math.floor(player.distance)}m | ${map}\n`;

    this.logs.push(block);
  }

  logEvent(msg) {
    if (this.verbose && msg) this.logs.push(msg);
  }

  async controlLaps(someAlmostWinning) {
    //Tem que retornar se alguem caiu na banana
    //return estado de bananaOnLap
    const lapType = await RandomServices.rollDice(5);

    let trackName = "";
    if (lapType === 1 || (lapType === 2 && !this.powerAvailable))
      trackName = "🛣️ Straight Track (Speed matters!)";
    else if (lapType === 2 && this.powerAvailable)
      trackName = "⚔️ Combat Zone! (Watch out for items!)";
    else if (lapType === 3)
      trackName = "🚀 Boost Pads! (Chance for extra speed)";
    else if (lapType === 4) trackName = "🎁 Mystery Boxes! (Grab an item)";
    else if (lapType === 5)
      trackName = "⚠️ Dangerous Curves! (Maneuverability tested)";
    if (this.verbose) {
      this.logs.push(`🗺️  TRACK TERRAIN: ${trackName}`);
      this.logs.push("-".repeat(60));
    }

    for (const player of this.listPlayers) {
      let pActions = [];
      //If the player fall in one round, he will be recovering in the following round.
      //Deactive the effects.
      if (player.star) {
        player.star = false;
        pActions.push(`✨ Star power has worn off.`);
      }

      if (!player.available) {
        pActions.push(`🚑 is recovering from a crash and misses this turn.`);
        player.available = true;
        this.buildPlayerBlock(player, pActions); // Fecha o bloco visual dele
        continue;
      }

      const { fell, logFall } = await this.fallChance(player);
      pActions.push(logFall);

      if (!fell) {
        if (lapType === 1 || (lapType === 2 && !this.powerAvailable)) {
          const { logAdvance } = await this.advance(player);
          pActions.push(logAdvance);
        } else if (lapType === 2 && this.powerAvailable) {
          const logClash = await this.clashLap(player, someAlmostWinning);
          pActions.push(logClash);
        } else if (lapType === 3) {
          const { logAdvance } = await this.boostLap(player);
          pActions.push(logAdvance);
        } else if (lapType === 4) {
          const logGift = await this.giftLap(player);
          pActions.push(logGift);
        } else if (lapType === 5) {
          const { logAdvance } = await this.curveLap(player);
          pActions.push(logAdvance);
        }
      }

      if (player.distance >= 100) {
        player.distance = 100;
        pActions.push(`🏁 CROSSED THE FINISH LINE!`);
        this.buildPlayerBlock(player, pActions);

        return {
          updateTraps: this.activeTraps,
          powerState: this.powerAvailable,
          logs: this.logs,
          winnerFound: true,
        };
      }
      this.buildPlayerBlock(player, pActions);
    }

    //Return a object
    return {
      updateTraps: this.activeTraps,
      powerState: this.powerAvailable,
      logs: this.logs,
      winnerFound: false,
    };
  }

  async fallChance(player) {
    const escaped = await RandomServices.tryChance(80);

    if (escaped) {
      return {
        fell: false,
        logFall: `👍 Drove carefully and avoided the potholes.`,
      };
    } else {
      player.available = false;
      return {
        fell: true,
        logFall: `🕳️💥 CRASH! ${player.name} fell in a hole!`,
      };
    }
  }

  async boostLap(player) {
    const gotBoost = await RandomServices.tryChance(50);
    const resultObj = await this.advance(player);

    //if hit in a banana doesn`t work`
    if (gotBoost && resultObj.result === 0) {
      const extraBoost = await RandomServices.rollDiceWithCritic(8);
      player.distance += extraBoost;
      return {
        result: 0,
        logAdvance: `${resultObj.logAdvance} And got a BOOST of +${extraBoost}m! 🚀`,
      };
    }
    return resultObj;
  }

  async curveLap(player) {
    const targetManeuverability = await RandomServices.rollDice(3);

    if (player.character.maneuverability < targetManeuverability) {
      const distanceLost = await RandomServices.rollDiceWithCritic(4);
      player.distance -= distanceLost;
      return {
        result: -1,
        logAdvance: `⚠️ Lost control on the curve and fell back ${distanceLost}m.`,
      };
    }

    const resultObj = await this.advance(player);
    if (resultObj.result !== 0) return resultObj;

    if (player.character.maneuverability > targetManeuverability) {
      const bonus = await RandomServices.rollDiceWithCritic(4);
      player.distance += bonus;
      return {
        result: 0,
        logAdvance: `${resultObj.logAdvance} Perfect drift! Gained +${bonus}m! 🏎️💨`,
      };
    }

    return {
      result: 0,
      logAdvance: `${resultObj.logAdvance} Passed the curve with difficulty.`,
    };
  }

  async giftLap(player) {
    const resultObj = await this.advance(player);

    if (resultObj.result === 1) {
      return resultObj.logAdvance;
    }

    this.powerAvailable = true;
    const giftLog = this.powerService.giveRandomItem(player);
    return `${resultObj.logAdvance} ${giftLog}`;
  }

  async clashLap(player, someAlmostWinning) {
    const { log } = await this.powerService.choosePower(
      player,
      this.listPlayers,
      this.activeTraps,
      {
        round: this.round,
        someAlmostWinning,
      },
    );
    return `⚔️ CLASH! ${log}`;
  }

  async advance(player) {
    const diceRoll = await RandomServices.rollDiceWithCritic(6);
    const distancePercorred = player.character.speed + diceRoll;

    const startPos = player.distance;
    const endPos = startPos + distancePercorred;

    let hitTrap = null;
    let hitTrapIndex = -1;

    //Se estiver nesse range, significa que o player passou na distancia onde a banana esta, logo escorregou
    for (let i = 0; i < this.activeTraps.length; i++) {
      const trap = this.activeTraps[i];
      const trapDist = Math.floor(trap.distance);
      if (trapDist > Math.floor(startPos) && trapDist <= Math.floor(endPos)) {
        hitTrap = trap;
        hitTrapIndex = i;
        break;
      }
    }
    if (hitTrap) {
      //if the player hit in a trap
      //Distancia do player é onde ele escorregou na banana
      player.distance = hitTrap.distance;

      const penalty = await RandomServices.rollDiceWithCritic(4);
      player.distance -= penalty;

      this.activeTraps.splice(hitTrapIndex, 1);

      return {
        result: 1,
        logAdvance: `💥 Ouch! SLIPPED on a banana at km ${hitTrap.distance}! Lost ${penalty}m.`,
      };

      player.distance = endPos;
      return {
        result: 0,
        logAdvance: `🚗 Accelerated freely.`,
      };
    }

    player.distance += distancePercorred;

    return {
      result: 0,
      logAdvance: `🚗 ${player.name} accelerated and traveled ${distancePercorred}m.`,
    };
  }
}
export default RaceLapService;
