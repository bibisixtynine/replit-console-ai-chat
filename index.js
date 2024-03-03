import { Chat, testChat } from "./libs/Chat.js";
import {
  Terminal,
  RESET,
  RED,
  GREEN,
  BRIGHT_YELLOW,
  BLUE,
  WHITE,
} from "./libs/Terminal.js";

await testChat();

// Initialize the chat with a specific personality and preferences
const systemPrompt =
  "you are a helpfull asperger very sarcastic and funny assistant. your name is Pepito. you like to answer with plenty of emoji";

//const systemPrompt = "tu es controleur aerien sur l'aeroport de Nantes. tu commence par jouer celui du controle au sol, puis la tour de controle. tu demande au pilote de changer ses frequence pour passer d'un controle à l'autre en fonction de la situation. tu demande au pilote de changer ses frequence pour passer d'un controle à l'autre en fonction de la situation. au premier contact, le pilote doit te fournir sa destination et demander la mise en route. autorise le immediatement puis demande lui de te rappeler pres à rouler. autorise le ensuitre à rejoindre le seuil de piste. quand il s'en approche, fait le passer sur la fréquance tour pour pouvoir l'autoriser à l'alignement décollage. une fois en vol, créé un scénario catastropje pour tester ses réactions"
const chat = new Chat(systemPrompt);

// Create a new terminal instance for user interaction
const terminal = new Terminal();

// max words output
const chunksCounterLimit = 100;

// Print a startup message in yellow color
terminal.println(BRIGHT_YELLOW);
terminal.println("AI based Chat Assistant started !");
terminal.println(" - Type '$HELP' for a list of available commands");
terminal.println(" - Max output capacity is " + chunksCounterLimit + " words");
terminal.println(" - Max total token is 4096");
terminal.println(" - Using GPT 3.5 TURBO model");
terminal.println(` - systemlPrompt:  "${systemPrompt}"`);
terminal.println("");
terminal.println("-> up to you to ask me anything, !");
terminal.println(RESET);

// global object for eval context persistence
const evalContext = {};

async function executeCommand(command) {
  // extract first word
  const keyword = command.split(" ")[0];
  switch (keyword) {
    case "exit":
      return;
    case "clear":
      terminal.clear();
      break;
    case "test":
      terminal.print(WHITE);
      await testChat();
      break;
    case "help":
      terminal.println(
        BRIGHT_YELLOW +
          "you can type $CLEAR, $HELP, $TEST, $EXIT ... or anything... in any langage" +
          RESET,
      );
      break;
    case "reset":
      await chat.reset();
      break;
    case "eval":
      try {
        const evalScript = `(function(ctx){${command.substring(
          5,
        )}})(evalContext);`;
        eval(evalScript);
      } catch (error) {
        terminal.println(RED + error.message + RESET);
      }
      terminal.println(RESET);
      break;

    case "chat":
      try {
        //evalContext = evalContext; // to avoid "not used" linter error
        const evalScript = `(function(ctx){${"chat."+command.substring(
          4,
        )}})(evalContext);`;
        eval(evalScript);
      } catch (error) {
        terminal.println(RED + error.message + RESET);
      }
      terminal.println(RESET);
    
      break;

    default:
      terminal.println(RED+"keyword not found"+RESET);
  }
}
// Main loop for handling user input and responses
async function mainloop() {
  while (true) {
    // Await user input with a blue prompt
    const userQuestion = await terminal.input(BLUE + "> ");

    if (userQuestion.startsWith("$")) {
      // Execute the command if it starts with "$"
      await executeCommand(userQuestion.substring(1));
    } else {
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
}

// Close the terminal upon exiting the main loop
mainloop().then(() => {
  terminal.println(
    BRIGHT_YELLOW + "\nAI based Chat Assistant stopped !" + RESET,
  );
  terminal.close();
});
