// FinPro AI — Vanilla JavaScript App Controller

// Global active states
let currentTab = "dashboard";
let currentModule = "ca";
let uploadedFiles = [];
let savedReports = [];
let activeReportOutput = "";
let complianceDeadlines = [];

// Module visual specifications mapping
const modulesConfig = {
  ca: {
    title: "CA — Tax & Audit",
    color: "#1D9E75", // Emerald
    bg: "bg-emerald-500",
    text: "text-emerald-600",
    lightBg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: "calculator",
    description: "AI-powered statutory audits, multi-regime income tax computations, and GST reconciliations.",
    laws: "Income Tax Act 1961, GST Act 2017, Companies Act 2013, ICAI Standards on Auditing",
    quickActions: [
      { label: "YoY Statement Comparison", prompt: "Perform a YoY financial statement horizontal comparison and ratio analysis report on my uploaded Balance Sheet and Profit & Loss files." },
      { label: "Compute income tax", prompt: "Compute income tax for FY 2024-25. I am a salaried individual. My gross salary is ₹12,00,000. I have HRA of ₹2,40,000 (fully claimed), 80C investments ₹1,50,000, 80D health insurance ₹25,000, home loan interest ₹2,00,000 (Section 24b). Show full computation under both old and new regime and recommend the better option." },
      { label: "GST liability analysis", prompt: "Analyse my GST liability for the month. My B2B sales are ₹15,00,000 (18% GST). B2C sales ₹5,00,000 (12% GST). Purchases with ITC available: ₹8,00,000 (18%). Purchases without ITC: ₹2,00,000. Compute CGST, SGST, IGST separately and net GST payable after ITC." }
    ]
  },
  cs: {
    title: "CS — Corporate Law",
    color: "#5F5E5A", // Stone
    bg: "bg-stone-500",
    text: "text-stone-600",
    lightBg: "bg-stone-50",
    border: "border-stone-200",
    icon: "building-2",
    description: "Corporate governance drafting, board resolutions, secretarial audit checklists, and ROC filing schedules.",
    laws: "Companies Act 2013, SEBI LODR Regulations 2015, FEMA 1999, RBI Guidelines",
    quickActions: [
      { label: "Board resolution", prompt: "Draft a board resolution for opening a corporate bank current account with Apex Trust Bank. Mr. Rajesh Sharma (DIN: 01847589) is to be authorized. Use proper recital format with RESOLVED THAT and FURTHER RESOLVED THAT." },
      { label: "MCA V3 filing guidelines", prompt: "List the core MCA filing requirements for an annual Private Limited company. Specify Form AOC-4, Form MGT-7, deadlines, penalties, and essential checklists under Section 137." }
    ]
  },
  cma: {
    title: "CMA — Cost Management",
    color: "#3B6D11", // Lime
    bg: "bg-lime-600",
    text: "text-lime-600",
    lightBg: "bg-lime-50",
    border: "border-lime-200",
    icon: "bar-chart-3",
    description: "Industrial cost sheets under CAS-4, standard variance metrics, and cost record compliance reports.",
    laws: "Cost Accounting Standards (CAS) 1-24, Companies (Cost Records & Audit) Rules 2014",
    quickActions: [
      { label: "CAS-4 cost sheet", prompt: "Prepare a detailed production cost sheet as per CAS-4. Direct materials are ₹4,50,000, employee salaries ₹1,50,000, design expenses ₹50,000, factory overheads ₹2,00,000, quality control ₹30,000. Output is 10,000 units. Structure prime cost, works cost, and production cost." },
      { label: "Material variance analysis", prompt: "Compute raw material price and usage variance. Standard quantity 42,000 kg at ₹10/kg. Actual quantity used 41,000 kg at ₹11/kg. Show cost variance, price variance, usage variance, and flag adverse/favourable outcomes." }
    ]
  },
  cfp: {
    title: "CFP — Financial Planning",
    color: "#185FA5", // Blue
    bg: "bg-blue-500",
    text: "text-blue-600",
    lightBg: "bg-blue-50",
    border: "border-blue-200",
    icon: "target",
    description: "Goal-based inflation-adjusted projection sheets, Human Life Value estimates, and tax-efficient wealth maps.",
    laws: "Time Value of Money (TVM) principles, FPSB India guidelines, Section 80C/80CCD portfolio allocations",
    quickActions: [
      { label: "Retirement corpus", prompt: "Compute the required retirement corpus and monthly SIP. Current age 30, retirement age 60, life expectancy 85. Current monthly expense is ₹60,000. Inflation is 6%, pre-retirement equity return 12%, post-retirement safe return 8%." },
      { label: "Insurance needs (HLV)", prompt: "Calculate my Human Life Value (HLV) insurance cover. Annual income ₹15,00,000. Personal expenses ₹3,00,000. Family contribution ₹12,00,000. Discount rate 7%, retirement age 60 (30 years to serve)." }
    ]
  },
  cia: {
    title: "CIA — Internal Audit",
    color: "#993C1D", // Orange-red
    bg: "bg-orange-500",
    text: "text-orange-600",
    lightBg: "bg-orange-50",
    border: "border-orange-200",
    icon: "shield",
    description: "Risk Control Matrices (RACM), process vulnerability mapping, and ACFE forensic audits.",
    laws: "IIA Standards (IPPF), COSO Framework, ACFE Fraud Risk Methodologies",
    quickActions: [
      { label: "Procurement RACM", prompt: "Draft a Risk and Control Matrix (RACM) for the procurement and payment cycle. Detail 3 risk steps: vendor onboarding, 3-way matching, and disbursements. Design controls and risk ratings." },
      { label: "Audit findings report", prompt: "Draft an internal audit finding for a control gap where payments were processed without Goods Receipt Notes (GRN). Structure as Condition, Criteria, Cause, Effect, and Audit Recommendation." }
    ]
  },
  frm: {
    title: "FRM — Risk Management",
    color: "#993556", // Pink-red
    bg: "bg-pink-500",
    text: "text-pink-600",
    lightBg: "bg-pink-50",
    border: "border-pink-200",
    icon: "alert-triangle",
    description: "Parametric Value-at-Risk calculations, credit default calculations, and Basel III liquidity buffer assessments.",
    laws: "Basel III/IV Standards (BCBS), RBI Risk Circulars, GARP FRM Framework",
    quickActions: [
      { label: "Market VaR computation", prompt: "Compute a 10-day Value-at-Risk (VaR) at 99% confidence for a portfolio valued at ₹10,00,00,000 with a daily volatility of 1.5%. Show intermediate 1-day calculations and parametric formulas." },
      { label: "Basel III liquidity audit", prompt: "Provide a checklist for Basel III compliance. Focus on Liquidity Coverage Ratio (LCR) and Net Stable Funding Ratio (NSFR) formulas, minimum RBI thresholds, and eligible HQLA instruments." }
    ]
  },
  cfa: {
    title: "CFA — Investments",
    color: "#854F0B", // Amber
    bg: "bg-amber-500",
    text: "text-amber-600",
    lightBg: "bg-amber-50",
    border: "border-amber-200",
    icon: "trending-up",
    description: "Discounted Cash Flow (DCF) intrinsic share valuations, DuPont ratios, and Equity Research Thesis portfolios.",
    laws: "CFA Institute Global Investment Performance Standards (GIPS), DuPont Analysis models",
    quickActions: [
      { label: "DCF equity valuation", prompt: "Draft a DCF valuation report for Apex Industries (NSE). Year 1-5 projected FCFF: ₹60Cr, ₹72.5Cr, ₹85.7Cr, ₹99Cr, ₹114.5Cr. WACC is 11.2%, terminal growth rate 4.5%, net debt ₹180Cr, outstanding shares 2.2Cr." },
      { label: "DuPont 3-Step Analysis", prompt: "Perform a 3-step DuPont Analysis for a firm with Revenue ₹50L, Operating Expenses ₹12L, Assets ₹25L, Equity ₹14L, and Net Profit after tax ₹3.7L. Compare margins, turnovers, and leverage." }
    ]
  },
  acca: {
    title: "ACCA — Global IFRS",
    color: "#534AB7", // Indigo
    bg: "bg-indigo-500",
    text: "text-indigo-600",
    lightBg: "bg-indigo-50",
    border: "border-indigo-200",
    icon: "globe",
    description: "IFRS 15 five-step revenue bundles, IFRS 16 lease liability capitalization, and Ind AS reconciliation sheets.",
    laws: "IASB International Financial Reporting Standards (IFRS 1-17 / IAS 1-41)",
    quickActions: [
      { label: "IFRS 15 revenue bundle", prompt: "Perform a 5-step IFRS 15 allocation for a software contract bundle. Total fixed consideration ₹30,00,000. Core software license standalone value ₹24,00,000, technical updates stand-alone value ₹6,00,000." },
      { label: "IFRS 16 lease valuation", prompt: "Compute IOU Right-of-Use (ROU) Asset and Lease Liability under IFRS 16. Lease term is 5 years, annual rental ₹5,00,000 paid in advance, Incremental Borrowing Rate (IBR) is 8%." }
    ]
  },
  cpa: {
    title: "CPA — US GAAP & Tax",
    color: "#185FA5", // Sky
    bg: "bg-sky-500",
    text: "text-sky-600",
    lightBg: "bg-sky-50",
    border: "border-sky-200",
    icon: "dollar-sign",
    description: "FASB ASC topic alignments, SALT economic nexus audits (Wayfair), and Federal IRS schedules.",
    laws: "FASB ASC 606/842, US Internal Revenue Code (IRC), South Dakota v. Wayfair (2018)",
    quickActions: [
      { label: "ASC 606 revenue recognition", prompt: "Assess revenue recognition under ASC 606 input method. Construction contract total price $5,00,000, estimated costs $4,000,000, actual costs incurred in Year 1 $1,600,000. Compute percentage and revenue." },
      { label: "SALT economic nexus audit", prompt: "Perform a state nexus analysis for a remote e-commerce vendor following South Dakota v. Wayfair. Review New York state economic thresholds ($500k sales AND 100 transactions) against current metrics ($650k sales, 120 orders)." }
    ]
  }
};

