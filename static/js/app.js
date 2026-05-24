let currentTests = [];
let currentFeatureList = [];
let stepInterval = null;
let activeStep = -1;
let chartRef = null;
let priorityChart = null, typeChart = null;
let activePriorityFilter = null;
let activeTypeFilter = null;
let currentRating = 0;
let outputMode = 'cards';
let chatHistory = [];

const pipelineSteps = [
  { id: 1, name: "PARSE", desc: "Extract features", icon: "fa-code" },
  { id: 2, name: "VALIDATE", desc: "Verify inputs", icon: "fa-check-circle" },
  { id: 3, name: "ANALYZE", desc: "AI processing", icon: "fa-brain" },
  { id: 4, name: "GENERATE", desc: "QA test types/feature", icon: "fa-layer-group" },
  { id: 5, name: "PRIORITIZE", desc: "Risk assessment", icon: "fa-chart-line" },
  { id: 6, name: "BUILD", desc: "Test case assembly", icon: "fa-file-alt" },
  { id: 7, name: "VISUALIZE", desc: "Dashboard ready", icon: "fa-chart-pie" }
];

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast-notification ${type}`;
  toast.innerHTML = `<i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i> ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function extractFeaturesFromText(text) {
  if (!text || !text.trim()) return [];
  let lines = text.split(/\r?\n/);
  let features = [];
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    if (line.startsWith("-") || line.startsWith("*") || line.startsWith("•")) {
      let clean = line.substring(1).trim();
      if (clean && clean.length > 1) features.push(clean);
    } else if (line.includes(":")) {
      let after = line.split(":")[1];
      if (after) {
        after.split(",").forEach(p => { let f = p.trim(); if (f && f.length > 1) features.push(f); });
      } else if (line.length > 3 && line.length < 100) {
        features.push(line);
      }
    } else if (line.length > 2 && line.length < 80 && !line.match(/^\d+\./)) {
      features.push(line);
    }
  }
  if (features.length === 0 && text.trim().length > 3) {
    let potential = text.trim().split(/[,.\n]/).filter(s => s.trim().length > 2).slice(0, 5);
    features = potential;
  }
  let seen = new Set();
  let unique = [];
  for (let f of features) {
    let low = f.toLowerCase().substring(0, 60);
    if (!seen.has(low) && f.length > 1) { seen.add(low); unique.push(f.substring(0, 55)); }
  }
  return unique.slice(0, 10);
}

function generateTestSuite(features) {
  let tests = [];
  let id = 1;
  for (let feat of features) {
    if (!feat || feat.length < 1) continue;
    tests.push(createTC(id++, feat, "Functional", "High", [`Initialize test environment`, `Navigate to "${feat}" module`, `Execute valid operation`, `Validate expected response`], `${feat} works correctly under normal conditions.`));
    tests.push(createTC(id++, feat, "Negative", "Medium", [`Access ${feat} endpoint`, `Inject invalid/malformed payloads`, `Trigger error handler`, `Verify graceful degradation`], `System handles errors gracefully, no crash or data corruption.`));
    tests.push(createTC(id++, feat, "Edge Case", "Medium", [`Apply boundary value analysis`, `Test with max/min constraints`, `Verify extreme inputs`], `Boundary conditions are handled properly without failures.`));
    tests.push(createTC(id++, feat, "Security", "High", [`Attempt SQL injection attack`, `Test XSS vector injection`, `Try authentication bypass`, `Validate access controls`], `All malicious inputs sanitized, unauthorized access denied.`));
    tests.push(createTC(id++, feat, "UI/UX", "Low", [`Check responsive layout`, `Test keyboard navigation`, `Perform visual regression`], `UI matches design specifications, fully accessible.`));
    tests.push(createTC(id++, feat, "Integration", "High", [`Trigger API endpoint`, `Verify database state`, `Check event logs/message queue`, `Validate end-to-end flow`], `All integrated components work together correctly.`));
    tests.push(createTC(id++, feat, "Performance", "Medium", [`Simulate 100 concurrent users`, `Measure response time`, `Monitor resource usage`], `Response time under 1.5 seconds under load.`));
    tests.push(createTC(id++, feat, "Accessibility", "Low", [`Run automated a11y scan`, `Test screen reader compatibility`, `Check color contrast`], `WCAG 2.1 AA compliance achieved.`));
    tests.push(createTC(id++, feat, "Localization", "Medium", [`Switch to different locale`, `Verify date/time formats`, `Check currency display`, `Validate translated strings`], `i18n works correctly across all supported locales.`));
  }
  return tests;
}

