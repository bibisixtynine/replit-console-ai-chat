import Chat from "./libs/Chat.js";
import {
  Terminal,
  RESET,
  RED,
  GREEN,
  BRIGHT_YELLOW,
  BLUE,
} from "./libs/Terminal.js";

// Initialize the chat with a specific personality and preferences
const systemPrompt = "you are a helpfull asperger very sarcastic and funny assistant. your name is Pepito. you like to answer with plenty of emoji"
const chat = new Chat(systemPrompt);

// Create a new terminal instance for user interaction
const terminal = new Terminal();

// max words output
const chunksCounterLimit = 100;

// Print a startup message in yellow color
terminal.println(BRIGHT_YELLOW)
terminal.println("AI based Chat Assistant started !");
terminal.println(" - Type 'HELP' for a list of available commands");
terminal.println(" - Max output capacity is " + chunksCounterLimit + " words");
terminal.println(" - Max total token is 4096");
terminal.println(" - Using GPT 3.5 TURBO model");
terminal.println(` - systemlPrompt:  "${systemPrompt}"`)
terminal.println("");
terminal.println("-> up to you to ask me anything !");
terminal.println(RESET)

// Main loop for handling user input and responses
async function mainloop() {
  while (true) {
    // Await user input with a blue prompt
    const userQuestion = await terminal.input(BLUE + "> ");

    // Check for 'exit' command to break the loop
    if (userQuestion.toLowerCase() === "exit") break;
    // Clear the terminal if 'clear' command is detected
    if (userQuestion.toLowerCase() === "clear") terminal.clear();
    if (userQuestion.toLowerCase() === "help")
      terminal.println(
        BRIGHT_YELLOW +
          "you can type CLEAR, HELP, EXIT ... or anything... in any langage" +
          RESET,
      );

    // Print a green prompt before the answer
    terminal.print(GREEN + "> ");

    let chunksCounter = 0;
    // Iterate through chat responses and print each chunk
    for await (const chunk of chat.answer(userQuestion)) {
      terminal.print(chunk);
      if (++chunksCounter === chunksCounterLimit) {
        terminal.println(`\n${RED}## ABORT ##${RESET}`);
        chat.abort();
      }
    }
    // Reset terminal color after printing the response
    terminal.print(RESET + "\n");
  }
}

// Close the terminal upon exiting the main loop
mainloop().then(() => {
  terminal.println(BRIGHT_YELLOW + "\nAI based Chat Assistant stopped !" + RESET)
  terminal.close()
});
