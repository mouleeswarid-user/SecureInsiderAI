/**
 * SecureInsiderAI - Application Logic and Dashboard Interactivity
 * Built for Bank of Maharashtra Hackathon Demo
 */

// Global state variables
let employees = [];
let alerts = [];
let currentSelectedEmployeeId = null;
let currentSelectedAlertId = null;
let aiSensitivityThreshold = 75;

// Chart instances
let threatTrendChart = null;
let deptRiskChart = null;
let employeeRiskChart = null;

// Initial Mock Employees Database
const initialEmployees = [
    {
        id: "EMP001",
        name: "Sunil Deshmukh",
        department: "IT & Security",
        loginTime: "13:45",
        failedLogins: 0,
        fileAccessCount: 94,
        device: "Admin terminal (Linux)",
        location: "Mumbai",
        riskScore: 78,
        status: "Warning",
        blocked: false,
        ip: "10.12.32.14",
        anomalies: [
            "Attempted file system read on root directory security folder.",
            "Execution of unusual shell commands in IT environment."
        ],
        activityHistory: [
            { time: "13:45", type: "safe", desc: "SSH login successful from internal subnet." },
            { time: "13:52", type: "warning", desc: "Read access request to /etc/security/db_config." },
            { time: "14:02", type: "danger", desc: "Attempted unauthorized folder copy of IT keys." }
        ]
    },
    {
        id: "EMP002",
        name: "Vivek Joshi",
        department: "Treasury & Forex",
        loginTime: "11:20",
        failedLogins: 0,
        fileAccessCount: 14,
        device: "Office PC (Windows)",
        location: "Pune",
        riskScore: 12,
        status: "Safe",
        blocked: false,
        ip: "10.14.88.35",
        anomalies: [],
        activityHistory: [
            { time: "11:20", type: "safe", desc: "Logged in via standard AD authentication." },
            { time: "11:35", type: "safe", desc: "Updated Forex exchange rates dataset." }
        ]
    },
    {
        id: "EMP003",
        name: "Ananya Rao",
        department: "IT & Security",
        loginTime: "03:15",
        failedLogins: 2,
        fileAccessCount: 45,
        device: "Unknown Macbook",
        location: "Bengaluru",
        riskScore: 56,
        status: "Warning",
        blocked: false,
        ip: "182.72.114.9",
        anomalies: [
            "Unusual login time (03:15 AM).",
            "Login from unknown Apple Macbook system.",
            "Failed login attempt followed by password override."
        ],
        activityHistory: [
            { time: "03:10", type: "warning", desc: "Two failed login credentials attempts." },
            { time: "03:15", type: "warning", desc: "Successful login from unknown device brand." },
            { time: "03:30", type: "danger", desc: "Downloaded IT firewall config files." }
        ]
    },
    {
        id: "EMP004",
        name: "Rahul Sharma",
        department: "Treasury & Forex",
        loginTime: "02:10",
        failedLogins: 0,
        fileAccessCount: 512,
        device: "Remote Virtual Host",
        location: "Romania (VPN)",
        riskScore: 92,
        status: "Threat",
        blocked: false,
        ip: "89.120.45.188",
        anomalies: [
            "Privileged access misuse: exporting high-value bond records.",
            "Login from unusual overseas location (Romania VPN).",
            "Large file downloads (512 files in 3 minutes)."
        ],
        activityHistory: [
            { time: "02:10", type: "danger", desc: "Session initiated from Bucharest, Romania." },
            { time: "02:12", type: "warning", desc: "Access granted to High-Value Corporate Accounts Vault." },
            { time: "02:14", type: "danger", desc: "Extracted 500+ customer PDF statements to local disk." }
        ]
    },
    {
        id: "EMP005",
        name: "Neha Patil",
        department: "Retail Banking",
        loginTime: "09:05",
        failedLogins: 0,
        fileAccessCount: 22,
        device: "Desktop PC (Windows)",
        location: "Nagpur",
        riskScore: 8,
        status: "Safe",
        blocked: false,
        ip: "10.22.41.60",
        anomalies: [],
        activityHistory: [
            { time: "09:05", type: "safe", desc: "MFA challenge successfully verified. Login complete." },
            { time: "09:30", type: "safe", desc: "Accessed Retail Mortgage dashboard." }
        ]
    },
    {
        id: "EMP006",
        name: "Priya Shinde",
        department: "Wealth Management",
        loginTime: "12:10",
        failedLogins: 4,
        fileAccessCount: 38,
        device: "Work iPad",
        location: "Mumbai",
        riskScore: 65,
        status: "Warning",
        blocked: false,
        ip: "10.12.91.44",
        anomalies: [
            "Brute force signature: 4 consecutive failed logins.",
            "Access to customer net-worth profiles immediately following lockout override."
        ],
        activityHistory: [
            { time: "11:58", type: "warning", desc: "Multiple failed password attempts detected." },
            { time: "12:10", type: "safe", desc: "Unlock code approved by manager. Login succeeded." },
            { time: "12:20", type: "warning", desc: "Querying HNWI (High Net Worth) private portfolio balances." }
        ]
    },
    {
        id: "EMP007",
        name: "Amit Mishra",
        department: "Operations",
        loginTime: "10:15",
        failedLogins: 0,
        fileAccessCount: 15,
        device: "Office PC (Windows)",
        location: "Pune",
        riskScore: 18,
        status: "Safe",
        blocked: false,
        ip: "10.14.92.51",
        anomalies: [],
        activityHistory: [
            { time: "10:15", type: "safe", desc: "Logged in via Active Directory domain controller." },
            { time: "10:45", type: "safe", desc: "Cleared queue for pending check deposits." }
        ]
    },
    {
        id: "EMP008",
        name: "Karan Johar",
        department: "Wealth Management",
        loginTime: "08:45",
        failedLogins: 0,
        fileAccessCount: 12,
        device: "Work Laptop",
        location: "Pune",
        riskScore: 10,
        status: "Safe",
        blocked: false,
        ip: "10.14.90.22",
        anomalies: [],
        activityHistory: [
            { time: "08:45", type: "safe", desc: "Session started via local corporate Wi-Fi." }
        ]
    },
    {
        id: "EMP009",
        name: "Rajesh Kulkarni",
        department: "Operations",
        loginTime: "06:30",
        failedLogins: 1,
        fileAccessCount: 8,
        device: "Mobile App (Android)",
        location: "Thane",
        riskScore: 24,
        status: "Safe",
        blocked: false,
        ip: "49.32.18.99",
        anomalies: [],
        activityHistory: [
            { time: "06:30", type: "safe", desc: "Logged in via OTP-linked Banking Application." }
        ]
    },
    {
        id: "EMP010",
        name: "Meera Nair",
        department: "Retail Banking",
        loginTime: "10:00",
        failedLogins: 0,
        fileAccessCount: 17,
        device: "Desktop PC (Windows)",
        location: "Mumbai",
        riskScore: 15,
        status: "Safe",
        blocked: false,
        ip: "10.12.44.18",
        anomalies: [],
        activityHistory: [
            { time: "10:00", type: "safe", desc: "Standard logon session verified." }
        ]
    },
    {
        id: "EMP011",
        name: "Vikram Chavan",
        department: "Retail Banking",
        loginTime: "09:30",
        failedLogins: 0,
        fileAccessCount: 30,
        device: "Desktop PC (Windows)",
        location: "Kolhapur",
        riskScore: 19,
        status: "Safe",
        blocked: false,
        ip: "10.29.35.4",
        anomalies: [],
        activityHistory: [
            { time: "09:30", type: "safe", desc: "Logged in using local biometric security key." }
        ]
    },
    {
        id: "EMP012",
        name: "Sneha Joshi",
        department: "Treasury & Forex",
        loginTime: "14:15",
        failedLogins: 0,
        fileAccessCount: 5,
        device: "Office PC (Windows)",
        location: "Pune",
        riskScore: 5,
        status: "Safe",
        blocked: false,
        ip: "10.14.88.90",
        anomalies: [],
        activityHistory: [
            { time: "14:15", type: "safe", desc: "Standard session started." }
        ]
    },
    {
        id: "EMP013",
        name: "Abhishek Deshpande",
        department: "Operations",
        loginTime: "22:50",
        failedLogins: 1,
        fileAccessCount: 42,
        device: "Home Laptop (VPN)",
        location: "Nagpur",
        riskScore: 45,
        status: "Warning",
        blocked: false,
        ip: "157.44.190.2",
        anomalies: [
            "Late night administrative activities.",
            "Transfer of system diagnostic reports outside regular shifts."
        ],
        activityHistory: [
            { time: "22:50", type: "safe", desc: "VPN link established. Authentication completed." },
            { time: "23:05", type: "warning", desc: "Requested file: operations_audit_trail_Q2.xlsx" }
        ]
    },
    {
        id: "EMP014",
        name: "Vijay Patil",
        department: "IT & Security",
        loginTime: "11:05",
        failedLogins: 0,
        fileAccessCount: 65,
        device: "Linux Server Console",
        location: "Mumbai",
        riskScore: 28,
        status: "Safe",
        blocked: false,
        ip: "10.12.30.9",
        anomalies: [],
        activityHistory: [
            { time: "11:05", type: "safe", desc: "SSH login completed successfully." }
        ]
    },
    {
        id: "EMP015",
        name: "Dinesh Kumar",
        department: "Retail Banking",
        loginTime: "08:12",
        failedLogins: 0,
        fileAccessCount: 120,
        device: "Terminal Client",
        location: "Nashik",
        riskScore: 32,
        status: "Safe",
        blocked: false,
        ip: "10.35.4.111",
        anomalies: [],
        activityHistory: [
            { time: "08:12", type: "safe", desc: "Logon initiated successfully." }
        ]
    }
];

