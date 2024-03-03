// AIChat.js
// 2 march 2024
// ilboued
// v1.0.0

// usage :
//    const userQuestion = await zxconsole.input(BLUE + "You: ");
//
//    for await (const chunk of zxai.answer(userQuestion)) {
//      console.log(chunk);
//    }

import OpenAI from "openai";

class Chat {
  //////////////////////////////////////////////////////////////////
  // Constructor initializes the OpenAI instance and conversation history
  constructor(systemPrompt, openaiApiKey = process.env.OPENAI_API_KEY) {
    this.openai = new OpenAI({ apiKey: openaiApiKey });
    this.conversationHistory = [];
    // Add the initial system prompt to the conversation history
    this.conversationHistory.push({ role: "system", content: systemPrompt });
    this.stream = undefined;
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
      model: "gpt-3.5-turbo",
      messages: this.conversationHistory,
      stream: true,
      max_tokens: 4096,
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
      model: "gpt-4",
      max_tokens: 4096,
    });

    const aiMessage = response.choices[0].message.content.trim();
    this.conversationHistory.push({ role: "assistant", content: aiMessage });

    return aiMessage;
  }
}

export default Chat;