function createTC(id, feature, type, priority, steps, expected) {
  return { id: `TC_${String(id).padStart(3, "0")}`, title: `${type} validation: ${feature.substring(0, 50)}`, priority, type, steps, expected_result: expected, featureRef: feature };
}

function renderSteps(activeIdx = -1) {
  const container = document.getElementById("stepContainer");
  let html = `<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; align-items: center;">`;
  pipelineSteps.forEach((step, idx) => {
    const isActive = (idx === activeIdx);
    html += `<div class="step-node-dev ${isActive ? 'active' : ''}"><div class="step-num"><i class="fas ${step.icon}"></i> ${step.id}</div><div class="step-name">${step.name}</div><div class="step-desc">${step.desc}</div></div>`;
    if (idx < pipelineSteps.length - 1) html += `<div class="arrow-icon"><i class="fas fa-chevron-right"></i></div>`;
  });
  html += `</div>`;
  container.innerHTML = html;
  updatePipelineChart(activeIdx);
}

function updatePipelineChart(activeIdx) {
  const canvas = document.getElementById("pipelineChart");
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const intensities = pipelineSteps.map((_, idx) => (activeIdx >= idx) ? 8 : 2);
  if (chartRef) chartRef.destroy();
  chartRef = new Chart(ctx, {
    type: 'line',
    data: { labels: pipelineSteps.map(s => s.name), datasets: [{ label: 'Pipeline Progress', data: intensities, borderColor: '#60a5fa', backgroundColor: 'rgba(96, 165, 250, 0.15)', fill: true, tension: 0.3, pointBackgroundColor: '#fbbf24' }] },
    options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { labels: { color: '#94a3b8', font: { size: 9 } } } }, scales: { y: { min: 0, max: 10, ticks: { color: '#64748b' } }, x: { ticks: { color: '#94a3b8', font: { size: 8 } } } } }
  });
}

function animatePipeline(totalFeatures, totalTests) {
  return new Promise((resolve) => {
    if (stepInterval) clearInterval(stepInterval);
    activeStep = -1;
    const stepDelay = 500;
    function advanceStep() {
      activeStep++;
      if (activeStep < pipelineSteps.length) {
        renderSteps(activeStep);
        const statusDiv = document.getElementById("pipelineStatus");
        if (statusDiv) {
          let msg = `⚡ STEP ${activeStep + 1}: ${pipelineSteps[activeStep].name} — ${pipelineSteps[activeStep].desc}`;
          if (activeStep === 3) msg += ` (${totalTests} tests from ${totalFeatures} features)`;
          if (activeStep === pipelineSteps.length - 1) msg = `✅ GENERATION COMPLETE — ${totalTests} test cases ready. Use filters to explore.`;
          statusDiv.innerHTML = `<i class="fas fa-microchip"></i> ${msg}`;
        }
        if (activeStep === pipelineSteps.length - 1) {
          clearInterval(stepInterval);
          setTimeout(() => resolve(), 400);
        }
      } else {
        clearInterval(stepInterval);
        resolve();
      }
    }
    advanceStep();
    stepInterval = setInterval(advanceStep, stepDelay);
  });
}

