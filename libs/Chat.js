// AIChat.js
// 2 march 2024
// ilboued
// v1.0.0
// usage :
async function testChat() {
  console.log("Chat Test by requesting a citation and a french citation :");
  process.stdout.write(" - ");
  const chat = new Chat({
    systemPrompt: "you are a helpfull assistant",
    openaiApiKey: process.env.OPENAI_API_KEY, // use your own api key
    model: "gpt-3.5-turbo",
    maxToken: 4096,
  });

  // Main loop for handling user input and stream responses
  async function main() {
    for await (const chunk of chat.answer(
      "hello ! tell me short random citation with the author !",
    )) {
      process.stdout.write(chunk);
    }
    process.stdout.write("\n - ");
    for await (const chunk of chat.answer(
      "hello ! tell me short random citation with the author ! Use french langage",
    )) {
      process.stdout.write(chunk);
    }
  }
  // Close the terminal upon exiting the main loop
  await main();
  console.log("\n=> Test completed !\n");
}

// call this function to test the chat,
// use await if you want to wait for the response :

// await testChat()

import OpenAI from "openai";

const defaultSystemPrompt = "you are a helpfull assistant";
const defaultOpenaiApiKey = process.env.OPENAI_API_KEY;
const defaultOpenAIModel = "gpt-3.5-turbo";
const defaulMaxTokens = 4096;

class Chat {
  systemPrompt;
  openaiApiKey;
  openaiModel;
  maxTokens;

  //////////////////////////////////////////////////////////////////
  // Constructor initializes the OpenAI instance and conversation history
  constructor(config = {}) {
    this.reset(config);

    this.openai = new OpenAI({ apiKey: this.openaiApiKey });
  }

  setConfig(config = {}) {
    this.systemPrompt = config.systemPrompt || defaultSystemPrompt;
    this.openaiApiKey = config.openaiApiKey || defaultOpenaiApiKey;
    this.model = config.model || defaultOpenAIModel;
    this.maxTokens = config.maxTokens || defaulMaxTokens;
  }

  setModel(model = defaultOpenAIModel) {
    this.model = model;
  }

  setApIKey(apiKey = defaultOpenaiApiKey) {
    this.openaiApiKey = apiKey;
  }

  setMaxTokens(maxTokens = defaulMaxTokens) {
    this.maxTokens = maxTokens;
  }

  setSystemPrompt(systemPrompt = defaultSystemPrompt) {
    this.systemPrompt = systemPrompt;
    // Ajouter un nouveau message système à la conversationHistory
    this.conversationHistory.push({
      role: "system",
      content: this.systemPrompt,
    });
  }

  resetConversation() {
    this.conversationHistory = [
      {
        role: "system",
        content: this.systemPrompt,
      },
    ];
  }

  async reset(config = {}) {
    await this.abort();
    this.setConfig(config);
    this.conversationHistory = [];
    this.conversationHistory.push({
      role: "system",
      content: this.systemPrompt,
    });
  }

  //////////////////////////////////////////////////////////////////
  // Asynchronous generator function to handle streaming responses
  async *answer(prompt) {
    await this.abort();
    // Add user's prompt to the conversation history
    this.conversationHistory.push({ role: "user", content: prompt });
    // Placeholder for assistant's response
    this.conversationHistory.push({ role: "assistant", content: "" });
    // Configuration for OpenAI API request
    const openai_config = {
      model: this.model,
      messages: this.conversationHistory,
      stream: true,
      max_tokens: this.maxTokens,
    };

    try {
      // Create a stream for receiving OpenAI responses
      this.stream = await this.openai.chat.completions.create(openai_config);

      // Iterate over each chunk of data in the stream
      for await (const chunk of this.stream) {
        const [choice] = chunk.choices;
        const { content } = choice.delta;

        // If there is content, yield it and append to the last conversation entry
        if (content) {
          yield content;
          this.conversationHistory[
            this.conversationHistory.length - 1
          ].content += content;
        }
      }
    } catch (error) {
      // Log and rethrow any errors encountered during streaming
      console.error("Error during OpenAI streaming:", error);
      throw error;
    }
  }

  //////////////////////////////////////////////////////////////////
  // stop streaming
  async abort() {
    if (
      this.stream &&
      this.stream.controller &&
      typeof this.stream.controller.abort === "function"
    ) {
      this.stream.controller.abort();
      this.stream = undefined;
    }
  }

  //////////////////////////////////////////////////////////////////
  // answer without streaming
  async answerWithoutStreaming(message) {
    this.conversationHistory.push({ role: "user", content: message });

    const response = await this.openai.chat.completions.create({
      messages: this.conversationHistory,
      model: this.model,
      max_tokens: this.maxTokens,
    });

    const aiMessage = response.choices[0].message.content.trim();
    this.conversationHistory.push({ role: "assistant", content: aiMessage });

    return aiMessage;
  }
}

export { Chat, testChat };