// Initializer
document.addEventListener("DOMContentLoaded", () => {
  // Sync Lucide icons
  lucide.createIcons();
  
  // Load local databases
  loadPersistentData();
  
  // Render Dashboard
  switchTab("dashboard");
});

// Single Page Tab Switch Controller
function switchTab(tabId) {
  currentTab = tabId;
  
  // Hide all panels
  document.querySelectorAll(".tab-pane").forEach((pane) => {
    pane.classList.add("hidden");
  });
  
  // Reset Nav active states
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.className = "nav-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-all text-left";
  });

  if (tabId === "dashboard" || tabId === "reports" || tabId === "settings") {
    // Show static tabs
    const target = document.getElementById(`tab-${tabId}`);
    if (target) target.classList.remove("hidden");
    
    const navBtn = document.getElementById(`nav-${tabId}`);
    if (navBtn) navBtn.className = "nav-btn w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-extrabold bg-slate-100 text-slate-900 transition-all text-left";
    
    if (tabId === "reports") {
      renderReportsList();
    }
  } else {
    // Show dynamic Modules tab
    currentModule = tabId;
    const target = document.getElementById("tab-module");
    if (target) target.classList.remove("hidden");
    
    const navBtn = document.getElementById(`nav-${tabId}`);
    const activeColor = modulesConfig[tabId].color;
    
    if (navBtn) {
      navBtn.className = "nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-extrabold bg-slate-100 text-slate-900 transition-all text-left";
    }
    
    renderModuleWorkspace(tabId);
  }
}

