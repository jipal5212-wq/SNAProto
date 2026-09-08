# Government Innovation Procurement & Pilot Management Platform

A fully working prototype designed to demonstrate the lifecycle of government innovation: from problem definition to challenge publishing, startup matching, evaluation, pilot tracking, and scale-up recommendation.

## Features Included
1. **Problem → Challenge Builder**: Government defines raw problems, and AI helps structure them into outcome-based challenges with KPIs.
2. **Challenge Marketplace**: Startups can view and discover published challenges.
3. **Startup Profiles & Matching**: AI-assisted compatibility scoring matches startups to challenges based on technologies, capabilities, and semantic similarity.
4. **Evaluation & Selection**: Evaluators score applications based on predefined criteria (Technical Feasibility, Expected Impact, Innovation, Scalability, Cost).
5. **Pilot Management**: Governments create controlled pilots with selected startups.
6. **KPI Monitoring**: Track baseline, target, and actual values for multiple KPIs.
7. **Validation & Recommendation**: Rule-based engine recommends SCALE UP, EXTEND PILOT, or STOP based on validation outcomes.
8. **Role-based Dashboards**: Specific views for Government, Startups, and Evaluators.

## Getting Started

### Prerequisites
- Node.js
- MongoDB running locally (default: `mongodb://localhost:27017/snap_prototype`)

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables:
   Rename `.env.example` to `.env` and fill in your details (especially the `AI_API_KEY` if you want real AI processing, otherwise it falls back to deterministic mock data).
   ```bash
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/snap_prototype
   SESSION_SECRET=your_secret
   AI_API_KEY=your_key_here
   ```
3. Seed the database with demo data:
   ```bash
   node seed/seed.js
   ```
4. Start the server:
   ```bash
   npm start
   ```
   Or for development:
   ```bash
   npm run dev
   ```

### Demo Accounts (Password for all: `password`)
- **Government**: `gov@demo.com`
- **Startup**: `startup@demo.com`
- **Evaluator**: `evaluator@demo.com`
- **Admin**: `admin@demo.com`

## Prototype Limitations & Future Expansion
- **AI Processing**: Currently abstracted. It includes a fallback mechanism if no API key is provided, ensuring the prototype always works for demonstrations.
- **Authentication**: Simple session-based auth is used for the prototype. In production, an SSO or OAuth provider (e.g., Auth0, Azure AD) should be implemented.
- **File Uploads (Evidence)**: The evidence management UI is stubbed out for the hackathon but currently lacks an S3/Cloud Storage backend implementation.
- **Matching Engine**: Uses a simplified weighted scoring model. In a production environment, this would utilize proper vector embeddings and a dedicated vector database (like Pinecone or Milvus).
