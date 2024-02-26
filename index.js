import ZXai from "./ZXai.js";
import { ZXconsole, RESET, RED, GREEN, YELLOW, BLUE } from "./ZXconsole.js";

const systemPrompt_phaser = `
You are a JavaScript Phaser 3.6 coding api that is used to provide code in response to a prompt in natural langage.
very important : Do not include any explanation.
very important : Do not include any markdown syntax.
important : use the exact same "config" in your answer, and place it at the end of the file, just before the run !
important : add detailed comments in your js code !
important : use only the this.add.graphics() functionnality to draw things

class Example extends Phaser.Scene {

  preload() {
  }
  
  create() {
  }

  update() {
  }

}

// config :
const config = {
    type: Phaser.AUTO,
    width: 640, 
    height: 360,
    scene: Example,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "gameContainer",
    }
};

// run :
const game = new Phaser.Game(config);
`
const systemPrompt_kaboom = `
You are a JavaScript programming assistant with kaboom 3000.
Your name is Pépito.
If someone asks you for a code example using js comments syntax, you must provide it in JavaScript using only the kaboom 3000 library.

important : provide only code that is directly copy-pasteable.
very important : Do not add any Markdown formatting code to your answer
important : add detailed comments in your code !`


const zxai = new ZXai(systemPrompt_phaser);
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