// Initial Alerts History
const initialAlerts = [
    {
        id: "ALT001",
        employeeId: "EMP004",
        employeeName: "Rahul Sharma",
        department: "Treasury & Forex",
        severity: "critical",
        reason: "Accessing sensitive bond market holdings and customer balances at 2:10 AM from Romanian VPN.",
        riskScore: 92,
        timestamp: "2026-07-16 02:10:15",
        location: "Romania (VPN)",
        device: "Remote Virtual Host",
        ip: "89.120.45.188",
        status: "Active",
        recommendation: "Revoke VPN token immediately, temporarily block domain accounts, and contact compliance officer."
    },
    {
        id: "ALT002",
        employeeId: "EMP001",
        employeeName: "Sunil Deshmukh",
        department: "IT & Security",
        severity: "warning",
        reason: "Reading master security configuration databases containing customer login parameters.",
        riskScore: 78,
        timestamp: "2026-07-16 14:02:40",
        location: "Mumbai",
        device: "Admin terminal (Linux)",
        ip: "10.12.32.14",
        status: "Active",
        recommendation: "Audit IT shell commands, confirm authority parameters, and restrict file access."
    },
    {
        id: "ALT003",
        employeeId: "EMP006",
        employeeName: "Priya Shinde",
        department: "Wealth Management",
        severity: "warning",
        reason: "Multiple consecutive failed logins followed by accessing high net worth customer account statements.",
        riskScore: 65,
        timestamp: "2026-07-16 12:20:11",
        location: "Mumbai",
        device: "Work iPad",
        ip: "10.12.91.44",
        status: "Active",
        recommendation: "Verify identity via secondary MFA check and contact employee to verify access authority."
    }
];

// Audit logs list
let auditLogs = [
    { time: "14:00:10", type: "info", text: "SecureInsiderAI core engine loaded successfully." },
    { time: "14:00:12", type: "info", text: "SHA-256 integrity ledger initialized [Block Hash: 7fbca49a...]" },
    { time: "14:02:40", type: "warning", text: "ANOMALY: EMP001 (Sunil Deshmukh) attempted file read access on root configs. Score: 78%" },
    { time: "14:05:00", type: "info", text: "Admin console dashboard loaded." }
];

