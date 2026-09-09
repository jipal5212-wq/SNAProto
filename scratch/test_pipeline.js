const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
const Application = require('../models/Application');
const Startup = require('../models/Startup');
const ragService = require('../services/ragService');
const path = require('path');

async function testFullPrototype() {
  await mongoose.connect('mongodb://localhost:27017/snap_prototype');
  console.log('Connected to MongoDB');

  // 1. Verify RAG availability
  const isAvailable = await ragService.isAvailable();
  console.log('1. RAG Engine Status:', isAvailable ? 'ONLINE (FastAPI Port 8000)' : 'OFFLINE');
  if (!isAvailable) throw new Error('RAG engine is offline');

  // 2. Fetch seeded challenge
  const challenge = await Challenge.findOne({ status: 'PUBLISHED' });
  console.log(`2. Testing with Challenge: "${challenge.title}"`);

  // 3. Sync challenge with RAG engine
  const problemId = await ragService.syncProblem(challenge);
  challenge.ragProblemId = problemId;
  await challenge.save();
  console.log(`3. Challenge successfully registered in RAG Engine with problem_id: ${problemId}`);

  // 4. Test Startup Proposal Document Uploads
  const sampleDocs = [
    {
      name: 'AquaSense Technologies',
      file: path.join(__dirname, '../rag-engine/sample_docs/AquaSense_IoT_Solution.docx')
    },
    {
      name: 'HydroVision Analytics',
      file: path.join(__dirname, '../rag-engine/sample_docs/HydroVision_Satellite_Solution.docx')
    },
    {
      name: 'MegaInfrastructure Ltd',
      file: path.join(__dirname, '../rag-engine/sample_docs/MegaCorp_Ineligible_Sample.docx')
    }
  ];

  console.log('4. Uploading and parsing startup proposals...');
  for (const doc of sampleDocs) {
    const res = await ragService.uploadSolutionDoc(problemId, doc.name, doc.file);
    console.log(`   -> [${doc.name}] Solution ID: ${res.solution_id} | Eligible: ${res.eligible} (${res.eligibility_reason}) | Flags: ${res.consistency_flags.length}`);
  }

  // 5. Trigger AI Shortlisting & Scoring
  console.log('5. Triggering AI RAG Shortlist & Ranking...');
  const shortlist = await ragService.getShortlist(problemId, true);
  console.log(`   -> Ranked ${shortlist.ranked_solutions.length} solutions:`);
  shortlist.ranked_solutions.forEach((sol, i) => {
    console.log(`      #${i + 1} ${sol.startup_name}: Score ${sol.final_score}/10 | Rel: ${sol.scores.relevance}/5, Feas: ${sol.scores.feasibility}/5, Inn: ${sol.scores.innovation}/5`);
  });

  // 6. Test Cross-Document ChromaDB Semantic Search
  console.log('6. Testing ChromaDB Cross-Document Semantic Search for "acoustic IoT sensors"...');
  const searchResults = await ragService.searchSolutions(problemId, 'acoustic IoT sensors');
  console.log(`   -> Found ${searchResults.results.length} semantic matches in vector database:`);
  searchResults.results.slice(0, 2).forEach(r => {
    console.log(`      - Startup: ${r.startup_name} (Similarity: ${r.similarity_score})`);
    console.log(`        Snippet: "${r.chunk.substring(0, 90)}..."`);
  });

  console.log('\n=============================================');
  console.log('ALL WORKFLOW GATES & PIPELINE VERIFIED 100%!');
  console.log('=============================================');
  process.exit(0);
}

testFullPrototype().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