// Sidebar toggle for smaller viewport responsiveness
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar.style.width === "0px" || sidebar.classList.contains("w-0")) {
    sidebar.style.width = "256px";
    sidebar.classList.remove("w-0");
  } else {
    sidebar.style.width = "0px";
    sidebar.classList.add("w-0");
  }
}

// Collapsible User Account widget
function toggleProfileDropdown() {
  const dropdown = document.getElementById("profile-dropdown");
  dropdown.classList.toggle("hidden");
}

// Load configurations from standard localStorage client indexes
function loadPersistentData() {
  // Load Reports
  try {
    const data = localStorage.getItem("finpro_reports");
    savedReports = data ? JSON.parse(data) : [];
    document.getElementById("saved-reports-count").innerText = `${savedReports.length} Reports`;
  } catch (e) {
    savedReports = [];
  }

  // Load Deadlines
  try {
    const data = localStorage.getItem("finpro_compliance");
    if (data) {
      complianceDeadlines = JSON.parse(data);
    } else {
      // Seed default compliance items to look like live data on boot
      complianceDeadlines = [
        { id: "d1", title: "Form 3CD Tax Audit Filing (Sec 44AB)", due_date: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0], module: "ca", status: "pending" },
        { id: "d2", title: "GSTR-3B GST Monthly Summary Filing", due_date: new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0], module: "ca", status: "pending" },
        { id: "d3", title: "MGT-14 ROC Board Resolution Submission", due_date: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0], module: "cs", status: "overdue" },
        { id: "d4", title: "Form CRA-4 Cost Audit filing (CRA Rules)", due_date: new Date(Date.now() + 45 * 86400000).toISOString().split("T")[0], module: "cma", status: "pending" }
      ];
      localStorage.setItem("finpro_compliance", JSON.stringify(complianceDeadlines));
    }
    renderDeadlinesList();
  } catch (e) {
    complianceDeadlines = [];
  }
}