// Predictive Feed Items
const predictiveFeedItems = [
    { id: "PF001", title: "Minor File Spike", desc: "Sneha Joshi (Treasury) read 5 files in 1 min.", score: 12, dept: "Treasury", time: "1 min ago", status: "low" },
    { id: "PF002", title: "IP Subnet Hop", desc: "Vijay Patil logged in from different office block.", score: 28, dept: "IT & Security", time: "5 mins ago", status: "low" },
    { id: "PF003", title: "Session Overlap Warning", desc: "Karan Johar double session from iPad & PC.", score: 48, dept: "Wealth Management", time: "12 mins ago", status: "med" },
    { id: "PF004", title: "Out-of-Hours Activity", desc: "Abhishek Deshpande accessing files at 22:50.", score: 45, dept: "Operations", time: "22 mins ago", status: "med" }
];

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    // Load local storage if exists, otherwise load defaults
    employees = JSON.parse(JSON.stringify(initialEmployees));
    alerts = JSON.parse(JSON.stringify(initialAlerts));

    // Start Live Clock
    updateClock();
    setInterval(updateClock, 1000);

    // Initial Render
    calculateAndRenderStats();
    renderEmployeeTable();
    renderAlertsFeed();
    renderBlockedAccountsList();
    renderPredictiveFeed();
    initCharts();
    setupEventListeners();

    // Show initial active threat banner if there is any active critical threat
    checkCriticalThreats();

    // Log to terminal
    logTerminal("info", "SecureInsiderAI fully operational in Maharashtra Bank Hackathon Demo environment.");
});

// Update Header Clock
function updateClock() {
    const clockEl = document.getElementById("live-time");
    if (clockEl) {
        const now = new Date();
        // Adjust for current timezone
        clockEl.innerText = now.toTimeString().split(' ')[0];
    }
}

// Log message to Secure Audit Logs terminal
function logTerminal(type, text) {
    const termBody = document.getElementById("audit-terminal-body");
    if (!termBody) return;

    const timestamp = new Date().toTimeString().split(' ')[0];
    const sha = Math.random().toString(36).substring(2, 10).toUpperCase();

    const line = document.createElement("div");
    line.className = "terminal-line";

    let icon = "⚙️";
    let textClass = "info";
    if (type === "warning") {
        icon = "⚠️";
        textClass = "warning";
    } else if (type === "danger") {
        icon = "🚨";
        textClass = "danger";
    }

    line.innerHTML = `<span class="timestamp">[${timestamp}]</span> <span class="hash">[HASH:${sha}]</span> <span class="${textClass}">${icon} ${text}</span>`;
    termBody.appendChild(line);
    termBody.scrollTop = termBody.scrollHeight;
}

// Calculate dashboard metrics and draw UI changes
function calculateAndRenderStats() {
    const totalCount = employees.length;
    const activeCount = employees.filter(e => !e.blocked).length;
    const alertCount = alerts.filter(a => a.status === "Active").length;
    const highRiskCount = employees.filter(e => e.riskScore >= 70 && !e.blocked).length;

    // Calculate Average Risk Score of unblocked employees
    const unblockedEmps = employees.filter(e => !e.blocked);
    const sumRisk = unblockedEmps.reduce((acc, curr) => acc + curr.riskScore, 0);
    const avgRisk = unblockedEmps.length > 0 ? (sumRisk / unblockedEmps.length).toFixed(1) : 0;

    // Set DOM elements
    document.getElementById("stat-total-employees").innerText = totalCount;
    document.getElementById("stat-active-users").innerText = activeCount;
    document.getElementById("stat-total-alerts").innerText = alertCount;
    document.getElementById("menu-alert-count").innerText = alertCount;
    
    const menuBadge = document.getElementById("menu-alert-count");
    if (alertCount > 0) {
        menuBadge.style.display = "block";
    } else {
        menuBadge.style.display = "none";
    }

    document.getElementById("stat-high-risk").innerText = highRiskCount;
    
    // Alerts description
    const alertTextEl = document.getElementById("stat-active-alerts-text");
    if (alertCount > 0) {
        alertTextEl.innerText = `${alertCount} unresolved threats`;
        alertTextEl.className = "trend danger";
    } else {
        alertTextEl.innerText = "No unresolved threats";
        alertTextEl.className = "trend safe";
    }

    // High risk description
    const highRiskTextEl = document.querySelector("#stat-high-risk + span");
    if (highRiskCount > 0) {
        highRiskTextEl.innerText = `Requires action (Score >= 70%)`;
        highRiskTextEl.className = "trend danger";
    } else {
        highRiskTextEl.innerText = "No critical threat profiles";
        highRiskTextEl.className = "trend safe";
    }

    // AI average risk gauge progress bar
    document.getElementById("avg-risk-text").innerText = `${avgRisk}%`;
    const gaugeFill = document.getElementById("gauge-fill");
    
    // SVG DashOffset calculator for circular gauge (dashes total length is 126)
    // 0% risk = dashoffset 126
    // 100% risk = dashoffset 0
    const offset = 126 - (avgRisk / 100) * 126;
    gaugeFill.style.strokeDashoffset = offset;

    // Update Average Risk label status
    const avgStatusText = document.getElementById("avg-risk-status");
    const statusDot = document.getElementById("sidebar-status-dot");
    const statusText = document.getElementById("sidebar-status-text");

    if (avgRisk > 60 || alertCount > 0) {
        avgStatusText.innerText = "RISK ELEVATED";
        avgStatusText.className = "trend text-center danger";
        
        statusDot.className = "status-dot red pulse";
        statusText.innerText = "CRITICAL WARNING";
    } else if (avgRisk > 30) {
        avgStatusText.innerText = "SYSTEM CAUTION";
        avgStatusText.className = "trend text-center warning";
        
        statusDot.className = "status-dot yellow pulse";
        statusText.innerText = "SYSTEM CAUTION";
    } else {
        avgStatusText.innerText = "SYSTEM STABLE";
        avgStatusText.className = "trend text-center safe";
        
        statusDot.className = "status-dot green pulse";
        statusText.innerText = "SYSTEM SAFE";
    }
}

