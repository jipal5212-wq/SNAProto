import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

OUTPUT_DIR = os.path.abspath("./test_startup_proposals")
os.makedirs(OUTPUT_DIR, exist_ok=True)

proposals_data = [
    {
        "id": "1",
        "filename_base": "1_AquaPulse_IoT_Solutions",
        "startup_name": "AquaPulse Technologies Pvt. Ltd.",
        "dpiit_number": "DIPP89214",
        "dpiit_status": "Yes (DPIIT Recognized Startup)",
        "incorporation_date": "14-March-2022",
        "turnover": "Rs 3.4 Crore",
        "team_size": "14 full-time engineers and researchers",
        "key_people": "Dr. Rohit Shenoy (PhD Signal Processing, IIT Bombay), Ananya Deshmukh (Ex-Honeywell SCADA Principal Engineer)",
        "approach_title": "Non-Invasive Acoustic IoT Telemetry & Real-Time Hydro-Transient Leak Pinpointing",
        "trl_level": "TRL 8 - Flight & Field Tested Operational System across 140km municipal grid in Surat",
        "pilot_readiness": "Deployment ready in 30 to 45 days with off-the-shelf certified clamp sensors",
        "cost_estimate": "Rs 42,50,000 (INR 42.5 Lakhs) for 100km municipal pipeline pilot zone",
        "tech_stack": ["Piezoelectric Acoustic Surface Clamps", "LoRaWAN 868MHz Gateway", "MQTT Broker", "Docker", "Python FastAPI", "React GIS Dashboard", "PostgreSQL/TimescaleDB"],
        "claimed_outcomes": [
            "35% reduction in non-revenue municipal water losses within 90 days",
            "Underground leak pinpointing accuracy within 1.5 meters without road excavation",
            "Continuous real-time alert latency under 60 seconds sent directly to SCADA operators",
            "Battery endurance of sensor pods exceeding 36 months via low-power sleep cycles"
        ],
        "scalability_blueprint": "Distributed microservices cloud architecture hosted on MeitY-empaneled cloud (AWS GovCloud / NIC Cloud). Multi-tenant MQTT brokers capable of supporting 50,000+ edge sensor nodes across multiple municipal corporations and urban local bodies (ULBs).",
        "security_privacy": "Full compliance with CERT-In Indian cybersecurity directives. AES-256 encryption at rest, TLS 1.3 in transit with mutual client-certificate authentication (mTLS). Zero foreign data routing; 100% Indian data sovereignty in compliance with DPDP Act 2023.",
        "expected_nature": "TOP_RANKED_FEASIBLE"
    },
    {
        "id": "2",
        "filename_base": "2_AeroGeo_Satellite_SAR",
        "startup_name": "AeroGeo Spatial Intelligence Pvt. Ltd.",
        "dpiit_number": "DIPP74391",
        "dpiit_status": "Yes (DPIIT Recognized Startup)",
        "incorporation_date": "18-November-2021",
        "turnover": "Rs 4.8 Crore",
        "team_size": "8 Remote Sensing Scientists & Computer Vision Engineers",
        "key_people": "Vikram Adve (Ex-ISRO Space Applications Centre scientist, 12 years in radar processing), Dr. Meera Nambiar (PhD Remote Sensing, IISc Bangalore)",
        "approach_title": "Synthetic Aperture Radar (SAR) Satellite Interferometry & Deep Learning Soil Moisture Analytics",
        "trl_level": "TRL 7 - System prototype demonstrated in operational urban pipeline corridor using Sentinel-1 & RISAT data",
        "pilot_readiness": "Ready for initial satellite acquisition pass within 20 days; baseline report in 45 days",
        "cost_estimate": "Rs 64,00,000 (INR 64 Lakhs) for quarterly satellite imaging and AI processing covering 500 sq km",
        "tech_stack": ["L-Band & C-Band SAR Interferometry (InSAR)", "PyTorch Convolutional Neural Networks", "Google Earth Engine API", "GeoTIFF GIS Layers", "OpenLayers Interactive Map"],
        "claimed_outcomes": [
            "100% wide-area non-contact surveillance across entire municipal territory without physical entry",
            "Detection of micro-subsidence and sub-surface soil moisture anomalies down to 3mm displacement",
            "Prioritization map of high-probability leak zones updated every 12 days",
            "Zero disruption to urban traffic or municipal roads during inspection"
        ],
        "scalability_blueprint": "Virtually infinite geographical scalability. Because satellite imagery is captured from orbit, expanding surveillance from one city to an entire state requires zero hardware deployment or civil excavation.",
        "security_privacy": "Complies with Indian National Geospatial Policy 2022. High-resolution raster layers hosted on localized Indian data servers with role-based cryptographic access control (RBAC).",
        "expected_nature": "HIGH_INNOVATION_FEASIBLE"
    },
    {
        "id": "3",
        "filename_base": "3_JalRakshak_Frugal_IoT",
        "startup_name": "JalRakshak Tech Innovations LLP",
        "dpiit_number": "DIPP102384",
        "dpiit_status": "Yes (DPIIT Recognized Startup)",
        "incorporation_date": "05-January-2023",
        "turnover": "Rs 85 Lakhs",
        "team_size": "5 Embedded Hardware Developers & Field Technicians",
        "key_people": "Karthik R. (B.Tech NIT Trichy), Suresh Patel (5 years rural IoT deployment experience)",
        "approach_title": "Ultra-Low-Cost Solar-Harvested Hydro-Vibration Pods with ESP32 Mesh Protocol",
        "trl_level": "TRL 6 - Technology demonstrated in operational pilot across 2 residential wards in Tiruchirappalli",
        "pilot_readiness": "Immediate deployment ready in 25 days using modular 3D-printed enclosure pods",
        "cost_estimate": "Rs 18,20,000 (INR 18.2 Lakhs) for 60 sensor units and cellular mesh gateway",
        "tech_stack": ["ESP32-S3 Microcontroller", "PVDF Piezoelectric Vibration Sensor", "868MHz Mesh Radio", "Solar MPPT Charger", "Node.js Gateway", "SMS & WhatsApp Alert Bot"],
        "claimed_outcomes": [
            "Lowest capital deployment cost on the market at under Rs 15,000 per monitoring node",
            "Autonomous perpetual solar harvesting operation requiring zero battery replacements",
            "Instant SMS and WhatsApp automated dispatch to junior field maintenance engineers within 3 minutes",
            "22% reduction in unmetered water losses across municipal distribution zones"
        ],
        "scalability_blueprint": "Ideal for Tier-2, Tier-3 municipalities, Smart Cities, and rural Jal Jeevan Mission schemes. Nodes form self-healing mesh networks where only one master unit requires 4G SIM connectivity.",
        "security_privacy": "Device-to-gateway HMAC-SHA256 authenticated packets. Web console hosted on secure Indian VPS with HTTPS and two-factor administrator authentication.",
        "expected_nature": "COST_EFFECTIVE_FEASIBLE"
    },
    {
        "id": "4",
        "filename_base": "4_Titan_MegaInfra_Ineligible",
        "startup_name": "Titan Heavy Infrastructure & Civil Contracting Ltd.",
        "dpiit_number": "None / Not DPIIT Registered (Large Infrastructure Corporation)",
        "dpiit_status": "No (Not eligible for Startup India concessions)",
        "incorporation_date": "12-June-2004 (22 years old)",
        "turnover": "Rs 480.0 Crore (Audited FY25 Annual Revenue)",
        "team_size": "1,450 full-time civil workers, site supervisors, and operators",
        "key_people": "M. K. Singhania (Managing Director, 30 years civil contracting experience)",
        "approach_title": "Full-Depth Trench Excavation & Heavy Diesel Acoustic Hydro-Testing Methodology",
        "trl_level": "Traditional Civil Contracting Methodology (No proprietary innovative technology)",
        "pilot_readiness": "Requires 90 to 120 days for heavy excavator mobilization, road closure permits, and site setup",
        "cost_estimate": "Rs 4,80,00,000 (INR 4.8 Crore) including road cutting and heavy machinery hire",
        "tech_stack": ["JCB 3DX Excavators", "Diesel-Powered Pressure Test Pumps", "Manual Acoustic Listening Sticks", "Paper Inspection Logs", "Commercial Desktop Spreadsheets"],
        "claimed_outcomes": [
            "Physical uncovering of main distribution lines for visual and hydrostatic inspection",
            "Full replacement of pipeline sections older than 15 years",
            "Requires closure of urban roadway lanes for 6 to 12 weeks during execution"
        ],
        "scalability_blueprint": "Limited scalability due to high capital intensity, manual civil labor requirements, and persistent traffic disruption.",
        "security_privacy": "Physical paper logs and standard unencrypted email spreadsheets.",
        "expected_nature": "STATUTORY_INELIGIBLE"
    },
    {
        "id": "5",
        "filename_base": "5_QuantumFlux_Impossible_Proposal",
        "startup_name": "QuantumFlux Resonance Laboratories",
        "dpiit_number": "DIPP99912",
        "dpiit_status": "Yes (Registered as micro enterprise)",
        "incorporation_date": "10-August-2024",
        "turnover": "Rs 50,000",
        "team_size": "1 Individual Solo Founder",
        "key_people": "Acharya Devratan (Self-described Quantum Consciousness & Cosmic Energy Researcher)",
        "approach_title": "Zero-Point Quantum Vacuum Flux Resonance & Telepathic Sub-Surface Harmonic Leak Detection",
        "trl_level": "TRL 1 - Theoretical Conjecture & Speculative Hypothesis (Violates Laws of Thermodynamics)",
        "pilot_readiness": "Instantaneous activation via remote telepathic quantum meditation upon contract award",
        "cost_estimate": "Rs 5,000 (Nominal offering for cosmic resonance alignment)",
        "tech_stack": ["Zero-Point Energy Generator", "Scalar Wave Telepathy", "Sub-Surface Torsion Field Harmonizer", "Tachyon Wave Concentrator"],
        "claimed_outcomes": [
            "100% instantaneous detection of all liquid leaks across the entire Indian subcontinent with zero hardware",
            "Zero physical sensors, zero battery power, zero electrical wiring, zero maintenance forever",
            "Operates by reversing the second law of thermodynamics to heal metal pipe cracks through mental thought vibration"
        ],
        "scalability_blueprint": "Claims cosmic universal reach across all dimensions with zero infrastructure expenditure.",
        "security_privacy": "Protected by divine telepathic encryption that cannot be breached by conventional computing or supercomputers.",
        "expected_nature": "LOGICALLY_IMPOSSIBLE_UNVIABLE"
    }
]

