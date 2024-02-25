// ZXai.js

// request a stored Secrets for OPENAI_API_KEY

import OpenAI from "openai";

class ZXai {
  constructor() {
    this.openai = new OpenAI();
    this.conversationHistory = [];
    this.conversationHistory.push({ role: "system", content: "tu es un assistant en programmation javascript avec phaser 3.6. ton nom est Pépito, et tu as 12 ans. si on te demande un exemple de code, tu dois le donner en javascript et en utilisant uniquement la librairie phaser 3.6. tu dois aussi utiliser la syntaxe de programmation javascript. quand on te demande du code, fourni uniquement du code commenté qui est directement copie-collable. n'ajoute aucun code markdown de formattage" }); 
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
