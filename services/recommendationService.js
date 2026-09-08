class RecommendationService {
  generateRuleBasedRecommendation(validation, pilot) {
    if (validation.validationStatus === 'VALIDATED') {
      return {
        status: 'SCALE_UP',
        reason: 'Pilot was fully validated and successfully achieved core KPIs. Scale-up is recommended.'
      };
    } else if (validation.validationStatus === 'PARTIALLY_VALIDATED') {
      return {
        status: 'EXTEND_PILOT',
        reason: 'Pilot showed partial success. Extended testing or a larger secondary pilot is recommended before full scale-up.'
      };
    } else {
      return {
        status: 'STOP',
        reason: 'Pilot failed to meet validation criteria. Do not proceed to scale-up.'
      };
    }
  }
}

module.exports = new RecommendationService();
