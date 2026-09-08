require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Department = require('../models/Department');
const Startup = require('../models/Startup');
const Challenge = require('../models/Challenge');
const Application = require('../models/Application');
const Evaluation = require('../models/Evaluation');
const Pilot = require('../models/Pilot');
const KPI = require('../models/KPI');
const Validation = require('../models/Validation');
const Recommendation = require('../models/Recommendation');

async function seed() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/snap_prototype');
      console.log('Connected to DB for seeding...');
    }

    // Clear ALL collections
    await Promise.all([
      User.deleteMany({}),
      Department.deleteMany({}),
      Startup.deleteMany({}),
      Challenge.deleteMany({}),
      Application.deleteMany({}),
      Evaluation.deleteMany({}),
      Pilot.deleteMany({}),
      KPI.deleteMany({}),
      Validation.deleteMany({}),
      Recommendation.deleteMany({})
    ]);
    console.log('Cleared all collections.');

    const passwordHash = await bcrypt.hash('password', 10);

    // ──────────────────────────────────────────────
    // 1. DEPARTMENTS
    // ──────────────────────────────────────────────
    const healthDept = await Department.create({
      name: 'Health Department',
      description: 'Department responsible for public health, hospitals, and emergency services.',
      sector: 'Healthcare'
    });

    const urbanDept = await Department.create({
      name: 'Urban Development Department',
      description: 'Department responsible for urban planning, waste management, and infrastructure.',
      sector: 'Urban Development'
    });

    // ──────────────────────────────────────────────
    // 2. USERS
    // ──────────────────────────────────────────────
    const govUser = await User.create({
      name: 'Gov Official',
      email: 'gov@demo.com',
      password: passwordHash,
      role: 'GOVERNMENT',
      department: healthDept._id
    });

    const evaluatorUser = await User.create({
      name: 'Expert Evaluator',
      email: 'evaluator@demo.com',
      password: passwordHash,
      role: 'EVALUATOR',
      department: healthDept._id
    });

    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@demo.com',
      password: passwordHash,
      role: 'ADMIN'
    });

    // Startup Users
    const startup1User = await User.create({
      name: 'Alice Founder',
      email: 'startup@demo.com',
      password: passwordHash,
      role: 'STARTUP'
    });

    const startup2User = await User.create({
      name: 'Bob Innovator',
      email: 'startup2@demo.com',
      password: passwordHash,
      role: 'STARTUP'
    });

    const startup3User = await User.create({
      name: 'Carol Builder',
      email: 'startup3@demo.com',
      password: passwordHash,
      role: 'STARTUP'
    });

    // ──────────────────────────────────────────────
    // 3. STARTUPS
    // ──────────────────────────────────────────────
    const startup1 = await Startup.create({
      user: startup1User._id,
      name: 'ABC Technologies',
      description: 'We build AI and IoT solutions for real-time route optimization, focusing on emergency and logistics operations. Our platform uses machine learning to predict traffic patterns and optimize response routes in real-time.',
      industries: ['Transportation', 'Healthcare', 'Emergency Services'],
      technologies: ['AI', 'Machine Learning', 'IoT', 'Data Analytics'],
      capabilities: ['Route Optimization', 'Real-Time Monitoring', 'Predictive Analytics'],
      products: ['RouteOptimizer Pro', 'EmergencyTrack Platform'],
      teamSize: '15-25',
      stage: 'Series A',
      foundedYear: 2021,
      previousProjects: ['City Transit Optimization Pilot', 'Logistics Fleet Management'],
      governmentProjects: ['Metro City Traffic Pilot Program'],
      pilotReady: true,
      regions: ['North America', 'Europe']
    });
    startup1User.startup = startup1._id;
    await startup1User.save();

    const startup2 = await Startup.create({
      user: startup2User._id,
      name: 'VisionTrack Analytics',
      description: 'Computer vision and traffic analytics company specializing in urban mobility solutions. We use camera feeds and AI to analyze traffic flow and provide actionable insights.',
      industries: ['Transportation', 'Smart Cities'],
      technologies: ['Computer Vision', 'AI', 'Data Analytics', 'Cloud'],
      capabilities: ['Traffic Analytics', 'Computer Vision', 'Data Processing', 'Real-Time Monitoring'],
      products: ['TrafficSense Platform', 'Urban Flow Dashboard'],
      teamSize: '10-20',
      stage: 'Seed',
      foundedYear: 2022,
      previousProjects: ['Smart Traffic Signal Project'],
      governmentProjects: [],
      pilotReady: true,
      regions: ['North America']
    });
    startup2User.startup = startup2._id;
    await startup2User.save();

    const startup3 = await Startup.create({
      user: startup3User._id,
      name: 'AquaSense IoT',
      description: 'IoT-based water monitoring and leakage detection platform. Our sensors detect anomalies in water distribution networks and alert operators in real-time.',
      industries: ['Water Management', 'Infrastructure', 'Smart Cities'],
      technologies: ['IoT', 'Data Analytics', 'Machine Learning', 'Cloud'],
      capabilities: ['Real-Time Monitoring', 'Anomaly Detection', 'Predictive Maintenance', 'Data Processing'],
      products: ['AquaGuard Sensor Network', 'LeakFinder Pro'],
      teamSize: '5-10',
      stage: 'Pre-Seed',
      foundedYear: 2023,
      previousProjects: ['University Water Network Monitoring'],
      governmentProjects: [],
      pilotReady: false,
      regions: ['Europe']
    });
    startup3User.startup = startup3._id;
    await startup3User.save();

    // ──────────────────────────────────────────────
    // 4. CHALLENGES
    // ──────────────────────────────────────────────
    const challenge1 = await Challenge.create({
      department: healthDept._id,
      title: 'Emergency Response Optimization',
      rawProblem: 'Ambulances are getting delayed because of traffic congestion in the city center during peak hours.',
      problemStatement: 'Emergency vehicles experience significant delays due to urban traffic congestion, resulting in longer response times and potentially worse patient outcomes. The average response time has increased by 40% during peak hours over the last 3 years.',
      desiredOutcome: 'Reduce average emergency response time from 25 minutes to 15 minutes through real-time route optimization and traffic-aware dispatching.',
      target: '15 minutes average response time',
      sector: 'Healthcare',
      affectedUsers: ['Emergency Medical Teams', 'Patients', 'Hospital Staff'],
      location: 'Metro City Central District',
      currentProcess: 'Manual dispatch with static routing based on shortest distance.',
      baseline: '25 minutes average response time',
      constraints: ['Must integrate with existing CAD systems', 'Must work in areas with poor GPS coverage', 'Must not require infrastructure changes to ambulances'],
      technologies: ['AI', 'Machine Learning', 'IoT', 'Data Analytics'],
      requiredCapabilities: ['Route Optimization', 'Real-Time Monitoring', 'Predictive Analytics'],
      budgetMin: 50000,
      budgetMax: 150000,
      pilotDuration: '30 Days',
      kpis: ['Average Response Time', 'Percentage of trips meeting 15-min target', 'Route Efficiency Score', 'System Availability %'],
      deadline: new Date('2026-12-31'),
      status: 'PUBLISHED',
      aiGenerated: true,
      createdAt: new Date('2026-08-01')
    });

    const challenge2 = await Challenge.create({
      department: urbanDept._id,
      title: 'Smart Waste Management System',
      rawProblem: 'Garbage trucks follow fixed routes regardless of whether bins are full, wasting fuel and missing overflowing bins.',
      problemStatement: 'Municipal waste collection follows static schedules and routes, leading to inefficient resource utilization. Approximately 30% of pickups are unnecessary (bins not full), while 15% of bins overflow between collections.',
      desiredOutcome: 'Implement IoT-based fill-level monitoring to optimize waste collection routes, reducing unnecessary pickups by 50% and eliminating bin overflow incidents.',
      target: '50% reduction in unnecessary pickups',
      sector: 'Urban Development',
      technologies: ['IoT', 'Data Analytics', 'Cloud'],
      requiredCapabilities: ['Real-Time Monitoring', 'Route Optimization', 'Data Processing'],
      budgetMin: 30000,
      budgetMax: 100000,
      pilotDuration: '45 Days',
      kpis: ['Collection Route Efficiency', 'Bin Overflow Rate', 'Fuel Consumption', 'Citizen Satisfaction'],
      deadline: new Date('2026-11-30'),
      status: 'PUBLISHED',
      createdAt: new Date('2026-08-15')
    });

    const challenge3 = await Challenge.create({
      department: urbanDept._id,
      title: 'Water Leakage Detection & Prevention',
      rawProblem: 'The city loses 30% of treated water due to undetected leaks in the aging distribution network.',
      problemStatement: 'The municipal water distribution network loses approximately 30% of treated water through undetected leaks, costing the city millions annually and straining water resources during drought conditions.',
      desiredOutcome: 'Deploy IoT-based leak detection sensors to reduce water loss from 30% to under 15% within the pilot zone.',
      target: 'Reduce water loss to under 15%',
      sector: 'Infrastructure',
      technologies: ['IoT', 'Machine Learning', 'Data Analytics'],
      requiredCapabilities: ['Anomaly Detection', 'Real-Time Monitoring', 'Predictive Maintenance'],
      budgetMin: 40000,
      budgetMax: 120000,
      pilotDuration: '60 Days',
      kpis: ['Water Loss %', 'Leak Detection Accuracy', 'Mean Time to Detection', 'Cost Savings'],
      deadline: new Date('2027-01-31'),
      status: 'PUBLISHED',
      createdAt: new Date('2026-09-01')
    });

    // ──────────────────────────────────────────────
    // 5. APPLICATIONS (for the primary demo scenario)
    // ──────────────────────────────────────────────
    const app1 = await Application.create({
      challenge: challenge1._id,
      startup: startup1._id,
      solutionTitle: 'RouteOptimizer Pro for Emergency Services',
      solutionDescription: 'Our AI-powered platform uses real-time traffic data, historical patterns, and machine learning to dynamically optimize ambulance routes. The system integrates with existing CAD systems via API and provides turn-by-turn navigation optimized for emergency response.',
      technicalApproach: 'We combine real-time traffic feeds (Google Maps, Waze) with historical incident data and ML models trained on 2 years of city traffic patterns. Our routing engine recalculates optimal routes every 30 seconds during active dispatch.',
      implementationPlan: 'Week 1-2: API integration with existing CAD system. Week 3: Driver training and tablet deployment. Week 4-6: Monitored parallel operation. Week 7-8: Full deployment with performance measurement.',
      expectedImpact: 'Based on our previous transit pilot, we expect a 30-35% reduction in response times, bringing the average from 25 minutes to approximately 16-17 minutes.',
      estimatedCost: 85000,
      pilotRequirements: 'API access to dispatch system, 5 ambulances equipped with tablets, real-time traffic data feed.',
      status: 'PILOT_SELECTED',
      matchScore: 92,
      submittedAt: new Date('2026-08-10')
    });

    const app2 = await Application.create({
      challenge: challenge1._id,
      startup: startup2._id,
      solutionTitle: 'TrafficSense Emergency Corridor System',
      solutionDescription: 'Our computer vision platform uses existing city CCTV cameras to monitor traffic density and predict congestion. We create dynamic emergency corridors by coordinating with traffic signals along the optimal route.',
      technicalApproach: 'Computer vision analysis of CCTV feeds to assess real-time traffic density. AI model predicts congestion 10-15 minutes ahead. Integration with traffic signal control for green-wave corridors.',
      implementationPlan: 'Phase 1: Camera feed integration (2 weeks). Phase 2: AI model deployment (1 week). Phase 3: Signal integration pilot (2 weeks). Phase 4: Measurement (3 weeks).',
      expectedImpact: 'Expected 20-25% reduction in response times through predictive traffic clearing.',
      estimatedCost: 120000,
      pilotRequirements: 'Access to CCTV feeds, traffic signal API, dedicated server infrastructure.',
      status: 'SHORTLISTED',
      matchScore: 84,
      submittedAt: new Date('2026-08-12')
    });

    // ──────────────────────────────────────────────
    // 6. EVALUATIONS
    // ──────────────────────────────────────────────
    const eval1 = await Evaluation.create({
      application: app1._id,
      evaluator: evaluatorUser._id,
      technicalFeasibility: 90,
      expectedImpact: 88,
      innovation: 85,
      scalability: 92,
      costEffectiveness: 88,
      finalScore: 89, // 90*0.25 + 88*0.25 + 85*0.20 + 92*0.15 + 88*0.15 = 22.5 + 22 + 17 + 13.8 + 13.2 = 88.5 ≈ 89
      comments: 'Strong technical solution with proven track record. The integration with existing CAD systems is a major advantage. Cost is reasonable for the expected impact.',
      createdAt: new Date('2026-08-20')
    });

    const eval2 = await Evaluation.create({
      application: app2._id,
      evaluator: evaluatorUser._id,
      technicalFeasibility: 78,
      expectedImpact: 82,
      innovation: 90,
      scalability: 75,
      costEffectiveness: 70,
      finalScore: 80, // 78*0.25 + 82*0.25 + 90*0.20 + 75*0.15 + 70*0.15 = 19.5 + 20.5 + 18 + 11.25 + 10.5 = 79.75 ≈ 80
      comments: 'Innovative approach using existing CCTV infrastructure. However, the signal integration requires cooperation from traffic authority which adds risk. Higher cost than competing solutions.',
      createdAt: new Date('2026-08-20')
    });

    // ──────────────────────────────────────────────
    // 7. PILOT (the primary demo scenario)
    // ──────────────────────────────────────────────
    const pilot1 = await Pilot.create({
      challenge: challenge1._id,
      startup: startup1._id,
      department: healthDept._id,
      objective: 'Test and validate ABC Technologies RouteOptimizer Pro for emergency response time reduction in Metro City Central District.',
      location: 'Metro City Central District',
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-09-30'),
      budget: 85000,
      baseline: '25 minutes average response time',
      target: '15 minutes average response time',
      milestones: [
        { name: 'System Deployment & Integration', status: 'COMPLETED' },
        { name: 'CAD System Integration', status: 'COMPLETED' },
        { name: 'Field Testing (5 Ambulances)', status: 'COMPLETED' },
        { name: 'Performance Measurement', status: 'COMPLETED' },
        { name: 'Final Evaluation', status: 'COMPLETED' }
      ],
      feedback: [
        {
          rating: 4,
          usability: 'Intuitive interface, drivers adapted quickly',
          effectiveness: 'Noticeable improvement in route quality',
          reliability: 'System was available 99.2% of the time',
          comments: 'The real-time rerouting feature was particularly helpful during rush hour. Some minor GPS accuracy issues in tunnel areas.',
          submittedBy: govUser._id,
          createdAt: new Date('2026-09-28')
        },
        {
          rating: 5,
          usability: 'Very easy to use after initial training',
          effectiveness: 'Significant time savings observed',
          reliability: 'Rock solid performance',
          comments: 'Best routing solution we have tested. The predictive traffic feature is game-changing.',
          submittedBy: evaluatorUser._id,
          createdAt: new Date('2026-09-29')
        }
      ],
      evidence: [
        {
          filename: 'pilot_report_sept2026.pdf',
          type: 'PDF',
          category: 'Report',
          uploadedBy: govUser._id,
          uploadedAt: new Date('2026-09-30'),
          description: 'Final pilot performance report with all metrics.',
          verificationStatus: 'VERIFIED'
        },
        {
          filename: 'response_time_data.csv',
          type: 'CSV',
          category: 'Data',
          uploadedBy: evaluatorUser._id,
          uploadedAt: new Date('2026-09-30'),
          description: 'Raw response time data for all 300+ dispatches during pilot.',
          verificationStatus: 'VERIFIED'
        }
      ],
      status: 'SCALE_UP_RECOMMENDED'
    });

    // ──────────────────────────────────────────────
    // 8. KPIs with realistic measurement data
    // ──────────────────────────────────────────────
    const kpi1 = await KPI.create({
      pilot: pilot1._id,
      name: 'Average Response Time',
      description: 'Average time from dispatch to arrival at scene.',
      unit: 'Minutes',
      direction: 'lower_is_better',
      baseline: 25,
      target: 15,
      measurementFrequency: 'Daily',
      measurementMethod: 'Automated CAD system logging',
      dataSource: 'CAD System API',
      actualValues: [
        { date: new Date('2026-09-01'), value: 24 },
        { date: new Date('2026-09-05'), value: 22 },
        { date: new Date('2026-09-10'), value: 20 },
        { date: new Date('2026-09-15'), value: 19 },
        { date: new Date('2026-09-20'), value: 18 },
        { date: new Date('2026-09-25'), value: 17 },
        { date: new Date('2026-09-30'), value: 17 }
      ]
    });

    const kpi2 = await KPI.create({
      pilot: pilot1._id,
      name: 'Route Efficiency Score',
      description: 'Percentage of optimal route followed vs. actual route taken.',
      unit: '%',
      direction: 'higher_is_better',
      baseline: 65,
      target: 85,
      measurementFrequency: 'Weekly',
      measurementMethod: 'GPS tracking analysis',
      dataSource: 'RouteOptimizer Platform',
      actualValues: [
        { date: new Date('2026-09-07'), value: 72 },
        { date: new Date('2026-09-14'), value: 78 },
        { date: new Date('2026-09-21'), value: 84 },
        { date: new Date('2026-09-28'), value: 87 }
      ]
    });

    const kpi3 = await KPI.create({
      pilot: pilot1._id,
      name: 'Trips Meeting 15-min Target',
      description: 'Percentage of dispatches that arrive within 15 minutes.',
      unit: '%',
      direction: 'higher_is_better',
      baseline: 35,
      target: 70,
      measurementFrequency: 'Weekly',
      measurementMethod: 'CAD system analysis',
      dataSource: 'CAD System',
      actualValues: [
        { date: new Date('2026-09-07'), value: 42 },
        { date: new Date('2026-09-14'), value: 51 },
        { date: new Date('2026-09-21'), value: 58 },
        { date: new Date('2026-09-28'), value: 62 }
      ]
    });

    const kpi4 = await KPI.create({
      pilot: pilot1._id,
      name: 'System Availability',
      description: 'Uptime percentage of the RouteOptimizer platform.',
      unit: '%',
      direction: 'higher_is_better',
      baseline: 0,
      target: 99,
      measurementFrequency: 'Daily',
      measurementMethod: 'Automated monitoring',
      dataSource: 'System logs',
      actualValues: [
        { date: new Date('2026-09-07'), value: 99.1 },
        { date: new Date('2026-09-14'), value: 99.5 },
        { date: new Date('2026-09-21'), value: 99.8 },
        { date: new Date('2026-09-28'), value: 99.2 }
      ]
    });

    // Link KPIs to Pilot
    pilot1.kpis = [kpi1._id, kpi2._id, kpi3._id, kpi4._id];
    await pilot1.save();

    // ──────────────────────────────────────────────
    // 9. VALIDATION
    // ──────────────────────────────────────────────
    const validation1 = await Validation.create({
      pilot: pilot1._id,
      evaluator: evaluatorUser._id,
      kpiAchievement: 'Response time reduced from 25 to 17 minutes (80% of target achieved). Route efficiency exceeded target at 87%. System availability consistently above 99%.',
      evidenceVerified: true,
      technicalValidation: 'All technical requirements met. CAD integration working smoothly. System performed reliably under load.',
      validationStatus: 'VALIDATED',
      comments: 'The pilot demonstrated clear value in reducing emergency response times. While the 15-minute target was not fully achieved (actual: 17 minutes), the improvement is significant and further optimization is expected at full scale. Strongly recommend proceeding to scale-up.',
      validatedAt: new Date('2026-10-02')
    });

    // ──────────────────────────────────────────────
    // 10. RECOMMENDATION
    // ──────────────────────────────────────────────
    const recommendation1 = await Recommendation.create({
      pilot: pilot1._id,
      recommendation: 'SCALE_UP',
      reason: 'Pilot was fully validated. Response time improved from 25 to 17 minutes (32% improvement). Route efficiency improved from 65% to 87%. System availability exceeded 99%. Average stakeholder feedback rating: 4.5/5. Evidence is complete and verified. Scale-up is recommended for city-wide deployment.',
      kpiAchievement: '80% overall KPI achievement',
      validationStatus: 'VALIDATED',
      feedbackScore: 4.5,
      generatedBy: 'RULE_ENGINE',
      createdAt: new Date('2026-10-02')
    });

    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('  SEED COMPLETE! Demo data loaded.');
    console.log('═══════════════════════════════════════════');
    console.log('');
    console.log('Demo Accounts (password: "password"):');
    console.log('  Government:  gov@demo.com');
    console.log('  Startup:     startup@demo.com');
    console.log('  Evaluator:   evaluator@demo.com');
    console.log('  Admin:       admin@demo.com');
    console.log('');
    console.log('Seeded Data:');
    console.log(`  Departments:      2`);
    console.log(`  Users:            6`);
    console.log(`  Startups:         3`);
    console.log(`  Challenges:       3 (all PUBLISHED)`);
    console.log(`  Applications:     2`);
    console.log(`  Evaluations:      2`);
    console.log(`  Pilots:           1 (SCALE_UP_RECOMMENDED)`);
    console.log(`  KPIs:             4 (with measurement data)`);
    console.log(`  Validations:      1 (VALIDATED)`);
    console.log(`  Recommendations:  1 (SCALE_UP)`);
    console.log('');
    console.log('Primary Demo Scenario:');
    console.log('  Challenge: Emergency Response Optimization');
    console.log('  Startup:   ABC Technologies');
    console.log('  Result:    SCALE UP RECOMMENDED');
    console.log('═══════════════════════════════════════════');

    return { success: true };
  } catch (err) {
    console.error('Seed Error:', err);
    throw err;
  }
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seed;