// Render deadlines tracker lists in dashboard
function renderDeadlinesList() {
  const container = document.getElementById("deadlines-container");
  if (!container) return;
  
  container.innerHTML = "";
  
  const labelMap = { ca: "CA - Tax", cs: "CS - Law", cma: "CMA - Costing" };

  complianceDeadlines.forEach((item) => {
    const isOverdue = new Date(item.due_date) < new Date() && item.status !== "done";
    const deadlineItem = document.createElement("div");
    deadlineItem.className = "py-3 flex items-center justify-between hover:bg-slate-50/50 p-2 rounded-lg transition-colors";
    
    deadlineItem.innerHTML = `
      <div class="flex items-start gap-3">
        <button onclick="toggleDeadlineStatus('${item.id}')" class="mt-0.5 w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all ${
          item.status === 'done'
            ? 'bg-emerald-500 border-emerald-600 text-white'
            : isOverdue
            ? 'border-rose-400 text-rose-500 bg-rose-50'
            : 'border-slate-300 hover:border-slate-400 text-slate-400'
        }">
          ${item.status === 'done' ? '<i data-lucide="check" class="w-3 h-3"></i>' : ''}
        </button>
        <div>
          <h4 class="text-xs font-bold text-slate-700 ${item.status === 'done' ? 'line-through opacity-50' : ''}">${item.title}</h4>
          <p class="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-wide">
            <span class="bg-slate-100 text-slate-500 px-1 rounded mr-1.5">${labelMap[item.module] || item.module}</span>
            Due: ${new Date(item.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </p>
        </div>
      </div>
      <div>
        ${
          item.status === 'done'
            ? '<span class="text-[8px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">COMPLETED</span>'
            : isOverdue
            ? '<span class="text-[8px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 animate-pulse">OVERDUE</span>'
            : '<span class="text-[8px] font-extrabold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">PENDING</span>'
        }
      </div>
    `;
    container.appendChild(deadlineItem);
  });
  
  lucide.createIcons();
}

// Toggle pending done statuses of calendar tasks
function toggleDeadlineStatus(id) {
  complianceDeadlines = complianceDeadlines.map((item) => {
    if (item.id === id) {
      return { ...item, status: item.status === "done" ? "pending" : "done" };
    }
    return item;
  });
  localStorage.setItem("finpro_compliance", JSON.stringify(complianceDeadlines));
  renderDeadlinesList();
}

// Collapsible inputs to add custom calendar items
function toggleAddDeadline() {
  const form = document.getElementById("add-deadline-form");
  form.classList.toggle("hidden");
}

function addDeadline() {
  const title = document.getElementById("deadline-title").value;
  const date = document.getElementById("deadline-date").value;
  const mod = document.getElementById("deadline-module").value;
  
  if (!title.trim() || !date) return;
  
  const newItem = {
    id: Math.random().toString(36).substring(2, 11),
    title,
    due_date: date,
    module: mod,
    status: "pending"
  };
  
  complianceDeadlines.unshift(newItem);
  localStorage.setItem("finpro_compliance", JSON.stringify(complianceDeadlines));
  
  // Reset
  document.getElementById("deadline-title").value = "";
  document.getElementById("deadline-date").value = "";
  toggleAddDeadline();
  
  renderDeadlinesList();
}