def create_markdown_file(p):
    md_path = os.path.join(OUTPUT_DIR, f"{p['filename_base']}.md")
    content = f"""# Technical & Commercial Proposal: Outcome-Based Solution

**Submitted to:** Municipal Water Supply & Sewerage Board / Department of Urban Development  
**Challenge Track:** Urban Water Pipeline Leakage Detection, Telemetry & Non-Revenue Water Reduction  
**Startup Name:** {p['startup_name']}  
**DPIIT Recognition Number:** {p['dpiit_number']} ({p['dpiit_status']})  
**Date of Incorporation:** {p['incorporation_date']}  
**Audited Annual Turnover:** {p['turnover']}  
**Core Team Size:** {p['team_size']}  

---

## 1. Executive Summary & Proposed Approach
### Title: {p['approach_title']}

{p['startup_name']} is pleased to present this comprehensive technical and outcome-based commercial proposal in response to the Government Procurement Challenge for Non-Revenue Water reduction and real-time municipal pipeline monitoring.

Our proposed solution addresses the municipal challenge through proven, state-of-the-art methodology designed to eliminate water loss, integrate with existing SCADA control centers, and deliver rapid return on investment.

- **Technology Readiness Level (TRL):** {p['trl_level']}
- **Deployment Timeline:** {p['pilot_readiness']}
- **Proposed Pilot Budget:** {p['cost_estimate']}
- **Key Leadership & Engineering Credentials:** {p['key_people']}

---

## 2. Technical Architecture & Implementation Details

Our architecture leverages modern, field-proven engineering stacks:
- **Core Technology Stack:** {', '.join(p['tech_stack'])}

### Detailed Methodology:
1. **Sensing & Data Acquisition:**
   The primary sensing layer gathers physical and acoustic vibration data along the municipal pipe network without requiring disruptive civil road excavation.
2. **Telemetry & Gateway Communication:**
   Edge gateways securely aggregate telemetry packets and transmit them over authenticated radio and cellular channels to the central municipal cloud broker.
3. **Analytics & Alert Generation:**
   Automated algorithmic pipelines cross-examine pressure transient signatures against background flow baselines to identify anomalous micro-leaks within minutes of inception.

---

## 3. Projected Outcomes & Key Performance Indicators (KPIs)

We contractually commit to the following performance benchmarks during the 90-day pilot deployment:
{chr(10).join([f"- **Outcome {i+1}:** {o}" for i, o in enumerate(p['claimed_outcomes'])])}

---

## 4. Scalability & Municipal Expansion Blueprint

{p['scalability_blueprint']}

---

## 5. Security, Data Privacy & Regulatory Compliance

{p['security_privacy']}

---

## 6. Commercial Pilot Cost Breakdown

| Budget Line Item | Allocated Amount (INR) | Justification |
|---|---|---|
| Hardware & Sensor Acquisition | Rs 18,50,000 | Precision industrial hardware & field deployment mounts |
| Edge Computing & Gateway Modems | Rs 8,00,000 | Certified telemetry transmitters & solar accessories |
| Cloud Infrastructure & SCADA API Integration | Rs 7,50,000 | High-availability cloud broker & municipal dashboard |
| Ground Calibration & Field Engineering | Rs 8,50,000 | 90-day on-site support, training & verification audits |
| **Total Proposed Pilot Cost** | **{p['cost_estimate']}** | **Comprehensive Turnkey Pilot Implementation** |

---

## 7. Declaration & Statutory Verification

We hereby certify that all information submitted in this proposal represents accurate, verified technical specifications and audited corporate records.

**Authorized Signatory:**  
*For {p['startup_name']}*  
*Director / Principal Investigator*
"""
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created Markdown: {md_path}")
    return md_path

