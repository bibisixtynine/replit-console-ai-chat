import readline from 'readline';

// Terminal color codes
const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const MAGENTA = "\x1b[35m";
const CYAN = "\x1b[36m";
const WHITE = "\x1b[37m";
const BRIGHT_BLACK = "\x1b[90m";
const BRIGHT_RED = "\x1b[91m";
const BRIGHT_GREEN = "\x1b[92m";
const BRIGHT_YELLOW = "\x1b[93m";
const BRIGHT_BLUE = "\x1b[94m";
const BRIGHT_MAGENTA = "\x1b[95m";
const BRIGHT_CYAN = "\x1b[96m";
const BRIGHT_WHITE = "\x1b[97m";

class Terminal {
  constructor() {
    // Create a readline interface for input/output
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  // Prompts the user with a question and returns a promise with the answer
  input(questionText) {
    return new Promise((resolve) => {
      this.rl.question(questionText, (answer) => {
        resolve(answer);
      });
    });
  }

  // Prints a message followed by a newline character
  println(message) {
    process.stdout.write(message + '\n');
  }

  // Prints a message without a newline character
  print(message) {
    process.stdout.write(message)
  }
  
  // Clears the terminal screen
  clear() {
    process.stdout.write('\x1Bc');
  }

  // Closes the readline interface
  close() {
    this.rl.close();
  }
}

export { Terminal, RESET, RED, GREEN, YELLOW, BLUE, MAGENTA, CYAN, WHITE, BRIGHT_BLACK, BRIGHT_RED, BRIGHT_GREEN, BRIGHT_YELLOW, BRIGHT_BLUE, BRIGHT_MAGENTA, BRIGHT_CYAN, BRIGHT_WHITE };