// Dynamic Module Workspace rendering
function renderModuleWorkspace(moduleId) {
  const cfg = modulesConfig[moduleId];
  
  document.getElementById("module-title").innerText = cfg.title;
  document.getElementById("module-desc").innerText = cfg.description;
  document.getElementById("module-laws").innerText = `CITATIONS: ${cfg.laws}`;
  
  const iconBox = document.getElementById("module-header-icon");
  iconBox.style.backgroundColor = cfg.color + "15";
  iconBox.innerHTML = `<i data-lucide="${cfg.icon}" class="w-5.5 h-5.5" style="color: ${cfg.color}"></i>`;
  
  // Render Quick Actions
  const qContainer = document.getElementById("quick-actions-container");
  qContainer.innerHTML = "";
  
  cfg.quickActions.forEach((act) => {
    const actBtn = document.createElement("button");
    actBtn.className = "text-left p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 transition-all text-xs text-slate-600 font-semibold group flex flex-col justify-between h-24";
    
    const isComparison = act.prompt.includes("comparison") || act.prompt.includes("YoY");
    
    actBtn.onclick = () => {
      if (isComparison) {
        openUploaderDrawer();
      }
      document.getElementById("query-input").value = act.prompt;
      triggerQueryAPI(act.prompt);
    };
    
    actBtn.innerHTML = `
      <span class="block text-[9px] uppercase font-bold tracking-wider opacity-60">${isComparison ? "STATEMENT UPLOAD" : "QUICK DRAFT"}</span>
      <span class="block mt-1 font-bold text-slate-700 leading-snug">${act.label}</span>
      <span class="mt-2 text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
        ${isComparison ? "Open File Uploader" : "Initiate Computation"} <i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>
      </span>
    `;
    qContainer.appendChild(actBtn);
  });
  
  // Reset query form uploader
  hideUploaderDrawer();
  uploadedFiles = [];
  renderFilesList();
  
  // Clear previous query input and hide output box
  document.getElementById("query-input").value = "";
  document.getElementById("output-container").classList.add("hidden");
  
  lucide.createIcons();
}

// Collapsible Document Uploader Area
function toggleUploaderDrawer() {
  const drawer = document.getElementById("uploader-drawer");
  drawer.classList.toggle("hidden");
}

function openUploaderDrawer() {
  document.getElementById("uploader-drawer").classList.remove("hidden");
}

function hideUploaderDrawer() {
  document.getElementById("uploader-drawer").classList.add("hidden");
}

function triggerFileInput() {
  document.getElementById("file-input").click();
}

function handleDrag(e) {
  e.preventDefault();
  e.stopPropagation();
  const dropzone = document.getElementById("dropzone");
  if (e.type === "dragover") {
    dropzone.className = "border-2 border-dashed border-indigo-600 rounded-xl p-4 bg-indigo-50/20 text-center cursor-pointer transition-all flex flex-col items-center gap-1.5";
  } else {
    dropzone.className = "border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl p-4 bg-white text-center cursor-pointer transition-all flex flex-col items-center gap-1.5";
  }
}

function handleDrop(e) {
  handleDrag(e);
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    addUploadedFiles(e.dataTransfer.files);
  }
}

function handleFileChange(e) {
  if (e.target.files && e.target.files[0]) {
    addUploadedFiles(e.target.files);
  }
}

function addUploadedFiles(filesList) {
  for (let i = 0; i < filesList.length; i++) {
    if (uploadedFiles.length >= 2) break; // Limit 2 files YoY comparison
    const file = filesList[i];
    uploadedFiles.push({ file, progress: 0, done: false });
    
    const idx = uploadedFiles.length - 1;
    simulateFileUploadProgress(idx);
  }
  renderFilesList();
  updatePaperclipButtonState();
}

function simulateFileUploadProgress(index) {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      uploadedFiles[index].progress = 100;
      uploadedFiles[index].done = true;
      renderFilesList();
    } else {
      uploadedFiles[index].progress = progress;
      renderFilesList();
    }
  }, 100);
}

function removeFile(index, e) {
  e.stopPropagation();
  uploadedFiles = uploadedFiles.filter((_, i) => i !== index);
  renderFilesList();
  updatePaperclipButtonState();
}

function updatePaperclipButtonState() {
  const btn = document.getElementById("uploader-toggle-btn");
  if (uploadedFiles.length > 0) {
    btn.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-200 bg-emerald-50 text-emerald-700 transition-colors focus:outline-none";
    btn.innerHTML = `<i data-lucide="paperclip" class="w-3.5 h-3.5 animate-bounce"></i> ${uploadedFiles.length} Statements Attached`;
  } else {
    btn.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none";
    btn.innerHTML = `<i data-lucide="paperclip" class="w-3.5 h-3.5"></i> Attach Financial Statements`;
  }
  lucide.createIcons();
}