// Render Employee Activity Table
function renderEmployeeTable() {
    const tableBody = document.getElementById("employee-table-body");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    const deptFilter = document.getElementById("filter-dept").value;
    const riskFilter = document.getElementById("filter-risk").value;
    const searchVal = document.getElementById("global-search").value.toLowerCase();

    // Sort employees: highest risk first
    const sortedEmployees = [...employees].sort((a, b) => b.riskScore - a.riskScore);

    sortedEmployees.forEach(emp => {
        // Apply Filters
        if (deptFilter !== "all" && emp.department !== deptFilter) return;
        
        if (riskFilter === "high" && emp.riskScore < 70) return;
        if (riskFilter === "med" && (emp.riskScore < 30 || emp.riskScore >= 70)) return;
        if (riskFilter === "low" && emp.riskScore >= 30) return;

        if (searchVal && 
            !emp.name.toLowerCase().includes(searchVal) && 
            !emp.id.toLowerCase().includes(searchVal) && 
            !emp.location.toLowerCase().includes(searchVal) && 
            !emp.department.toLowerCase().includes(searchVal) && 
            !emp.device.toLowerCase().includes(searchVal)
        ) return;

        // Render Row
        const tr = document.createElement("tr");
        tr.dataset.id = emp.id;
        
        if (currentSelectedEmployeeId === emp.id) {
            tr.className = "row-selected";
        }

        // Risk badge color
        let riskClass = "low";
        if (emp.riskScore >= 70) riskClass = "high";
        else if (emp.riskScore >= 30) riskClass = "med";

        // Status badge
        let statusClass = "safe";
        let displayStatus = emp.status;
        if (emp.blocked) {
            statusClass = "blocked";
            displayStatus = "Blocked";
        } else if (emp.status === "Threat") {
            statusClass = "threat";
        } else if (emp.status === "Warning") {
            statusClass = "warning";
        }

        // Action button
        let actionBtnText = emp.blocked ? "Unlock" : "Block";
        let actionBtnClass = emp.blocked ? "btn-table-action action-unlock" : "btn-table-action";

        tr.innerHTML = `
            <td><strong>${emp.id}</strong></td>
            <td>${emp.name}</td>
            <td>${emp.department}</td>
            <td>${emp.loginTime}</td>
            <td>${emp.failedLogins}</td>
            <td>${emp.fileAccessCount}</td>
            <td class="font-small">${emp.device}</td>
            <td>${emp.location}</td>
            <td><span class="risk-badge ${riskClass}">${emp.riskScore}%</span></td>
            <td><span class="status-badge ${statusClass}">${displayStatus}</span></td>
            <td><button class="${actionBtnClass}" onclick="event.stopPropagation(); toggleBlockAccount('${emp.id}')">${actionBtnText}</button></td>
        `;

        // Row Click Listener
        tr.addEventListener("click", () => {
            selectEmployee(emp.id);
        });

        tableBody.appendChild(tr);
    });
}

// Select employee and show detailed profile card
function selectEmployee(id) {
    currentSelectedEmployeeId = id;
    
    // Highlight row
    const rows = document.querySelectorAll("#employee-table-body tr");
    rows.forEach(r => {
        if (r.dataset.id === id) r.className = "row-selected";
        else r.className = "";
    });

    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    // Fill Detail card
    document.getElementById("detail-placeholder").style.display = "none";
    const detailContent = document.getElementById("detail-content");
    detailContent.classList.remove("hidden");

    document.getElementById("detail-name").innerText = emp.name;
    document.getElementById("detail-id").innerText = emp.id;
    
    const deptBadge = document.getElementById("detail-dept");
    deptBadge.innerText = emp.department;
    deptBadge.className = `badge detail-dept-badge`;

    const riskScoreEl = document.getElementById("detail-risk-score");
    riskScoreEl.innerText = `${emp.riskScore}%`;

    const riskFillEl = document.getElementById("detail-risk-progress");
    riskFillEl.style.width = `${emp.riskScore}%`;
    
    if (emp.riskScore >= 70) {
        riskScoreEl.style.color = "var(--color-danger)";
        riskFillEl.className = "progress-bar-fill red";
    } else if (emp.riskScore >= 30) {
        riskScoreEl.style.color = "var(--color-warning)";
        riskFillEl.className = "progress-bar-fill orange";
    } else {
        riskScoreEl.style.color = "var(--color-safe)";
        riskFillEl.className = "progress-bar-fill green";
    }

    const statusEl = document.getElementById("detail-status");
    if (emp.blocked) {
        statusEl.innerText = "BLOCKED";
        statusEl.className = "value text-muted";
    } else {
        statusEl.innerText = emp.status.toUpperCase();
        if (emp.status === "Threat") statusEl.className = "value text-danger";
        else if (emp.status === "Warning") statusEl.className = "value text-warning";
        else statusEl.className = "value text-success";
    }

    document.getElementById("detail-files").innerText = emp.fileAccessCount;
    document.getElementById("detail-device").innerText = emp.device.split(' ')[0];

    // Anomalies
    const anomaliesContainer = document.getElementById("detail-anomalies");
    anomaliesContainer.innerHTML = "";
    
    if (emp.anomalies.length === 0) {
        anomaliesContainer.innerHTML = `<div class="desc-text" style="margin-bottom: 0;">No active AI security warnings detected for this session.</div>`;
    } else {
        emp.anomalies.forEach(anom => {
            const item = document.createElement("div");
            item.className = emp.riskScore >= 70 ? "anomaly-item" : "anomaly-item warning-item";
            item.innerHTML = `
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>${anom}</span>
            `;
            anomaliesContainer.appendChild(item);
        });
    }

    // Timeline
    const timelineContainer = document.getElementById("detail-timeline");
    timelineContainer.innerHTML = "";

    emp.activityHistory.forEach(act => {
        const item = document.createElement("div");
        item.className = "timeline-item";
        
        let dotClass = "safe";
        if (act.type === "danger") dotClass = "danger";
        else if (act.type === "warning") dotClass = "warning";

        item.innerHTML = `
            <div class="timeline-dot ${dotClass}"></div>
            <div class="timeline-time">${act.time}</div>
            <div class="timeline-desc">${act.desc}</div>
        `;
        timelineContainer.appendChild(item);
    });

    // Detail Action Button
    const actionBtn = document.getElementById("detail-action-btn");
    if (emp.blocked) {
        actionBtn.innerText = "Unlock Account";
        actionBtn.className = "btn btn-primary w-100";
    } else {
        actionBtn.innerText = "Block Employee Account";
        actionBtn.className = "btn btn-danger-action w-100";
    }

    actionBtn.onclick = () => {
        toggleBlockAccount(emp.id);
        // Refresh detail card
        selectEmployee(emp.id);
    };
}

// Close employee detail sidebar
document.getElementById("close-detail-btn").addEventListener("click", () => {
    document.getElementById("detail-content").classList.add("hidden");
    document.getElementById("detail-placeholder").style.display = "flex";
    currentSelectedEmployeeId = null;
    renderEmployeeTable();
});

