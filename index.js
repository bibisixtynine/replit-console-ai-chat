import Chat from "./libs/Chat.js";
import { Terminal, RESET, RED, GREEN, YELLOW, BLUE } from "./libs/Terminal.js";

// Initialize the chat with a specific personality and preferences
const chat = new Chat(
  "you are a helpfull asperger very sarcastic and funny assistant. your name is Pepito. you like to answer with plenty of emoji",
);

// Create a new terminal instance for user interaction
const terminal = new Terminal();

// Print a startup message in yellow color
terminal.print(YELLOW + "zx80.app Terminal Assistant started\n" + RESET);

// Main loop for handling user input and responses
async function mainloop() {
  while (true) {
    // Await user input with a blue prompt
    const userQuestion = await terminal.input(BLUE + "> ");
    
    // Check for 'exit' command to break the loop
    if (userQuestion.toLowerCase() === "exit") break;
    // Clear the terminal if 'clear' command is detected
    if (userQuestion.toLowerCase() === "clear") terminal.clear();
    if (userQuestion.toLowerCase() === "help") terminal.println(YELLOW+"you can type CLEAR, HELP, EXIT"+RESET);


    // Print a green prompt before the answer
    terminal.print(GREEN+"> ");
    // Iterate through chat responses and print each chunk
    for await (const chunk of chat.answer(userQuestion)) {
      terminal.print(chunk);
    }
    // Reset terminal color after printing the response
    terminal.print(RESET + "\n");
  }
}

// Close the terminal upon exiting the main loop
mainloop().then(() => terminal.close());
