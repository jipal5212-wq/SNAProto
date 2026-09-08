const aiService = require('./aiService');

class MatchingService {
  async calculateMatch(challenge, startup) {
    let score = 0;
    
    // 1. Technology match (20%)
    const challengeTechs = challenge.technologies.map(t => t.toLowerCase());
    const startupTechs = startup.technologies.map(t => t.toLowerCase());
    const commonTechs = challengeTechs.filter(t => startupTechs.includes(t));
    const techScore = challengeTechs.length ? (commonTechs.length / challengeTechs.length) * 20 : 20;
    score += techScore;

    // 2. Capability match (10%)
    const challengeCaps = challenge.requiredCapabilities.map(c => c.toLowerCase());
    const startupCaps = startup.capabilities.map(c => c.toLowerCase());
    const commonCaps = challengeCaps.filter(c => startupCaps.includes(c));
    const capScore = challengeCaps.length ? (commonCaps.length / challengeCaps.length) * 10 : 10;
    score += capScore;

    // 3. Sector match (15%)
    const sectorScore = (startup.industries.map(i=>i.toLowerCase()).includes((challenge.sector || '').toLowerCase())) ? 15 : 0;
    score += sectorScore;

    // 4. Pilot Readiness (5%)
    const readyScore = startup.pilotReady ? 5 : 0;
    score += readyScore;

    // 5. Semantic similarity via AI / Fallback (50%)
    // Since we don't have embeddings locally without AI provider, we do a basic keyword match fallback.
    const textMatchScore = this.calculateTextSimilarity(
      (challenge.problemStatement + " " + challenge.desiredOutcome).toLowerCase(),
      (startup.description || "").toLowerCase()
    );
    const semanticScore = textMatchScore * 50;
    score += semanticScore;

    const explanation = await aiService.generateMatchExplanation(challenge, startup);

    return {
      score: Math.round(score),
      explanation
    };
  }

  calculateTextSimilarity(text1, text2) {
    if (!text1 || !text2) return 0.5; // neutral fallback
    const words1 = text1.split(/\W+/);
    const words2 = text2.split(/\W+/);
    let common = 0;
    for (let word of words1) {
      if (word.length > 3 && words2.includes(word)) common++;
    }
    // Very crude fallback
    return Math.min(1, common / 10 + 0.3); // base 0.3 + 0.1 per word matched
  }

  async getRecommendedChallenges(startup) {
    const Challenge = require('../models/Challenge');
    const challenges = await Challenge.find({ status: 'PUBLISHED' });
    const scored = await Promise.all(challenges.map(async ch => {
      const res = await this.calculateMatch(ch, startup);
      return { challenge: ch, score: res.score, explanation: res.explanation };
    }));
    return scored.sort((a, b) => b.score - a.score);
  }
}

module.exports = new MatchingService();