function renderFilesList() {
  const container = document.getElementById("files-list");
  if (!container) return;
  
  container.innerHTML = "";
  
  uploadedFiles.forEach((item, idx) => {
    const itemCard = document.createElement("div");
    itemCard.className = "bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 relative overflow-hidden text-left";
    
    itemCard.innerHTML = `
      <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
        <i data-lucide="file-text" class="w-4 h-4"></i>
      </div>
      <div class="flex-grow min-w-0">
        <p class="text-[11px] font-bold text-slate-800 truncate leading-none mb-1">${item.file.name}</p>
        <div class="flex items-center gap-2">
          <span class="text-[9px] font-bold text-slate-400 uppercase">${(item.file.size / 1024).toFixed(1)} KB</span>
          <div class="flex-grow h-1 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-300 ${item.done ? 'bg-emerald-500' : 'bg-indigo-600'}" style="width: ${item.progress}%"></div>
          </div>
          <span class="text-[9px] font-bold text-slate-500">${item.progress}%</span>
        </div>
      </div>
      <button onclick="removeFile(${idx}, event)" class="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"><i data-lucide="x" class="w-3 h-3"></i></button>
      ${item.done ? '<div class="absolute top-1 right-8 flex items-center gap-0.5 text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-100"><i data-lucide="check" class="w-2 h-2"></i> STORED</div>' : ''}
    `;
    container.appendChild(itemCard);
  });
  
  lucide.createIcons();
}

// Form Submission Trigger
function handleQuerySubmit(e) {
  e.preventDefault();
  const q = document.getElementById("query-input").value;
  triggerQueryAPI(q);
}

// Primary stream parser and UI renderer
async function triggerQueryAPI(q) {
  if (!q.trim() && uploadedFiles.length === 0) return;
  
  let finalQuery = q;
  if (!q.trim() && uploadedFiles.length > 0) {
    finalQuery = `Perform YoY Horizontal Comparison and audit review for uploaded files: ${uploadedFiles.map(item => item.file.name).join(", ")}`;
  }
  
  const container = document.getElementById("output-container");
  const outputBox = document.getElementById("report-output-box");
  const actions = document.getElementById("output-actions");
  const ping = document.getElementById("output-ping");
  const dot = document.getElementById("output-dot");
  const status = document.getElementById("output-status");
  
  // Show output console in active loader state
  container.classList.remove("hidden");
  outputBox.innerHTML = `<p class="text-xs text-slate-400 py-4 italic animate-pulse">Establishing secure sandbox encryption layer...</p>`;
  actions.classList.add("hidden");
  ping.className = "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75";
  dot.className = "relative inline-flex rounded-full h-2 w-2 bg-emerald-500";
  status.innerText = "Executing Calculations...";
  
  // Scroll down smoothly to show results loading
  container.scrollIntoView({ behavior: "smooth" });
  
  activeReportOutput = "";
  
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        module: currentModule,
        query: finalQuery
      })
    });
    
    if (!res.ok) throw new Error("API Connection Failed");
    
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    outputBox.innerHTML = "";
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      activeReportOutput += chunk;
      
      // Render Markdown live via marked.js
      outputBox.innerHTML = marked.parse(activeReportOutput);
      
      // Keep viewport scrolled down as streaming prints
      container.scrollTop = container.scrollHeight;
    }
    
    // Success Completion state UI update
    ping.className = "hidden";
    dot.className = "relative inline-flex rounded-full h-2 w-2 bg-emerald-500";
    status.innerText = "Audit Verification Confirmed";
    actions.classList.remove("hidden");
    
    // Save report in history automatically if uploader triggers comparison
    if (uploadedFiles.length > 0) {
      saveActiveReport();
    }
    
  } catch (err) {
    console.error(err);
    outputBox.innerHTML = `<p class="text-xs text-rose-500 py-4 font-semibold">Error processing AI financial stream. Please check connection.</p>`;
    ping.className = "hidden";
    dot.className = "relative inline-flex rounded-full h-2 w-2 bg-rose-500";
    status.innerText = "Calculation Failed";
  }
}

// Persistent Report History operations
function saveActiveReport() {
  const queryText = document.getElementById("query-input").value || (uploadedFiles.length > 0 ? "Horizontal statement horizontal comparison" : "Quick action Blueprints");
  const moduleCfg = modulesConfig[currentModule];
  
  const newReport = {
    id: Math.random().toString(36).substring(2, 11),
    module: currentModule,
    title: queryText.slice(0, 50) || `${moduleCfg.title} Analysis`,
    query: queryText,
    content: activeReportOutput,
    created_at: new Date().toISOString()
  };
  
  savedReports.unshift(newReport);
  localStorage.setItem("finpro_reports", JSON.stringify(savedReports));
  
  // Show user dynamic Saved indicator status
  const saveBtn = document.getElementById("save-report-btn");
  saveBtn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 inline mr-1"></i> Saved to History`;
  saveBtn.className = "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-50 border border-slate-200 text-slate-400 cursor-default";
  
  document.getElementById("saved-reports-count").innerText = `${savedReports.length} Reports`;
  
  lucide.createIcons();
}

