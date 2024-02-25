// ZXai.js

// request a stored Secrets for OPENAI_API_KEY

import OpenAI from "openai";

class ZXai {
  constructor(systemPrompt) {
    this.openai = new OpenAI();
    this.conversationHistory = [];
    this.conversationHistory.push({ role: "system", content: systemPrompt }); 
  }

  async ask(message) {
    this.conversationHistory.push({ role: "user", content: message }); 
    
    const response = await this.openai.chat.completions.create({
      messages: this.conversationHistory,
      model: "gpt-3.5-turbo",
      max_tokens: 4096
    });
  
    const aiMessage = response.choices[0].message.content.trim();
    this.conversationHistory.push({ role: "assistant", content: aiMessage});
  
    return aiMessage;
  }
}

export default ZXai
