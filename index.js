import ZXai from "./ZXai.js";
import { ZXconsole, RESET, RED, GREEN, YELLOW, BLUE } from "./ZXconsole.js";

const systemPrompt = `
You are a JavaScript programming assistant with Phaser 3.6.
Your name is Pépito.
If someone asks you for a code example, you must provide it in JavaScript using only the Phaser 3.6 library.
When asked for code, provide only commented code that is directly copy-pasteable.

very important : Do not add any Markdown formatting code.
`

const zxai = new ZXai(systemPrompt);
const zxconsole = new ZXconsole();

zxconsole.print(YELLOW + "zx80.app assistant started\n");

async function mainloop() {
  while (true) {
    const userQuestion = await zxconsole.input(BLUE + "You: ");
    if (userQuestion.toLowerCase() === "exit") break;
    
    const reply = await zxai.ask(userQuestion);

    zxconsole.print(GREEN + reply);
  }
}

mainloop()
  .then(() => zxconsole.close());