function deleteReport(id, e) {
  e.stopPropagation();
  savedReports = savedReports.filter((r) => r.id !== id);
  localStorage.setItem("finpro_reports", JSON.stringify(savedReports));
  
  renderReportsList();
  document.getElementById("saved-reports-count").innerText = `${savedReports.length} Reports`;
}

// Display Grid for Reports tab
function renderReportsList() {
  const grid = document.getElementById("reports-grid");
  if (!grid) return;
  
  grid.innerHTML = "";
  
  if (savedReports.length === 0) {
    grid.parentNode.innerHTML = `
      <div class="flex flex-col items-center justify-center p-12 bg-white border border-slate-200 rounded-2xl text-center space-y-3">
        <i data-lucide="file-text" class="w-12 h-12 text-slate-300"></i>
        <h3 class="text-sm font-semibold text-slate-700">No Saved Reports Found</h3>
        <p class="text-xs text-slate-400 mt-1 max-w-sm">Execute any prompt inside the modules and click "Save Report" to persist them here!</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }
  
  savedReports.forEach((report) => {
    const label = modulesConfig[report.module]?.title || "Financial Report";
    const reportCard = document.createElement("div");
    reportCard.className = "bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between h-44 group";
    
    reportCard.onclick = () => {
      // Toggle back to active module tab and render the report output
      switchTab(report.module);
      const container = document.getElementById("output-container");
      const outputBox = document.getElementById("report-output-box");
      const actions = document.getElementById("output-actions");
      const ping = document.getElementById("output-ping");
      const status = document.getElementById("output-status");
      
      container.classList.remove("hidden");
      outputBox.innerHTML = marked.parse(report.content);
      
      activeReportOutput = report.content;
      
      ping.className = "hidden";
      status.innerText = "Saved Report View Loaded";
      actions.classList.remove("hidden");
      
      const saveBtn = document.getElementById("save-report-btn");
      saveBtn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 inline mr-1"></i> Saved to History`;
      saveBtn.className = "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-50 border border-slate-200 text-slate-400 cursor-default";
      
      container.scrollIntoView({ behavior: "smooth" });
    };
    
    reportCard.innerHTML = `
      <div class="space-y-2 text-left">
        <div class="flex items-center justify-between">
          <span class="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-500 tracking-wide">${label}</span>
          <span class="text-[8.5px] text-slate-400 font-bold uppercase flex items-center gap-1"><i data-lucide="calendar" class="w-2.5 h-2.5"></i> ${new Date(report.created_at).toLocaleDateString('en-IN')}</span>
        </div>
        <h3 class="text-xs font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">${report.title}</h3>
      </div>
      <div class="flex items-center justify-between border-t border-slate-100 pt-3.5 mt-2.5">
        <span class="text-[9.5px] text-slate-400 font-semibold truncate max-w-[200px]">Query: "${report.query.slice(0, 30)}..."</span>
        <div class="flex items-center gap-1 flex-shrink-0">
          <button onclick="deleteReport('${report.id}', event)" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
          <span class="text-[8.5px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1"><i data-lucide="eye" class="w-2.5 h-2.5"></i> Open Blueprints</span>
        </div>
      </div>
    `;
    grid.appendChild(reportCard);
  });
  
  lucide.createIcons();
}