// Toggle block employee account
function toggleBlockAccount(id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    if (emp.blocked) {
        // Unlock
        emp.blocked = false;
        logTerminal("info", `OVERRIDE: Administrator unlocked employee account ${emp.id} (${emp.name}).`);
        showToast(`Account ${emp.id} unlocked successfully.`);

        // If risk was critical, change status down to normal baseline or Warning
        if (emp.status === "Threat") {
            emp.status = "Warning";
            emp.riskScore = 55; // Lower risk score on restoration
        }
    } else {
        // Block
        emp.blocked = true;
        logTerminal("danger", `LOCKOUT: Employee account ${emp.id} (${emp.name}) blocked temporarily by administrative command.`);
        showToast(`Account ${emp.id} blocked and suspended.`, "danger");

        // Resolve any active alerts for this employee
        alerts.forEach(alert => {
            if (alert.employeeId === id) {
                alert.status = "Resolved";
            }
        });
    }

    // Refresh UI
    calculateAndRenderStats();
    renderEmployeeTable();
    renderAlertsFeed();
    renderBlockedAccountsList();
    updateCharts();
    checkCriticalThreats();
}

// Show global toast message
function showToast(message, type = "success") {
    const toast = document.getElementById("global-toast");
    const toastMessage = document.getElementById("toast-message");
    const toastIcon = document.getElementById("toast-icon");

    toastMessage.innerText = message;
    
    if (type === "danger") {
        toastIcon.className = "fa-solid fa-triangle-exclamation";
        toastIcon.style.color = "var(--color-danger)";
        toast.style.borderColor = "var(--color-danger)";
    } else {
        toastIcon.className = "fa-solid fa-circle-check";
        toastIcon.style.color = "var(--color-safe)";
        toast.style.borderColor = "var(--color-safe)";
    }

    toast.classList.remove("toast-hidden");

    setTimeout(() => {
        toast.classList.add("toast-hidden");
    }, 3500);
}

// Check for active critical threats and show threat banner
function checkCriticalThreats() {
    const banner = document.getElementById("critical-alert-banner");
    
    // Find first active critical alert
    const criticalAlert = alerts.find(a => a.severity === "critical" && a.status === "Active");

    if (criticalAlert) {
        // Check if employee is already blocked
        const emp = employees.find(e => e.id === criticalAlert.employeeId);
        if (emp && emp.blocked) {
            banner.classList.add("alert-hidden");
            return;
        }

        banner.classList.remove("alert-hidden");
        document.getElementById("banner-risk-score").innerText = `${criticalAlert.riskScore}% Risk`;
        document.getElementById("banner-alert-msg").innerText = criticalAlert.reason;
        document.getElementById("banner-emp-name").innerText = criticalAlert.employeeName;
        document.getElementById("banner-emp-ip").innerText = criticalAlert.ip;
        document.getElementById("banner-emp-loc").innerText = `${criticalAlert.location} (${criticalAlert.device})`;

        // Actions
        document.getElementById("banner-block-btn").onclick = () => {
            toggleBlockAccount(criticalAlert.employeeId);
        };
        
        document.getElementById("banner-dismiss-btn").onclick = () => {
            banner.classList.add("alert-hidden");
            logTerminal("warning", `Alert ${criticalAlert.id} for ${criticalAlert.employeeName} dismissed from active banner by Admin.`);
        };
    } else {
        banner.classList.add("alert-hidden");
    }
}

// Render Alerts Feed on Security Alerts view
function renderAlertsFeed() {
    const listWrapper = document.getElementById("alerts-list-wrapper");
    if (!listWrapper) return;

    listWrapper.innerHTML = "";

    // Counters
    let critCount = 0;
    let warnCount = 0;
    let resCount = 0;

    alerts.forEach(a => {
        // Count severities
        if (a.status === "Resolved") resCount++;
        else if (a.severity === "critical") critCount++;
        else if (a.severity === "warning") warnCount++;

        const card = document.createElement("div");
        card.className = `alert-item-card ${a.severity}-level`;
        if (currentSelectedAlertId === a.id) {
            card.classList.add("alert-card-selected");
        }

        let badgeClass = a.severity === "critical" ? "risk-badge high" : "risk-badge med";
        if (a.status === "Resolved") badgeClass = "status-badge blocked";

        card.innerHTML = `
            <div class="alert-card-header">
                <span class="emp-id">${a.employeeId} (${a.department})</span>
                <span class="${badgeClass}">${a.status === "Resolved" ? "RESOLVED" : a.riskScore + "% Risk"}</span>
            </div>
            <div class="alert-card-body">
                <p class="reason">${a.reason}</p>
                <div class="meta">
                    <span>${a.timestamp.split(' ')[1]}</span>
                    <span>${a.location}</span>
                </div>
            </div>
        `;

        card.addEventListener("click", () => {
            selectAlert(a.id);
        });

        listWrapper.appendChild(card);
    });

    // Update alert counts in view
    document.getElementById("alert-summary-critical").innerText = critCount;
    document.getElementById("alert-summary-warning").innerText = warnCount;
    document.getElementById("alert-summary-resolved").innerText = resCount;

    // Show initial alert details on right panel if not selected
    if (alerts.length > 0 && !currentSelectedAlertId) {
        selectAlert(alerts[0].id);
    }
}

