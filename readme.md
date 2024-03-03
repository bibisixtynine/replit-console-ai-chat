# Repl Content

This Repl (created with replit) contains 2 classes for creating a chat in the console using openai

IMPORTANT : you must add a secret key containing a valid OPENAI_API_KEY

## Main Files

- `index.js` : example of use in the form of a chat in the console
- `/libs/Chat.js` : Implements a class to integrate the OpenAI API, allowing dynamic interactions based on AI, and streamed answers.
- `/libs/Terminal.js` : Provides a colored console interface for interacting with the user (with input !)

[![Open in Replit](https://repl.it/badge/github/openai/gpt-3)](https://replit.com/@ilboued/console-ai-chat)

## Usage
 ```js
import Chat from "./libs/Chat.js";
import {Terminal} from "./libs/Terminal.js";

// Create a new chat, with a configuration prompt
const chat = new Chat("you are a helpfull assistant");

// Create a new terminal instance for user interaction
const terminal = new Terminal();

// Main loop for handling user input and responses
async function mainloop() {
  while (true) {
    // Await user input with a blue prompt
    const userQuestion = await terminal.input("user: ");

    // Check for 'exit' command to break the loop
    if (userQuestion.toLowerCase() === "exit") break;

    // Print a green prompt before the answer
    terminal.print("assistant: ");

    // Iterate through chat responses and print each chunk
    for await (const chunk of chat.answer(userQuestion)) {
      terminal.print(chunk);
    }

    // new line
    terminal.println("");
  }
}

// Close the terminal upon exiting the main loop
mainloop()
  .then(() => {
    terminal.close()
  });
```

Look at index.js for an richer example with colors :-)