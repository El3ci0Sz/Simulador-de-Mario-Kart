import readline from "readline";

class InputUtils {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  ask(question) {
    return new Promise((resolve) => {
      this.rl.question(question, resolve);
    });
  }

  async askNumber(question, min, max) {
    while (true) {
      const answer = await this.ask(question);
      const number = parseInt(answer);

      if (!isNaN(number) && number >= min && number <= max) {
        return number;
      }

      console.log("Invalid number, try again.\n");
    }
  }

  close() {
    this.rl.close();
  }
}

export default InputUtils;