// Select an alert in the Feed and show detail analysis panel
function selectAlert(id) {
    currentSelectedAlertId = id;
    
    // Highlight
    const cards = document.querySelectorAll(".alert-item-card");
    cards.forEach((c, idx) => {
        if (alerts[idx] && alerts[idx].id === id) {
            c.classList.add("alert-card-selected");
        } else {
            c.classList.remove("alert-card-selected");
        }
    });

    const alert = alerts.find(a => a.id === id);
    if (!alert) return;

    const analysisPanel = document.getElementById("ai-analysis-details");
    analysisPanel.innerHTML = "";

    // Anomaly Severity slider color code
    let meterColor = "green";
    if (alert.severity === "critical") meterColor = "red";
    else if (alert.severity === "warning") meterColor = "orange";

    // Resolve button
    const isEmpBlocked = employees.find(e => e.id === alert.employeeId)?.blocked;
    let adminBtnText = isEmpBlocked ? "Account Suspended (Unlock)" : "Mitigate Threat (Block Account)";
    let adminBtnClass = isEmpBlocked ? "btn btn-secondary-action w-100" : "btn btn-danger-action w-100";

    analysisPanel.innerHTML = `
        <div class="analysis-header-box">
            <div class="analysis-header-info">
                <h3>Incident ${alert.id}</h3>
                <span class="sub">${alert.timestamp}</span>
            </div>
            <div class="confidence-score-block">
                <div class="conf-val">${alert.riskScore}%</div>
                <div class="conf-lbl">AI Confidence</div>
            </div>
        </div>

        <div class="analysis-main-grid">
            <div class="analysis-column-left">
                <div class="panel-sub-section">
                    <h4>Threat Profile</h4>
                    <div class="threat-details-list">
                        <div class="detail-row">
                            <span class="lbl">Target Employee</span>
                            <span class="val">${alert.employeeName} (${alert.employeeId})</span>
                        </div>
                        <div class="detail-row">
                            <span class="lbl">Department</span>
                            <span class="val">${alert.department}</span>
                        </div>
                        <div class="detail-row">
                            <span class="lbl">Anomalous Device</span>
                            <span class="val">${alert.device}</span>
                        </div>
                        <div class="detail-row">
                            <span class="lbl">Location Origin</span>
                            <span class="val">${alert.location}</span>
                        </div>
                        <div class="detail-row">
                            <span class="lbl">Network IP Address</span>
                            <span class="val">${alert.ip}</span>
                        </div>
                        <div class="detail-row">
                            <span class="lbl">Alert Severity</span>
                            <span class="val ${alert.severity === "critical" ? "text-danger" : "text-warning"}">${alert.severity.toUpperCase()}</span>
                        </div>
                    </div>
                </div>

                <div class="panel-sub-section">
                    <h4>Severity Assessment</h4>
                    <div class="severity-meter-bg">
                        <div class="sev-fill ${meterColor}" style="width: ${alert.riskScore}%"></div>
                    </div>
                    <div class="slider-labels">
                        <span>Low Threat</span>
                        <span>Warning Threshold</span>
                        <span>High Risk Lockout</span>
                    </div>
                </div>
            </div>

            <div class="analysis-column-right">
                <div class="panel-sub-section">
                    <h4>Neural Network reasoning</h4>
                    <div class="ai-reasoning-card">
                        <h4><i class="fa-solid fa-brain"></i> AI Recommendation Engine</h4>
                        <p>${alert.reason}</p>
                        <p style="margin-top: 10px; font-weight: bold; color: var(--text-primary);">
                            Recommended Immediate Remediation:
                        </p>
                        <p style="margin-top: 4px; font-style: italic;">${alert.recommendation}</p>
                    </div>
                </div>

                <div class="panel-sub-section" style="margin-top: 30px;">
                    <button class="${adminBtnClass}" id="ai-remediate-btn">${adminBtnText}</button>
                </div>
            </div>
        </div>
    `;

    // Action listener
    document.getElementById("ai-remediate-btn").onclick = () => {
        toggleBlockAccount(alert.employeeId);
        // Refresh alert display
        selectAlert(alert.id);
    };
}

// Render Blocked Accounts in Admin panel list
function renderBlockedAccountsList() {
    const listContainer = document.getElementById("blocked-list-container");
    if (!listContainer) return;

    listContainer.innerHTML = "";

    const blockedEmployees = employees.filter(e => e.blocked);

    if (blockedEmployees.length === 0) {
        listContainer.innerHTML = `
            <div class="card-placeholder" style="padding: 20px 0; height: 180px;">
                <i class="fa-solid fa-lock-open" style="font-size: 28px;"></i>
                <p style="font-size: 12px; margin-top: 6px;">No locked or suspended employee accounts found.</p>
            </div>
        `;
        return;
    }

    blockedEmployees.forEach(emp => {
        const item = document.createElement("div");
        item.className = "blocked-account-item";
        item.innerHTML = `
            <div class="blocked-user-details">
                <span class="blocked-name">${emp.name} <strong class="font-small text-muted">[${emp.id}]</strong></span>
                <div class="blocked-meta">
                    <span>Dept: <strong>${emp.department}</strong></span>
                    <span>Risk: <strong class="text-danger">${emp.riskScore}%</strong></span>
                </div>
            </div>
            <button class="btn-unlock" onclick="toggleBlockAccount('${emp.id}')">Restore Access</button>
        `;
        listContainer.appendChild(item);
    });
}

// Render Live Predictive Feed on Dashboard Overview
function renderPredictiveFeed() {
    const container = document.getElementById("live-predictive-feed");
    if (!container) return;

    container.innerHTML = "";

    predictiveFeedItems.forEach(item => {
        const div = document.createElement("div");
        div.className = "feed-item";
        
        let iconClass = "safe";
        if (item.status === "danger") iconClass = "danger";
        else if (item.status === "med") iconClass = "warning";

        div.innerHTML = `
            <div class="feed-left">
                <div class="feed-icon ${iconClass}">
                    <i class="fa-solid fa-satellite-dish"></i>
                </div>
                <div class="feed-desc">
                    <span class="feed-title">${item.title}</span>
                    <span class="feed-sub">${item.desc}</span>
                </div>
            </div>
            <div class="feed-right">
                <span class="feed-score ${item.status === "low" ? "low" : "med"}">${item.score}% Risk</span>
                <span class="feed-time">${item.time}</span>
            </div>
        `;
        container.appendChild(div);
    });
}

