# S.N.A.P — Startup Network & Automated Procurement

> **AI-Powered Platform for Government Innovation, Startup Discovery & Automated Procurement**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/jipal5212-wq/SNAProto)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/new?template=https://github.com/jipal5212-wq/SNAProto)
[![GitHub Repository](https://img.shields.io/badge/GitHub-jipal5212--wq%2FSNAProto-blue?logo=github)](https://github.com/jipal5212-wq/SNAProto)
[![Docker Ready](https://img.shields.io/badge/Docker-Production%20Ready-2496ED?logo=docker)](file:///c:/Users/ASHISH%20KUMAR%20PAL/.gemini/antigravity-ide/scratch/SNAP-Startup-Network-Automated-Procurement-/SNAP/Dockerfile)

**S.N.A.P (Startup Network & Automated Procurement)** is an AI-powered GovTech platform designed to bridge the gap between **government departments and innovative startups**.

The platform enables government departments to transform real-world operational problems into structured challenges, discover relevant startups, evaluate their solutions, manage pilot programs, monitor measurable outcomes, and generate evidence-based procurement recommendations.

### End-to-End Workflow

```text
Government Problem
        ↓
AI-Powered Challenge Creation
        ↓
Challenge Marketplace
        ↓
Startup Discovery & Matching
        ↓
Solution Submission
        ↓
Evaluation & Ranking
        ↓
Pilot Selection
        ↓
KPI Monitoring
        ↓
Validation
        ↓
Procurement Recommendation
        ↓
SCALE-UP / EXTEND / STOP
```

> **S.N.A.P is a functional hackathon prototype / proof of concept demonstrating the innovation-to-adoption lifecycle.**

---

## 🚨 Problem

Government departments regularly encounter operational challenges that could potentially be solved by innovative startup technologies.

However, the current innovation adoption process can involve several difficulties:

* Converting operational problems into well-defined innovation challenges
* Discovering startups capable of solving specific government problems
* Comparing startup solutions objectively
* Managing pilot programs
* Tracking measurable outcomes
* Collecting and organizing pilot evidence
* Making informed decisions about scaling successful solutions

This creates a gap between:

**Government Problems ↔ Startup Innovation ↔ Real-World Adoption**

S.N.A.P aims to bridge this gap through a unified digital platform.

---

# 💡 Our Solution

S.N.A.P provides a centralized workflow connecting government departments and startups.

Government departments can:

* Create operational problems
* Generate structured challenges using AI
* Publish challenges
* Discover suitable startups
* Evaluate submitted solutions
* Select solutions for pilot programs
* Monitor pilot KPIs
* Collect evidence and feedback
* Validate pilot outcomes
* Generate procurement/adoption recommendations

Startups can:

* Create their company profile
* Discover relevant government challenges
* Check eligibility
* Submit solutions
* Track application status
* Participate in pilots
* Submit supporting evidence

---

# ✨ Core Features

## 1. 🤖 AI Problem → Challenge Builder

Government users can describe an operational problem in natural language.

S.N.A.P uses AI to assist in transforming the problem into a structured innovation challenge.

### AI-generated information can include:

* Problem statement
* Desired outcome
* Suggested KPIs
* Required technologies
* Required capabilities
* Constraints
* Clarifying questions

Government users can **review, modify and approve** the generated challenge before publication.

---

# 2. 🏪 Challenge Marketplace

Published government challenges are displayed through a centralized marketplace.

Startups can:

* Browse challenges
* Search challenges
* Filter challenges
* View complete challenge details
* Check eligibility
* Submit solutions

Each challenge contains structured information regarding:

* Problem
* Expected outcomes
* KPIs
* Technologies
* Capabilities
* Constraints
* Timeline

---

# 3. 🚀 Startup Profiles

Startups create structured profiles containing:

* Company information
* Industry sector
* Technologies
* Capabilities
* Products
* Team size
* Startup stage
* Founded year
* Previous projects
* Government projects
* Pilot readiness
* Operating regions

This information powers S.N.A.P's startup matching engine.

---

# 4. 🧠 AI-Assisted Startup Matching

S.N.A.P combines **structured eligibility filtering with semantic similarity** to identify startups that are relevant to a government challenge.

### Matching Pipeline

```text
Challenge
    ↓
Eligibility Filtering
    ↓
Sector / Technology / Capability Matching
    ↓
Semantic Similarity
    ↓
Weighted Compatibility Score
    ↓
Ranked Startups
```

### Compatibility Score

| Factor              | Weight |
| ------------------- | -----: |
| Semantic Similarity |    50% |
| Technology Match    |    20% |
| Sector Match        |    15% |
| Capability Match    |    10% |
| Pilot Readiness     |     5% |

The platform also provides an explanation of why a startup was considered compatible.

S.N.A.P does not fabricate startup capabilities or information.

---

# 5. 📝 Solution Submission

Startups can submit proposals containing:

* Solution title
* Solution description
* Technical approach
* Implementation plan
* Expected impact
* Estimated cost
* Pilot requirements
* Timeline
* Supporting information

### Application Lifecycle

```text
SUBMITTED
    ↓
UNDER_REVIEW
    ↓
SHORTLISTED / REJECTED
    ↓
PILOT_SELECTED
```

Duplicate applications for the same challenge are prevented.

---

# 6. 📊 Solution Evaluation & Ranking

Government users and evaluators can evaluate startup proposals using a weighted scoring framework.

### Evaluation Criteria

| Criterion             | Weight |
| --------------------- | -----: |
| Technical Feasibility |    25% |
| Expected Impact       |    25% |
| Innovation            |    20% |
| Scalability           |    15% |
| Cost Effectiveness    |    15% |

Each criterion is scored from **0–100**.

The final weighted score determines the solution ranking.

Solutions can be:

* Shortlisted
* Rejected
* Ranked
* Selected for pilot

---

# 7. 🧪 Pilot Management

Selected solutions can be converted into structured pilot programs.

### Pilot Lifecycle

```text
PLANNED
   ↓
ACTIVE
   ↓
COMPLETED
   ↓
VALIDATED
```

Possible outcomes:

```text
COMPLETED
   ├── SCALE-UP
   ├── EXTEND
   └── STOP
```

Pilot dashboards provide visibility into:

* Pilot status
* Timeline
* KPIs
* Evidence
* Feedback
* Validation
* Recommendation

---

# 8. 📈 KPI Monitoring

Each pilot can define measurable Key Performance Indicators.

A KPI contains:

* Name
* Description
* Unit
* Baseline
* Target
* Measurement frequency
* Measurement method
* Data source
* Actual values

S.N.A.P calculates:

* Improvement from baseline
* Target achievement
* KPI status

### KPI Status

```text
ACHIEVED
ON_TRACK
AT_RISK
FAILED
```

### Example

```text
KPI: Emergency Response Time

Baseline: 60 minutes
Target:   30 minutes
Actual:   28 minutes

Status: ACHIEVED
```

---

# 9. 📂 Evidence Management

Pilot participants can upload supporting evidence including:

* PDF reports
* CSV datasets
* XLSX files
* Images
* Validation documents

S.N.A.P uses **Cloudinary** for file storage and MongoDB for associated metadata and references.

File uploads are validated using:

* MIME type
* File extension
* File size
* File count
* Authorization rules

Sensitive evidence is protected from unauthorized access.

---

# 10. 🧠 Gemini-Powered RAG

S.N.A.P includes an AI knowledge assistant powered by **Google Gemini and Retrieval-Augmented Generation (RAG)**.

Instead of directly sending questions to Gemini, S.N.A.P first retrieves relevant information from its knowledge base.

### RAG Architecture

```text
Government Guidelines
        ↓
Document Upload
        ↓
Text Extraction
        ↓
Chunking
        ↓
Embeddings
        ↓
MongoDB Vector Search
        ↓
Top-K Relevant Chunks
        ↓
Retrieved Context
        ↓
Gemini
        ↓
Grounded Answer + Sources
```

The RAG assistant is designed to provide answers grounded in retrieved documents.

When sufficient information is unavailable, the system should clearly indicate that the available context is insufficient.

---

# 11. 🤖 AI Pilot Analysis

Gemini can analyze information supplied during the pilot.

Inputs can include:

* Pilot objectives
* KPI results
* Feedback
* Validation information
* Evidence summaries

The system can generate:

* Performance summary
* Successful areas
* Weak areas
* Risks
* Recommendation explanation

AI-generated analysis must use only supplied information and must not fabricate statistics or evidence.

---

# 12. ⚖️ Validation & Procurement Recommendation

S.N.A.P uses deterministic rules to support pilot validation and adoption decisions.

### Validation Status

```text
VALIDATED
PARTIALLY_VALIDATED
NOT_VALIDATED
```

### SCALE-UP Recommendation

A pilot can receive a **SCALE-UP** recommendation when:

```text
Validation = VALIDATED
AND
KPI Achievement >= 80%
AND
Required Evidence = COMPLETE
AND
Average Feedback >= 3.5 / 5
```

If the solution is promising but additional evidence is required:

```text
EXTEND
```

If the pilot performs poorly:

```text
STOP / DO NOT SCALE
```

These recommendations are **decision-support outputs**.

The final procurement or adoption decision remains with the authorized government authority.

---

# 👥 User Roles

S.N.A.P supports four primary roles.

## 🏛️ Government

Can:

* Create problems
* Generate challenges
* Publish challenges
* Discover startups
* Review applications
* Evaluate solutions
* Select solutions
* Create pilots
* Monitor KPIs
* Validate pilots
* View recommendations

## 🚀 Startup

Can:

* Create startup profile
* Discover challenges
* Check eligibility
* Submit solutions
* Track applications
* Participate in pilots
* Submit evidence

## 🧑‍⚖️ Evaluator

Can:

* Review applications
* Score solutions
* Provide evaluation feedback
* Contribute to rankings

## ⚙️ Admin

Can:

* Manage users
* Manage departments
* Manage platform configuration
* Monitor platform activity

---

# 🔐 Authentication & Authorization

S.N.A.P implements role-based authentication and authorization.

### Security mechanisms

* Password hashing
* Session-based authentication
* Protected routes
* Role-based middleware
* Resource ownership checks
* Input validation
* File validation
* Unauthorized-access prevention

### Authorization Flow

```text
Request
   ↓
Authentication Middleware
   ↓
Authenticated?
   ├── NO → Login
   └── YES
         ↓
    Role Middleware
         ↓
    Permission Check
         ↓
      Controller
```

---

# 🏗️ Technology Stack

| Layer          | Technology              |
| -------------- | ----------------------- |
| Frontend       | EJS                     |
| Styling        | Tailwind CSS            |
| Client-side    | Vanilla JavaScript      |
| Backend        | Node.js + Express.js    |
| Database       | MongoDB + Mongoose      |
| Vector Search  | MongoDB Vector Search   |
| AI             | Google Gemini API       |
| RAG            | Gemini + Embeddings     |
| File Upload    | Multer                  |
| File Storage   | Cloudinary              |
| Authentication | Express Session         |
| Security       | Password Hashing + RBAC |

---

# 📁 Project Structure

```text
SNAP/
│
├── controllers/
│   ├── authController.js
│   ├── challengeController.js
│   ├── startupController.js
│   ├── applicationController.js
│   ├── evaluationController.js
│   ├── pilotController.js
│   ├── kpiController.js
│   └── recommendationController.js
│
├── models/
│   ├── User.js
│   ├── Department.js
│   ├── Startup.js
│   ├── Challenge.js
│   ├── Application.js
│   ├── Evaluation.js
│   ├── Pilot.js
│   ├── KPI.js
│   ├── Validation.js
│   └── Recommendation.js
│
├── routes/
│   ├── authRoutes.js
│   ├── challengeRoutes.js
│   ├── startupRoutes.js
│   ├── applicationRoutes.js
│   ├── evaluationRoutes.js
│   ├── pilotRoutes.js
│   └── aiRoutes.js
│
├── services/
│   ├── aiService.js
│   ├── ragService.js
│   ├── matchingService.js
│   ├── evaluationService.js
│   └── recommendationService.js
│
├── middleware/
│   ├── auth.js
│   ├── roles.js
│   ├── ownership.js
│   └── upload.js
│
├── views/
│   ├── auth/
│   ├── government/
│   ├── startup/
│   ├── evaluator/
│   ├── challenges/
│   ├── pilots/
│   └── partials/
│
├── public/
│   ├── css/
│   └── js/
│
├── seed/
│
├── app.js
├── server.js
├── package.json
└── .env
```

---

# 🔄 Complete Demo Flow

```text
Government Login
       ↓
Create Operational Problem
       ↓
AI Challenge Generation
       ↓
Review & Edit
       ↓
Publish Challenge
       ↓
Startup Discovers Challenge
       ↓
AI-Assisted Matching
       ↓
Startup Submits Solution
       ↓
Evaluation & Ranking
       ↓
Solution Selected
       ↓
Pilot Created
       ↓
KPIs Defined
       ↓
Pilot Execution
       ↓
KPI Results
       ↓
Evidence Upload
       ↓
Feedback Collection
       ↓
Pilot Validation
       ↓
AI Pilot Analysis
       ↓
Procurement Recommendation
       ↓
SCALE-UP / EXTEND / STOP
```

---

# 🎯 Example Use Case

## Emergency Response Optimization

A government department identifies an operational problem:

> Emergency response teams are experiencing delays in reaching critical locations.

The government creates the problem in S.N.A.P.

Gemini assists in generating:

* Structured problem statement
* Desired outcomes
* KPIs
* Required technologies
* Implementation constraints

The challenge is published.

S.N.A.P identifies startups whose capabilities are relevant to the challenge.

A startup submits an emergency-response optimization solution.

Evaluators score the proposal using the predefined evaluation framework.

The selected solution enters a pilot.

### Pilot KPI

```text
Emergency Response Time

Baseline: 60 minutes
Target:   30 minutes
Actual:   28 minutes
```

Result:

```text
ACHIEVED
```

After evidence collection and validation, S.N.A.P generates:

```text
┌────────────────────────────────┐
│    PROCUREMENT RECOMMENDATION  │
│                                │
│            SCALE-UP            │
│                                │
│  KPI Achievement: 93%          │
│  Validation: VALIDATED         │
│  Evidence: COMPLETE            │
└────────────────────────────────┘
```

The authorized government authority makes the final decision.

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone <repository-url>
cd SNAP
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_gemini_model

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 4. Start the Application

```bash
npm run dev
```

Or:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

---

# 🔑 Environment Variables

| Variable                | Purpose                   |
| ----------------------- | ------------------------- |
| `MONGO_URI`             | MongoDB connection        |
| `SESSION_SECRET`        | Session security          |
| `GEMINI_API_KEY`        | Gemini API authentication |
| `GEMINI_MODEL`          | Gemini model              |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud          |
| `CLOUDINARY_API_KEY`    | Cloudinary API            |
| `CLOUDINARY_API_SECRET` | Cloudinary authentication |

> **Never commit `.env` to GitHub.**

---

# 🧩 System Architecture

```text
                    ┌─────────────────────┐
                    │     GOVERNMENT      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │        S.N.A.P      │
                    │     Web Platform    │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
    ┌───────────┐        ┌───────────┐       ┌───────────┐
    │  Gemini   │        │  MongoDB  │       │ Cloudinary│
    │  + RAG    │        │ + Vector  │       │   Files   │
    └───────────┘        │   Search  │       └───────────┘
                         └─────┬─────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       STARTUPS      │
                    └─────────────────────┘
```

---

# 🌟 What Makes S.N.A.P Different?

S.N.A.P is more than a startup marketplace.

It connects the entire innovation adoption lifecycle:

```text
IDENTIFY
   ↓
STRUCTURE
   ↓
DISCOVER
   ↓
MATCH
   ↓
EVALUATE
   ↓
PILOT
   ↓
MEASURE
   ↓
VALIDATE
   ↓
ADOPT
```

The platform focuses on moving from:

> **"We have a problem."**

to:

> **"We found a solution."**

to:

> **"We tested it."**

to:

> **"The evidence shows whether we should adopt it."**

---

# 🛡️ Prototype Scope

S.N.A.P is a **hackathon prototype / proof of concept**.

It does not attempt to replace actual:

* Government procurement systems
* Tendering platforms
* Legal approval workflows
* Financial authorization systems
* Government compliance systems

Instead, S.N.A.P demonstrates an AI-assisted technology layer for:

**Innovation Discovery → Evaluation → Pilot → Measurement → Adoption Decision Support**

---

# 🚀 Future Scope

Potential future enhancements include:

* Government identity integration
* Digital signatures
* Procurement system integration
* Multi-language AI
* Real-time IoT KPI collection
* Geospatial pilot monitoring
* Predictive pilot-success analysis
* Automated compliance verification
* Advanced vector search
* Real-time analytics
* Production-grade cloud infrastructure

---

# 🏆 Smart India Hackathon

**Problem Statement:** SIH26136

### Project

# **S.N.A.P**

### Startup Network & Automated Procurement

> **Connecting government problems with startup innovation — and turning successful pilots into evidence-backed adoption decisions.**

---

## 👨‍💻 Built With

**Node.js · Express.js · MongoDB · Mongoose · EJS · Tailwind CSS · Vanilla JavaScript · Gemini AI · RAG · MongoDB Vector Search · Cloudinary**