def create_docx_file(p):
    docx_path = os.path.join(OUTPUT_DIR, f"{p['filename_base']}.docx")
    doc = docx.Document()

    # Title
    title_p = doc.add_paragraph()
    title_run = title_p.add_run("TECHNICAL & COMMERCIAL PROPOSAL")
    title_run.font.size = Pt(20)
    title_run.font.bold = True
    title_run.font.color.rgb = RGBColor(27, 79, 114) # Deep Navy Blue
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER

    sub_p = doc.add_paragraph()
    sub_run = sub_p.add_run("Submitted for Government Innovation Challenge & Pilot Procurement\nUrban Water Pipeline Telemetry & Non-Revenue Water Reduction")
    sub_run.font.size = Pt(12)
    sub_run.font.italic = True
    sub_p.alignment = WD_ALIGN_PARAGRAPH.CENTER

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # Metadata Table
    table = doc.add_table(rows=7, cols=2)
    table.style = 'Table Grid'
    meta_rows = [
        ("Startup / Entity Name", p['startup_name']),
        ("DPIIT Recognition No.", f"{p['dpiit_number']} ({p['dpiit_status']})"),
        ("Date of Incorporation", p['incorporation_date']),
        ("Annual Audited Turnover", p['turnover']),
        ("Core Engineering Team", p['team_size']),
        ("Technology Readiness (TRL)", p['trl_level']),
        ("Proposed Pilot Budget", p['cost_estimate'])
    ]
    for i, (k, v) in enumerate(meta_rows):
        row = table.rows[i]
        row.cells[0].paragraphs[0].add_run(k).bold = True
        row.cells[1].paragraphs[0].add_run(v)

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # Section 1
    h1 = doc.add_heading("1. Executive Summary & Proposed Approach", level=1)
    doc.add_paragraph(f"Approach Title: {p['approach_title']}").bold = True
    doc.add_paragraph(
        f"{p['startup_name']} submits this technical proposal to deploy an automated, outcome-driven solution "
        f"for municipal utility monitoring. Our engineering pathway provides immediate operational observability, "
        f"drastically lowering non-revenue resource loss while integrating seamlessly into existing command centers."
    )
    doc.add_paragraph(f"Key Personnel & Credentials: {p['key_people']}")
    doc.add_paragraph(f"Operational Deployment Timeline: {p['pilot_readiness']}")

    # Section 2
    doc.add_heading("2. Technical Architecture & Tech Stack", level=1)
    doc.add_paragraph(f"Primary Technology Stack: {', '.join(p['tech_stack'])}")
    doc.add_paragraph(
        "Our multi-layer architecture integrates non-intrusive sensor hardware, industrial communication protocols, "
        "and distributed cloud intelligence to deliver actionable telemetry with minimal human intervention."
    )

    # Section 3
    doc.add_heading("3. Projected Outcomes & Performance Benchmarks", level=1)
    for outcome in p['claimed_outcomes']:
        doc.add_paragraph(f"• {outcome}")

    # Section 4
    doc.add_heading("4. Scalability & Municipal Expansion", level=1)
    doc.add_paragraph(p['scalability_blueprint'])

    # Section 5
    doc.add_heading("5. Cybersecurity, Encryption & Data Privacy", level=1)
    doc.add_paragraph(p['security_privacy'])

    # Section 6
    doc.add_heading("6. Commercial Budget Allocation", level=1)
    doc.add_paragraph(f"Total Turnkey Pilot Budget: {p['cost_estimate']}")
    doc.add_paragraph(
        "All cost projections have been optimized to maximize municipal value per kilometer monitored, "
        "ensuring sustainable payback within the first operational quarter."
    )

    # Signoff
    doc.add_paragraph().paragraph_format.space_after = Pt(20)
    sig_p = doc.add_paragraph()
    sig_p.add_run(f"Authorized Signatory\nFor {p['startup_name']}\nChief Technical Officer / Director").italic = True

    doc.save(docx_path)
    print(f"Created DOCX: {docx_path}")
    return docx_path

if __name__ == "__main__":
    for p in proposals_data:
        create_markdown_file(p)
        create_docx_file(p)
    print("All 5 startup proposal documents generated successfully!")
