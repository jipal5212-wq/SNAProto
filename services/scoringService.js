class ScoringService {
  calculateEvaluationScore(evalData) {
    // Technical Feasibility — 25%
    // Expected Impact — 25%
    // Innovation — 20%
    // Scalability — 15%
    // Cost Effectiveness — 15%
    
    const tf = (evalData.technicalFeasibility || 0) * 0.25;
    const ei = (evalData.expectedImpact || 0) * 0.25;
    const inn = (evalData.innovation || 0) * 0.20;
    const sc = (evalData.scalability || 0) * 0.15;
    const ce = (evalData.costEffectiveness || 0) * 0.15;
    
    return Math.round(tf + ei + inn + sc + ce);
  }
}

module.exports = new ScoringService();
