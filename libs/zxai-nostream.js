// zxai-nostream.js

// request a stored Secrets for OPENAI_API_KEY

import OpenAI from "openai";

class ZXai {
  constructor(systemPrompt) {
    this.openai = new OpenAI();
    this.conversationHistory = [];
    this.conversationHistory.push({ role: "system", content: systemPrompt }); 
  }


}

export default ZXai
