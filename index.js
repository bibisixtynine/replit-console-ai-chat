import ZXai from "./ZXai.js";
import { ZXconsole, RESET, RED, GREEN, YELLOW, BLUE } from "./ZXconsole.js";

const zxai = new ZXai();
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