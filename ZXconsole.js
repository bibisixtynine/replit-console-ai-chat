import readline from 'readline';

const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";


class ZXconsole {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  input(questionText) {
    return new Promise((resolve) => {
      this.rl.question(questionText, (answer) => {
        resolve(answer);
      });
    });
  }

  print(message) {
    console.log(message);
  }

  close() {
    this.rl.close();
  }
}

export { ZXconsole, RESET, RED, GREEN, YELLOW, BLUE };