// Initialize and render Chart.js
function initCharts() {
    // 1. Line Chart: Daily Threat Trend & Logins
    const ctxTrend = document.getElementById("threatTrendChart");
    if (ctxTrend) {
        threatTrendChart = new Chart(ctxTrend, {
            type: 'line',
            data: {
                labels: ['Jul 10', 'Jul 11', 'Jul 12', 'Jul 13', 'Jul 14', 'Jul 15', 'Jul 16'],
                datasets: [
                    {
                        label: 'Logins',
                        data: [150, 162, 145, 185, 192, 178, 184],
                        borderColor: '#0070F3',
                        backgroundColor: 'rgba(0, 112, 243, 0.05)',
                        tension: 0.35,
                        fill: true
                    },
                    {
                        label: 'Anomalies Detected',
                        data: [2, 1, 0, 4, 3, 5, 2],
                        borderColor: '#FF3D00',
                        backgroundColor: 'rgba(255, 61, 0, 0.05)',
                        tension: 0.35,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#90A3BF', font: { family: 'Outfit' } }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#90A3BF', font: { family: 'Outfit' } }
                    }
                }
            }
        });
    }

    // 2. Polar Area / Radar Chart: Department Risk Profile
    const ctxDept = document.getElementById("deptRiskChart");
    if (ctxDept) {
        deptRiskChart = new Chart(ctxDept, {
            type: 'polarArea',
            data: {
                labels: ['IT & Security', 'Retail Banking', 'Treasury & Forex', 'Wealth Management', 'Operations'],
                datasets: [{
                    data: calculateDeptAverageRisk(),
                    backgroundColor: [
                        'rgba(0, 112, 243, 0.5)',
                        'rgba(0, 223, 137, 0.5)',
                        'rgba(255, 61, 0, 0.5)',
                        'rgba(255, 145, 0, 0.5)',
                        'rgba(144, 163, 191, 0.5)'
                    ],
                    borderColor: 'var(--bg-card)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { color: '#90A3BF', font: { family: 'Outfit', size: 10 } }
                    }
                },
                scales: {
                    r: {
                        grid: { color: 'rgba(255, 255, 255, 0.07)' },
                        angleLines: { color: 'rgba(255, 255, 255, 0.07)' },
                        ticks: { display: false }
                    }
                }
            }
        });
    }

    // 3. Bar Chart: Top 5 Riskiest Employees
    const ctxEmp = document.getElementById("employeeRiskChart");
    if (ctxEmp) {
        const topEmpsData = getTopRiskyEmployeesData();
        employeeRiskChart = new Chart(ctxEmp, {
            type: 'bar',
            data: {
                labels: topEmpsData.names,
                datasets: [{
                    data: topEmpsData.scores,
                    backgroundColor: topEmpsData.colors,
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        max: 100,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#90A3BF', font: { family: 'Outfit' } }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: '#90A3BF', font: { family: 'Outfit' } }
                    }
                }
            }
        });
    }
}

// Calculate Average Department Risk Scores dynamically
function calculateDeptAverageRisk() {
    const depts = ['IT & Security', 'Retail Banking', 'Treasury & Forex', 'Wealth Management', 'Operations'];
    return depts.map(dept => {
        const deptEmps = employees.filter(e => e.department === dept && !e.blocked);
        if (deptEmps.length === 0) return 0;
        const sum = deptEmps.reduce((acc, curr) => acc + curr.riskScore, 0);
        return Math.round(sum / deptEmps.length);
    });
}

// Compile Top Risky Employees details for Chart
function getTopRiskyEmployeesData() {
    // Filter unblocked, sort risk desc, take top 5
    const topEmps = employees
        .filter(e => !e.blocked)
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 5);

    const names = topEmps.map(e => e.name);
    const scores = topEmps.map(e => e.riskScore);
    const colors = topEmps.map(e => e.riskScore >= 70 ? '#FF3D00' : (e.riskScore >= 30 ? '#FF9100' : '#00E676'));

    return { names, scores, colors };
}

// Dynamic updates of Chart instances
function updateCharts() {
    if (deptRiskChart) {
        deptRiskChart.data.datasets[0].data = calculateDeptAverageRisk();
        deptRiskChart.update();
    }

    if (employeeRiskChart) {
        const topEmpsData = getTopRiskyEmployeesData();
        employeeRiskChart.data.labels = topEmpsData.names;
        employeeRiskChart.data.datasets[0].data = topEmpsData.scores;
        employeeRiskChart.data.datasets[0].backgroundColor = topEmpsData.colors;
        employeeRiskChart.update();
    }
}

// Setup Event Listeners for UI Components
function setupEventListeners() {
    // 1. Navigation Tab Switching
    const navItems = document.querySelectorAll(".sidebar-menu li");
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const targetTab = item.dataset.tab;
            
            // Toggle active menu class
            navItems.forEach(n => n.classList.remove("active"));
            item.classList.add("active");

            // Toggle active sections
            const tabs = document.querySelectorAll(".tab-content");
            tabs.forEach(t => {
                if (t.id === targetTab) {
                    t.classList.add("active");
                } else {
                    t.classList.remove("active");
                }
            });

            // Log event to terminal
            logTerminal("info", `Navigation switched to Tab: ${targetTab.toUpperCase()}`);
        });
    });

    // 2. Global search table filter
    document.getElementById("global-search").addEventListener("input", () => {
        renderEmployeeTable();
    });

    // 3. Dropdowns Filters
    document.getElementById("filter-dept").addEventListener("change", () => {
        renderEmployeeTable();
    });
    
    document.getElementById("filter-risk").addEventListener("change", () => {
        renderEmployeeTable();
    });

    // 4. Admin Sensitivity Slider
    const slider = document.getElementById("slider-sensitivity");
    const sliderVal = document.getElementById("sensitivity-val");
    if (slider) {
        slider.addEventListener("input", (e) => {
            aiSensitivityThreshold = e.target.value;
            sliderVal.innerText = `${aiSensitivityThreshold}%`;
            document.getElementById("analytics-confidence-threshold").innerText = `${aiSensitivityThreshold}%`;
            
            logTerminal("warning", `AI Configuration Altered: Sensitivity threshold set to ${aiSensitivityThreshold}%.`);
        });
    }

    // 5. Clear audit terminal logs
    document.getElementById("clear-logs-btn").addEventListener("click", () => {
        const termBody = document.getElementById("audit-terminal-body");
        if (termBody) termBody.innerHTML = "";
        logTerminal("info", "Audit terminal display cleared by security override.");
    });

    // 6. Threat simulation trigger
    document.getElementById("simulate-alert-btn").addEventListener("click", () => {
        simulateNewThreat();
    });

    // 7. Report Compiler Form Button
    const genReportBtn = document.getElementById("generate-report-btn");
    if (genReportBtn) {
        genReportBtn.addEventListener("click", () => {
            compileMockReport();
        });
    }

    // Close Report Preview
    const closePrevBtn = document.getElementById("close-preview-btn");
    if (closePrevBtn) {
        closePrevBtn.addEventListener("click", () => {
            document.getElementById("report-preview-box").classList.add("hidden");
        });
    }

    // Print Report
    const printReportBtn = document.getElementById("print-report-btn");
    if (printReportBtn) {
        printReportBtn.addEventListener("click", () => {
            window.print();
        });
    }
}

