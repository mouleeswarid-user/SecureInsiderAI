# SecureInsiderAI - AI-Based Insider Threat Detection for Banking

**SecureInsiderAI** is a modern, responsive, and interactive cybersecurity prototype designed to identify and mitigate insider threats in financial systems. The application is tailored for security administrators to monitor, detect, and respond to anomalous activities by privileged banking employees in real-time.

*This project was designed for the **Bank of Maharashtra Hackathon** demonstration.*

---

## 🚀 Key Features

* **Real-time AI Threat Detection & Countermeasures**:
  * **Failed Login Spikes**: Identifies brute force patterns on user accounts.
  * **Unusual Access Times**: Flags administrative work executed outside office shifts.
  * **Location & Device Spoofing**: Detects logins from unknown device models or hops in geographic regions (e.g. VPN logins).
  * **Large File Extractions**: Warns on abnormal volumes of confidential customer statement downloads.
  * **Automatic Lockout**: Real-time admin banner alert to temporarily lock out accounts and revoke credentials.
* **Aggregated Cybersecurity Analytics**:
  * **Risk Index Gauge**: Interactive indicator displaying the average risk assessment of all unblocked accounts.
  * **Daily Threat Graph**: Chart.js lines tracing total login counts against detected anomalies.
  * **Department Profiling**: Radar/polar area graph displaying average threat levels per division (IT, Retail Banking, Treasury, Wealth Management, Operations).
  * **High-Risk Ranking**: Horizontal bar chart ordering the top 5 riskiest employees.
* **Admin Control Center**:
  * **Sensitivity Configuration**: Slider control to adjust the model's sensitivity threshold.
  * **Account Restorations**: Admin panel to review locked profiles and restore system access.
  * **Compliance Report Generator**: Compiles statistics and incident logs into printable dossiers matching RBI guidelines.
* **Immutable Secure Audit Logs**:
  * Terminal window console rendering cryptographically simulated SHA-256 event checks.

---

## 🛠️ Technology Stack

* **Structure**: HTML5 (Semantic elements)
* **Styling**: Vanilla CSS3 (Custom properties, Responsive Flexbox/Grid, Glassmorphic panels, keyframe animations)
* **Logic**: Vanilla JavaScript (Interactive states, event hooks, and simulators)
* **Graphics**: Chart.js (Interactive canvas charts)
* **Iconography**: FontAwesome 6 (Vector security symbols)
* **Typography**: Google Fonts (Outfit font face)

---

## 📦 File Structure

```text
SecureInsiderAI/
├── index.html     # Structural framework & page tabs
├── styles.css     # Theme variables, layouts, & animations
├── app.js         # Employee database, Chart.js mapping, & simulation engine
├── package.json   # Server dev configuration script
└── README.md      # Documentation dossier
```

---

## 💻 How to Run Locally

### Option A: Double-Click (No Installations Required)
1. Navigate to the project directory.
2. Double-click the `index.html` file to run the app directly in any browser (Chrome, Edge, Safari, Firefox).

### Option B: Local Web Server
If you have Python installed, start a local server by running:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your web browser.

---

## 🛡️ Hackathon Demonstration Walkthrough

1. **Dashboard Tab**: Review the aggregate metrics, charts, and current system status.
2. **Simulate Cyber Threat**: Click the orange **"Simulate Threat"** button in the header. A red alert banner will slide down, warning about a critical threat.
3. **Trigger Mitigation**: Click the **"Block Account"** button in the banner. Observe the status badges update to `SYSTEM SAFE`, user count decrease, and audit logs append a suspension hash code.
4. **Inspect Employee Logs**: Go to the **"Employee Activity"** tab. Search for an employee (e.g. `Rahul`), select their row, and view their security timeline in the side details panel.
5. **Generate Audits**: Head to the **"Risk Analytics"** tab, select a report cycle, and click **"Compile & Download Security Report"**. Print or save the simulated compliance docket.