// FIXED FILTER FUNCTION: properly handles priority & type filters simultaneously
function renderFilteredTests() {
  let filtered = [...currentTests];
  if (activePriorityFilter) filtered = filtered.filter(t => t.priority === activePriorityFilter);
  if (activeTypeFilter) filtered = filtered.filter(t => t.type === activeTypeFilter);
  renderTestOutput(filtered);
  updateDonutChartsWithFilteredView(filtered);
  const totalSpan = document.getElementById("totalTestCountSpan");
  if (totalSpan) totalSpan.innerHTML = `${filtered.length} / ${currentTests.length} tests`;
  const badgeDiv = document.getElementById("activeFiltersBadge");
  let filtersHtml = [];
  if (activePriorityFilter) filtersHtml.push(`<span class="stat-badge-dev" style="background:#3b82f6;">Priority: ${activePriorityFilter}</span>`);
  if (activeTypeFilter) filtersHtml.push(`<span class="stat-badge-dev" style="background:#a855f7;">Type: ${activeTypeFilter}</span>`);
  badgeDiv.innerHTML = filtersHtml.length ? `<i class="fas fa-filter"></i> Active filters: ${filtersHtml.join(' ')}` : `<i class="fas fa-sliders-h"></i> No active filters - showing all ${currentTests.length} tests`;
  const feedbackCountField = document.getElementById("feedbackTestCount");
  if (feedbackCountField) feedbackCountField.value = currentTests.length > 0 ? `${currentTests.length} test cases generated` : "No tests yet";
}