// Compile printable summary dossier text
function compileMockReport() {
    const reportType = document.getElementById("report-type").value;
    const reportDept = document.getElementById("report-dept").value;
    
    const activeAlerts = alerts.filter(a => a.status === "Active").length;
    const blockedCount = employees.filter(e => e.blocked).length;
    const totalCount = employees.length;

    let titleText = "DAILY COMPLIANCE REPORT";
    if (reportType === "weekly") titleText = "WEEKLY SECURITY SUMMARY";
    else if (reportType === "incident") titleText = "CRITICAL INCIDENT HISTORY FILES";

    const reportContent = `===========================================================
               SECUREINSIDERAI SECURITY SYSTEM
                    ${titleText}
===========================================================
Generated: ${new Date().toLocaleString()}
Scope: ${reportDept.toUpperCase()} Departments
Environment: Bank of Maharashtra Demo Network
Compliance Reference: RBI/2026/CYBER-SHIELD-V3
-----------------------------------------------------------

I. GENERAL INVENTORY
  - Total Monitored Accounts  : ${totalCount}
  - Suspended/Blocked Profiles : ${blockedCount}
  - Unresolved AI Threat flags: ${activeAlerts}

II. CRYPTOGRAPHIC INTEGRITY
  - Ledger Checksum           : SHA-256 MATCHED [VERIFIED]
  - Security MFA Ratio        : 100% Enrollment
  - Core AI Engine State      : Sensitivity limit at ${aiSensitivityThreshold}%

III. RECENT CRITICAL EVENTS DETECTED
${alerts.map(a => `  [ID: ${a.id}] ${a.employeeName} (${a.department})
    Reason: ${a.reason}
    Action Status: ${a.status === "Resolved" ? "Account Locked/Remediated" : "Awaiting Actions"}
`).join('\n')}

IV. AI DEPT AUDIT REVIEWS
  * IT & Security       : Average Risk Score: ${calculateDeptAverageRisk()[0]}%
  * Retail Banking      : Average Risk Score: ${calculateDeptAverageRisk()[1]}%
  * Treasury & Forex    : Average Risk Score: ${calculateDeptAverageRisk()[2]}%
  * Wealth Management   : Average Risk Score: ${calculateDeptAverageRisk()[3]}%
  * Operations          : Average Risk Score: ${calculateDeptAverageRisk()[4]}%

-----------------------------------------------------------
Compiled by SecureInsiderAI Automated Compliance Engine.
Secure Ledger Reference ID: TX-${Math.random().toString(36).substring(2, 9).toUpperCase()}
===========================================================`;

    const previewContent = document.getElementById("preview-text-content");
    previewContent.innerText = reportContent;
    
    document.getElementById("report-preview-box").classList.remove("hidden");
    logTerminal("info", `COMPLIANCE: Security PDF/CSV report summary generated.`);
}

// Generate new live interactive threat simulation
function simulateNewThreat() {
    // Generate a randomized employee threat scenario
    const scenarios = [
        {
            empId: "EMP003",
            name: "Ananya Rao",
            dept: "IT & Security",
            reason: "Brute force signature: 5 failed administrative logins followed by SSH key modification.",
            risk: 85,
            loc: "Nashik Core Hub",
            dev: "Unknown Chromebook",
            ip: "10.35.2.145",
            rec: "Block admin token keys immediately, restrict client MAC, check console logs."
        },
        {
            empId: "EMP013",
            name: "Abhishek Deshpande",
            dept: "Operations",
            reason: "Accessing sensitive customer transaction ledger exports outside business hours (02:50 AM).",
            risk: 80,
            loc: "Nagpur (VPN)",
            dev: "Home Desktop PC",
            ip: "182.75.14.22",
            rec: "Confirm administrative shift records, suspend database queries, force MFA login."
        },
        {
            empId: "EMP006",
            name: "Priya Shinde",
            dept: "Wealth Management",
            reason: "Large file downloads (800MB customer details data) within 45 seconds from external gateway.",
            risk: 94,
            loc: "Pune Regional Office",
            dev: "Private iPhone Client",
            ip: "10.14.91.80",
            rec: "Lock device access credentials, trigger immediate corporate verification check."
        }
    ];

    // Pick one scenario randomly
    const scene = scenarios[Math.floor(Math.random() * scenarios.length)];

    // Check if the employee is already blocked
    const emp = employees.find(e => e.id === scene.empId);
    if (emp) {
        emp.riskScore = scene.risk;
        emp.status = "Threat";
        emp.device = scene.dev;
        emp.location = scene.loc;
        emp.ip = scene.ip;
        emp.failedLogins = 5;
        
        // Add to history
        emp.anomalies.unshift(scene.reason);
        emp.activityHistory.unshift({
            time: new Date().toTimeString().split(' ')[0].substring(0, 5),
            type: "danger",
            desc: scene.reason
        });

        // Add to global Alerts
        const newAlertId = `ALT0${alerts.length + 1}`;
        const newAlert = {
            id: newAlertId,
            employeeId: scene.empId,
            employeeName: scene.name,
            department: scene.dept,
            severity: "critical",
            reason: scene.reason,
            riskScore: scene.risk,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            location: scene.loc,
            device: scene.dev,
            ip: scene.ip,
            status: "Active",
            recommendation: scene.rec
        };

        // Put alert at front
        alerts.unshift(newAlert);
        
        // Log to terminal
        logTerminal("danger", `CRITICAL DETECTION: AI Anomaly Engine flagged account ${scene.empId} (${scene.name}). Risk score: ${scene.risk}%.`);
        
        // Show Toast
        showToast(`CRITICAL INSIDER THREAT: ${scene.name} (${scene.dept})`, "danger");

        // Refresh UI
        calculateAndRenderStats();
        renderEmployeeTable();
        renderAlertsFeed();
        renderBlockedAccountsList();
        updateCharts();
        checkCriticalThreats();

        // Increment anomaly count on Trend Chart
        if (threatTrendChart) {
            const dataIndex = threatTrendChart.data.datasets[1].data.length - 1;
            threatTrendChart.data.datasets[1].data[dataIndex] += 1;
            threatTrendChart.update();
        }
    }
}
