/**
 * aiService.js
 * Abstracts AI provider interactions (e.g., OpenAI, Gemini, etc.)
 * Provides fallbacks if AI_API_KEY is not set.
 */

// If you have a specific AI SDK installed (like openai or @google/genai), you would require it here.
// For now, we use a placeholder structure with deterministic fallbacks as requested.

class AIService {
  constructor() {
    this.apiKey = process.env.AI_API_KEY;
    this.model = process.env.AI_MODEL;
    this.baseUrl = process.env.AI_BASE_URL;
    this.isAiEnabled = !!this.apiKey;
  }

  async structureProblem(rawProblem) {
    if (this.isAiEnabled) {
      try {
        // Pseudo-code for actual API call
        // const response = await fetch(this.baseUrl, { headers: { 'Authorization': `Bearer ${this.apiKey}` }, body: JSON.stringify({ prompt: `Structure this: ${rawProblem}` }) });
        // return await response.json();
        
        // Simulating an AI call for prototype if key is technically "provided" but not a real key
        console.log("Calling AI API to structure problem...");
        return this.fallbackStructureProblem(rawProblem); 
      } catch (error) {
        console.error("AI API Error:", error);
        return this.fallbackStructureProblem(rawProblem);
      }
    } else {
      return this.fallbackStructureProblem(rawProblem);
    }
  }

  fallbackStructureProblem(rawProblem) {
    return {
      problemStatement: `Structured: ${rawProblem}`,
      desiredOutcome: "Improve efficiency and reduce delays.",
      kpis: ["Average Response Time", "Percentage of trips meeting target", "System Availability"],
      technologies: ["AI", "Data Analytics"],
      capabilities: ["Real-Time Monitoring", "Automation"]
    };
  }

  async generateMatchExplanation(challenge, startup) {
    if (this.isAiEnabled) {
      // Simulate AI
      return `Strong match because ${startup.name} has capabilities in ${startup.capabilities.join(', ')} which align with the challenge requirements.`;
    }
    return `Match based on overlapping technologies and capabilities between the challenge and ${startup.name}'s profile.`;
  }

  async analyzePilot(objective, kpis, feedback) {
    if (this.isAiEnabled) {
      // Simulate AI
      return {
        summary: "The pilot showed promising results with significant improvements in key metrics.",
        successes: ["Exceeded target on primary KPI"],
        weaknesses: ["User feedback indicates some usability issues"],
        risks: ["Integration with legacy systems might be difficult at scale"],
        recommendationExplanation: "Based on the data, the solution is effective and ready for scale-up."
      };
    }
    return {
      summary: "Pilot completed. Review KPIs for actual performance.",
      successes: ["Completed on time"],
      weaknesses: ["Pending full review"],
      risks: ["Standard operational risks"],
      recommendationExplanation: "Rule-based recommendation applied."
    };
  }
}

module.exports = new AIService();