function updateDonutChartsWithFilteredView(filteredTests) {
  const priorityCounts = { High: 0, Medium: 0, Low: 0 };
  const typeMap = new Map();
  filteredTests.forEach(t => { priorityCounts[t.priority]++; typeMap.set(t.type, (typeMap.get(t.type) || 0) + 1); });
  const priorityCtx = document.getElementById("priorityDonurChart") || document.getElementById("priorityDonutChart");
  const typeCtx = document.getElementById("typeDonutChart");
  if (priorityChart) priorityChart.destroy();
  if (typeChart) typeChart.destroy();
  if (priorityCtx && priorityCtx.id === "priorityDonutChart") {
    priorityChart = new Chart(priorityCtx, { type: 'doughnut', data: { labels: ['High Risk', 'Medium Risk', 'Low Risk'], datasets: [{ data: [priorityCounts.High, priorityCounts.Medium, priorityCounts.Low], backgroundColor: ['#dc2626', '#f59e0b', '#10b981'] }] }, options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e6', font: { size: 9 } } } } } });
  }
  if (typeCtx) {
    typeChart = new Chart(typeCtx, { type: 'doughnut', data: { labels: Array.from(typeMap.keys()), datasets: [{ data: Array.from(typeMap.values()), backgroundColor: ['#3b82f6', '#a855f7', '#ec489a', '#14b8a6', '#f97316', '#8b5cf6', '#06b6d4', '#84cc16', '#d946ef'] }] }, options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e6', font: { size: 8 } } } } } });
  }
}

function renderTestOutput(tests) {
  const outputDiv = document.getElementById("outputArea");
  if (!tests || tests.length === 0) { outputDiv.innerHTML = `<div class="dev-card empty-state" style="padding: 2rem;"><i class="fas fa-filter" style="font-size: 2rem; opacity: 0.5;"></i><p style="margin-top: 1rem;">No test cases match the selected filters.</p></div>`; return; }
  const prioCount = { High: 0, Medium: 0, Low: 0 };
  const typeMap = new Map();
  tests.forEach(t => { prioCount[t.priority]++; typeMap.set(t.type, (typeMap.get(t.type) || 0) + 1); });
  let statsHtml = `<div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 1rem;"><div class="stat-badge-dev"><i class="fas fa-cubes"></i> Features: ${currentFeatureList.length}</div><div class="stat-badge-dev"><i class="fas fa-vial"></i> Showing: ${tests.length} / ${currentTests.length}</div><div class="stat-badge-dev"><i class="fas fa-chart-simple"></i> 🔴${prioCount.High} 🟡${prioCount.Medium} 🟢${prioCount.Low}</div><button id="toggleTableViewBtn" class="btn-dev btn-orange-dev" style="margin-left:auto;">${outputMode === 'table' ? 'Show Cards' : 'Show Table'}</button></div><div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 1rem;">${Array.from(typeMap.entries()).map(([type, cnt]) => `<span class="stat-badge-dev"><i class="fas fa-tag"></i> ${type}: ${cnt}</span>`).join('')}</div>`;
  let contentHtml = "";
  if (outputMode === 'table') {
    contentHtml += `<div class="dev-card" style="padding:1rem; overflow-x:auto;">
        <table class="qa-table"><thead><tr><th>ID</th><th>Feature</th><th>Type</th><th>Priority</th><th>Steps</th><th>Actions</th></tr></thead><tbody>`;
    tests.forEach(tc => {
      const stepsSummary = tc.steps.join(' • ');
      contentHtml += `<tr><td>${tc.id}</td><td>${tc.featureRef}</td><td>${tc.type}</td><td>${tc.priority}</td><td>${stepsSummary}</td><td><button class="btn-dev action-btn" onclick="copyTestSteps('${tc.id}')">Copy Steps</button><button class="btn-dev action-btn" onclick="askAboutTest('${tc.id}')">Ask QA Chat</button></td></tr>`;
    });
    contentHtml += `</tbody></table></div>`;
  } else {
    let cardsHtml = "";
    tests.forEach(tc => {
      const priorityClass = tc.priority === "High" ? "priority-high" : (tc.priority === "Medium" ? "priority-med" : "priority-low");
      cardsHtml += `<div class="test-card-dev"><div style="display: flex; justify-content: space-between;"><span><strong style="color:#60a5fa;">${tc.id}</strong> <span class="priority-tag ${priorityClass}">${tc.priority}</span> <span style="background:#1e293b;padding:2px 8px;border-radius:12px;color:#a78bfa;">${tc.type}</span></span></div><p><span style="color:#a78bfa;">▸ Feature:</span> ${tc.featureRef}</p><p><span style="color:#a78bfa;">▸ Scenario:</span> ${tc.title}</p><details><summary>📋 Expand steps & expected</summary><ul>${tc.steps.map(s => `<li style="margin-left:1.2rem;font-size:0.75rem;"><i class="fas fa-angle-right" style="color:#60a5fa;"></i> ${s}</li>`).join('')}</ul><p><span style="color:#34d399;">✓ Expected:</span> ${tc.expected_result}</p></details></div>`;
    });
    contentHtml = cardsHtml;
  }
  outputDiv.innerHTML = statsHtml + contentHtml;
  const toggleBtn = document.getElementById('toggleTableViewBtn');
  if (toggleBtn) toggleBtn.addEventListener('click', toggleOutputMode);
  if (outputMode !== 'table') {
    const cards = Array.from(document.querySelectorAll("#outputArea .test-card-dev"));
    cards.forEach(c => { c.classList.add('stagger-hidden'); setTimeout(() => { c.classList.remove('stagger-hidden'); c.classList.add('stagger-visible'); }, 50); });
  }
}

// FILTER EVENT HANDLERS (FIXED)
function attachFilterEvents() {
  const chips = document.querySelectorAll('.filter-chip');
  chips.forEach(chip => {
    chip.removeEventListener('click', handleFilterClick);
    chip.addEventListener('click', handleFilterClick);
  });
}

function handleFilterClick(e) {
  const chip = e.currentTarget;
  const filterType = chip.getAttribute('data-filter-type');
  const filterValue = chip.getAttribute('data-filter-value');
  if (filterType === 'priority') {
    if (activePriorityFilter === filterValue) {
      activePriorityFilter = null;
    } else {
      activePriorityFilter = filterValue;
    }
  } else if (filterType === 'type') {
    if (activeTypeFilter === filterValue) {
      activeTypeFilter = null;
    } else {
      activeTypeFilter = filterValue;
    }
  }
  // Update UI active class
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active-filter'));
  if (activePriorityFilter) {
    document.querySelectorAll(`.filter-chip[data-filter-type="priority"][data-filter-value="${activePriorityFilter}"]`).forEach(c => c.classList.add('active-filter'));
  }
  if (activeTypeFilter) {
    document.querySelectorAll(`.filter-chip[data-filter-type="type"][data-filter-value="${activeTypeFilter}"]`).forEach(c => c.classList.add('active-filter'));
  }
  renderFilteredTests();
}

function clearFilters() {
  activePriorityFilter = null;
  activeTypeFilter = null;
  document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active-filter'));
  renderFilteredTests();
  showToast("Filters cleared", "success");
}

// Feedback Functions
function initRatingStars() {
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => {
    star.addEventListener('click', function () {
      const rating = parseInt(this.getAttribute('data-rating'));
      currentRating = rating;
      document.getElementById('feedbackRating').value = rating;
      stars.forEach((s, idx) => {
        if (idx < rating) s.classList.add('active');
        else s.classList.remove('active');
      });
      updateFeedbackPreview();
    });
  });
}

function updateFeedbackPreview() {
  const name = document.getElementById('feedbackName').value || '[Not provided]';
  const email = document.getElementById('feedbackEmail').value || '[Not provided]';
  const rating = currentRating > 0 ? currentRating : 'Not rated';
  const message = document.getElementById('feedbackMessage').value || '[No message]';
  const testCount = document.getElementById('feedbackTestCount').value || 'No tests generated';
  const previewDiv = document.getElementById('feedbackPreview');
  previewDiv.innerHTML = `<i class="fas fa-eye"></i> <strong>Feedback Preview:</strong><br>
    📛 Name: ${name}<br>
    📧 Email: ${email}<br>
    ⭐ Rating: ${rating}/5<br>
    🧪 ${testCount}<br>
    💬 Message: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`;
}

function sendFeedbackToEmail() {
  const name = document.getElementById('feedbackName').value.trim();
  const email = document.getElementById('feedbackEmail').value.trim();
  const rating = currentRating;
  const message = document.getElementById('feedbackMessage').value.trim();
  const testCount = document.getElementById('feedbackTestCount').value || 'No tests generated';

  if (!name) { showToast("Please enter your name", "error"); document.getElementById('feedbackName').classList.add('error-input'); setTimeout(() => document.getElementById('feedbackName').classList.remove('error-input'), 2000); return; }
  if (!email) { showToast("Please enter your email", "error"); document.getElementById('feedbackEmail').classList.add('error-input'); setTimeout(() => document.getElementById('feedbackEmail').classList.remove('error-input'), 2000); return; }
  if (!email.includes('@') || !email.includes('.')) { showToast("Please enter a valid email address", "error"); return; }
  if (rating === 0) { showToast("Please select a rating (1-5 stars)", "error"); return; }
  if (!message) { showToast("Please enter your feedback message", "error"); document.getElementById('feedbackMessage').classList.add('error-input'); setTimeout(() => document.getElementById('feedbackMessage').classList.remove('error-input'), 2000); return; }
  const subject = encodeURIComponent(`DevQA Forge Feedback from ${name}`);
  const body = encodeURIComponent(`===========================================\nDEVQA FORGE FEEDBACK FORM\n===========================================\n\n📅 Date: ${new Date().toLocaleString()}\n\n👤 Name: ${name}\n📧 Email: ${email}\n⭐ Rating: ${rating}/5\n🧪 Test Status: ${testCount}\n\n💬 Message:\n${message}\n\n===========================================\nThank you for helping us improve DevQA Forge!`);
  window.location.href = `mailto:skbharath2006@gmail.com?subject=${subject}&body=${body}`;
  showToast("Opening your email client with pre-filled feedback template!", "success");
}

function resetFeedbackForm() {
  document.getElementById('feedbackName').value = '';
  document.getElementById('feedbackEmail').value = 'skbharath2006@gmail.com';
  document.getElementById('feedbackMessage').value = '';
  currentRating = 0;
  document.getElementById('feedbackRating').value = 0;
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => star.classList.remove('active'));
  updateFeedbackPreview();
  showToast("Feedback form reset", "success");
}

async function runFullPipeline() {
  const raw = document.getElementById("reqInput").value;
  if (!raw.trim()) { showToast("Please enter feature requirements first.", "error"); return; }
  const features = extractFeaturesFromText(raw);
  if (features.length === 0) { showToast("No valid features detected. Use bullet points (- Feature) or comma-separated list.", "error"); return; }
  currentFeatureList = features;
  currentTests = generateTestSuite(features);
  activePriorityFilter = null; activeTypeFilter = null;
  document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active-filter'));
  document.getElementById("pipelineVisual").style.display = "block";
  document.getElementById("qaDashboard").style.display = "none";
  renderSteps(-1);
  await animatePipeline(currentFeatureList.length, currentTests.length);
  document.getElementById("qaDashboard").style.display = "block";
  renderFilteredTests();  // Fixed: uses renderFilteredTests to sync everything
  showToast(`Success! Generated ${currentTests.length} test cases.`, "success");
}

async function exportPDF() {
  if (!currentTests.length) { showToast("No test cases to export. Generate a test suite first.", "warning"); return; }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.setFillColor(18, 22, 45); doc.rect(0, 0, 210, 35, 'F');
  doc.setTextColor(96, 165, 250); doc.setFontSize(20); doc.setFont("helvetica", "bold"); doc.text("DevQA Forge - Test Report", 20, 18);
  doc.setFontSize(9); doc.setTextColor(156, 163, 175); doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 28); doc.text(`Total: ${currentTests.length}`, 140, 28);
  const featuresCount = new Set(currentTests.map(t => t.featureRef)).size;
  const highCount = currentTests.filter(t => t.priority === "High").length;
  const medCount = currentTests.filter(t => t.priority === "Medium").length;
  const lowCount = currentTests.filter(t => t.priority === "Low").length;
  doc.setFillColor(30, 35, 55); doc.roundedRect(20, 40, 170, 25, 3, 3, 'F');
  doc.setTextColor(96, 165, 250); doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.text("SUMMARY", 25, 48);
  doc.setTextColor(203, 213, 225); doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.text(`Features: ${featuresCount}`, 25, 56); doc.text(`High Priority: ${highCount}`, 80, 56); doc.text(`Medium: ${medCount}`, 130, 56); doc.text(`Low: ${lowCount}`, 170, 56);
  let y = 78;
  for (let i = 0; i < currentTests.length; i++) {
    const tc = currentTests[i];
    if (y > 270) { doc.addPage(); y = 20; doc.setFillColor(18, 22, 45); doc.rect(0, 0, 210, 25, 'F'); doc.setTextColor(96, 165, 250); doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.text("DevQA Forge - Test Report (continued)", 20, 16); y = 32; }
    doc.setFillColor(25, 30, 45); doc.roundedRect(15, y - 2, 180, 30, 2, 2, 'F');
    doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(96, 165, 250); doc.text(`${tc.id}`, 20, y + 4);
    let priorityColor = tc.priority === "High" ? [220, 38, 38] : (tc.priority === "Medium" ? [245, 158, 11] : [16, 185, 129]);
    doc.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]); doc.text(`[${tc.priority}]`, 55, y + 4);
    doc.setTextColor(167, 139, 250); doc.text(`${tc.type}`, 85, y + 4);
    doc.setFont("helvetica", "normal"); doc.setTextColor(203, 213, 225); doc.setFontSize(7);
    doc.text(`Feature: ${tc.featureRef.substring(0, 60)}`, 20, y + 10);
    doc.text(`Expected: ${tc.expected_result.substring(0, 68)}`, 20, y + 16);
    doc.setTextColor(156, 163, 175); doc.text(`Steps: ${tc.steps[0]} → ${tc.steps[1] || ''}`, 20, y + 22);
    y += 32;
  }
  doc.save("devqa_test_report.pdf");
  showToast("PDF report downloaded!", "success");
}