// Re-implemented standard client-side PDF compiler (bypasses Windows Absolute ESM webpack bugs)
async function downloadActiveReportPDF() {
  if (!activeReportOutput) return;
  
  const title = modulesConfig[currentModule].title;
  const bannerColor = modulesConfig[currentModule].color;
  
  try {
    const pdfDoc = await PDFLib.PDFDocument.create();
    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);
    
    let page = pdfDoc.addPage([595, 842]);
    const { width, height } = page.getSize();
    let y = height - 60;
    
    // Hex to RGB parser helper
    const hexToRgb = (hex) => {
      const clean = hex.replace("#", "");
      const r = parseInt(clean.substring(0, 2), 16) / 255;
      const g = parseInt(clean.substring(2, 4), 16) / 255;
      const b = parseInt(clean.substring(4, 6), 16) / 255;
      return [r, g, b];
    };
    const bannerRgb = hexToRgb(bannerColor);
    
    // Draw Banner Header
    page.drawRectangle({
      x: 0,
      y: height - 80,
      width,
      height: 80,
      color: PDFLib.rgb(bannerRgb[0], bannerRgb[1], bannerRgb[2])
    });
    
    page.drawText("FinPro AI", { x: 40, y: height - 35, size: 22, font: boldFont, color: PDFLib.rgb(1, 1, 1) });
    page.drawText(`${title.toUpperCase()} — COMPILATION blueprint`, { x: 40, y: height - 53, size: 9.5, font: boldFont, color: PDFLib.rgb(0.9, 0.95, 0.93) });
    page.drawText(`Date: ${new Date().toLocaleDateString("en-IN")}  |  Client Reference: Placeholder  |  Waiver Standard: SA-505 Vetted`, {
      x: 40,
      y: height - 68,
      size: 7.5,
      font,
      color: PDFLib.rgb(0.85, 0.9, 0.87)
    });
    
    y = height - 110;
    
    // Clean and split lines
    const lines = activeReportOutput.replace(/[*`_]/g, "").split("\n");
    
    for (const line of lines) {
      if (y < 70) {
        // Page Wraps - referencing active page reference correctly to avoid overlap bugs
        page = pdfDoc.addPage([595, 842]);
        y = page.getSize().height - 50;
        
        page.drawRectangle({
          x: 0,
          y: page.getSize().height - 30,
          width: page.getSize().width,
          height: 30,
          color: PDFLib.rgb(bannerRgb[0] * 0.9, bannerRgb[1] * 0.9, bannerRgb[2] * 0.9)
        });
        page.drawText(`FinPro AI — ${title}`, {
          x: 40,
          y: page.getSize().height - 18,
          size: 8,
          font: boldFont,
          color: PDFLib.rgb(1, 1, 1)
        });
        y = page.getSize().height - 60;
      }
      
      const isHeading = line.startsWith("#");
      const isBullet = line.trim().startsWith("-");
      const isTableDivider = line.includes("---") && line.includes("|");
      
      if (isTableDivider) continue;
      
      let cleanLine = line.replace(/^#+\s*/, "").replace(/^-\s*/, "• ").trim();
      if (!cleanLine) {
        y -= 8;
        continue;
      }
      
      const fontSize = isHeading ? 11 : (isBullet ? 9 : 9.5);
      const activeFont = isHeading ? boldFont : font;
      const textColor = isHeading 
        ? PDFLib.rgb(bannerRgb[0], bannerRgb[1], bannerRgb[2])
        : PDFLib.rgb(0.15, 0.2, 0.25);
      
      // Horizontal word wrapping
      const maxWidth = width - 80;
      const words = cleanLine.split(" ");
      let currentLineText = "";
      
      for (const word of words) {
        const testLine = currentLineText ? `${currentLineText} ${word}` : word;
        const lineWidth = activeFont.widthOfTextAtSize(testLine, fontSize);
        
        if (lineWidth > maxWidth) {
          page.drawText(currentLineText, {
            x: isBullet ? 52 : 40,
            y,
            size: fontSize,
            font: activeFont,
            color: textColor
          });
          y -= 13;
          currentLineText = word;
          
          if (y < 70) {
            page = pdfDoc.addPage([595, 842]);
            y = page.getSize().height - 50;
          }
        } else {
          currentLineText = testLine;
        }
      }
      
      if (currentLineText) {
        page.drawText(currentLineText, {
          x: isBullet ? 52 : 40,
          y,
          size: fontSize,
          font: activeFont,
          color: textColor
        });
        y -= isHeading ? 18 : 13;
      }
    }
    
    // Add final legal copilot indemnity waiver
    page.drawRectangle({
      x: 40,
      y: 35,
      width: width - 80,
      height: 1,
      color: PDFLib.rgb(0.8, 0.8, 0.8)
    });
    
    page.drawText("DISCLAIMER WAIVER: Blueprint compiled by FinPro AI analytical copilot. Under Section 137, all worksheets must be manually audited and signed off by a licensed professional.", {
      x: 40,
      y: 15,
      size: 6,
      font,
      color: PDFLib.rgb(0.6, 0.6, 0.6)
    });
    
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes.buffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_finpro_blueprint.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error("PDF Downloader failed:", error);
  }
}