function clearAll() {
  document.getElementById("reqInput").value = "";
  document.getElementById("outputArea").innerHTML = `<div class="dev-card empty-state" style="padding: 2rem;"><i class="fas fa-code" style="font-size: 2rem; opacity: 0.5;"></i><p style="margin-top: 1rem;">No test cases generated yet.<br>Enter features above and click GENERATE TEST SUITE</p></div>`;
  currentTests = []; currentFeatureList = [];
  outputMode = 'cards';
  chatHistory = [];
  const chatMessages = document.getElementById('chatMessages');
  if (chatMessages) {
    chatMessages.innerHTML = `<div class="chat-message bot">Hello QA tester! I am ready to review your test cases, suggest improvements, and help convert findings into table actions.</div>`;
  }
  if (stepInterval) clearInterval(stepInterval);
  renderSteps(-1);
  document.getElementById("qaDashboard").style.display = "none";
  document.getElementById("pipelineStatus").innerHTML = `<i class="fas fa-hourglass-half"></i> Ready — Enter features and click GENERATE`;
  if (chartRef) { chartRef.destroy(); chartRef = null; updatePipelineChart(-1); }
  activePriorityFilter = null; activeTypeFilter = null;
  document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active-filter'));
  document.getElementById("feedbackTestCount").value = "No tests yet";
  updateFeedbackPreview();
  showToast("All test data cleared.", "success");
}

function toggleFlowVisibility() {
  const panel = document.getElementById("pipelineVisual");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
}

function toggleOutputMode() {
  outputMode = outputMode === 'table' ? 'cards' : 'table';
  renderFilteredTests();
}

function appendChatMessage(role, text) {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${role}`;

  if (typeof marked !== 'undefined' && role === 'bot') {
    messageDiv.innerHTML = marked.parse(text);
  } else {
    messageDiv.innerHTML = text.replace(/\n/g, '<br>');
  }

  // add table styles if there are any tables
  const tables = messageDiv.querySelectorAll('table');
  tables.forEach(table => {
    table.className = 'qa-table';
    table.style.marginTop = '10px';
  });

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendChatQuestion(promptOverride) {
  const inputField = document.getElementById('chatInput');
  const messageText = promptOverride || inputField.value.trim();
  if (!messageText) return;
  appendChatMessage('user', messageText);
  inputField.value = '';
  const payload = {
    message: messageText,
    testCases: currentTests.slice(0, 25).map(tc => ({ id: tc.id, feature: tc.featureRef, type: tc.type, priority: tc.priority, expected_result: tc.expected_result, steps: tc.steps }))
  };
  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (data.error) {
      appendChatMessage('bot', `Error: ${data.error}`);
      showToast('QA chat failed. See console.', 'error');
      console.error(data.error);
    } else {
      appendChatMessage('bot', data.response);
    }
  } catch (error) {
    appendChatMessage('bot', `Connection error. Try again.`);
    console.error(error);
  }
}

function copyTestSteps(testId) {
  const test = currentTests.find(tc => tc.id === testId);
  if (!test) return;
  const stepsText = test.steps.join('\n');
  navigator.clipboard.writeText(stepsText).then(() => {
    showToast(`Copied steps for ${testId}`);
  }).catch(() => {
    showToast('Unable to copy steps', 'error');
  });
}

function askAboutTest(testId) {
  const test = currentTests.find(tc => tc.id === testId);
  if (!test) return;
  const message = `Review QA test case ${test.id} for feature ${test.featureRef}. Type: ${test.type}, Priority: ${test.priority}. Steps: ${test.steps.join(' · ')}. Expected: ${test.expected_result}. Suggest any improvements or risk coverage issues.`;
  sendChatQuestion(message);
}

async function resetChatConversation() {
  chatHistory = [];
  const chatMessages = document.getElementById('chatMessages');
  if (chatMessages) {
    chatMessages.innerHTML = `<div class="chat-message bot">Hello QA tester! I am ready to review your test cases, suggest improvements, and help convert findings into table actions.</div>`;
  }
  try {
    await fetch('/chat/reset', { method: 'POST' });
  } catch (e) {
    console.error('Failed to reset chat history on server', e);
  }
}

// Event Listeners
document.getElementById("runPipelineBtn").addEventListener("click", runFullPipeline);
document.getElementById("exportPdfBtn").addEventListener("click", exportPDF);
document.getElementById("clearBtn").addEventListener("click", clearAll);
document.getElementById("toggleFlowBtn").addEventListener("click", toggleFlowVisibility);
document.getElementById("clearFiltersBtn").addEventListener("click", clearFilters);
document.getElementById("sendFeedbackBtn").addEventListener("click", sendFeedbackToEmail);
document.getElementById("resetFeedbackBtn").addEventListener("click", resetFeedbackForm);
document.getElementById('chatSendBtn').addEventListener('click', () => sendChatQuestion());
document.getElementById('chatResetBtn').addEventListener('click', resetChatConversation);
document.getElementById('chatInput').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendChatQuestion();
  }
});

['feedbackName', 'feedbackEmail', 'feedbackMessage'].forEach(id => {
  document.getElementById(id).addEventListener('input', updateFeedbackPreview);
});

initRatingStars();
renderSteps(-1);
attachFilterEvents();
updateFeedbackPreview();
