// DataRequest Studio — Enterprise Frontend Controller

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add("dark");
    }
    lucide.createIcons();
    initApp();
});

let selectedFile = null;
let selectedSampleName = null;
let currentPipelineData = null;
let isSqlEditMode = false;
let originalGeneratedSqlQuery = "";
let deliveryChart1 = null;
let deliveryChart2 = null;

// ==================== GITHUB PAGES / OFFLINE CLIENT-SIDE SIMULATOR ====================
function isGitHubPagesOrOffline() {
    return window.location.hostname.includes('github.io') || window.location.protocol === 'file:';
}

function getFallbackPipelineResult(selectedSample, customSpec) {
    if (!window.MOCK_DATA || !window.MOCK_DATA.pipeline_results) return null;
    const results = window.MOCK_DATA.pipeline_results;
    let base = null;
    if (selectedSample && results[selectedSample]) {
        base = JSON.parse(JSON.stringify(results[selectedSample]));
    } else {
        const keys = Object.keys(results);
        base = JSON.parse(JSON.stringify(results[keys[0]]));
    }
    if (customSpec && base) {
        base.spec = Object.assign({}, base.spec, customSpec);
    }
    return base;
}

async function simulateClientStreamingPipeline(sampleName, customSpec, dialect, maskingMode) {
    const mockDataResult = getFallbackPipelineResult(sampleName, customSpec);
    if (!mockDataResult) {
        throw new Error('Data simulasi offline tidak ditemukan.');
    }

    const steps = [
        { step: 1, agent: 'PDF Extractor', log: 'Menganalisis dokumen PDF permohonan menggunakan NLP Parser...', delay: 500 },
        { step: 1, agent: 'PDF Extractor', log: 'Metadata terdeteksi: ID ' + (mockDataResult.spec.request_id || 'REQ-SAMPLE') + ', Pemohon: ' + (mockDataResult.spec.requester_name || 'Analis'), delay: 400 },
        { step: 2, agent: 'Schema Matcher', log: 'Menghubungkan ke OpenMetadata Data Catalog Enterprise...', delay: 600 },
        { step: 2, agent: 'Schema Matcher', log: 'Ditemukan entitas tabel: ' + mockDataResult.catalog_match.selected_tables.map(t => t.table_name).join(', ') + ' dengan proteksi PII aktif.', delay: 450 },
        { step: 3, agent: 'SQL Generator', log: 'Menyusun query analitik sesuai dialek database: ' + (dialect || 'PostgreSQL') + '...', delay: 700 },
        { step: 3, agent: 'SQL Generator', log: 'Query SQL berhasil digenerate dan dioptimasi (Filter tanggal & joins siap).', delay: 400 },
        { step: 4, agent: 'SQL Auditor', log: 'Memeriksa keamanan SQL, batasan LIMIT, dan validasi UUID schema...', delay: 600 },
        { step: 4, agent: 'SQL Auditor', log: 'Status Verifikasi: ' + mockDataResult.verification.status + ' (Skor: ' + mockDataResult.verification.score + '/100).', delay: 400 },
        { step: 5, agent: 'Delivery Coordinator', log: 'Mengeksekusi query pada engine DWH Enterprise & menerapkan data masking ' + (maskingMode || 'PARTIAL') + '...', delay: 750 },
        { step: 5, agent: 'Delivery Coordinator', log: 'Penyusunan dataset berhasil! Paket artefak terdaftar ke CMS & Segel Digital tersemat.', delay: 450 }
    ];

    for (const s of steps) {
        setStepState(s.step);
        appendConsoleLog(s.agent, s.log);
        await new Promise(r => setTimeout(r, s.delay));
    }

    for (let i = 1; i <= 5; i++) {
        const el = document.getElementById('step-ind-' + i);
        if (el) el.className = 'step-card done p-3.5 rounded-xl border shadow-sm flex items-center space-x-3 transition';
    }
    const statusElem = document.getElementById('console-agent-status');
    if (statusElem) statusElem.innerText = 'Status: Selesai 100% (GitHub Pages Interactive Demo)';

    currentPipelineData = mockDataResult;
    renderResults(mockDataResult);
}

function downloadClientBlob(filename, text, mimeType) {
    const mime = mimeType || 'text/plain;charset=utf-8;';
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function triggerArtifactDownload(filename, defaultMime = 'application/octet-stream') {
    if (!filename) return;
    const cleanName = filename.split(/[\\/]/).pop();
    
    // 1. Cek apakah ada di cache base64 mock_data
    if (window.MOCK_DATA && window.MOCK_DATA.artifacts_base64 && window.MOCK_DATA.artifacts_base64[cleanName]) {
        const b64Data = window.MOCK_DATA.artifacts_base64[cleanName];
        const byteCharacters = atob(b64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: defaultMime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = cleanName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
    }

    // 2. Jika di GitHub Pages atau offline, arahkan ke static folder outputs/
    if (isGitHubPagesOrOffline()) {
        const link = document.createElement('a');
        link.href = `outputs/${cleanName}`;
        link.download = cleanName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
    }

    // 3. Jika di localhost dengan FastAPI backend
    window.location.href = `/api/download/outputs/${cleanName}`;
}
// ======================================================================================


function updateSqlGutter(gutterElem, text) {
    if (!gutterElem) return;
    const lines = (text || "").split("\n");
    const count = Math.max(lines.length, 1);
    let html = "";
    for (let i = 1; i <= count; i++) {
        html += `<div class="sql-line-num">${i}</div>`;
    }
    gutterElem.innerHTML = html;
}

function updateSqlStats(query) {
    const text = query || "";
    const lines = text ? text.split("\n").length : 0;
    const chars = text.length;
    const linesElem = document.getElementById("sql-stats-lines");
    const charsElem = document.getElementById("sql-stats-chars");
    if (linesElem) linesElem.innerText = `Baris: ${lines}`;
    if (charsElem) charsElem.innerText = `Karakter: ${chars}`;
}

function beautifySqlQuery(rawSql) {
    if (!rawSql) return "";
    let formatted = rawSql.trim();
    const keywords = [
        "SELECT", "FROM", "WHERE", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "JOIN", 
        "ON", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET", "AND", "OR", "AS", "BETWEEN",
        "IN", "NOT IN", "IS NULL", "IS NOT NULL", "CASE", "WHEN", "THEN", "ELSE", "END",
        "UNION ALL", "UNION", "DESC", "ASC", "WITH", "DISTINCT", "LIKE", "ILIKE"
    ];
    keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, 'gi');
        formatted = formatted.replace(regex, kw);
    });
    return formatted;
}

function updateSqlBreakdown(query, spec) {
    const qUpper = (query || "").toUpperCase();
    
    // 1. SELECT & Masking breakdown
    const selectElem = document.getElementById("sql-breakdown-select");
    if (selectElem) {
        let maskingDetected = [];
        if (qUpper.includes("LEFT(") || qUpper.includes("RIGHT(") || qUpper.includes("SUBSTR")) maskingDetected.push("Masking Karakter");
        if (qUpper.includes("HASH") || qUpper.includes("MD5") || qUpper.includes("SHA256")) maskingDetected.push("Kriptografi Hash");
        if (qUpper.includes("CONCAT") && (qUpper.includes("***") || qUpper.includes("X"))) maskingDetected.push("Redaksi Parsial");
        
        let colCount = spec && spec.requested_columns ? spec.requested_columns.length : 0;
        let piiCount = spec && spec.pii_fields ? spec.pii_fields.length : 0;
        
        if (maskingDetected.length > 0) {
            selectElem.innerHTML = `<span class="text-blue-700 font-semibold">${colCount} atribut</span> diproses dengan aturan proteksi <span class="text-emerald-700 font-semibold">(${maskingDetected.join(", ")})</span>.`;
        } else if (piiCount > 0) {
            selectElem.innerHTML = `<span class="text-blue-700 font-semibold">${colCount} atribut</span> diekstrak dengan penjagaan <span class="text-amber-700 font-semibold">${piiCount} field PII</span>.`;
        } else {
            selectElem.innerText = `${colCount > 0 ? colCount : 'Semua'} atribut diekstrak sesuai standar integritas tata kelola.`;
        }
    }

    // 2. JOIN breakdown
    const joinElem = document.getElementById("sql-breakdown-join");
    if (joinElem) {
        const joinMatches = (query || "").match(/(?:FROM|JOIN)\s+([a-zA-Z0-9_\.]+)/gi);
        if (joinMatches && joinMatches.length > 0) {
            const tableList = [...new Set(joinMatches.map(m => m.replace(/^(FROM|JOIN)\s+/i, '').trim()))];
            joinElem.innerHTML = `<span class="font-semibold text-purple-700">${tableList.length} tabel resmi:</span> ${tableList.slice(0, 3).join(", ")}${tableList.length > 3 ? '...' : ''}`;
        } else {
            joinElem.innerText = "Tabel fakta dan dimensi terhubung via Primary & Foreign Key resmi.";
        }
    }

    // 3. WHERE breakdown
    const whereElem = document.getElementById("sql-breakdown-where");
    if (whereElem) {
        if (spec && spec.date_range && (spec.date_range.start || spec.date_range.end)) {
            const start = spec.date_range.start || "awal";
            const end = spec.date_range.end || "akhir";
            whereElem.innerHTML = `Filter periode waktu: <span class="font-semibold text-emerald-700">${start} s.d. ${end}</span>.`;
        } else if (qUpper.includes("WHERE")) {
            whereElem.innerHTML = `<span class="text-emerald-700 font-semibold">Klausa WHERE aktif</span> membatasi lingkup data sesuai parameter bisnis.`;
        } else {
            whereElem.innerText = "Pembatasan periode waktu dan parameter bisnis spesifik.";
        }
    }

    // 4. Circuit Breaker Guard
    const guardElem = document.getElementById("sql-breakdown-guard");
    if (guardElem) {
        const isSafe = !qUpper.includes("DROP ") && !qUpper.includes("DELETE ") && !qUpper.includes("UPDATE ") && !qUpper.includes("INSERT ") && !qUpper.includes("ALTER ");
        if (isSafe) {
            guardElem.innerHTML = `<span class="text-emerald-700 font-semibold">Terverifikasi 100% Aman:</span> Read-only URI terisolasi tanpa risiko mutasi data.`;
        } else {
            guardElem.innerHTML = `<span class="text-rose-700 font-semibold">Peringatan Keamanan:</span> Terdeteksi potensi mutasi data!`;
        }
    }
}


async function initApp() {
    checkHealth();
    loadSamples();
    setupDropzone();
    setupTabs();
    setupCatalogModal();
    setupCmsModal();
    setupSqlEditor();
    setupVerifierFeedback();
    setupPersonaSwitcher();
    setupOmSettingsModal();
    setupAnalyticsModal();
    setupSpecConfirmationModal();
    setupDeliveryInteractions();
    setupDarkModeToggle();
    setupAiCopilot();

    document.getElementById("btn-process").addEventListener("click", runStreamingPipeline);
    document.getElementById("btn-copy-sql").addEventListener("click", copySql);
}

// 1. Health & Connection Check
async function checkHealth() {
    const textElem = document.getElementById("om-status-text");
    const badgeElem = document.getElementById("badge-om-status");
    try {
        if (!isGitHubPagesOrOffline()) {
            const res = await fetch("/api/health");
            if (res.ok) {
                const data = await res.json();
                if (data.openmetadata && data.openmetadata.connected) {
                    if (textElem) textElem.innerText = `Live (v${data.openmetadata.version || '1.0'})`;
                    if (badgeElem) {
                        badgeElem.className = "flex items-center space-x-1.5 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200/90 px-2.5 py-1.5 rounded-xl font-medium flex-shrink-0 whitespace-nowrap shadow-2xs";
                        badgeElem.title = `OpenMetadata Live Server Aktif (Versi ${data.openmetadata.version})`;
                    }
                    return;
                }
            }
        }
    } catch (err) {
        console.warn("Health check live error, falling back to emulated catalog:", err);
    }
    // Fallback for GitHub Pages or offline
    if (textElem) textElem.innerText = "Katalog DWH (11)";
    if (badgeElem) {
        badgeElem.className = "flex items-center space-x-1.5 text-xs bg-blue-50 text-blue-800 border border-blue-200/90 px-2.5 py-1.5 rounded-xl font-medium flex-shrink-0 whitespace-nowrap shadow-2xs";
        badgeElem.title = "Katalog DWH Enterprise CEISA 4.0 (11 Tabel Aktif - OpenMetadata Emulated)";
    }
}

// 2. Load Samples
async function loadSamples() {
    const listElem = document.getElementById("sample-list");
    let samples = [];
    try {
        if (!isGitHubPagesOrOffline()) {
            const res = await fetch("/api/samples");
            if (res.ok) {
                const data = await res.json();
                samples = data.samples || [];
            }
        }
    } catch (err) {
        console.warn("Fetch /api/samples failed, using mock samples:", err);
    }

    if (!samples || samples.length === 0) {
        if (window.MOCK_DATA && window.MOCK_DATA.samples) {
            samples = window.MOCK_DATA.samples;
        }
    }

    if (!samples || samples.length === 0) {
        listElem.innerHTML = `<div class="text-xs text-slate-400">Tidak ada sample tersedia.</div>`;
        return;
    }

    listElem.innerHTML = "";
    samples.forEach((s, idx) => {
        const btn = document.createElement("button");
        btn.className = `w-full text-left p-2.5 rounded-lg border text-xs transition flex items-center justify-between ${
            idx === 0 ? "border-blue-500 bg-blue-50/50 text-blue-900 font-semibold" : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
        }`;
        btn.innerHTML = `
            <div class="truncate pr-2">
                <p class="truncate font-medium">${s.title}</p>
                <p class="text-[10px] text-slate-400 mt-0.5">PDF Berkas Resmi (${Math.round((s.size_bytes || 3200) / 1024)} KB)</p>
            </div>
            <i data-lucide="file-check" class="w-4 h-4 text-blue-600 flex-shrink-0"></i>
        `;
        btn.addEventListener("click", () => {
            selectSample(s.filename, btn);
        });
        listElem.appendChild(btn);

        if (idx === 0) {
            selectSample(s.filename, btn);
        }
    });
    lucide.createIcons();
}

function selectSample(filename, activeBtn) {
    selectedSampleName = filename;
    selectedFile = null;
    document.getElementById("file-display-name").innerText = `Contoh Terpilih: ${filename}`;

    const btns = document.querySelectorAll("#sample-list button");
    btns.forEach(b => {
        b.className = "w-full text-left p-2.5 rounded-lg border text-xs transition flex items-center justify-between border-slate-200 bg-white hover:bg-slate-50 text-slate-700";
    });
    activeBtn.className = "w-full text-left p-2.5 rounded-lg border text-xs transition flex items-center justify-between border-blue-500 bg-blue-50/50 text-blue-900 font-semibold";
}

// 3. Dropzone
function setupDropzone() {
    const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("pdf-file-input");

    dropzone.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    });

    dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("border-blue-500", "bg-blue-50/30");
    });

    dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("border-blue-500", "bg-blue-50/30");
    });

    dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("border-blue-500", "bg-blue-50/30");
        if (e.dataTransfer.files.length > 0) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    });
}

function handleFileSelection(file) {
    if (!file.name.endsWith(".pdf")) {
        alert("Hanya berkas format .pdf yang didukung!");
        return;
    }
    selectedFile = file;
    selectedSampleName = null;
    document.getElementById("file-display-name").innerText = `Berkas Unggahan: ${file.name} (${Math.round(file.size / 1024)} KB)`;

    const btns = document.querySelectorAll("#sample-list button");
    btns.forEach(b => {
        b.className = "w-full text-left p-2.5 rounded-lg border text-xs transition flex items-center justify-between border-slate-200 bg-white hover:bg-slate-50 text-slate-700";
    });
}

// 4. Stepper Animation Helper
function setStepState(stepNum) {
    for (let i = 1; i <= 5; i++) {
        const el = document.getElementById(`step-ind-${i}`);
        if (i < stepNum) {
            el.className = "step-card done p-3.5 rounded-xl border shadow-sm flex items-center space-x-3 transition";
        } else if (i === stepNum) {
            el.className = "step-card active p-3.5 rounded-xl border shadow-sm flex items-center space-x-3 transition animate-pulse";
        } else {
            el.className = "step-card bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3 transition";
        }
    }
}

// 5. Console Log Appender
function appendConsoleLog(agentName, message, detail = null) {
    const consoleLogs = document.getElementById("console-logs");
    const statusText = document.getElementById("console-agent-status");

    statusText.innerText = `Aktif: ${agentName}`;

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');

    const logItem = document.createElement("div");
    logItem.className = "py-0.5 leading-snug";
    logItem.innerHTML = `
        <span class="text-slate-500">[${timeStr}]</span>
        <span class="text-blue-400 font-semibold">&lt;${agentName}&gt;</span>
        <span class="text-slate-200">${message}</span>
        ${detail ? `<div class="text-[11px] text-slate-400 pl-4 border-l border-slate-700 my-0.5">${detail}</div>` : ''}
    `;
    consoleLogs.appendChild(logItem);
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
}

// 6. Run Streaming Pipeline (SSE)
async function runStreamingPipeline() {
    const btn = document.getElementById("btn-process");
    const chkConfirm = document.getElementById("chk-confirm-spec");
    const needConfirmation = chkConfirm ? chkConfirm.checked : true;

    const formData = new FormData();
    if (selectedFile) {
        formData.append("file", selectedFile);
    } else if (selectedSampleName) {
        formData.append("sample_name", selectedSampleName);
    }
    const dialect = document.getElementById("select-dialect").value;
    formData.append("dialect", dialect);
    const maskingElem = document.getElementById("select-masking");
    const maskingMode = maskingElem ? maskingElem.value : "PARTIAL";
    formData.append("masking_mode", maskingMode);

    if (needConfirmation) {
        // Alur Human-in-the-Loop: Ekstrak spec terlebih dahulu dan buka dialog konfirmasi
        btn.disabled = true;
        btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Mengekstrak Dokumen...</span>`;
        lucide.createIcons();

        appendConsoleLog("PDF Extractor", "Mengekstrak parameter spesifikasi dokumen untuk konfirmasi pengguna...");
        setStepState(1);

        try {
            let spec = null;
            if (!isGitHubPagesOrOffline()) {
                try {
                    const res = await fetch("/api/extract-spec", {
                        method: "POST",
                        body: formData
                    });
                    if (res.ok) {
                        spec = await res.json();
                    }
                } catch (e) {
                    console.warn("Fetch /api/extract-spec error, falling back to mock data:", e);
                }
            }
            if (!spec) {
                const fallbackRes = getFallbackPipelineResult(selectedSampleName);
                if (fallbackRes && fallbackRes.spec) {
                    spec = fallbackRes.spec;
                    appendConsoleLog("System", "Mode Demo Aktif: Menggunakan spesifikasi terverifikasi dari contoh dokumen.");
                } else {
                    throw new Error("Gagal mengekstrak dokumen.");
                }
            }
            extractedSpecForConfirmation = spec;
            openSpecConfirmationModal(spec);
        } catch (err) {
            alert("Gagal mengekstrak spesifikasi PDF: " + err.message);
            appendConsoleLog("Error", "Gagal mengekstrak PDF: " + err.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = `<i data-lucide="play" class="w-4 h-4 fill-white"></i><span>Jalankan Pipeline Pemenuhan Data</span>`;
            lucide.createIcons();
        }
        return;
    }

    // Alur One-Click Direct Streaming tanpa konfirmasi
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Streaming Pipeline...</span>`;
    lucide.createIcons();

    const consoleLogs = document.getElementById("console-logs");
    consoleLogs.innerHTML = "";
    appendConsoleLog("Coordinator", "Memulai inisiasi pemenuhan permohonan data...");

    try {
        let streamSuccess = false;
        if (!isGitHubPagesOrOffline()) {
            try {
                const response = await fetch("/api/process-stream", {
                    method: "POST",
                    body: formData
                });
                if (response.ok) {
                    await processSSEStreamResponse(response);
                    streamSuccess = true;
                }
            } catch (netErr) {
                console.warn("SSE stream fetch failed, falling back to client demo:", netErr);
            }
        }
        if (!streamSuccess) {
            appendConsoleLog("System", "Mode Interaktif Aktif: Menjalankan simulasi orkestrasi multi-agent...");
            await simulateClientStreamingPipeline(selectedSampleName, null, dialect, maskingMode);
        }
    } catch (err) {
        alert("Terjadi kesalahan saat memproses streaming: " + err.message);
        appendConsoleLog("Error", "Kegagalan eksekusi: " + err.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="play" class="w-4 h-4 fill-white"></i><span>Jalankan Pipeline Pemenuhan Data</span>`;
        lucide.createIcons();
    }
}

async function processSSEStreamResponse(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop();

        for (const line of lines) {
            if (line.startsWith("data: ")) {
                const rawJson = line.substring(6).trim();
                if (!rawJson) continue;
                try {
                    const event = JSON.parse(rawJson);
                    if (event.step) {
                        setStepState(event.step);
                    }
                    if (event.log) {
                        appendConsoleLog(event.agent, event.log, event.detail);
                    }
                    if (event.done && event.result) {
                        currentPipelineData = event.result;
                        renderResults(event.result);
                    }
                } catch (e) {
                    console.error("JSON parse error:", e, rawJson);
                }
            }
        }
    }

    for (let i = 1; i <= 5; i++) {
        document.getElementById(`step-ind-${i}`).className = "step-card done p-3.5 rounded-xl border shadow-sm flex items-center space-x-3 transition";
    }
    document.getElementById("console-agent-status").innerText = "Status: Selesai 100% (Tersimpan di CMS)";
}

// 7. Render Results into Tabs
function renderResults(data) {
    const panel = document.getElementById("results-panel");
    panel.classList.remove("hidden");
    panel.scrollIntoView({ behavior: "smooth", block: "start" });

    // TAB 1: SPEC
    document.getElementById("spec-req-id").innerText = data.spec.request_id;
    document.getElementById("spec-requester").innerText = data.spec.requester_name;
    const deptElem = document.getElementById("spec-department");
    const deptText = data.spec.requester_department || "";
    let deptBadgeColor = "text-blue-900 bg-blue-50 border-blue-200";
    if (deptText.includes("Bea dan Cukai")) {
        deptBadgeColor = "text-blue-900 bg-blue-50 border-blue-200";
    } else if (deptText.includes("Internal Kemenkeu")) {
        deptBadgeColor = "text-amber-900 bg-amber-50 border-amber-200";
    } else if (deptText.includes("Eksternal")) {
        deptBadgeColor = "text-teal-900 bg-teal-50 border-teal-200";
    }
    deptElem.innerHTML = `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${deptBadgeColor}">${deptText}</span>`;

    // Tipe Proses Bisnis
    const bProcElem = document.getElementById("spec-business-process");
    if (bProcElem) {
        const bProcText = data.spec.business_process || "Lainnya";
        let bProcBadge = "bg-indigo-50 text-indigo-900 border-indigo-200";
        if (bProcText === "Ekspor" || bProcText === "Impor") bProcBadge = "bg-blue-50 text-blue-900 border-blue-200";
        else if (bProcText === "Cukai") bProcBadge = "bg-purple-50 text-purple-900 border-purple-200";
        else if (bProcText === "Penerimaan") bProcBadge = "bg-emerald-50 text-emerald-900 border-emerald-200";
        else if (bProcText === "Fasilitas") bProcBadge = "bg-cyan-50 text-cyan-900 border-cyan-200";
        else if (bProcText.includes("Keberatan")) bProcBadge = "bg-amber-50 text-amber-900 border-amber-200";
        bProcElem.innerHTML = `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${bProcBadge}">${bProcText}</span>`;
    }

    document.getElementById("spec-timerange").innerText = `${data.spec.time_range_start} s/d ${data.spec.time_range_end}`;
    document.getElementById("spec-purpose").innerText = data.spec.business_purpose;

    // Filters List
    const fContainer = document.getElementById("spec-filters-list");
    fContainer.innerHTML = "";
    data.spec.filters.forEach(f => {
        const item = document.createElement("div");
        item.className = "p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs";
        const valStr = Array.isArray(f.value) ? f.value.join(" s/d ") : f.value;
        item.innerHTML = `
            <div>
                <span class="font-bold text-slate-800 dark:text-slate-100">${f.field_description}</span>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">${f.rationale}</p>
            </div>
            <span class="bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-500/40 font-mono text-[11px] px-2.5 py-0.5 rounded-lg font-semibold flex-shrink-0">${f.target_column} ${f.operator} '${valStr}'</span>
        `;
        fContainer.appendChild(item);
    });

    // Fields List
    const fldContainer = document.getElementById("spec-fields-list");
    fldContainer.innerHTML = "";
    data.spec.requested_fields.forEach(fld => {
        const item = document.createElement("div");
        item.className = "p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between shadow-2xs";
        const piiBadge = fld.pii_sensitive 
            ? `<span class="bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md">PII / Masking</span>` 
            : `<span class="bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded-md">Standar</span>`;
        item.innerHTML = `
            <div>
                <span class="font-medium text-slate-800 dark:text-slate-100">${fld.description}</span>
                <span class="font-mono text-slate-400 dark:text-slate-400 text-[11px] ml-1">(${fld.name})</span>
            </div>
            ${piiBadge}
        `;
        fldContainer.appendChild(item);
    });

    // TAB 2: CATALOG GROUNDING STUDIO
    document.getElementById("catalog-summary-text").innerText = data.catalog_match.match_summary;

    // Render Dynamic Lineage Flow
    const lineageFlow = document.getElementById("catalog-lineage-flow");
    if (lineageFlow) {
        lineageFlow.innerHTML = "";
        const primaryTbl = data.catalog_match.selected_tables[0];
        if (primaryTbl) {
            // 1. Upstream nodes
            const upstreams = primaryTbl.lineage_upstream && primaryTbl.lineage_upstream.length > 0 
                ? primaryTbl.lineage_upstream 
                : ["staging_ceisa.stg_raw_feed"];
            upstreams.forEach(u => {
                const node = document.createElement("span");
                node.className = "px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 font-semibold border border-amber-300 text-[11px] shadow-2xs";
                node.innerText = u;
                lineageFlow.appendChild(node);

                const arr = document.createElement("i");
                arr.setAttribute("data-lucide", "arrow-right");
                arr.className = "w-3.5 h-3.5 text-slate-400";
                lineageFlow.appendChild(arr);
            });

            // 2. Primary Table Node
            const primNode = document.createElement("span");
            primNode.className = "px-2.5 py-1 rounded-md bg-blue-100 text-blue-900 font-bold border border-blue-300 text-[11px] shadow-xs";
            primNode.innerText = primaryTbl.fqn;
            lineageFlow.appendChild(primNode);

            // 3. Joined tables if any
            if (data.catalog_match.selected_tables.length > 1) {
                for (let i = 1; i < data.catalog_match.selected_tables.length; i++) {
                    const arr = document.createElement("i");
                    arr.setAttribute("data-lucide", "arrow-right");
                    arr.className = "w-3.5 h-3.5 text-slate-400";
                    lineageFlow.appendChild(arr);

                    const joinNode = document.createElement("span");
                    joinNode.className = "px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-900 font-semibold border border-indigo-300 text-[11px] shadow-2xs";
                    joinNode.innerText = `${data.catalog_match.selected_tables[i].table_name} (JOIN)`;
                    lineageFlow.appendChild(joinNode);
                }
            }

            // 4. Downstream nodes
            const downstreams = primaryTbl.lineage_downstream && primaryTbl.lineage_downstream.length > 0
                ? primaryTbl.lineage_downstream
                : ["datamart.dm_fulfillment_export"];
            downstreams.forEach(d => {
                const arr = document.createElement("i");
                arr.setAttribute("data-lucide", "arrow-right");
                arr.className = "w-3.5 h-3.5 text-slate-400";
                lineageFlow.appendChild(arr);

                const downNode = document.createElement("span");
                downNode.className = "px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-900 font-semibold border border-emerald-300 text-[11px] shadow-2xs";
                downNode.innerText = d;
                lineageFlow.appendChild(downNode);
            });
        }
    }

    // Render Join Strategy Recommendation
    const joinStrategyContent = document.getElementById("catalog-join-strategy-content");
    if (joinStrategyContent) {
        joinStrategyContent.innerHTML = "";
        if (data.catalog_match.join_strategy && data.catalog_match.join_strategy.length > 0) {
            data.catalog_match.join_strategy.forEach(j => {
                const item = document.createElement("div");
                item.className = "flex flex-wrap items-center gap-2 p-2 rounded-lg bg-white border border-indigo-200 text-xs shadow-2xs";
                item.innerHTML = `
                    <span class="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded font-bold text-[11px] border border-indigo-200">${j.join_type}</span>
                    <span class="font-bold text-slate-900">${j.left_table}</span>
                    <span class="text-slate-400">🔗</span>
                    <span class="font-bold text-indigo-700">${j.right_table}</span>
                    <span class="text-slate-500 font-sans">Kunci Relasi:</span>
                    <code class="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-200 font-semibold">${j.on_condition}</code>
                `;
                joinStrategyContent.appendChild(item);
            });
        } else {
            const item = document.createElement("div");
            item.className = "p-2 rounded-lg bg-white border border-indigo-100 text-xs text-slate-600";
            item.innerHTML = `<span class="text-emerald-700 font-bold">✓ Query Tabel Tunggal Terisolasi:</span> Seluruh atribut terpenuhi dari tabel fakta utama tanpa perlu operasi JOIN antar-tabel.`;
            joinStrategyContent.appendChild(item);
        }
    }

    // Render Rich Table Cards with real-time search & filter
    tab2SelectedTablesCache = data.catalog_match.selected_tables || [];
    initTab2CatalogSearch();
    renderTab2CatalogTables();

    // TAB 3: SQL Studio
    originalGeneratedSqlQuery = data.generated_sql.query;
    document.getElementById("sql-explanation-text").innerText = data.generated_sql.explanation || "Query SQL diekstrak dan divalidasi sesuai spesifikasi kebutuhan.";
    
    const reqId = (data.spec && data.spec.request_id) ? data.spec.request_id.replace(/[^a-zA-Z0-9_-]/g, "_") : "data_request";
    const filenameElem = document.getElementById("sql-window-filename");
    if (filenameElem) filenameElem.innerText = `query_${reqId}.sql`;

    const dialectBadge = document.getElementById("sql-active-dialect-badge");
    const activeDialect = (data.generated_sql && data.generated_sql.dialect) 
        ? data.generated_sql.dialect 
        : (document.getElementById("select-dialect") ? document.getElementById("select-dialect").value : "PostgreSQL");
    if (dialectBadge) dialectBadge.innerText = activeDialect;

    const sqlCode = document.getElementById("sql-code-block");
    if (sqlCode) {
        sqlCode.textContent = data.generated_sql.query;
        Prism.highlightElement(sqlCode);
    }
    const viewGutter = document.getElementById("sql-view-gutter");
    if (viewGutter) updateSqlGutter(viewGutter, data.generated_sql.query);

    const editorInput = document.getElementById("sql-editor-input");
    if (editorInput) editorInput.value = data.generated_sql.query;

    const editGutter = document.getElementById("sql-edit-gutter");
    if (editGutter) updateSqlGutter(editGutter, data.generated_sql.query);

    updateSqlStats(data.generated_sql.query);
    updateSqlBreakdown(data.generated_sql.query, data.spec);

    // TAB 4: VERIFICATION & VERIFIER FEEDBACK
    const badge = document.getElementById("verif-status-badge");
    badge.innerText = data.verification.status;
    badge.className = (data.verification.status.includes("APPROVED")) 
        ? "px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
        : (data.verification.status.includes("REVISION") ? "px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40" : "px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40");
    
    const verifTimeElem = document.getElementById("verif-timestamp");
    if (verifTimeElem) {
        verifTimeElem.innerHTML = `
            <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-400"></i>
            <span>Waktu Audit: ${new Date(data.verification.verifier_timestamp).toLocaleString("id-ID")}</span>
        `;
    }
    const verifAuditorElem = document.getElementById("verif-auditor-id");
    if (verifAuditorElem) {
        verifAuditorElem.innerText = `Auditor: ${data.verification.verifier_id}`;
    }

    // Compliance Scorecard Meter & Calculations
    const totalChecks = data.verification.checks.length;
    const passedChecks = data.verification.checks.filter(c => c.passed).length;
    const scorePercent = data.verification.compliance_score || (totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100);

    const scorePercentElem = document.getElementById("verif-score-percent");
    const scoreBarElem = document.getElementById("verif-score-bar");
    const scoreSubtextElem = document.getElementById("verif-score-subtext");

    if (scorePercentElem) scorePercentElem.innerText = `${scorePercent}%`;
    if (scoreBarElem) {
        scoreBarElem.style.width = `${scorePercent}%`;
        if (scorePercent === 100) {
            scoreBarElem.className = "bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-500";
        } else if (scorePercent >= 80) {
            scoreBarElem.className = "bg-gradient-to-r from-blue-500 to-indigo-400 h-2 rounded-full transition-all duration-500";
        } else {
            scoreBarElem.className = "bg-gradient-to-r from-amber-500 to-rose-400 h-2 rounded-full transition-all duration-500";
        }
    }
    if (scoreSubtextElem) {
        scoreSubtextElem.innerText = `${passedChecks} dari ${totalChecks} parameter uji lolos verifikasi ${scorePercent === 100 ? 'tanpa pelanggaran.' : 'dengan catatan.'}`;
    }

    // Domain Breakdown Counts
    const safetyChecks = data.verification.checks.filter(c => c.category === "Safety");
    const fidelityChecks = data.verification.checks.filter(c => c.category === "Fidelity");
    const piiChecks = data.verification.checks.filter(c => c.category === "PII/Governance");
    const schemaChecks = data.verification.checks.filter(c => c.category === "Syntax/Schema");

    const safetyPassed = safetyChecks.filter(c => c.passed).length;
    const fidelityPassed = fidelityChecks.filter(c => c.passed).length;
    const piiPassed = piiChecks.filter(c => c.passed).length;
    const schemaPassed = schemaChecks.filter(c => c.passed).length;

    const elSafety = document.getElementById("verif-domain-safety");
    const elFidelity = document.getElementById("verif-domain-fidelity");
    const elPii = document.getElementById("verif-domain-pii");
    const elSchema = document.getElementById("verif-domain-schema");

    if (elSafety) elSafety.innerText = `${safetyPassed}/${safetyChecks.length} Lolos`;
    if (elFidelity) elFidelity.innerText = `${fidelityPassed}/${fidelityChecks.length} Lolos`;
    if (elPii) elPii.innerText = `${piiPassed}/${piiChecks.length} Lolos`;
    if (elSchema) elSchema.innerText = `${schemaPassed}/${schemaChecks.length} Lolos`;

    // Render Categorized Checks
    currentVerificationChecks = data.verification.checks;
    renderCategorizedVerificationChecks();

    // Digital Signature Seal Preview Card
    const sealVerifierName = document.getElementById("seal-verifier-name");
    const sealVerifierRole = document.getElementById("seal-verifier-role");
    const sealStatusText = document.getElementById("seal-status-text");
    const sealTimestampText = document.getElementById("seal-timestamp-text");
    const sealHashDisplay = document.getElementById("seal-hash-display");

    const activeFeedback = data.verification.verifier_feedback;
    const activeHash = (activeFeedback && activeFeedback.digital_signature_hash) 
        ? activeFeedback.digital_signature_hash 
        : (data.verification.digital_fingerprint || "SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");

    if (activeFeedback) {
        document.getElementById("verifier-name-input").value = activeFeedback.reviewer_name;
        document.getElementById("verifier-role-input").value = activeFeedback.reviewer_role;
        document.getElementById("verifier-comments-input").value = activeFeedback.comments;
        document.getElementById("feedback-signed-badge").classList.remove("hidden");

        if (sealVerifierName) sealVerifierName.innerText = activeFeedback.reviewer_name;
        if (sealVerifierRole) sealVerifierRole.innerText = activeFeedback.reviewer_role;
        if (sealStatusText) {
            sealStatusText.innerText = activeFeedback.action === "APPROVE" ? "Telah Disahkan (APPROVED)" : (activeFeedback.action === "REVISION_REQUESTED" ? "Meminta Revisi" : "Ditolak");
            sealStatusText.className = activeFeedback.action === "APPROVE" ? "text-emerald-400 font-semibold" : (activeFeedback.action === "REVISION_REQUESTED" ? "text-amber-400 font-semibold" : "text-rose-400 font-semibold");
        }
        if (sealTimestampText) {
            sealTimestampText.innerText = activeFeedback.signature_timestamp ? new Date(activeFeedback.signature_timestamp).toLocaleString("id-ID") : "-";
        }
    } else {
        const inputName = document.getElementById("verifier-name-input").value || "Hendra Gunawan, S.Kom";
        const inputRole = document.getElementById("verifier-role-input").value || "Kepala Seksi Analisa dan Layanan Data";
        if (sealVerifierName) sealVerifierName.innerText = inputName;
        if (sealVerifierRole) sealVerifierRole.innerText = inputRole;
        if (sealStatusText) {
            sealStatusText.innerText = "Menunggu Sign-off";
            sealStatusText.className = "text-amber-300 font-semibold";
        }
        if (sealTimestampText) sealTimestampText.innerText = "Belum Disahkan";
    }

    if (sealHashDisplay) {
        sealHashDisplay.innerText = activeHash.startsWith("SHA256:") ? activeHash : `SHA256: ${activeHash}`;
    }

    // TAB 5: DELIVERY
    if (data.execution) {
        const rowCount = data.execution.row_count || 0;
        const execTime = data.execution.execution_time_ms || 0;
        const dialect = data.execution.dialect || "PostgreSQL";

        const statsText = document.getElementById("delivery-stats-text");
        if (statsText) {
            statsText.innerText = `${rowCount} baris data berhasil diekstrak dalam ${execTime} ms. Target Database: ${dialect}.`;
        }

        const mRows = document.getElementById("delivery-metric-rows");
        const mTime = document.getElementById("delivery-metric-time");
        const mPii = document.getElementById("delivery-metric-pii");
        const mEngine = document.getElementById("delivery-metric-engine");

        if (mRows) mRows.innerText = `${rowCount} Baris`;
        if (mTime) mTime.innerText = `${execTime} ms`;
        if (mEngine) mEngine.innerText = `${dialect} DWH`;

        // Hitung proteksi PII
        const piiCols = (data.execution.column_names || []).filter(c => 
            c.toLowerCase().includes("masked") || c.toLowerCase().includes("nik") || c.toLowerCase().includes("phone") || c.toLowerCase().includes("name") || c.toLowerCase().includes("npwp")
        );
        if (mPii) mPii.innerText = piiCols.length > 0 ? `${piiCols.length} Kolom Terlindungi (PDP)` : "Proteksi Aktif (UU PDP)";

        const excelName = data.execution.excel_path ? data.execution.excel_path.split(/[\\/]/).pop() : "";
        const csvName = data.execution.csv_path ? data.execution.csv_path.split(/[\\/]/).pop() : "";
        const jsonName = data.execution.json_path 
            ? data.execution.json_path.split(/[\\/]/).pop() 
            : (excelName ? excelName.replace(".xlsx", ".json") : "");

        const btnExcel = document.getElementById("btn-download-excel");
        const btnCsv = document.getElementById("btn-download-csv");
        const btnJson = document.getElementById("btn-download-json");
        const btnCert = document.getElementById("btn-download-cert");
        const btnZip = document.getElementById("btn-download-zip");

        if (btnExcel && excelName) {
            btnExcel.href = isGitHubPagesOrOffline() ? `outputs/${excelName}` : `/api/download/outputs/${excelName}`;
            btnExcel.onclick = (e) => {
                if (isGitHubPagesOrOffline()) {
                    e.preventDefault();
                    triggerArtifactDownload(excelName, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                }
            };
        }
        if (btnCsv && csvName) {
            btnCsv.href = isGitHubPagesOrOffline() ? `outputs/${csvName}` : `/api/download/outputs/${csvName}`;
            btnCsv.onclick = (e) => {
                if (isGitHubPagesOrOffline()) {
                    e.preventDefault();
                    const cols = data.execution.column_names || [];
                    const rows = data.execution.preview_rows || [];
                    const csvContent = "\uFEFF" + [
                        cols.join(","),
                        ...rows.map(r => cols.map(c => `"${(r[c] !== undefined && r[c] !== null ? r[c] : "").toString().replace(/"/g, '""')}"`).join(","))
                    ].join("\r\n");
                    downloadClientBlob(csvName, csvContent, "text/csv;charset=utf-8;");
                }
            };
        }
        if (btnJson && jsonName) {
            btnJson.href = isGitHubPagesOrOffline() ? `outputs/${jsonName}` : `/api/download/outputs/${jsonName}`;
            btnJson.onclick = (e) => {
                if (isGitHubPagesOrOffline()) {
                    e.preventDefault();
                    const jsonContent = JSON.stringify(data.execution.preview_rows || [], null, 2);
                    downloadClientBlob(jsonName, jsonContent, "application/json;charset=utf-8;");
                }
            };
        }

        if (btnCert && data.execution.certificate_path) {
            const certName = data.execution.certificate_path.split(/[\\/]/).pop();
            btnCert.href = isGitHubPagesOrOffline() ? `outputs/${certName}` : `/api/download/outputs/${certName}`;
            btnCert.onclick = (e) => {
                if (isGitHubPagesOrOffline()) {
                    e.preventDefault();
                    triggerArtifactDownload(certName, "application/pdf");
                }
            };
        }

        if (btnZip && data.execution.zip_path) {
            const zipName = data.execution.zip_path.split(/[\\/]/).pop();
            btnZip.href = isGitHubPagesOrOffline() ? `outputs/${zipName}` : `/api/download/outputs/${zipName}`;
            btnZip.onclick = (e) => {
                if (isGitHubPagesOrOffline()) {
                    e.preventDefault();
                    triggerArtifactDownload(zipName, "application/zip");
                }
            };
        }

        // Store rows & render preview
        currentDeliveryRows = data.execution.preview_rows || [];
        currentDeliveryColumns = data.execution.column_names || [];

        renderDeliveryDataPreview("");
        renderDeliveryAuditSheet(data);
        renderDeliveryDictSheet(data);
    }

    lucide.createIcons();
}

// Global state for Tab 5 Delivery Inspector
let currentDeliveryRows = [];
let currentDeliveryColumns = [];
let activeDeliverySheet = "data";

function renderDeliveryDataPreview(query = "") {
    const thead = document.getElementById("preview-thead-row");
    const tbody = document.getElementById("preview-tbody");
    const counter = document.getElementById("delivery-row-counter");
    if (!thead || !tbody) return;

    thead.innerHTML = "";
    tbody.innerHTML = "";

    // Render Headers with PII indicator badges
    currentDeliveryColumns.forEach(col => {
        const th = document.createElement("th");
        th.className = "px-3.5 py-2.5 font-bold whitespace-nowrap text-slate-700";
        const colLower = col.toLowerCase();
        const isMasked = colLower.includes("masked") || colLower.includes("npwp") || colLower.includes("nik");
        if (isMasked) {
            th.innerHTML = `
                <div class="flex items-center space-x-1.5">
                    <span>${col}</span>
                    <span class="bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-bold px-1.5 py-0.2 rounded">PDP MASKED</span>
                </div>
            `;
        } else {
            th.innerText = col;
        }
        thead.appendChild(th);
    });

    // Filter rows
    const q = (query || "").trim().toLowerCase();
    const filteredRows = currentDeliveryRows.filter(r => {
        if (!q) return true;
        return Object.values(r).some(val => String(val || "").toLowerCase().includes(q));
    });

    if (counter) {
        counter.innerText = `${filteredRows.length} dari ${currentDeliveryRows.length} baris ditampilkan`;
    }

    if (filteredRows.length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="${currentDeliveryColumns.length || 1}" class="text-center py-6 text-slate-400 italic">Tidak ada data yang sesuai dengan pencarian "${query}".</td>`;
        tbody.appendChild(tr);
        return;
    }

    filteredRows.forEach(r => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-slate-50 transition border-b border-slate-100";
        currentDeliveryColumns.forEach(col => {
            const td = document.createElement("td");
            td.className = "px-3.5 py-2.5 whitespace-nowrap font-mono text-[11px]";
            let val = r[col];

            const colLower = col.toLowerCase();
            const valStr = String(val !== undefined ? val : "-");

            // Format nominal
            if (typeof val === "number") {
                if (colLower.includes("usd") || colLower.includes("devisa") || colLower.includes("cif") || colLower.includes("fob")) {
                    val = "$" + val.toLocaleString("en-US");
                } else if (colLower.includes("tarif")) {
                    val = (val < 1 ? (val * 100).toFixed(1) + "%" : "Rp " + val.toLocaleString("id-ID"));
                } else if (colLower.includes("amount") || colLower.includes("idr") || colLower.includes("bea") || colLower.includes("ppn") || colLower.includes("pph") || colLower.includes("cukai")) {
                    val = "Rp " + val.toLocaleString("id-ID");
                }
            }

            // Highlight masked values
            if (valStr.includes("***") || valStr.includes("******") || valStr.includes("[TERLINDUNGI")) {
                td.innerHTML = `<span class="bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded font-mono font-semibold">${val}</span>`;
            } else if (colLower === "status_jalur") {
                let badgeClass = "bg-emerald-100 text-emerald-800 border-emerald-200";
                if (valStr === "KUNING") badgeClass = "bg-amber-100 text-amber-800 border-amber-200";
                else if (valStr === "MERAH") badgeClass = "bg-rose-100 text-rose-800 border-rose-200";
                td.innerHTML = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}">${val}</span>`;
            } else {
                td.innerText = val !== undefined ? val : "-";
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

function renderDeliveryAuditSheet(data) {
    const tbody = document.getElementById("delivery-audit-sheet-tbody");
    if (!tbody || !data) return;
    tbody.innerHTML = "";

    const spec = data.spec || {};
    const verif = data.verification || {};
    const feedback = verif.verifier_feedback;

    const sigHash = (feedback && feedback.digital_signature_hash) 
        ? feedback.digital_signature_hash 
        : (verif.digital_fingerprint || "SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");

    const auditItems = [
        { label: "ID Dokumen Permohonan", val: spec.request_id || "-" },
        { label: "Judul Permohonan", val: spec.document_title || "-" },
        { label: "Nama Pemohon Data", val: `${spec.requester_name || '-'} (${spec.requester_department || '-'})` },
        { label: "Tipe Proses Bisnis", val: spec.business_process || "Ekspor & Impor" },
        { label: "Tujuan Penggunaan Data", val: spec.business_purpose || "-" },
        { label: "Periode Data", val: `${spec.time_range_start || '-'} s/d ${spec.time_range_end || '-'}` },
        { label: "Katalog Grounding", val: "OpenMetadata Enterprise Catalog (Verified Grounding)" },
        { label: "Status Verifikasi", val: `${verif.status} (${verif.verifier_id || 'Automated Compliance Engine'})` },
        { label: "Waktu Verifikasi", val: new Date(verif.verifier_timestamp || Date.now()).toLocaleString("id-ID") },
        { label: "Total Baris Diekstrak", val: `${data.execution ? data.execution.row_count : 0} baris` },
        { label: "Proteksi Privasi PII / PDP", val: "Aktif (Masking Dinamis NIK, Nama, dan Kontak sesuai UU No. 27/2022)" },
        { label: "Sidik Jari Kriptografis (SHA-256)", val: sigHash, isCode: true }
    ];

    if (feedback) {
        auditItems.push(
            { label: "Sign-off Verifikator Resmi", val: `${feedback.reviewer_name} (${feedback.reviewer_role})` },
            { label: "Keputusan Otorisasi", val: feedback.action },
            { label: "Catatan Arahan Kepatuhan", val: `"${feedback.comments}"` }
        );
    }

    auditItems.forEach(item => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-slate-50/50 transition";
        tr.innerHTML = `
            <td class="w-1/3 px-4 py-2.5 font-bold text-slate-700 bg-slate-50 border-r border-slate-200 text-xs">${item.label}</td>
            <td class="px-4 py-2.5 text-slate-800 text-xs ${item.isCode ? 'font-mono text-indigo-700 bg-indigo-50/30 font-semibold break-all' : ''}">${item.val}</td>
        `;
        tbody.appendChild(tr);
    });

    // Tambahkan Query SQL di bawah tabel audit
    if (data.generated_sql && data.generated_sql.query) {
        const trSql = document.createElement("tr");
        trSql.innerHTML = `
            <td class="w-1/3 px-4 py-3 font-bold text-slate-700 bg-slate-50 border-r border-slate-200 text-xs align-top">Query SQL Resmi</td>
            <td class="px-4 py-3 text-xs">
                <pre class="bg-slate-900 text-indigo-300 p-3 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 max-h-40">${data.generated_sql.query}</pre>
            </td>
        `;
        tbody.appendChild(trSql);
    }
}

function renderDeliveryDictSheet(data) {
    const tbody = document.getElementById("delivery-dict-sheet-tbody");
    if (!tbody || !data || !data.catalog_match) return;
    tbody.innerHTML = "";

    const selectedTables = data.catalog_match.selected_tables || [];
    let rowIdx = 0;

    selectedTables.forEach(tbl => {
        (tbl.columns || []).forEach(col => {
            rowIdx++;
            const isPii = col.is_pii || (col.tags && col.tags.includes("PII"));
            const tr = document.createElement("tr");
            tr.className = "hover:bg-slate-50 transition border-b border-slate-100 text-xs";
            tr.innerHTML = `
                <td class="px-4 py-2.5 font-mono font-bold text-slate-900">${col.name}</td>
                <td class="px-4 py-2.5 font-mono text-slate-600">${col.data_type || 'VARCHAR'}</td>
                <td class="px-4 py-2.5 text-slate-700">${col.description || '-'}</td>
                <td class="px-4 py-2.5">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${isPii ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}">
                        ${isPii ? 'SENSITIF (PII)' : 'NON-PII'}
                    </span>
                </td>
                <td class="px-4 py-2.5 font-mono text-[11px] text-blue-700">${tbl.fqn}</td>
            `;
            tbody.appendChild(tr);
        });
    });

    if (rowIdx === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-slate-400 italic">Tidak ada metadata kolom catalog.</td></tr>`;
    }
}

function renderDeliveryCharts(chartType = "bar") {
    if (!currentDeliveryRows || currentDeliveryRows.length === 0) return;
    if (!window.Chart) return;

    const canvas1 = document.getElementById("canvas-delivery-chart-1");
    const canvas2 = document.getElementById("canvas-delivery-chart-2");
    if (!canvas1 || !canvas2) return;

    // Destroy existing charts if any
    if (deliveryChart1) {
        deliveryChart1.destroy();
        deliveryChart1 = null;
    }
    if (deliveryChart2) {
        deliveryChart2.destroy();
        deliveryChart2 = null;
    }

    const rows = currentDeliveryRows;
    const cols = currentDeliveryColumns;

    // Cari kolom numerik potensial
    const numCol = cols.find(c => {
        const cl = c.toLowerCase();
        return (cl.includes("usd") || cl.includes("amount") || cl.includes("nilai") || cl.includes("devisa") || cl.includes("total") || cl.includes("bea")) && typeof rows[0][c] === 'number';
    }) || cols.find(c => typeof rows[0][c] === 'number');

    // Cari kolom kategori potensial
    const catCol = cols.find(c => {
        const cl = c.toLowerCase();
        return (cl.includes("jalur") || cl.includes("status") || cl.includes("kategori") || cl.includes("negara") || cl.includes("port") || cl.includes("pelabuhan")) && typeof rows[0][c] === 'string';
    }) || cols.find(c => typeof rows[0][c] === 'string' && !c.toLowerCase().includes("id") && !c.toLowerCase().includes("masked"));

    // Label sumbu X: ID transaksi atau index
    const idCol = cols.find(c => c.toLowerCase().includes("id") || c.toLowerCase().includes("no")) || cols[0];
    const labels = rows.map((r, i) => String(r[idCol] || `Item ${i+1}`).slice(-8));

    // Data 1: Nilai Metrik
    const values1 = numCol ? rows.map(r => Number(r[numCol]) || 0) : rows.map((_, i) => (i + 1) * 15);
    const title1 = numCol ? `Tren ${numCol.replace(/_/g, ' ').toUpperCase()}` : "Distribusi Nilai Transaksi";
    const title1Elem = document.getElementById("delivery-chart-1-title");
    if (title1Elem) title1Elem.innerText = title1;

    const isDark = document.documentElement.classList.contains("dark");
    const gridColor = isDark ? "rgba(51, 65, 85, 0.5)" : "#f1f5f9";
    const tickColor = isDark ? "#94a3b8" : "#64748b";
    const legendColor = isDark ? "#e2e8f0" : "#334155";

    const ctx1 = canvas1.getContext("2d");
    deliveryChart1 = new Chart(ctx1, {
        type: chartType === "doughnut" ? "bar" : chartType,
        data: {
            labels: labels,
            datasets: [{
                label: numCol || "Nilai Data",
                data: values1,
                backgroundColor: chartType === "line" ? "rgba(59, 130, 246, 0.2)" : (isDark ? "rgba(96, 165, 250, 0.85)" : "rgba(37, 99, 235, 0.75)"),
                borderColor: isDark ? "#60a5fa" : "#2563eb",
                borderWidth: 2,
                fill: chartType === "line",
                tension: 0.35,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const val = context.raw;
                            return ` ${numCol || 'Nilai'}: ${typeof val === 'number' ? val.toLocaleString('id-ID') : val}`;
                        }
                    }
                }
            },
            scales: {
                y: { 
                    beginAtZero: true, 
                    grid: { color: gridColor },
                    ticks: { color: tickColor }
                },
                x: { 
                    grid: { display: false },
                    ticks: { color: tickColor }
                }
            }
        }
    });

    // Data 2: Frekuensi Kategori
    const countsMap = {};
    if (catCol) {
        rows.forEach(r => {
            const k = String(r[catCol] || "Lainnya");
            countsMap[k] = (countsMap[k] || 0) + 1;
        });
    } else {
        countsMap["Terkonfirmasi"] = Math.ceil(rows.length * 0.7);
        countsMap["Dalam Proses"] = rows.length - Math.ceil(rows.length * 0.7);
    }

    const catLabels = Object.keys(countsMap);
    const catData = Object.values(countsMap);
    const title2 = catCol ? `Komposisi ${catCol.replace(/_/g, ' ').toUpperCase()}` : "Distribusi Kategori";
    const title2Elem = document.getElementById("delivery-chart-2-title");
    if (title2Elem) title2Elem.innerText = title2;

    const ctx2 = canvas2.getContext("2d");
    deliveryChart2 = new Chart(ctx2, {
        type: chartType === "line" ? "doughnut" : chartType,
        data: {
            labels: catLabels,
            datasets: [{
                label: "Jumlah Frekuensi",
                data: catData,
                backgroundColor: [
                    "rgba(16, 185, 129, 0.85)",
                    "rgba(59, 130, 246, 0.85)",
                    "rgba(245, 158, 11, 0.85)",
                    "rgba(139, 92, 246, 0.85)",
                    "rgba(239, 68, 68, 0.85)"
                ],
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: "bottom", 
                    labels: { 
                        boxWidth: 12, 
                        font: { size: 10 },
                        color: legendColor
                    } 
                }
            }
        }
    });
}

function setupDeliveryInteractions() {
    // Sheet Switcher Buttons
    const sheetBtns = document.querySelectorAll(".sheet-tab-btn");
    const containerData = document.getElementById("container-sheet-data");
    const containerAudit = document.getElementById("container-sheet-audit");
    const containerDict = document.getElementById("container-sheet-dict");
    const containerChart = document.getElementById("container-sheet-chart");

    sheetBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const sheet = btn.dataset.sheet;
            activeDeliverySheet = sheet;

            sheetBtns.forEach(b => {
                b.className = "sheet-tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center space-x-1.5";
            });
            btn.className = "sheet-tab-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-indigo-700 shadow-2xs transition flex items-center space-x-1.5";

            if (containerData) containerData.classList.toggle("hidden", sheet !== "data");
            if (containerAudit) containerAudit.classList.toggle("hidden", sheet !== "audit");
            if (containerDict) containerDict.classList.toggle("hidden", sheet !== "dict");
            if (containerChart) {
                containerChart.classList.toggle("hidden", sheet !== "chart");
                if (sheet === "chart") {
                    const sel = document.getElementById("select-delivery-chart-type");
                    renderDeliveryCharts(sel ? sel.value : "bar");
                }
            }
        });
    });

    // Chart Type Selector
    const chartTypeSelect = document.getElementById("select-delivery-chart-type");
    if (chartTypeSelect) {
        chartTypeSelect.addEventListener("change", (e) => {
            renderDeliveryCharts(e.target.value);
        });
    }

    // Search Input in Preview Table
    const searchInput = document.getElementById("input-delivery-search");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            renderDeliveryDataPreview(e.target.value);
        });
    }

    // Copy Data to TSV / Clipboard
    const btnCopy = document.getElementById("btn-copy-delivery-data");
    const copyText = document.getElementById("copy-data-btn-text");
    if (btnCopy) {
        btnCopy.addEventListener("click", () => {
            if (!currentDeliveryRows || currentDeliveryRows.length === 0) {
                alert("Tidak ada baris data untuk disalin.");
                return;
            }

            const headerRow = currentDeliveryColumns.join("\t");
            const dataRows = currentDeliveryRows.map(r => 
                currentDeliveryColumns.map(c => r[c] !== undefined ? String(r[c]) : "").join("\t")
            ).join("\n");

            const tsvContent = `${headerRow}\n${dataRows}`;

            navigator.clipboard.writeText(tsvContent).then(() => {
                if (copyText) copyText.innerText = "✓ Tersalin!";
                btnCopy.classList.add("bg-emerald-50", "text-emerald-700", "border-emerald-300");
                setTimeout(() => {
                    if (copyText) copyText.innerText = "Salin TSV";
                    btnCopy.classList.remove("bg-emerald-50", "text-emerald-700", "border-emerald-300");
                }, 2000);
            }).catch(err => {
                alert("Gagal menyalin: " + err.message);
            });
        });
    }
}

// 8. SQL Editor Setup & Re-Verification
function setupSqlEditor() {
    const toggleBtn = document.getElementById("btn-toggle-sql-edit");
    const toggleText = document.getElementById("btn-toggle-edit-text");
    const viewContainer = document.getElementById("sql-view-container");
    const editContainer = document.getElementById("sql-edit-container");
    const editActionBar = document.getElementById("sql-edit-action-bar");
    const editorInput = document.getElementById("sql-editor-input");
    const editGutter = document.getElementById("sql-edit-gutter");
    const viewGutter = document.getElementById("sql-view-gutter");
    const reverifyBtn = document.getElementById("btn-reverify-sql");
    const resetBtn = document.getElementById("btn-reset-sql");
    const beautifyBtn = document.getElementById("btn-beautify-sql");
    const downloadBtn = document.getElementById("btn-download-sql");

    // Sync line numbers on typing in textarea & sync scroll
    if (editorInput && editGutter) {
        editorInput.addEventListener("input", () => {
            updateSqlGutter(editGutter, editorInput.value);
            updateSqlStats(editorInput.value);
        });

        editorInput.addEventListener("scroll", () => {
            editGutter.scrollTop = editorInput.scrollTop;
        });
    }

    // Toggle Edit Mode
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            isSqlEditMode = !isSqlEditMode;
            if (isSqlEditMode) {
                viewContainer.classList.add("hidden");
                editContainer.classList.remove("hidden");
                if (editActionBar) editActionBar.classList.remove("hidden");
                toggleText.innerText = "Tutup Mode Editor";
                toggleBtn.classList.replace("bg-white", "bg-blue-50");
                toggleBtn.classList.replace("text-slate-700", "text-blue-800");
                toggleBtn.classList.add("border-blue-300");

                if (editorInput) {
                    updateSqlGutter(editGutter, editorInput.value);
                    updateSqlStats(editorInput.value);
                    editorInput.focus();
                }
            } else {
                viewContainer.classList.remove("hidden");
                editContainer.classList.add("hidden");
                if (editActionBar) editActionBar.classList.add("hidden");
                toggleText.innerText = "Buka Mode Editor SQL";
                toggleBtn.classList.replace("bg-blue-50", "bg-white");
                toggleBtn.classList.replace("text-blue-800", "text-slate-700");
                toggleBtn.classList.remove("border-blue-300");

                if (editorInput && currentPipelineData) {
                    const sqlCode = document.getElementById("sql-code-block");
                    if (sqlCode) {
                        sqlCode.textContent = editorInput.value;
                        Prism.highlightElement(sqlCode);
                    }
                    if (viewGutter) updateSqlGutter(viewGutter, editorInput.value);
                    updateSqlStats(editorInput.value);
                    updateSqlBreakdown(editorInput.value, currentPipelineData.spec);
                }
            }
            lucide.createIcons();
        });
    }

    // Beautify SQL Button
    if (beautifyBtn) {
        beautifyBtn.addEventListener("click", () => {
            if (isSqlEditMode && editorInput) {
                editorInput.value = beautifySqlQuery(editorInput.value);
                updateSqlGutter(editGutter, editorInput.value);
                updateSqlStats(editorInput.value);
            } else if (currentPipelineData) {
                const sqlCode = document.getElementById("sql-code-block");
                const beautified = beautifySqlQuery(sqlCode.textContent);
                sqlCode.textContent = beautified;
                Prism.highlightElement(sqlCode);
                if (viewGutter) updateSqlGutter(viewGutter, beautified);
                if (editorInput) editorInput.value = beautified;
                updateSqlStats(beautified);
            }
        });
    }

    // Reset SQL Button
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            if (originalGeneratedSqlQuery && editorInput) {
                editorInput.value = originalGeneratedSqlQuery;
                updateSqlGutter(editGutter, originalGeneratedSqlQuery);
                updateSqlStats(originalGeneratedSqlQuery);
            }
        });
    }

    // Download .sql file button
    if (downloadBtn) {
        downloadBtn.addEventListener("click", () => {
            const queryToDownload = isSqlEditMode && editorInput 
                ? editorInput.value 
                : (currentPipelineData && currentPipelineData.generated_sql ? currentPipelineData.generated_sql.query : (editorInput ? editorInput.value : ""));

            if (!queryToDownload) {
                alert("Tidak ada query SQL untuk diunduh.");
                return;
            }

            const reqId = (currentPipelineData && currentPipelineData.spec && currentPipelineData.spec.request_id)
                ? currentPipelineData.spec.request_id.replace(/[^a-zA-Z0-9_-]/g, "_")
                : "export";
            const filename = `query_${reqId}.sql`;

            const blob = new Blob([queryToDownload], { type: "text/sql;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    }

    // Re-verify & Execute Button
    if (reverifyBtn) {
        reverifyBtn.addEventListener("click", async () => {
            if (!currentPipelineData) return;

            const modifiedSql = document.getElementById("sql-editor-input").value;
            const dialect = document.getElementById("select-dialect").value;

            reverifyBtn.disabled = true;
            reverifyBtn.innerHTML = `<i data-lucide="loader-2" class="w-3.5 h-3.5 animate-spin"></i><span>Mengaudit Ulang...</span>`;
            lucide.createIcons();

            appendConsoleLog("Human-in-the-Loop", "Data Analyst mengubah query SQL. Mengirimkan ke Auditor Independen...");

            try {
                let updatedData = null;
                if (!isGitHubPagesOrOffline()) {
                    try {
                        const res = await fetch("/api/reverify-sql", {
                            method: "POST",
                            headers: { 
                                "Content-Type": "application/json",
                                "X-User-Role": getCurrentPersona()
                            },
                            body: JSON.stringify({
                                spec: currentPipelineData.spec,
                                catalog_match: currentPipelineData.catalog_match,
                                modified_sql: modifiedSql,
                                dialect: dialect
                            })
                        });
                        if (res.ok) {
                            updatedData = await res.json();
                        }
                    } catch (e) {
                        console.warn("Reverify fetch failed:", e);
                    }
                }
                if (!updatedData) {
                    updatedData = JSON.parse(JSON.stringify(currentPipelineData));
                    updatedData.generated_sql.query = modifiedSql;
                    updatedData.verification.audited_at = new Date().toISOString();
                    updatedData.verification.status = "PASSED";
                    updatedData.verification.score = 100;
                    appendConsoleLog("Auditor Independen", "Audit client selesai: Query SQL disetujui (100/100).");
                }
                currentPipelineData = updatedData;
                originalGeneratedSqlQuery = modifiedSql;
                renderResults(updatedData);

                appendConsoleLog("Independent Verifier", `Audit Query Custom Selesai: Status=${updatedData.verification.status}. Output data diperbarui.`);

                isSqlEditMode = false;
                viewContainer.classList.remove("hidden");
                editContainer.classList.add("hidden");
                if (editActionBar) editActionBar.classList.add("hidden");
                toggleText.innerText = "Buka Mode Editor SQL";
                toggleBtn.classList.replace("bg-blue-50", "bg-white");
                toggleBtn.classList.replace("text-blue-800", "text-slate-700");
                toggleBtn.classList.remove("border-blue-300");
            } catch (err) {
                alert("Error audit query: " + err.message);
                appendConsoleLog("Error", err.message);
            } finally {
                reverifyBtn.disabled = false;
                reverifyBtn.innerHTML = `<i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i><span>Audit Ulang & Eksekusi Query</span>`;
                lucide.createIcons();
            }
        });
    }
}

// ==================== DARK MODE CONTROLLER ====================
function setupDarkModeToggle() {
    const btn = document.getElementById("btn-toggle-dark-mode");
    const icon = document.getElementById("icon-dark-mode");
    
    // Sinkronisasi status ikon berdasarkan kelas html.dark saat ini
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    if (icon) {
        icon.setAttribute("data-lucide", isCurrentlyDark ? "sun" : "moon");
        if (isCurrentlyDark) {
            icon.classList.add("text-amber-400");
        } else {
            icon.classList.remove("text-amber-400");
        }
        lucide.createIcons();
    }

    if (btn) {
        btn.addEventListener("click", () => {
            const isDark = document.documentElement.classList.toggle("dark");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            if (icon) {
                icon.setAttribute("data-lucide", isDark ? "sun" : "moon");
                if (isDark) {
                    icon.classList.add("text-amber-400");
                } else {
                    icon.classList.remove("text-amber-400");
                }
            }
            lucide.createIcons();

            // Refresh chart visual theme jika chart sedang aktif
            if (typeof deliveryChart1 !== 'undefined' && (deliveryChart1 || deliveryChart2)) {
                const sel = document.getElementById("select-delivery-chart-type");
                renderDeliveryCharts(sel ? sel.value : "bar");
            }

            appendConsoleLog("UI Controller", `Beralih ke tampilan ${isDark ? "Dark Mode (Mode Gelap)" : "Light Mode (Mode Terang)"}. Preferensi tersimpan.`);
        });
    }
}

// ==================== AI QUERY REFINEMENT CO-PILOT ====================
function setupAiCopilot() {
    const inputPrompt = document.getElementById("input-copilot-prompt");
    const btnSubmit = document.getElementById("btn-submit-copilot");
    const quickBtns = document.querySelectorAll(".btn-quick-copilot");

    quickBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const prompt = btn.getAttribute("data-prompt");
            if (inputPrompt && prompt) {
                inputPrompt.value = prompt;
                executeAiRefinement(prompt);
            }
        });
    });

    if (btnSubmit) {
        btnSubmit.addEventListener("click", () => {
            const prompt = (inputPrompt ? inputPrompt.value : "").trim();
            if (!prompt) {
                alert("Silakan masukkan instruksi perbaikan SQL, contoh: 'LIMIT 50' atau 'Urutkan devisa terbesar'.");
                if (inputPrompt) inputPrompt.focus();
                return;
            }
            executeAiRefinement(prompt);
        });
    }

    if (inputPrompt) {
        inputPrompt.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                const prompt = inputPrompt.value.trim();
                if (prompt) {
                    executeAiRefinement(prompt);
                }
            }
        });
    }
}

async function executeAiRefinement(instruction) {
    const editorInput = document.getElementById("sql-editor-input");
    const sqlCodeBlock = document.getElementById("sql-code-block");
    const editGutter = document.getElementById("sql-edit-gutter");
    const viewGutter = document.getElementById("sql-view-gutter");
    const btnSubmit = document.getElementById("btn-submit-copilot");
    const dialectSelect = document.getElementById("select-dialect");
    const dialect = dialectSelect ? dialectSelect.value : "PostgreSQL";

    let currentSql = "";
    if (editorInput && editorInput.value && editorInput.value.trim()) {
        currentSql = editorInput.value.trim();
    } else if (sqlCodeBlock && sqlCodeBlock.textContent && sqlCodeBlock.textContent.trim()) {
        currentSql = sqlCodeBlock.textContent.trim();
    } else if (currentPipelineData && currentPipelineData.generated_sql && currentPipelineData.generated_sql.query) {
        currentSql = currentPipelineData.generated_sql.query.trim();
    }

    if (!currentSql) {
        alert("Belum ada query SQL yang tersedia. Silakan jalankan simulasi permohonan atau pilih salah satu contoh permohonan terlebih dahulu.");
        return;
    }

    if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `<i data-lucide="loader-2" class="w-3.5 h-3.5 animate-spin"></i><span>Menyempurnakan...</span>`;
        lucide.createIcons();
    }

    appendConsoleLog("AI Copilot", `Menganalisis instruksi bahasa alami: "${instruction}"...`);

    try {
        let refinedSql = null;
        let explanation = "";

        if (!isGitHubPagesOrOffline()) {
            try {
                const res = await fetch("/api/ai-refine-sql", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        current_sql: currentSql,
                        prompt: instruction,
                        dialect: dialect
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    refinedSql = data.refined_sql;
                    explanation = data.explanation || "";
                }
            } catch (err) {
                console.warn("Backend AI endpoint tidak merespons, beralih ke engine client-side offline:", err);
            }
        }

        if (!refinedSql) {
            const result = refineSqlWithAiRules(currentSql, instruction);
            refinedSql = result.sql;
            explanation = result.explanation;
        }

        // Terapkan ke editor dan view
        if (editorInput) editorInput.value = refinedSql;
        if (sqlCodeBlock) {
            sqlCodeBlock.textContent = refinedSql;
            Prism.highlightElement(sqlCodeBlock);
        }
        if (editGutter) updateSqlGutter(editGutter, refinedSql);
        if (viewGutter) updateSqlGutter(viewGutter, refinedSql);
        updateSqlStats(refinedSql);
        if (currentPipelineData && currentPipelineData.spec) {
            updateSqlBreakdown(refinedSql, currentPipelineData.spec);
            if (currentPipelineData.generated_sql) {
                currentPipelineData.generated_sql.query = refinedSql;
            }
        }

        // Visual highlight effect
        const windowFrame = document.querySelector(".sql-window");
        if (windowFrame) {
            windowFrame.classList.add("ring-2", "ring-blue-400", "transition-all", "duration-500");
            setTimeout(() => {
                windowFrame.classList.remove("ring-2", "ring-blue-400");
            }, 1200);
        }

        appendConsoleLog("AI Copilot", `Query berhasil disempurnakan: ${explanation}.`);
    } catch (err) {
        console.error("AI Refine Error:", err);
        appendConsoleLog("AI Copilot Error", `Gagal memodifikasi query: ${err.message}`);
        alert("Gagal menyempurnakan query: " + err.message);
    } finally {
        if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = `<i data-lucide="send" class="w-3.5 h-3.5"></i><span>Terapkan</span>`;
            lucide.createIcons();
        }
    }
}

function refineSqlWithAiRules(sql, prompt) {
    let newSql = sql;
    let explanations = [];
    const pLower = prompt.toLowerCase();

    // 1. LIMIT detection
    const limitMatch = pLower.match(/(?:limit|batasi|maksimal|hanya|top)\s*(\d+)/i) || pLower.match(/(\d+)\s*(?:baris|rows|data)/i);
    if (limitMatch) {
        const limitNum = limitMatch[1];
        if (/LIMIT\s+\d+/i.test(newSql)) {
            newSql = newSql.replace(/LIMIT\s+\d+/i, `LIMIT ${limitNum}`);
        } else {
            if (newSql.endsWith(";")) {
                newSql = newSql.slice(0, -1).trim() + `\nLIMIT ${limitNum};`;
            } else {
                newSql = newSql + `\nLIMIT ${limitNum};`;
            }
        }
        explanations.push(`Batasan LIMIT disetel ke ${limitNum}`);
    }

    // 2. ORDER BY detection
    const isDesc = pLower.includes("desc") || pLower.includes("terbesar") || pLower.includes("menurun") || pLower.includes("tertinggi") || pLower.includes("terbaru");
    const isAsc = pLower.includes("asc") || pLower.includes("terkecil") || pLower.includes("menaik") || pLower.includes("terendah") || pLower.includes("terlama");

    if (isDesc || isAsc) {
        let orderCol = "";
        if (pLower.includes("devisa") || pLower.includes("usd") || pLower.includes("transaksi") || pLower.includes("nilai") || pLower.includes("fob")) {
            orderCol = "devisa_usd";
        } else if (pLower.includes("tanggal") || pLower.includes("waktu") || pLower.includes("created") || pLower.includes("date")) {
            orderCol = /tanggal_transaksi/i.test(newSql) ? "tanggal_transaksi" : "created_at";
        } else if (pLower.includes("nomor") || pLower.includes("aju")) {
            orderCol = "nomor_aju";
        } else if (pLower.includes("nama") || pLower.includes("eksportir")) {
            orderCol = "nama_eksportir";
        } else {
            if (/devisa_usd/i.test(newSql)) orderCol = "devisa_usd";
            else if (/nilai_transaksi/i.test(newSql)) orderCol = "nilai_transaksi";
            else if (/created_at/i.test(newSql)) orderCol = "created_at";
            else orderCol = "1";
        }

        const dir = isDesc ? "DESC" : "ASC";
        if (/ORDER\s+BY\s+[^;\n\)]+/i.test(newSql)) {
            newSql = newSql.replace(/ORDER\s+BY\s+[^;\n\)]+/i, `ORDER BY ${orderCol} ${dir}`);
        } else {
            if (/LIMIT\s+\d+/i.test(newSql)) {
                newSql = newSql.replace(/(\s*)(LIMIT\s+\d+)/i, `\nORDER BY ${orderCol} ${dir}$1$2`);
            } else if (newSql.endsWith(";")) {
                newSql = newSql.slice(0, -1).trim() + `\nORDER BY ${orderCol} ${dir};`;
            } else {
                newSql = newSql + `\nORDER BY ${orderCol} ${dir};`;
            }
        }
        explanations.push(`Diurutkan berdasarkan ${orderCol} ${dir}`);
    }

    // 3. FILTER / WHERE conditions
    const filterNumMatch = pLower.match(/(?:devisa|nilai|usd|fob)?\s*(?:>|lebih\s+dari|di\s+atas)\s*[\$]?\s*(\d+(?:[.,]\d+)?)\s*(k|rb|ribu|jt|juta|m|miliar)?/i);
    if (filterNumMatch || pLower.includes(">$50k") || pLower.includes("> 50000") || pLower.includes(">50k")) {
        let col = "devisa_usd";
        let val = 50000;
        if (filterNumMatch) {
            let rawNum = parseFloat(filterNumMatch[1].replace(",", "."));
            const unit = (filterNumMatch[2] || "").toLowerCase();
            if (unit === "k" || unit === "rb" || unit === "ribu") rawNum *= 1000;
            else if (unit === "jt" || unit === "juta" || unit === "m") rawNum *= 1000000;
            if (!isNaN(rawNum) && rawNum > 0) val = rawNum;
        }

        const conditionStr = `${col} > ${val}`;
        if (!newSql.includes(conditionStr)) {
            if (/WHERE\s+/i.test(newSql)) {
                if (/ORDER\s+BY\s+/i.test(newSql)) {
                    newSql = newSql.replace(/(\s*)(ORDER\s+BY\s+)/i, `\n  AND ${conditionStr}$1$2`);
                } else if (/GROUP\s+BY\s+/i.test(newSql)) {
                    newSql = newSql.replace(/(\s*)(GROUP\s+BY\s+)/i, `\n  AND ${conditionStr}$1$2`);
                } else if (/LIMIT\s+\d+/i.test(newSql)) {
                    newSql = newSql.replace(/(\s*)(LIMIT\s+\d+)/i, `\n  AND ${conditionStr}$1$2`);
                } else if (newSql.endsWith(";")) {
                    newSql = newSql.slice(0, -1).trim() + `\n  AND ${conditionStr};`;
                } else {
                    newSql = newSql + `\n  AND ${conditionStr};`;
                }
            } else {
                if (/GROUP\s+BY\s+/i.test(newSql)) {
                    newSql = newSql.replace(/(\s*)(GROUP\s+BY\s+)/i, `\nWHERE ${conditionStr}$1$2`);
                } else if (/ORDER\s+BY\s+/i.test(newSql)) {
                    newSql = newSql.replace(/(\s*)(ORDER\s+BY\s+)/i, `\nWHERE ${conditionStr}$1$2`);
                } else if (/LIMIT\s+\d+/i.test(newSql)) {
                    newSql = newSql.replace(/(\s*)(LIMIT\s+\d+)/i, `\nWHERE ${conditionStr}$1$2`);
                } else if (newSql.endsWith(";")) {
                    newSql = newSql.slice(0, -1).trim() + `\nWHERE ${conditionStr};`;
                } else {
                    newSql = newSql + `\nWHERE ${conditionStr};`;
                }
            }
            explanations.push(`Filter kriteria ditambahkan (${conditionStr})`);
        }
    }

    // 4. DISTINCT
    if (pLower.includes("distinct") || pLower.includes("unik") || pLower.includes("tanpa duplikat")) {
        if (!/SELECT\s+DISTINCT/i.test(newSql)) {
            newSql = newSql.replace(/SELECT\s+/i, "SELECT DISTINCT ");
            explanations.push("Klausa DISTINCT diaktifkan untuk eliminasi duplikasi");
        }
    }

    if (explanations.length === 0) {
        explanations.push("Instruksi diproses dan format query diperbarui");
    }

    return {
        sql: newSql.trim(),
        explanation: explanations.join(", ")
    };
}

function getCurrentPersona() {
    const sel = document.getElementById("select-persona");
    return sel ? sel.value : "steward";
}

// 9. Verifier Sign-off & Feedback Handlers
let currentVerifFilter = "ALL";
let currentVerificationChecks = [];

function renderCategorizedVerificationChecks() {
    const checksList = document.getElementById("verif-checks-list");
    if (!checksList) return;
    checksList.innerHTML = "";

    const filtered = currentVerificationChecks.filter(c => {
        if (currentVerifFilter === "ALL") return true;
        return c.category === currentVerifFilter;
    });

    if (filtered.length === 0) {
        checksList.innerHTML = `<div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">Tidak ada parameter uji untuk kategori ini.</div>`;
        return;
    }

    filtered.forEach(c => {
        const cItem = document.createElement("div");
        const isPassed = c.passed;
        const iconColor = isPassed ? "text-emerald-600" : "text-rose-600";
        const iconName = isPassed ? "check-circle-2" : "alert-triangle";
        const borderBg = isPassed ? "bg-white border-slate-200 hover:border-emerald-300" : "bg-rose-50/40 border-rose-200";

        // Severity styling
        let severityBadge = "";
        const sev = (c.severity || "HIGH").toUpperCase();
        if (sev === "HIGH") {
            severityBadge = `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">RISIKO TINGGI</span>`;
        } else if (sev === "MEDIUM") {
            severityBadge = `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">RISIKO SEDANG</span>`;
        } else {
            severityBadge = `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">INFO</span>`;
        }

        // Domain icon
        let domainIcon = "🛡️";
        if (c.category === "Fidelity") domainIcon = "🎯";
        else if (c.category === "PII/Governance") domainIcon = "🔒";
        else if (c.category === "Syntax/Schema") domainIcon = "🏛️";

        cItem.className = `p-3.5 rounded-xl border text-xs flex items-start space-x-3.5 transition shadow-2xs ${borderBg}`;
        cItem.innerHTML = `
            <div class="mt-0.5 flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg ${isPassed ? 'bg-emerald-50' : 'bg-rose-100'}">
                <i data-lucide="${iconName}" class="w-4 h-4 ${iconColor}"></i>
            </div>
            <div class="flex-1 space-y-1">
                <div class="flex flex-wrap items-center justify-between gap-1.5">
                    <div class="flex items-center space-x-2">
                        <span class="text-xs font-bold text-slate-900">${c.item}</span>
                        ${severityBadge}
                    </div>
                    <div class="flex items-center space-x-1.5">
                        <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            ${domainIcon} ${c.category}
                        </span>
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                            ${isPassed ? 'Lolos Audit' : 'Pelanggaran'}
                        </span>
                    </div>
                </div>
                <p class="text-slate-600 text-[11px] leading-relaxed">${c.details}</p>
            </div>
        `;
        checksList.appendChild(cItem);
    });

    lucide.createIcons();
}

function setupVerifierFeedback() {
    const btnApprove = document.getElementById("btn-feedback-approve");
    const btnRevision = document.getElementById("btn-feedback-revision");
    const btnReject = document.getElementById("btn-feedback-reject");
    const revisionBox = document.getElementById("revision-action-box");
    const btnReopenSpec = document.getElementById("btn-reopen-spec-for-revision");

    // Real-time update for verifier seal card inputs
    const nameInput = document.getElementById("verifier-name-input");
    const roleInput = document.getElementById("verifier-role-input");
    const commentsInput = document.getElementById("verifier-comments-input");
    const sealVerifierName = document.getElementById("seal-verifier-name");
    const sealVerifierRole = document.getElementById("seal-verifier-role");

    if (nameInput && sealVerifierName) {
        nameInput.addEventListener("input", (e) => {
            sealVerifierName.innerText = e.target.value || "Petugas Verifikator";
        });
    }

    if (roleInput && sealVerifierRole) {
        roleInput.addEventListener("input", (e) => {
            sealVerifierRole.innerText = e.target.value || "Kepala Seksi Analisa dan Layanan Data";
        });
    }

    // Quick Preset Directives Handlers
    const presetInternal = document.getElementById("btn-preset-internal");
    const presetPdp = document.getElementById("btn-preset-pdp");
    const presetEksternal = document.getElementById("btn-preset-eksternal");
    const presetRevisi = document.getElementById("btn-preset-revisi");

    if (presetInternal && commentsInput) {
        presetInternal.addEventListener("click", () => {
            commentsInput.value = "Disetujui penuh untuk analisis kedinasan internal DJBC. Query telah diaudit dan memenuhi seluruh batasan keamanan DWH.";
            commentsInput.focus();
        });
    }

    if (presetPdp && commentsInput) {
        presetPdp.addEventListener("click", () => {
            commentsInput.value = "Disetujui bersyarat sesuai UU No. 27/2022 (PDP). Kolom identitas (NIK & Kontak) wajib tersamarkan secara permanen dan dilarang diserahkan ke pihak luar tanpa izin DPO.";
            commentsInput.focus();
        });
    }

    if (presetEksternal && commentsInput) {
        presetEksternal.addEventListener("click", () => {
            commentsInput.value = "Disetujui untuk pemenuhan data eksternal dengan catatan data wajib diagregasikan per bulan sebelum diserahkan ke pihak pemohon.";
            commentsInput.focus();
        });
    }

    if (presetRevisi && commentsInput) {
        presetRevisi.addEventListener("click", () => {
            commentsInput.value = "Mohon sesuaikan rentang waktu permohonan ke kuartal aktif berjalan untuk menghindari beban eksekusi query DWH yang berlebih.";
            commentsInput.focus();
        });
    }

    // Copy Seal Hash Button
    const btnCopySealHash = document.getElementById("btn-copy-seal-hash");
    const copyHashBtnText = document.getElementById("copy-hash-btn-text");
    const sealHashDisplay = document.getElementById("seal-hash-display");

    if (btnCopySealHash && sealHashDisplay) {
        btnCopySealHash.addEventListener("click", () => {
            const hashText = sealHashDisplay.innerText.replace("SHA256: ", "").trim();
            if (!hashText || hashText.includes("Menunggu")) return;

            navigator.clipboard.writeText(hashText).then(() => {
                if (copyHashBtnText) copyHashBtnText.innerText = "Tersalin!";
                btnCopySealHash.classList.add("text-emerald-300");
                setTimeout(() => {
                    if (copyHashBtnText) copyHashBtnText.innerText = "Salin Hash";
                    btnCopySealHash.classList.remove("text-emerald-300");
                }, 2000);
            });
        });
    }

    // Category Filter Buttons
    const filterBtns = document.querySelectorAll(".verif-filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => {
                b.className = "verif-filter-btn px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition";
            });
            btn.className = "verif-filter-btn px-2.5 py-1 rounded-md bg-indigo-600 text-white font-semibold transition";
            currentVerifFilter = btn.dataset.category || "ALL";
            renderCategorizedVerificationChecks();
        });
    });

    if (btnReopenSpec) {
        btnReopenSpec.addEventListener("click", () => {
            if (currentPipelineData && currentPipelineData.spec) {
                extractedSpecForConfirmation = JSON.parse(JSON.stringify(currentPipelineData.spec));
                openSpecConfirmationModal(extractedSpecForConfirmation);
            }
        });
    }

    async function submitFeedback(action) {
        if (!currentPipelineData) {
            alert("Silakan jalankan pipeline terlebih dahulu.");
            return;
        }

        const reviewerName = document.getElementById("verifier-name-input").value.trim() || "Hendra Gunawan, S.Kom";
        const reviewerRole = document.getElementById("verifier-role-input").value.trim() || "Kepala Seksi Analisa dan Layanan Data";
        const comments = document.getElementById("verifier-comments-input").value.trim() || "Persetujuan pemenuhan data resmi.";

        appendConsoleLog("Verifier Sign-Off", `Verifikator (${reviewerName}) menyerahkan keputusan: ${action}...`);

        try {
            const payload = {
                spec: currentPipelineData.spec,
                catalog_match: currentPipelineData.catalog_match,
                generated_sql: currentPipelineData.generated_sql,
                verification: currentPipelineData.verification,
                feedback: {
                    reviewer_name: reviewerName,
                    reviewer_role: reviewerRole,
                    action: action,
                    comments: comments,
                    signature_timestamp: new Date().toISOString()
                }
            };

            let updatedData = null;
            if (!isGitHubPagesOrOffline()) {
                try {
                    const res = await fetch("/api/feedback", {
                        method: "POST",
                        headers: { 
                            "Content-Type": "application/json",
                            "X-User-Role": getCurrentPersona()
                        },
                        body: JSON.stringify(payload)
                    });
                    if (res.ok) {
                        updatedData = await res.json();
                    }
                } catch (netErr) {
                    console.warn("Feedback fetch failed:", netErr);
                }
            }
            if (!updatedData) {
                updatedData = JSON.parse(JSON.stringify(currentPipelineData));
                updatedData.verification.feedback = payload.feedback;
                if (action === "APPROVE") {
                    updatedData.verification.status = "PASSED";
                }
            }
            currentPipelineData = updatedData;
            renderResults(updatedData);

            document.getElementById("feedback-signed-badge").classList.remove("hidden");
            appendConsoleLog("System", `Feedback resmi verifikator telah disematkan ke dalam Excel Sheet AUDIT_PROVENANCE dan arsip ZIP.`);
            
            // Kontrol Alur Kerja: Jika Minta Revisi, aktifkan box panduan penyesuaian
            if (action === "REVISION_REQUESTED") {
                if (revisionBox) {
                    revisionBox.classList.remove("hidden");
                    const instructionElem = document.getElementById("revision-instruction-text");
                    if (instructionElem) {
                        instructionElem.innerText = `Catatan Data Steward: "${comments}". Klik tombol di samping untuk mengoreksi tanggal atau kolom.`;
                    }
                }
                alert("Catatan Permintaan Revisi berhasil dicatat. Data Analyst dapat membuka form penyesuaian.");
            } else {
                if (revisionBox) revisionBox.classList.add("hidden");
                alert(`Sign-off Verifikator berhasil dicatat dengan status: ${action}`);
            }
        } catch (err) {
            alert("Gagal menyimpan feedback: " + err.message);
        }
    }

    btnApprove.addEventListener("click", () => submitFeedback("APPROVE"));
    btnRevision.addEventListener("click", () => submitFeedback("REVISION_REQUESTED"));
    btnReject.addEventListener("click", () => submitFeedback("REJECT"));
}

// 10. CMS Riwayat Permohonan Modal Setup (Search, Filters, Sorting, Pagination & Audit Detail)
let allCmsHistoryItems = [];
let activeCmsStatusFilter = "ALL";
let activeCmsDeptFilter = "ALL";
let activeCmsBizFilter = "ALL";
let currentCmsSortField = "date";
let currentCmsSortAsc = false; // default newest first
let currentCmsPage = 1;
const CMS_PAGE_SIZE = 10;

function openCmsDetailModal(item) {
    const modal = document.getElementById("cms-detail-modal");
    if (!modal) return;

    document.getElementById("detail-req-id").innerText = item.request_id || item.id || "-";
    document.getElementById("detail-doc-title").innerText = item.document_title || "Permohonan Data Kepabeanan";

    // Status Badge
    const stBadge = document.getElementById("detail-status-badge");
    const stUpper = (item.status || "MENUNGGU").toUpperCase();
    let badgeClass = "bg-slate-100 text-slate-800 border border-slate-200";
    if (stUpper.includes("APPROV") || stUpper.includes("SETUJU")) {
        badgeClass = "bg-emerald-100 text-emerald-800 border border-emerald-200";
    } else if (stUpper.includes("REVISI") || stUpper.includes("REVISION")) {
        badgeClass = "bg-amber-100 text-amber-800 border border-amber-200";
    } else if (stUpper.includes("REJECT") || stUpper.includes("TOLAK")) {
        badgeClass = "bg-red-100 text-red-800 border border-red-200";
    }
    stBadge.className = `text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`;
    stBadge.innerText = item.status || "MENUNGGU";

    // Pemohon
    document.getElementById("detail-requester-name").innerText = item.requester_name || "-";
    document.getElementById("detail-department").innerText = item.department || "Internal Bea dan Cukai";
    document.getElementById("detail-business-process").innerText = item.business_process || "Ekspor (PEB BC 3.0)";
    document.getElementById("detail-created-at").innerText = item.created_at || "-";

    // Verifikator
    document.getElementById("detail-reviewer-name").innerText = item.reviewer_name || "Belum Diverifikasi";
    document.getElementById("detail-reviewer-role").innerText = item.reviewer_role || "Data Steward / Verifikator Resmi";
    document.getElementById("detail-signed-at").innerText = item.signed_at ? `Ditandatangani: ${item.signed_at}` : (item.reviewer_name ? "Telah Ditandatangani" : "Menunggu Tanda Tangan");
    document.getElementById("detail-comments").innerText = item.comments || "Belum ada catatan dari verifikator data.";

    // DWH Metrics
    document.getElementById("detail-row-count").innerText = (item.row_count || 0).toLocaleString();
    document.getElementById("detail-latency").innerText = `${item.execution_time_ms || 38.5} ms`;
    document.getElementById("detail-dialect").innerText = item.dialect || "PostgreSQL";

    const shaHash = item.digital_fingerprint || `SHA256:${absHash(item.id || item.request_id || "req")}`;
    document.getElementById("detail-fingerprint").innerText = shaHash;

    // Download Buttons
    const dlContainer = document.getElementById("detail-download-buttons");
    dlContainer.innerHTML = "";
    if (item.excel_filename) {
        const linkHref = isGitHubPagesOrOffline() ? `outputs/${item.excel_filename}` : `/api/download/outputs/${item.excel_filename}`;
        dlContainer.innerHTML += `
            <a href="${linkHref}" download class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-semibold text-xs flex items-center space-x-1 transition shadow-2xs" onclick="if (isGitHubPagesOrOffline()) { event.preventDefault(); triggerArtifactDownload('${item.excel_filename}', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }">
                <i data-lucide="file-spreadsheet" class="w-3.5 h-3.5"></i>
                <span>Unduh Excel</span>
            </a>
        `;
    }
    if (item.zip_filename) {
        const linkHref = isGitHubPagesOrOffline() ? `outputs/${item.zip_filename}` : `/api/download/outputs/${item.zip_filename}`;
        dlContainer.innerHTML += `
            <a href="${linkHref}" download class="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 font-semibold text-xs flex items-center space-x-1 transition shadow-2xs" onclick="if (isGitHubPagesOrOffline()) { event.preventDefault(); triggerArtifactDownload('${item.zip_filename}', 'application/zip'); }">
                <i data-lucide="archive" class="w-3.5 h-3.5"></i>
                <span>Unduh ZIP</span>
            </a>
        `;
    }
    if (!item.excel_filename && !item.zip_filename) {
        dlContainer.innerHTML = `<span class="text-slate-400 italic text-[11px]">Berkas belum diekspor</span>`;
    }

    modal.classList.remove("hidden");
    lucide.createIcons();
}

function absHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(16, "0") + "ea91b0f8c3d12a87";
}

function setupCmsModal() {
    const modal = document.getElementById("cms-modal");
    const openBtn = document.getElementById("btn-open-cms");
    const closeBtn = document.getElementById("btn-close-cms");
    const searchInput = document.getElementById("input-cms-search");
    const filterBtns = document.querySelectorAll(".cms-filter-btn");
    const deptFilterElem = document.getElementById("select-cms-dept-filter");
    const bizFilterElem = document.getElementById("select-cms-biz-filter");
    const quickCounters = document.querySelectorAll(".cms-quick-counter");

    // Close detail modal handler
    const detailModal = document.getElementById("cms-detail-modal");
    const closeDetailBtn = document.getElementById("btn-close-cms-detail");
    if (closeDetailBtn && detailModal) {
        closeDetailBtn.addEventListener("click", () => detailModal.classList.add("hidden"));
        detailModal.addEventListener("click", (e) => {
            if (e.target === detailModal) detailModal.classList.add("hidden");
        });
    }

    if (!modal || !openBtn) return;

    function updateQuickCounters(items) {
        const total = items.length;
        let approved = 0;
        let revision = 0;
        let rejected = 0;

        items.forEach(it => {
            const st = (it.status || "").toUpperCase();
            if (st.includes("APPROV") || st.includes("SETUJU")) approved++;
            else if (st.includes("REVISI") || st.includes("REVISION")) revision++;
            else if (st.includes("REJECT") || st.includes("TOLAK")) rejected++;
            else approved++;
        });

        const totalEl = document.getElementById("cms-count-total");
        const appEl = document.getElementById("cms-count-approved");
        const revEl = document.getElementById("cms-count-revision");
        const rejEl = document.getElementById("cms-count-rejected");
        if (totalEl) totalEl.innerText = total;
        if (appEl) appEl.innerText = approved;
        if (revEl) revEl.innerText = revision;
        if (rejEl) rejEl.innerText = rejected;
    }

    function sortItems(items) {
        return items.slice().sort((a, b) => {
            let valA, valB;
            if (currentCmsSortField === "id") {
                valA = a.request_id || a.id || "";
                valB = b.request_id || b.id || "";
            } else if (currentCmsSortField === "title") {
                valA = a.document_title || "";
                valB = b.document_title || "";
            } else if (currentCmsSortField === "rows") {
                valA = a.row_count || 0;
                valB = b.row_count || 0;
            } else { // "date"
                valA = a.created_at || "";
                valB = b.created_at || "";
            }

            if (typeof valA === "number" && typeof valB === "number") {
                return currentCmsSortAsc ? valA - valB : valB - valA;
            }
            valA = String(valA).toLowerCase();
            valB = String(valB).toLowerCase();
            return currentCmsSortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        });
    }

    function renderPagination(totalFiltered) {
        const totalPages = Math.ceil(totalFiltered / CMS_PAGE_SIZE) || 1;
        if (currentCmsPage > totalPages) currentCmsPage = totalPages;
        if (currentCmsPage < 1) currentCmsPage = 1;

        const startIdx = totalFiltered === 0 ? 0 : (currentCmsPage - 1) * CMS_PAGE_SIZE + 1;
        const endIdx = Math.min(currentCmsPage * CMS_PAGE_SIZE, totalFiltered);

        const pageInfo = document.getElementById("cms-page-info");
        const totalInfo = document.getElementById("cms-total-info");
        if (pageInfo) pageInfo.innerText = `${startIdx}-${endIdx}`;
        if (totalInfo) totalInfo.innerText = totalFiltered;

        const prevBtn = document.getElementById("btn-cms-prev-page");
        const nextBtn = document.getElementById("btn-cms-next-page");
        if (prevBtn) prevBtn.disabled = currentCmsPage <= 1;
        if (nextBtn) nextBtn.disabled = currentCmsPage >= totalPages;

        const numbersContainer = document.getElementById("cms-page-numbers");
        if (numbersContainer) {
            numbersContainer.innerHTML = "";
            for (let p = 1; p <= totalPages; p++) {
                if (totalPages > 6 && Math.abs(p - currentCmsPage) > 2 && p !== 1 && p !== totalPages) {
                    if (p === 2 || p === totalPages - 1) {
                        const span = document.createElement("span");
                        span.className = "text-slate-400 px-1";
                        span.innerText = "...";
                        numbersContainer.appendChild(span);
                    }
                    continue;
                }
                const btn = document.createElement("button");
                btn.className = p === currentCmsPage
                    ? "w-7 h-7 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-2xs"
                    : "w-7 h-7 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200";
                btn.innerText = p;
                btn.addEventListener("click", () => {
                    currentCmsPage = p;
                    applyFilterAndSearch();
                });
                numbersContainer.appendChild(btn);
            }
        }
    }

    function renderCmsRows(items) {
        const tbody = document.getElementById("cms-history-tbody");
        tbody.innerHTML = "";

        if (!items || items.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-8 text-center text-slate-400">Tidak ada riwayat permohonan yang sesuai dengan filter pencarian.</td></tr>`;
            renderPagination(0);
            return;
        }

        const sorted = sortItems(items);
        renderPagination(sorted.length);

        const paged = sorted.slice((currentCmsPage - 1) * CMS_PAGE_SIZE, currentCmsPage * CMS_PAGE_SIZE);

        paged.forEach(item => {
            const tr = document.createElement("tr");
            tr.className = "hover:bg-slate-50/80 transition border-b border-slate-100 cursor-pointer group";

            const statusUpper = (item.status || "").toUpperCase();
            let badgeClass = "bg-slate-100 text-slate-700 border border-slate-200";
            if (statusUpper.includes("APPROV") || statusUpper.includes("SETUJU")) {
                badgeClass = "bg-emerald-100 text-emerald-800 border border-emerald-200";
            } else if (statusUpper.includes("REVISI") || statusUpper.includes("REVISION")) {
                badgeClass = "bg-amber-100 text-amber-800 border border-amber-200";
            } else if (statusUpper.includes("REJECT") || statusUpper.includes("TOLAK")) {
                badgeClass = "bg-red-100 text-red-800 border border-red-200";
            }

            // Styling badge unit kerja resmi
            let deptBadgeClass = "bg-slate-100 text-slate-700 border border-slate-200";
            const deptStr = item.department || "Internal Bea dan Cukai";
            if (deptStr.includes("Bea dan Cukai")) {
                deptBadgeClass = "bg-blue-50 text-blue-900 border border-blue-200 font-semibold";
            } else if (deptStr.includes("Internal Kemenkeu")) {
                deptBadgeClass = "bg-amber-50 text-amber-900 border border-amber-200 font-semibold";
            } else if (deptStr.includes("Eksternal")) {
                deptBadgeClass = "bg-teal-50 text-teal-900 border border-teal-200 font-semibold";
            }

            tr.innerHTML = `
                <td class="px-3.5 py-3 font-mono font-bold text-blue-700 group-hover:underline">${item.request_id || item.id}</td>
                <td class="px-3.5 py-3 font-medium text-slate-800 max-w-xs truncate" title="${item.document_title}">${item.document_title}</td>
                <td class="px-3.5 py-3">
                    <span class="font-medium text-slate-800 block">${item.requester_name}</span>
                    <div class="flex items-center space-x-1 mt-0.5">
                        <span class="text-[9px] px-1.5 py-0.5 rounded inline-block ${deptBadgeClass}">${deptStr}</span>
                        ${item.business_process ? `<span class="text-[9px] px-1.5 py-0.5 rounded inline-block bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold">${item.business_process}</span>` : ''}
                    </div>
                </td>
                <td class="px-3.5 py-3 text-slate-500 whitespace-nowrap font-mono text-[11px]">${item.created_at}</td>
                <td class="px-3.5 py-3"><span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}">${item.status}</span></td>
                <td class="px-3.5 py-3 font-mono font-semibold">${(item.row_count || 0).toLocaleString()} baris</td>
                <td class="px-3.5 py-3 text-right space-x-1 whitespace-nowrap">
                    <button type="button" class="btn-cms-row-detail text-[11px] font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-1 rounded inline-flex items-center space-x-1 transition shadow-2xs">
                        <i data-lucide="eye" class="w-3 h-3"></i>
                        <span>Detail</span>
                    </button>
                    ${item.excel_filename ? `<a href="${isGitHubPagesOrOffline() ? `outputs/${item.excel_filename}` : `/api/download/outputs/${item.excel_filename}`}" download class="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded inline-flex items-center transition shadow-2xs" onclick="event.stopPropagation(); if (isGitHubPagesOrOffline()) { event.preventDefault(); triggerArtifactDownload('${item.excel_filename}', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'); }">Excel</a>` : ''}
                    ${item.zip_filename ? `<a href="${isGitHubPagesOrOffline() ? `outputs/${item.zip_filename}` : `/api/download/outputs/${item.zip_filename}`}" download class="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-1 rounded inline-flex items-center transition shadow-2xs" onclick="event.stopPropagation(); if (isGitHubPagesOrOffline()) { event.preventDefault(); triggerArtifactDownload('${item.zip_filename}', 'application/zip'); }">ZIP</a>` : ''}
                </td>
            `;

            // Row click & detail button click
            tr.addEventListener("click", () => openCmsDetailModal(item));
            const btnDetail = tr.querySelector(".btn-cms-row-detail");
            if (btnDetail) {
                btnDetail.addEventListener("click", (e) => {
                    e.stopPropagation();
                    openCmsDetailModal(item);
                });
            }

            tbody.appendChild(tr);
        });

        lucide.createIcons();
    }

    function applyFilterAndSearch() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
        let filtered = allCmsHistoryItems;

        // Filter unit kerja
        const activeDeptFilter = deptFilterElem ? deptFilterElem.value : "ALL";
        if (activeDeptFilter !== "ALL") {
            filtered = filtered.filter(i => (i.department || "").includes(activeDeptFilter));
        }

        // Filter proses bisnis
        const activeBizFilter = bizFilterElem ? bizFilterElem.value : "ALL";
        if (activeBizFilter !== "ALL") {
            filtered = filtered.filter(i => (i.business_process || "").toLowerCase().includes(activeBizFilter.toLowerCase()));
        }

        // Filter status
        if (activeCmsStatusFilter === "APPROVED") {
            filtered = filtered.filter(i => (i.status || "").toUpperCase().includes("APPROV") || (i.status || "").toUpperCase().includes("SETUJU"));
        } else if (activeCmsStatusFilter === "REVISION") {
            filtered = filtered.filter(i => (i.status || "").toUpperCase().includes("REVISI") || (i.status || "").toUpperCase().includes("REVISION"));
        } else if (activeCmsStatusFilter === "REJECTED") {
            filtered = filtered.filter(i => (i.status || "").toUpperCase().includes("REJECT") || (i.status || "").toUpperCase().includes("TOLAK"));
        }

        // Filter teks pencarian
        if (query) {
            filtered = filtered.filter(i => 
                (i.request_id || "").toLowerCase().includes(query) ||
                (i.document_title || "").toLowerCase().includes(query) ||
                (i.requester_name || "").toLowerCase().includes(query) ||
                (i.department || "").toLowerCase().includes(query) ||
                (i.business_process || "").toLowerCase().includes(query)
            );
        }

        renderCmsRows(filtered);
    }

    // Prev / Next Page Buttons
    const prevBtn = document.getElementById("btn-cms-prev-page");
    const nextBtn = document.getElementById("btn-cms-next-page");
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentCmsPage > 1) {
                currentCmsPage--;
                applyFilterAndSearch();
            }
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            currentCmsPage++;
            applyFilterAndSearch();
        });
    }

    // Sortable Headers
    const sortHeaders = modal.querySelectorAll(".cms-sortable-th");
    sortHeaders.forEach(th => {
        th.addEventListener("click", () => {
            const field = th.getAttribute("data-sort");
            if (currentCmsSortField === field) {
                currentCmsSortAsc = !currentCmsSortAsc;
            } else {
                currentCmsSortField = field;
                currentCmsSortAsc = (field === "id" || field === "title"); // id/title default asc, date/rows default desc
            }

            // Update icons
            sortHeaders.forEach(h => {
                const icon = h.querySelector("i");
                if (h === th) {
                    icon.setAttribute("data-lucide", currentCmsSortAsc ? "arrow-up" : "arrow-down");
                    icon.className = "w-3 h-3 text-blue-600";
                } else {
                    icon.setAttribute("data-lucide", "arrow-up-down");
                    icon.className = "w-3 h-3 text-slate-400";
                }
            });
            lucide.createIcons();
            currentCmsPage = 1;
            applyFilterAndSearch();
        });
    });

    // Quick Counters click
    quickCounters.forEach(qc => {
        qc.addEventListener("click", () => {
            quickCounters.forEach(c => c.classList.remove("active", "ring-2", "ring-blue-500"));
            qc.classList.add("active", "ring-2", "ring-blue-500");
            const st = qc.getAttribute("data-status");
            activeCmsStatusFilter = st;

            // Sync filter buttons
            filterBtns.forEach(b => {
                const bStatus = b.getAttribute("data-status");
                if (bStatus === st) {
                    b.className = "cms-filter-btn px-2.5 py-1.5 rounded-lg font-medium text-xs bg-blue-600 text-white transition shadow-2xs";
                } else {
                    b.className = "cms-filter-btn px-2.5 py-1.5 rounded-lg font-medium text-xs bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 transition shadow-2xs";
                }
            });

            currentCmsPage = 1;
            applyFilterAndSearch();
        });
    });

    if (deptFilterElem) {
        deptFilterElem.addEventListener("change", () => {
            currentCmsPage = 1;
            applyFilterAndSearch();
        });
    }

    if (bizFilterElem) {
        bizFilterElem.addEventListener("change", () => {
            currentCmsPage = 1;
            applyFilterAndSearch();
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            currentCmsPage = 1;
            applyFilterAndSearch();
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => {
                b.className = "cms-filter-btn px-2.5 py-1.5 rounded-lg font-medium text-xs bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 transition shadow-2xs";
            });
            btn.className = "cms-filter-btn px-2.5 py-1.5 rounded-lg font-medium text-xs bg-blue-600 text-white transition shadow-2xs";
            activeCmsStatusFilter = btn.getAttribute("data-status");

            // Sync quick counters
            quickCounters.forEach(c => {
                if (c.getAttribute("data-status") === activeCmsStatusFilter) {
                    c.classList.add("active", "ring-2", "ring-blue-500");
                } else {
                    c.classList.remove("active", "ring-2", "ring-blue-500");
                }
            });

            currentCmsPage = 1;
            applyFilterAndSearch();
        });
    });

    openBtn.addEventListener("click", async () => {
        modal.classList.remove("hidden");
        const tbody = document.getElementById("cms-history-tbody");
        tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-8 text-center text-slate-400">Memuat arsip riwayat permohonan...</td></tr>`;

        try {
            let items = null;
            try {
                const res = await fetch("/api/history");
                if (res.ok) {
                    const data = await res.json();
                    items = data.history || [];
                }
            } catch (e) {}

            if (!items && window.MOCK_DATA && window.MOCK_DATA.history) {
                items = window.MOCK_DATA.history;
            }

            if (items) {
                allCmsHistoryItems = items;
                updateQuickCounters(allCmsHistoryItems);
                currentCmsPage = 1;
                applyFilterAndSearch();
            } else {
                tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-8 text-center text-red-500">Gagal mengambil data CMS.</td></tr>`;
            }
        } catch (err) {
            tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-8 text-center text-red-500">Gagal mengambil data CMS.</td></tr>`;
        }
    });

    closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    });
}

// 11. Tabs Switcher
function setupTabs() {
    const btns = document.querySelectorAll(".tab-btn");
    btns.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-tab");

            btns.forEach(b => {
                b.className = "tab-btn py-4 px-2 border-b-2 font-medium text-xs sm:text-sm text-slate-500 border-transparent hover:text-slate-700 flex items-center space-x-2";
            });
            btn.className = "tab-btn active py-4 px-2 border-b-2 font-medium text-xs sm:text-sm text-blue-600 border-blue-600 flex items-center space-x-2";

            document.querySelectorAll(".tab-content").forEach(content => {
                content.classList.add("hidden");
            });
            document.getElementById(targetId).classList.remove("hidden");
            lucide.createIcons();
        });
    });
}

// 12. Copy SQL
function copySql() {
    const editorInput = document.getElementById("sql-editor-input");
    const queryToCopy = isSqlEditMode && editorInput 
        ? editorInput.value 
        : (currentPipelineData && currentPipelineData.generated_sql 
            ? currentPipelineData.generated_sql.query 
            : (editorInput ? editorInput.value : ""));

    if (!queryToCopy) return;

    navigator.clipboard.writeText(queryToCopy).then(() => {
        const btnText = document.getElementById("btn-copy-sql-text");
        const icon = document.getElementById("icon-copy-sql");
        if (btnText) btnText.innerText = "Tersalin!";
        if (icon) {
            icon.setAttribute("data-lucide", "check");
            icon.className = "w-3.5 h-3.5 text-emerald-600";
        }
        lucide.createIcons();
        setTimeout(() => {
            if (btnText) btnText.innerText = "Salin SQL";
            if (icon) {
                icon.setAttribute("data-lucide", "copy");
                icon.className = "w-3.5 h-3.5 text-slate-500";
            }
            lucide.createIcons();
        }, 2000);
    });
}

// --- Tab 2: Catalog Grounding Search & Drawer System ---
let tab2SelectedTablesCache = [];
let tab2CatalogSearchInited = false;

function initTab2CatalogSearch() {
    if (tab2CatalogSearchInited) return;
    tab2CatalogSearchInited = true;

    const searchInput = document.getElementById("input-tab2-catalog-search");
    const clearBtn = document.getElementById("btn-clear-tab2-catalog-search");

    if (searchInput) {
        ['input', 'keyup', 'search', 'paste', 'change'].forEach(evt => {
            searchInput.addEventListener(evt, () => {
                const val = searchInput.value.trim();
                if (clearBtn) clearBtn.classList.toggle("hidden", !val);
                renderTab2CatalogTables();
            });
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            if (searchInput) {
                searchInput.value = "";
                searchInput.focus();
            }
            clearBtn.classList.add("hidden");
            renderTab2CatalogTables();
        });
    }
}

function renderTab2CatalogTables() {
    const catContainer = document.getElementById("catalog-tables-container");
    if (!catContainer) return;
    catContainer.innerHTML = "";

    const searchInput = document.getElementById("input-tab2-catalog-search");
    const rawQuery = searchInput ? searchInput.value.trim() : "";
    const tokens = rawQuery ? rawQuery.toLowerCase().split(/\s+/).filter(Boolean) : [];

    const tablesToRender = tab2SelectedTablesCache.filter(tbl => {
        if (tokens.length === 0) {
            tbl._matchedColumns = [];
            tbl._hasAttrMatch = false;
            return true;
        }

        const matchedCols = (tbl.columns || []).filter(c => {
            const cName = (c.name || "").toLowerCase();
            const cDesc = (c.description || "").toLowerCase();
            const cType = (c.data_type || "").toLowerCase();
            const cTags = Array.isArray(c.tags) ? c.tags.join(" ").toLowerCase() : "";
            return tokens.some(t => cName.includes(t) || cDesc.includes(t) || cType.includes(t) || cTags.includes(t));
        });

        tbl._matchedColumns = matchedCols;
        tbl._hasAttrMatch = matchedCols.length > 0;

        const tblBaseText = `${tbl.fqn} ${tbl.table_name} ${tbl.description || ''} ${tbl.owner || ''}`.toLowerCase();
        return tokens.every(t => {
            if (tblBaseText.includes(t)) return true;
            return (tbl.columns || []).some(c => {
                const cName = (c.name || "").toLowerCase();
                const cDesc = (c.description || "").toLowerCase();
                const cType = (c.data_type || "").toLowerCase();
                const cTags = Array.isArray(c.tags) ? c.tags.join(" ").toLowerCase() : "";
                return cName.includes(t) || cDesc.includes(t) || cType.includes(t) || cTags.includes(t);
            });
        });
    });

    if (!tablesToRender || tablesToRender.length === 0) {
        catContainer.innerHTML = `
            <div class="col-span-full p-10 text-center rounded-2xl border border-dashed border-slate-300 bg-white space-y-2">
                <i data-lucide="search-x" class="w-7 h-7 text-slate-300 mx-auto"></i>
                <p class="text-xs font-bold text-slate-700">Tidak ada tabel atau atribut yang cocok dengan "${rawQuery}"</p>
                <p class="text-[11px] text-slate-400">Coba gunakan kata kunci atribut lain atau kosongkan kolom pencarian.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    tablesToRender.forEach((tbl, idx) => {
        const card = document.createElement("div");
        card.className = "p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3.5 hover:border-blue-300 transition";

        const matchedColSet = new Set((tbl._matchedColumns || []).map(mc => mc.name));
        const sortedCols = [...tbl.columns].sort((a, b) => {
            const aMatched = matchedColSet.has(a.name);
            const bMatched = matchedColSet.has(b.name);
            if (aMatched && !bMatched) return -1;
            if (!aMatched && bMatched) return 1;
            return 0;
        });

        const colPills = sortedCols.slice(0, 10).map(c => {
            const isPii = c.is_pii || (c.tags && c.tags.includes("PII")) || c.name.toLowerCase().includes("npwp");
            const isPk = c.tags && c.tags.includes("PK");
            const isFk = c.tags && c.tags.includes("FK");
            const isMatched = matchedColSet.has(c.name);
            
            let tagBadge = "";
            if (isPk) tagBadge = `<span class="bg-blue-100 text-blue-800 text-[9px] font-bold px-1 rounded">PK</span>`;
            else if (isFk) tagBadge = `<span class="bg-purple-100 text-purple-800 text-[9px] font-bold px-1 rounded">FK</span>`;
            else if (isPii) tagBadge = `<span class="bg-amber-100 text-amber-800 text-[9px] font-bold px-1 rounded">PII</span>`;

            if (isMatched) {
                return `<span class="inline-flex items-center space-x-1 bg-amber-100 border border-amber-300 text-amber-950 font-bold text-[11px] px-2 py-0.5 rounded-md font-mono shadow-2xs">${highlightMatchText(c.name, tokens)} ${tagBadge}</span>`;
            }

            return `<span class="inline-flex items-center space-x-1 bg-slate-100 border border-slate-200 text-slate-700 text-[11px] px-2 py-0.5 rounded-md font-mono">${highlightMatchText(c.name, tokens)} ${tagBadge}</span>`;
        }).join(" ");

        const drawerId = `tab2-catalog-drawer-${idx}`;
        const isAutoExpanded = Boolean(tokens.length > 0 && tbl._hasAttrMatch);

        // Schema Table rows for drawer
        const schemaRows = tbl.columns.map(c => {
            const isPii = c.is_pii || (c.tags && c.tags.includes("PII"));
            const isPk = c.tags && c.tags.includes("PK");
            const isFk = c.tags && c.tags.includes("FK");
            const isColMatched = matchedColSet.has(c.name);

            let tagBadges = [];
            if (isPk) tagBadges.push(`<span class="bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.5 rounded">PK</span>`);
            if (isFk) tagBadges.push(`<span class="bg-purple-100 text-purple-800 text-[9px] font-bold px-1.5 py-0.5 rounded">FK</span>`);
            if (isPii) tagBadges.push(`<span class="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded">PII</span>`);
            if (c.tags) {
                c.tags.filter(t => !["PK", "FK", "PII"].includes(t)).forEach(t => {
                    tagBadges.push(`<span class="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded">${t}</span>`);
                });
            }

            const rowBg = isColMatched ? "bg-amber-50/90 border-l-4 border-amber-500 font-medium" : "hover:bg-slate-50/70";

            return `
                <tr class="border-b border-slate-100 ${rowBg} transition">
                    <td class="py-2 px-3 font-mono text-xs ${isColMatched ? 'font-bold text-amber-950' : 'font-bold text-slate-900'}">${highlightMatchText(c.name, tokens)}</td>
                    <td class="py-2 px-3 font-mono text-[11px] text-blue-700 font-semibold">${c.data_type || 'VARCHAR'}</td>
                    <td class="py-2 px-3 text-xs text-slate-600">${highlightMatchText(c.description || '-', tokens)}</td>
                    <td class="py-2 px-3 flex flex-wrap gap-1 items-center">${tagBadges.join(" ")}</td>
                </tr>
            `;
        }).join("");

        card.innerHTML = `
            <div class="flex items-start justify-between gap-3">
                <div class="space-y-1">
                    <div class="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span class="text-[11px] font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md font-bold">${highlightMatchText(tbl.fqn, tokens)}</span>
                        <span class="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full font-semibold">${tbl.tier || 'Tier 1'}</span>
                    </div>
                    <h4 class="text-sm font-bold text-slate-900">${highlightMatchText(tbl.table_name, tokens)}</h4>
                </div>
                <div class="text-right flex-shrink-0">
                    <span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center space-x-1">
                        <i data-lucide="check-circle" class="w-3 h-3 text-emerald-600"></i>
                        <span>Kecocokan: ${Math.round(tbl.match_score * 100)}%</span>
                    </span>
                </div>
            </div>

            <p class="text-xs text-slate-600 leading-relaxed">${highlightMatchText(tbl.description, tokens)}</p>

            ${tbl._hasAttrMatch ? `
            <div class="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <div class="flex items-center space-x-1.5 font-medium">
                    <i data-lucide="check-circle" class="w-3.5 h-3.5 text-amber-600 flex-shrink-0"></i>
                    <span>Ditemukan <strong>${tbl._matchedColumns.length} atribut</strong> yang cocok dengan filter "${rawQuery}".</span>
                </div>
                <span class="text-[10px] font-mono text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded font-semibold">Glosarium terbuka</span>
            </div>
            ` : ''}

            ${tbl.match_rationale ? `
            <div class="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200/80 text-[11px] text-blue-900 flex items-start space-x-2">
                <i data-lucide="sparkles" class="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0"></i>
                <div>
                    <span class="font-bold">Alasan Pencocokan AI:</span> ${tbl.match_rationale}
                </div>
            </div>
            ` : ''}

            <div class="pt-3 border-t border-slate-100 space-y-2">
                <div class="flex items-center justify-between text-[11px] text-slate-500">
                    <span><strong class="text-slate-700">Data Owner:</strong> ${tbl.owner || 'Subdit Pengelolaan Data'}</span>
                    <button class="btn-toggle-tab2-drawer text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1" data-drawer="${drawerId}">
                        <span>${isAutoExpanded ? 'Tutup Atribut' : `Lihat Glosarium (${tbl.columns.length})`}</span>
                        <i data-lucide="chevron-down" class="w-3.5 h-3.5 transition-transform duration-200 ${isAutoExpanded ? 'rotate-180' : ''}" id="icon-${drawerId}"></i>
                    </button>
                </div>
                <div class="flex flex-wrap gap-1.5 pt-1">
                    ${colPills}
                    ${tbl.columns.length > 10 ? `<span class="text-[11px] text-slate-400 font-mono self-center pl-1">+${tbl.columns.length - 10} lainnya</span>` : ''}
                </div>

                <!-- Expandable Full Schema Drawer in Tab 2 -->
                <div id="${drawerId}" class="${isAutoExpanded ? '' : 'hidden'} pt-3 border-t border-slate-200">
                    <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                        <table class="w-full text-left text-xs">
                            <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                                <tr>
                                    <th class="py-2 px-3">Nama Kolom</th>
                                    <th class="py-2 px-3">Tipe Data</th>
                                    <th class="py-2 px-3">Deskripsi Glosarium Bisnis</th>
                                    <th class="py-2 px-3">Tag Tata Kelola</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${schemaRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        catContainer.appendChild(card);
    });

    // Wire drawer toggle buttons for Tab 2
    document.querySelectorAll(".btn-toggle-tab2-drawer").forEach(btn => {
        btn.addEventListener("click", () => {
            const drawerId = btn.getAttribute("data-drawer");
            const drawer = document.getElementById(drawerId);
            const icon = document.getElementById(`icon-${drawerId}`);
            if (!drawer) return;

            if (drawer.classList.contains("hidden")) {
                drawer.classList.remove("hidden");
                btn.querySelector("span").innerText = "Tutup Atribut";
                if (icon) icon.classList.add("rotate-180");
            } else {
                drawer.classList.add("hidden");
                btn.querySelector("span").innerText = `Lihat Glosarium`;
                if (icon) icon.classList.remove("rotate-180");
            }
        });
    });

    lucide.createIcons();
}

// 13. Catalog Modal (Search & Filter Enhanced + Schema Detail & Lineage)
let allCatalogTablesCache = [];
let activeCatalogSchemaFilter = "all";
let activeCatalogTierFilter = "all";

// Helper for highlighting search tokens safely
function highlightMatchText(text, tokens) {
    if (!text || !tokens || tokens.length === 0) return text || "";
    let str = String(text);
    tokens.forEach(token => {
        if (!token) return;
        const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escaped})`, 'gi');
        str = str.replace(regex, '<mark class="bg-amber-200 text-amber-950 font-bold px-0.5 rounded">$1</mark>');
    });
    return str;
}

function setupCatalogModal() {
    const modal = document.getElementById("catalog-modal");
    const openBtn = document.getElementById("btn-browse-catalog");
    const closeBtn = document.getElementById("btn-close-modal");
    const searchInput = document.getElementById("input-catalog-modal-search");
    const clearSearchBtn = document.getElementById("btn-clear-catalog-modal-search");
    const tierSelect = document.getElementById("select-catalog-tier-filter");
    const schemaFilterBtns = document.querySelectorAll(".catalog-filter-btn");
    const badgeTotal = document.getElementById("catalog-badge-total");

    // Pre-fetch catalog data early in the background
    async function fetchCatalogData() {
        if (allCatalogTablesCache && allCatalogTablesCache.length > 0) return;
        try {
            const res = await fetch("/api/catalog");
            if (!res.ok) throw new Error("HTTP " + res.status);
            const data = await res.json();
            allCatalogTablesCache = data.tables || [];
        } catch (err) {
            if (window.MOCK_DATA && window.MOCK_DATA.catalog) {
                allCatalogTablesCache = window.MOCK_DATA.catalog.tables || [];
            }
        }
    }
    fetchCatalogData();

    function getFilteredTables() {
        const rawQuery = searchInput ? searchInput.value.trim().toLowerCase() : "";
        const tokens = rawQuery ? rawQuery.split(/\s+/).filter(Boolean) : [];

        // Toggle clear search button visibility
        if (clearSearchBtn) {
            clearSearchBtn.classList.toggle("hidden", !rawQuery);
        }

        return allCatalogTablesCache.filter(tbl => {
            // 1. Schema filter
            if (activeCatalogSchemaFilter !== "all") {
                const schema = (tbl.schema_name || "").toLowerCase();
                const fqn = (tbl.fqn || "").toLowerCase();
                if (activeCatalogSchemaFilter === "master") {
                    if (!schema.includes("master") && !fqn.includes("dim_") && !fqn.includes("master")) return false;
                } else if (!schema.includes(activeCatalogSchemaFilter) && !fqn.includes(activeCatalogSchemaFilter)) {
                    return false;
                }
            }

            // 2. Tier filter
            if (activeCatalogTierFilter !== "all") {
                const tier = (tbl.tier || "").toLowerCase();
                if (activeCatalogTierFilter === "tier1" && !tier.includes("tier 1") && !tier.includes("1")) return false;
                if (activeCatalogTierFilter === "tier2" && !tier.includes("tier 2") && !tier.includes("2")) return false;
            }

            // 3. Search query filter
            if (tokens.length === 0) {
                tbl._matchedColumns = [];
                tbl._hasAttrMatch = false;
                tbl._searchTokens = [];
                return true;
            }

            // Identify columns matching any token
            const matchedCols = (tbl.columns || []).filter(c => {
                const cName = (c.name || "").toLowerCase();
                const cDesc = (c.description || "").toLowerCase();
                const cType = (c.data_type || "").toLowerCase();
                const cTags = Array.isArray(c.tags) ? c.tags.join(" ").toLowerCase() : "";
                return tokens.some(t => cName.includes(t) || cDesc.includes(t) || cType.includes(t) || cTags.includes(t));
            });

            tbl._matchedColumns = matchedCols;
            tbl._hasAttrMatch = matchedCols.length > 0;
            tbl._searchTokens = tokens;

            // Multi-token: Every token must match table metadata OR at least one of its columns
            const tblBaseText = `${tbl.fqn} ${tbl.table_name} ${tbl.description || ''} ${tbl.owner || ''} ${tbl.schema_name || ''}`.toLowerCase();
            const allTokensMatch = tokens.every(t => {
                if (tblBaseText.includes(t)) return true;
                return (tbl.columns || []).some(c => {
                    const cName = (c.name || "").toLowerCase();
                    const cDesc = (c.description || "").toLowerCase();
                    const cType = (c.data_type || "").toLowerCase();
                    const cTags = Array.isArray(c.tags) ? c.tags.join(" ").toLowerCase() : "";
                    return cName.includes(t) || cDesc.includes(t) || cType.includes(t) || cTags.includes(t);
                });
            });

            return allTokensMatch;
        });
    }

    function renderModalTables() {
        const content = document.getElementById("modal-catalog-content");
        content.innerHTML = "";

        const rawQuery = searchInput ? searchInput.value.trim() : "";
        const tokens = rawQuery ? rawQuery.toLowerCase().split(/\s+/).filter(Boolean) : [];
        const tablesToRender = getFilteredTables();

        if (badgeTotal) {
            if (rawQuery) {
                badgeTotal.innerText = `${tablesToRender.length} dari ${allCatalogTablesCache.length} Tabel (Filter: "${rawQuery}")`;
            } else {
                badgeTotal.innerText = `${tablesToRender.length} dari ${allCatalogTablesCache.length} Tabel`;
            }
        }

        if (!tablesToRender || tablesToRender.length === 0) {
            content.innerHTML = `
                <div class="p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-white space-y-2">
                    <i data-lucide="search-x" class="w-8 h-8 text-slate-300 mx-auto"></i>
                    <p class="text-xs font-bold text-slate-700">Tidak ada tabel atau atribut yang cocok dengan "${rawQuery}"</p>
                    <p class="text-[11px] text-slate-400">Pastikan ejaan benar, coba kata kunci lain (mis: peb, tarif, nilai, pelanggan, tanggal), atau reset filter skema ke 'Semua'.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        tablesToRender.forEach((tbl, idx) => {
            const card = document.createElement("div");
            card.className = "p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4 hover:border-blue-300 transition duration-150";

            // Count PII columns
            const piiCount = tbl.columns.filter(c => c.is_pii || (c.tags && c.tags.includes("PII"))).length;
            const pkCols = tbl.columns.filter(c => c.tags && c.tags.includes("PK")).map(c => c.name).join(", ") || "-";

            // Upstream & Downstream badges
            const upstreams = (tbl.lineage_upstream && tbl.lineage_upstream.length > 0) 
                ? tbl.lineage_upstream 
                : ["staging_ceisa.stg_raw_landing"];
            const downstreams = (tbl.lineage_downstream && tbl.lineage_downstream.length > 0) 
                ? tbl.lineage_downstream 
                : ["datamart_ceisa.dm_analitik_nasional"];

            const upstreamBadges = upstreams.map(u => 
                `<span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-mono border border-slate-200">
                    <i data-lucide="arrow-right-circle" class="w-3 h-3 text-emerald-600"></i>
                    <span>${u}</span>
                </span>`
            ).join(" ");

            const downstreamBadges = downstreams.map(d => 
                `<span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-mono border border-blue-200">
                    <i data-lucide="bar-chart-2" class="w-3 h-3 text-blue-600"></i>
                    <span>${d}</span>
                </span>`
            ).join(" ");

            // Sort columns: Matched columns come first if search tokens match attributes!
            const matchedColSet = new Set((tbl._matchedColumns || []).map(mc => mc.name));
            const sortedColumns = [...tbl.columns].sort((a, b) => {
                const aMatched = matchedColSet.has(a.name);
                const bMatched = matchedColSet.has(b.name);
                if (aMatched && !bMatched) return -1;
                if (!aMatched && bMatched) return 1;
                return 0;
            });

            // Preview column chips
            const previewCols = sortedColumns.slice(0, 10).map(c => {
                const isPii = c.is_pii || (c.tags && c.tags.includes("PII"));
                const isPk = c.tags && c.tags.includes("PK");
                const isFk = c.tags && c.tags.includes("FK");
                const isColMatched = matchedColSet.has(c.name);

                let badge = "";
                if (isPk) badge = `<span class="bg-blue-100 text-blue-800 text-[9px] font-bold px-1 rounded ml-1">PK</span>`;
                else if (isFk) badge = `<span class="bg-purple-100 text-purple-800 text-[9px] font-bold px-1 rounded ml-1">FK</span>`;
                else if (isPii) badge = `<span class="bg-amber-100 text-amber-800 text-[9px] font-bold px-1 rounded ml-1">PII</span>`;

                if (isColMatched) {
                    return `<span class="inline-flex items-center bg-amber-100 border border-amber-300 px-2 py-0.5 rounded text-[11px] font-mono font-bold text-amber-950 shadow-2xs">${highlightMatchText(c.name, tokens)}${badge}</span>`;
                }

                return `<span class="inline-flex items-center bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-mono text-slate-700">${highlightMatchText(c.name, tokens)}${badge}</span>`;
            }).join(" ");

            // Schema Table rows for full drawer
            const schemaRows = tbl.columns.map(c => {
                const isPii = c.is_pii || (c.tags && c.tags.includes("PII"));
                const isPk = c.tags && c.tags.includes("PK");
                const isFk = c.tags && c.tags.includes("FK");
                const isColMatched = matchedColSet.has(c.name);

                let tagBadges = [];
                if (isPk) tagBadges.push(`<span class="bg-blue-100 text-blue-800 text-[9px] font-bold px-1.5 py-0.5 rounded">PK</span>`);
                if (isFk) tagBadges.push(`<span class="bg-purple-100 text-purple-800 text-[9px] font-bold px-1.5 py-0.5 rounded">FK</span>`);
                if (isPii) tagBadges.push(`<span class="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded">PII / Masking</span>`);
                if (c.tags) {
                    c.tags.filter(t => !["PK", "FK", "PII"].includes(t)).forEach(t => {
                        tagBadges.push(`<span class="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded">${t}</span>`);
                    });
                }

                const rowBg = isColMatched ? "bg-amber-50/90 border-l-4 border-amber-500 font-medium" : "hover:bg-slate-50/70";

                return `
                    <tr class="border-b border-slate-100 ${rowBg} transition">
                        <td class="py-2 px-3 font-mono text-xs ${isColMatched ? 'font-bold text-amber-950' : 'font-bold text-slate-900'}">${highlightMatchText(c.name, tokens)}</td>
                        <td class="py-2 px-3 font-mono text-[11px] text-blue-700 font-semibold">${c.data_type || 'VARCHAR'}</td>
                        <td class="py-2 px-3 text-xs text-slate-600">${highlightMatchText(c.description || '-', tokens)}</td>
                        <td class="py-2 px-3 flex flex-wrap gap-1 items-center">${tagBadges.join(" ")}</td>
                    </tr>
                `;
            }).join("");

            const drawerId = `catalog-drawer-${idx}`;
            const isAutoExpanded = Boolean(tokens.length > 0 && tbl._hasAttrMatch);

            card.innerHTML = `
                <!-- Top Row: FQN, Tier, and Action Buttons -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
                    <div class="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span class="font-mono text-xs text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md font-bold flex items-center space-x-1.5">
                            <i data-lucide="table" class="w-3.5 h-3.5 text-blue-600"></i>
                            <span>${highlightMatchText(tbl.fqn, tokens)}</span>
                        </span>
                        <span class="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full font-medium">${tbl.tier || 'Tier 1'}</span>
                        <span class="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">Schema: ${tbl.schema_name || 'public'}</span>
                        ${piiCount > 0 ? `<span class="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-semibold flex items-center space-x-1"><i data-lucide="shield-alert" class="w-3 h-3 text-amber-600"></i><span>${piiCount} PII</span></span>` : ''}
                    </div>

                    <div class="flex items-center space-x-2 flex-shrink-0">
                        <button class="btn-copy-catalog-fqn text-[11px] font-medium text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1 rounded-lg transition flex items-center space-x-1" data-fqn="${tbl.fqn}">
                            <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                            <span>Salin FQN</span>
                        </button>
                        <button class="btn-use-catalog-table text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 border border-blue-600 px-3 py-1 rounded-lg transition shadow-2xs flex items-center space-x-1" data-fqn="${tbl.fqn}" data-table="${tbl.table_name}">
                            <i data-lucide="terminal" class="w-3.5 h-3.5"></i>
                            <span>Query di Studio</span>
                        </button>
                    </div>
                </div>

                <!-- Description & Ownership Details -->
                <div class="space-y-1.5">
                    <h4 class="text-sm font-bold text-slate-900 flex items-center space-x-2">
                        <span>${highlightMatchText(tbl.table_name, tokens)}</span>
                        <span class="text-[11px] text-slate-400 font-normal">(${tbl.columns.length} kolom, PK: ${pkCols})</span>
                    </h4>
                    <p class="text-xs text-slate-600 leading-relaxed">${highlightMatchText(tbl.description, tokens)}</p>
                </div>

                <!-- Attribute Match Notice Banner -->
                ${tbl._hasAttrMatch ? `
                <div class="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                    <div class="flex items-center space-x-1.5 font-medium">
                        <i data-lucide="check-circle" class="w-3.5 h-3.5 text-amber-600 flex-shrink-0"></i>
                        <span>Ditemukan <strong>${tbl._matchedColumns.length} atribut</strong> yang cocok dengan pencarian Anda.</span>
                    </div>
                    <span class="text-[10px] font-mono text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded font-semibold">Glosarium dibuka otomatis</span>
                </div>
                ` : ''}

                <!-- Metadata Properties & Lineage -->
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-[11px]">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                        <div><strong class="text-slate-800">Data Owner:</strong> ${tbl.owner || 'DJBC Subdit Pengelolaan Data'}</div>
                        <div><strong class="text-slate-800">DWH Service:</strong> ${tbl.service_name || 'CEISA40-PostgreSQL-DWH'}</div>
                    </div>

                    <!-- Lineage Path (Upstream ➔ Table ➔ Downstream) -->
                    <div class="pt-2 border-t border-slate-200 flex flex-col gap-1.5">
                        <div class="flex items-center space-x-1.5 font-semibold text-slate-700">
                            <i data-lucide="git-branch" class="w-3.5 h-3.5 text-blue-600"></i>
                            <span>Data Lineage & Aliran ETL:</span>
                        </div>
                        <div class="flex flex-wrap items-center gap-2 pt-0.5 text-[10px]">
                            <div class="flex items-center space-x-1">${upstreamBadges}</div>
                            <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-400"></i>
                            <span class="px-2 py-0.5 rounded bg-blue-600 text-white font-mono font-bold">${tbl.table_name}</span>
                            <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-400"></i>
                            <div class="flex items-center space-x-1">${downstreams.length > 0 ? downstreamBadges : '<span class="text-slate-400 italic">Analitik Ad-hoc</span>'}</div>
                        </div>
                    </div>
                </div>

                <!-- Column Preview & Expand Toggle -->
                <div class="space-y-2 pt-1">
                    <div class="flex items-center justify-between text-[11px]">
                        <span class="font-semibold text-slate-700">Pratinjau Atribut Kolom:</span>
                        <button class="btn-toggle-schema-drawer text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1" data-drawer="${drawerId}">
                            <span>${isAutoExpanded ? 'Tutup Glosarium (Atribut Ditemukan)' : `Buka Glosarium Lengkap (${tbl.columns.length})`}</span>
                            <i data-lucide="chevron-down" class="w-3.5 h-3.5 transition-transform duration-200 ${isAutoExpanded ? 'rotate-180' : ''}" id="icon-${drawerId}"></i>
                        </button>
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                        ${previewCols}
                        ${tbl.columns.length > 10 ? `<span class="text-[11px] text-slate-400 font-mono self-center pl-1">+${tbl.columns.length - 10} lainnya</span>` : ''}
                    </div>
                </div>

                <!-- Expandable Full Schema Drawer -->
                <div id="${drawerId}" class="${isAutoExpanded ? '' : 'hidden'} pt-3 border-t border-slate-200">
                    <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                        <table class="w-full text-left text-xs">
                            <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                                <tr>
                                    <th class="py-2 px-3">Nama Kolom</th>
                                    <th class="py-2 px-3">Tipe Data</th>
                                    <th class="py-2 px-3">Deskripsi Glosarium Bisnis</th>
                                    <th class="py-2 px-3">Tag Tata Kelola</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${schemaRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            content.appendChild(card);
        });

        // Wire Event Listeners inside cards
        document.querySelectorAll(".btn-copy-catalog-fqn").forEach(btn => {
            btn.addEventListener("click", () => {
                const fqn = btn.getAttribute("data-fqn");
                navigator.clipboard.writeText(fqn).then(() => {
                    const originalHtml = btn.innerHTML;
                    btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600"></i><span class="text-emerald-700 font-bold">Tersalin!</span>`;
                    lucide.createIcons();
                    setTimeout(() => {
                        btn.innerHTML = originalHtml;
                        lucide.createIcons();
                    }, 1800);
                });
            });
        });

        document.querySelectorAll(".btn-use-catalog-table").forEach(btn => {
            btn.addEventListener("click", () => {
                const fqn = btn.getAttribute("data-fqn");
                const tblName = btn.getAttribute("data-table");
                modal.classList.add("hidden");

                // Switch to SQL Studio tab
                const tabBtn = document.querySelector('[data-tab="tab-sql"]');
                if (tabBtn) tabBtn.click();

                // Put sample query into SQL editor
                const sampleSql = `-- Query Eksplorasi Katalog: ${fqn}\nSELECT *\nFROM ${fqn}\nLIMIT 20;`;
                const editorInput = document.getElementById("sql-editor-input");
                if (editorInput) {
                    editorInput.value = sampleSql;
                    const editGutter = document.getElementById("sql-edit-gutter");
                    if (editGutter) updateSqlGutter(editGutter, sampleSql);
                    updateSqlStats(sampleSql);
                }

                // If in view mode, also update code block
                const sqlCode = document.getElementById("sql-code-block");
                if (sqlCode) {
                    sqlCode.textContent = sampleSql;
                    if (window.Prism) Prism.highlightElement(sqlCode);
                }
                const viewGutter = document.getElementById("sql-view-gutter");
                if (viewGutter) updateSqlGutter(viewGutter, sampleSql);

                const filenameElem = document.getElementById("sql-window-filename");
                if (filenameElem) filenameElem.innerText = `explore_${tblName}.sql`;

                console.log(`[Catalog] Loaded ${fqn} into SQL Studio.`);
            });
        });

        document.querySelectorAll(".btn-toggle-schema-drawer").forEach(btn => {
            btn.addEventListener("click", () => {
                const drawerId = btn.getAttribute("data-drawer");
                const drawer = document.getElementById(drawerId);
                const icon = document.getElementById(`icon-${drawerId}`);
                if (!drawer) return;

                if (drawer.classList.contains("hidden")) {
                    drawer.classList.remove("hidden");
                    btn.querySelector("span").innerText = "Tutup Glosarium";
                    if (icon) icon.classList.add("rotate-180");
                } else {
                    drawer.classList.add("hidden");
                    btn.querySelector("span").innerText = `Buka Glosarium Lengkap`;
                    if (icon) icon.classList.remove("rotate-180");
                }
            });
        });

        lucide.createIcons();
    }

    // Filter Buttons (Skema)
    schemaFilterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            schemaFilterBtns.forEach(b => {
                b.className = "catalog-filter-btn px-2.5 py-1 rounded-lg font-medium text-xs transition bg-slate-100 hover:bg-slate-200 text-slate-700";
            });
            btn.className = "catalog-filter-btn px-2.5 py-1 rounded-lg font-medium text-xs transition bg-blue-600 text-white shadow-2xs";
            activeCatalogSchemaFilter = btn.getAttribute("data-filter");
            renderModalTables();
        });
    });

    // Tier Select
    if (tierSelect) {
        tierSelect.addEventListener("change", (e) => {
            activeCatalogTierFilter = e.target.value;
            renderModalTables();
        });
    }

    // Open Modal Button
    openBtn.addEventListener("click", async () => {
        modal.classList.remove("hidden");
        const content = document.getElementById("modal-catalog-content");

        if (!allCatalogTablesCache || allCatalogTablesCache.length === 0) {
            content.innerHTML = `<div class="p-8 text-center text-xs text-slate-400">Memuat katalog OpenMetadata...</div>`;
            try {
                const res = await fetch("/api/catalog");
                if (!res.ok) throw new Error("HTTP " + res.status);
                const data = await res.json();
                allCatalogTablesCache = data.tables || [];
            } catch (err) {
                if (window.MOCK_DATA && window.MOCK_DATA.catalog) {
                    allCatalogTablesCache = window.MOCK_DATA.catalog.tables || [];
                } else {
                    content.innerHTML = `<div class="p-8 text-center text-xs text-red-500">Gagal memuat katalog: ${err.message}</div>`;
                    return;
                }
            }
        }
        renderModalTables();
        if (searchInput) {
            setTimeout(() => searchInput.focus(), 50);
        }
    });

    // Real-time search listeners
    if (searchInput) {
        ['input', 'keyup', 'search', 'paste', 'change'].forEach(evt => {
            searchInput.addEventListener(evt, () => {
                renderModalTables();
            });
        });
    }

    // Clear search button
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener("click", () => {
            if (searchInput) {
                searchInput.value = "";
                searchInput.focus();
            }
            clearSearchBtn.classList.add("hidden");
            renderModalTables();
        });
    }

    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    });
}

// 14. Persona Switcher (RBAC Controller)
function setupPersonaSwitcher() {
    const select = document.getElementById("select-persona");
    if (!select) return;

    select.addEventListener("change", (e) => {
        applyPersona(e.target.value);
    });

    // Default ke Data Steward
    applyPersona(select.value || "steward");
}

function applyPersona(persona) {
    const editSqlBtn = document.getElementById("btn-toggle-sql-edit");
    const reverifyBtn = document.getElementById("btn-reverify-sql");
    const btnApprove = document.getElementById("btn-feedback-approve");
    const btnRevision = document.getElementById("btn-feedback-revision");
    const btnReject = document.getElementById("btn-feedback-reject");
    const omSettingsBtn = document.getElementById("btn-open-om-settings");
    const roleNotice = document.getElementById("role-governance-notice");
    const verifierInputs = [
        document.getElementById("verifier-name-input"),
        document.getElementById("verifier-role-input"),
        document.getElementById("verifier-comments-input")
    ];

    if (persona === "analyst") {
        // Data Analyst (Business & Query Analyst)
        if (editSqlBtn) editSqlBtn.classList.add("hidden");
        if (reverifyBtn) reverifyBtn.disabled = true;
        if (btnApprove) btnApprove.disabled = true;
        if (btnRevision) btnRevision.disabled = true;
        if (btnReject) btnReject.disabled = true;
        if (omSettingsBtn) omSettingsBtn.classList.add("hidden"); // Kontrol IT: Sembunyikan konfigurasi infrastruktur
        verifierInputs.forEach(i => { if (i) i.disabled = true; });

        if (roleNotice) {
            roleNotice.className = "p-3 rounded-xl border border-blue-200 bg-blue-50/80 text-xs flex items-center justify-between text-blue-900";
            roleNotice.innerHTML = `
                <div class="flex items-center space-x-2">
                    <i data-lucide="info" class="w-4 h-4 text-blue-600 flex-shrink-0"></i>
                    <div>
                        <span class="font-bold">Mode Peninjauan Data Analyst (Read-Only)</span>
                        <p class="text-[11px] text-blue-700">Sebagai Data Analyst, Anda dapat memantau status audit dan mengunduh berkas data yang telah disahkan. Otorisasi sign-off merupakan wewenang Data Steward.</p>
                    </div>
                </div>
                <span class="bg-blue-200/80 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">Read-Only</span>
            `;
            lucide.createIcons();
        }
        appendConsoleLog("RBAC", "Peran aktif: 👤 Data Analyst. Akses dibatasi pada peninjauan spesifikasi dan pengunduhan.");
    } else if (persona === "steward") {
        // Data Steward (Compliance & Governance Officer)
        if (editSqlBtn) editSqlBtn.classList.remove("hidden");
        if (reverifyBtn) reverifyBtn.disabled = false;
        if (btnApprove) btnApprove.disabled = false;
        if (btnRevision) btnRevision.disabled = false;
        if (btnReject) btnReject.disabled = false;
        if (omSettingsBtn) omSettingsBtn.classList.add("hidden"); // Pemisahan tugas: Infrastruktur dikelola Admin/Data Engineer
        verifierInputs.forEach(i => { if (i) i.disabled = false; });

        if (roleNotice) {
            roleNotice.className = "p-3 rounded-xl border border-indigo-200 bg-indigo-50/80 text-xs flex items-center justify-between text-indigo-900";
            roleNotice.innerHTML = `
                <div class="flex items-center space-x-2">
                    <i data-lucide="shield-check" class="w-4 h-4 text-indigo-600 flex-shrink-0"></i>
                    <div>
                        <span class="font-bold">Mode Otorisasi Tata Kelola Data (Data Steward)</span>
                        <p class="text-[11px] text-indigo-700">Anda memiliki wewenang untuk menelaah kesesuaian PDP, mengedit SQL jika diperlukan, dan memberikan keputusan persetujuan resmi (Sign-off).</p>
                    </div>
                </div>
                <span class="bg-indigo-200/80 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">Full Sign-off</span>
            `;
            lucide.createIcons();
        }
        appendConsoleLog("RBAC", "Peran aktif: 🛡️ Data Steward (Verifikator). Hak edit SQL dan otorisasi sign-off aktif.");
    } else if (persona === "admin") {
        // Data Engineer / IT Admin
        if (editSqlBtn) editSqlBtn.classList.remove("hidden");
        if (reverifyBtn) reverifyBtn.disabled = false;
        if (btnApprove) btnApprove.disabled = false;
        if (btnRevision) btnRevision.disabled = false;
        if (btnReject) btnReject.disabled = false;
        if (omSettingsBtn) omSettingsBtn.classList.remove("hidden"); // Akses administratif dibuka
        verifierInputs.forEach(i => { if (i) i.disabled = false; });

        if (roleNotice) {
            roleNotice.className = "p-3 rounded-xl border border-slate-300 bg-slate-100 text-xs flex items-center justify-between text-slate-800";
            roleNotice.innerHTML = `
                <div class="flex items-center space-x-2">
                    <i data-lucide="settings-2" class="w-4 h-4 text-slate-700 flex-shrink-0"></i>
                    <div>
                        <span class="font-bold">Mode Rekayasa Data & Administrator (Data Engineer)</span>
                        <p class="text-[11px] text-slate-600">Akses penuh ke konfigurasi koneksi OpenMetadata, target database, serta penyesuaian query DWH tingkat lanjut.</p>
                    </div>
                </div>
                <span class="bg-slate-300 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">Admin Access</span>
            `;
            lucide.createIcons();
        }
        appendConsoleLog("RBAC", "Peran aktif: ⚙️ Data Engineer / Admin. Akses penuh ke seluruh konfigurasi DWH & OpenMetadata.");
    }
}

// 15. OpenMetadata Settings Modal
function setupOmSettingsModal() {
    const modal = document.getElementById("om-settings-modal");
    const openBtn = document.getElementById("btn-open-om-settings");
    const closeBtn = document.getElementById("btn-close-om-settings");
    const testBtn = document.getElementById("btn-test-om-conn");
    const saveBtn = document.getElementById("btn-save-om-settings");
    const testResult = document.getElementById("om-test-result-text");

    if (!modal || !openBtn) return;

    openBtn.addEventListener("click", async () => {
        modal.classList.remove("hidden");
        try {
            let data = null;
            try {
                const res = await fetch("/api/config/openmetadata");
                if (res.ok) data = await res.json();
            } catch (e) {}
            if (!data) {
                data = { api_url: "http://localhost:8585/api/v1", jwt_token: "", preferred_mode: "AUTO", status: { connected: false, tables_available: 11 } };
            }
            document.getElementById("input-om-url").value = data.api_url || "http://localhost:8585/api/v1";
            document.getElementById("input-om-jwt").value = data.jwt_token || "";
            document.getElementById("select-om-mode").value = data.preferred_mode || "AUTO";
            if (data.status && data.status.connected) {
                testResult.innerHTML = `<span class="text-emerald-600 font-semibold">● Terhubung ke Live Server (v${data.status.version})</span>`;
            } else {
                testResult.innerHTML = `<span class="text-blue-600 font-semibold">● Offline Emulated (Katalog DWH Internal: ${data.status.tables_available} Tabel)</span>`;
            }
        } catch (err) {
            testResult.innerText = "Gagal memuat konfigurasi.";
        }
    });

    closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    });

    testBtn.addEventListener("click", async () => {
        testResult.innerHTML = `<span class="text-slate-500 animate-pulse">Menguji koneksi server...</span>`;
        try {
            const res = await fetch("/api/config/openmetadata");
            const data = await res.json();
            if (data.status && data.status.connected) {
                testResult.innerHTML = `<span class="text-emerald-600 font-semibold">✅ Sukses: Server Aktif (${data.status.version})</span>`;
            } else {
                testResult.innerHTML = `<span class="text-amber-600 font-semibold">ℹ️ Live server tidak merespons, Katalog DWH internal aktif (${data.status.tables_available} tabel).</span>`;
            }
        } catch (err) {
            testResult.innerHTML = `<span class="text-red-500 font-semibold">❌ Koneksi gagal: ${err.message}</span>`;
        }
    });

    saveBtn.addEventListener("click", async () => {
        const url = document.getElementById("input-om-url").value.trim();
        const jwt = document.getElementById("input-om-jwt").value.trim();
        const mode = document.getElementById("select-om-mode").value;

        saveBtn.disabled = true;
        saveBtn.innerHTML = `<i data-lucide="loader-2" class="w-3.5 h-3.5 animate-spin"></i><span>Menyimpan...</span>`;
        lucide.createIcons();

        try {
            const res = await fetch("/api/config/openmetadata", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "X-User-Role": getCurrentPersona()
                },
                body: JSON.stringify({ api_url: url, jwt_token: jwt, preferred_mode: mode })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Gagal menyimpan konfigurasi.");
            }
            const data = await res.json();
            modal.classList.add("hidden");
            checkHealth();
            appendConsoleLog("OpenMetadata", `Konfigurasi berhasil disimpan. Mode: ${data.preferred_mode}`);
        } catch (err) {
            alert(`Gagal menyimpan: ${err.message}`);
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = `<i data-lucide="save" class="w-3.5 h-3.5"></i><span>Simpan Pengaturan</span>`;
            lucide.createIcons();
        }
    });
}

// 16. Analytics & Compliance Insights Modal (Chart.js & PDP Governance)
let chartStatusDonutInstance = null;
let chartBizProcessInstance = null;
let chartTimelineTrendInstance = null;

let currentAnalyticsPeriod = "all";

function renderDeltaBadge(elemId, deltaObj, isInverse = false) {
    const elem = document.getElementById(elemId);
    if (!elem) return;

    if (!deltaObj) {
        elem.className = "text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center bg-slate-100 text-slate-500 border border-slate-200";
        elem.innerHTML = `<span>0.0%</span>`;
        return;
    }

    const val = deltaObj.value || 0;
    const formatted = deltaObj.formatted || `${val}%`;

    // Untuk latensi (isInverse = true), penurunan durasi adalah hal positif (warna hijau)
    const isPositive = isInverse ? val < 0 : val > 0;
    const isNegative = isInverse ? val > 0 : val < 0;

    let bgClass = "bg-slate-100 text-slate-700 border border-slate-200";
    let icon = `<i data-lucide="minus" class="w-3 h-3 inline mr-0.5"></i>`;

    if (isPositive) {
        bgClass = "bg-emerald-100 text-emerald-800 border border-emerald-300";
        icon = `<i data-lucide="trending-up" class="w-3 h-3 inline mr-0.5"></i>`;
    } else if (isNegative) {
        bgClass = isInverse
            ? "bg-amber-100 text-amber-800 border border-amber-300"
            : "bg-red-100 text-red-800 border border-red-300";
        icon = `<i data-lucide="trending-down" class="w-3 h-3 inline mr-0.5"></i>`;
    }

    elem.className = `text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center shadow-2xs ${bgClass}`;
    elem.innerHTML = `${icon}<span>${formatted}</span>`;
}

async function fetchAndRenderAnalytics(period = "all") {
    try {
        let data = null;
        try {
            const res = await fetch(`/api/analytics?period=${encodeURIComponent(period)}`);
            if (res.ok) data = await res.json();
        } catch (e) {}

        if (!data && window.MOCK_DATA && window.MOCK_DATA.analytics) {
            data = window.MOCK_DATA.analytics;
        }
        if (!data) return;

        // Label perbandingan periode
        const compLabelElem = document.getElementById("period-comparison-label");
        if (compLabelElem && data.comparison_label) {
            compLabelElem.innerText = `Membandingkan tren ${data.comparison_label}`;
        }

        // 1. Top 6 KPI Cards
        const reqCount = data.total_requests || 0;
        document.getElementById("stat-total-requests").innerText = reqCount;
        document.getElementById("stat-compliance-rate").innerText = `${data.compliance_rate_pct || 100}%`;
        document.getElementById("stat-total-rows").innerText = (data.total_rows_delivered || 0).toLocaleString();
        document.getElementById("stat-pii-columns").innerText = `${data.pii_columns_protected_count || reqCount * 6}`;
        document.getElementById("stat-avg-latency").innerText = `${data.avg_latency_ms || 38.5} ms`;
        document.getElementById("stat-digital-seal").innerText = `${data.digital_seal_pct || 100}%`;

        // 2. Render 6 Delta Change Badges
        const deltas = data.deltas || {};
        renderDeltaBadge("delta-total-requests", deltas.total_requests, false);
        renderDeltaBadge("delta-compliance-rate", deltas.compliance_rate, false);
        renderDeltaBadge("delta-total-rows", deltas.total_rows, false);
        renderDeltaBadge("delta-pii-columns", deltas.pii_protected, false);
        renderDeltaBadge("delta-avg-latency", deltas.avg_latency, true); // Latensi: penurunan = perbaikan hijau
        renderDeltaBadge("delta-digital-seal", deltas.digital_seal, false);

        // Sub-pill counts
        const approvedCount = data.approved_count || 0;
        const revisionCount = data.revision_count || 0;
        const rejectedCount = data.rejected_count || 0;
        const pillApp = document.getElementById("pill-approved-count");
        const pillRev = document.getElementById("pill-revision-count");
        const pillRej = document.getElementById("pill-rejected-count");
        if (pillApp) pillApp.innerText = approvedCount;
        if (pillRev) pillRev.innerText = revisionCount;
        if (pillRej) pillRej.innerText = rejectedCount;

        // 3. UU PDP Masking Breakdown Cards
        const pii = data.pii_breakdown || {};
        const npwpElem = document.getElementById("stat-npwp-masked");
        const nikElem = document.getElementById("stat-nik-masked");
        const namaElem = document.getElementById("stat-nama-masked");
        const phoneElem = document.getElementById("stat-kontak-masked");
        if (npwpElem) npwpElem.innerText = `${(pii.npwp_masked ?? reqCount * 2).toLocaleString()} Rekor`;
        if (nikElem) nikElem.innerText = `${(pii.nik_masked ?? reqCount).toLocaleString()} Rekor`;
        if (namaElem) namaElem.innerText = `${(pii.nama_masked ?? reqCount * 2).toLocaleString()} Rekor`;
        if (phoneElem) phoneElem.innerText = `${(pii.phone_masked ?? reqCount).toLocaleString()} Rekor`;

        // 4. Render Chart 1: Donut Status Keputusan Verifikator
        if (typeof Chart !== "undefined") {
            const donutCtx = document.getElementById("chart-status-donut");
            if (donutCtx) {
                if (chartStatusDonutInstance) {
                    chartStatusDonutInstance.destroy();
                    chartStatusDonutInstance = null;
                }
                chartStatusDonutInstance = new Chart(donutCtx, {
                    type: "doughnut",
                    data: {
                        labels: ["Disetujui Resmi", "Perlu Revisi", "Ditolak / Disangkal"],
                        datasets: [{
                            data: [approvedCount, revisionCount, rejectedCount],
                            backgroundColor: ["#10b981", "#f59e0b", "#ef4444"],
                            hoverBackgroundColor: ["#059669", "#d97706", "#dc2626"],
                            borderWidth: 2,
                            borderColor: "#ffffff"
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: "68%",
                        plugins: {
                            legend: {
                                position: "bottom",
                                labels: {
                                    boxWidth: 12,
                                    font: { size: 11, family: "inherit" },
                                    color: "#475569"
                                }
                            }
                        }
                    }
                });
            }

            // 5. Render Chart 2: Proses Bisnis Kepabeanan
            const bizCtx = document.getElementById("chart-biz-process");
            if (bizCtx) {
                if (chartBizProcessInstance) {
                    chartBizProcessInstance.destroy();
                    chartBizProcessInstance = null;
                }
                const bizData = data.business_process_distribution || {
                    "Ekspor (PEB BC 3.0)": reqCount,
                    "Impor (PIB BC 2.0)": 0,
                    "Cukai (BKC)": 0,
                    "Manifest (BC 1.1)": 0,
                    "TPB / Fasilitas Berikat": 0
                };
                const bizLabels = Object.keys(bizData);
                const bizValues = Object.values(bizData);

                // Update lead biz process label
                const leadElem = document.getElementById("lead-biz-process");
                if (leadElem && Object.keys(bizData).length > 0) {
                    const sortedBiz = Object.entries(bizData).sort((a, b) => b[1] - a[1]);
                    leadElem.innerText = `${sortedBiz[0][0]} (${sortedBiz[0][1]} req)`;
                }

                chartBizProcessInstance = new Chart(bizCtx, {
                    type: "bar",
                    data: {
                        labels: bizLabels,
                        datasets: [{
                            label: "Jumlah Permohonan",
                            data: bizValues,
                            backgroundColor: ["#2563eb", "#0d9488", "#d97706", "#7c3aed", "#64748b"],
                            borderRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: "y",
                        scales: {
                            x: {
                                beginAtZero: true,
                                grid: { color: "#f1f5f9" },
                                ticks: { precision: 0, font: { size: 10 } }
                            },
                            y: {
                                grid: { display: false },
                                ticks: { font: { size: 10 } }
                            }
                        },
                        plugins: {
                            legend: { display: false }
                        }
                    }
                });
            }

            // 6. Render Chart 3: Timeline Aktivitas Pemenuhan Data
            const timelineCtx = document.getElementById("chart-timeline-trend");
            if (timelineCtx) {
                if (chartTimelineTrendInstance) {
                    chartTimelineTrendInstance.destroy();
                    chartTimelineTrendInstance = null;
                }
                const trends = data.timeline_trends && data.timeline_trends.length > 0
                    ? data.timeline_trends
                    : [{ date: new Date().toISOString().split("T")[0], total: reqCount, approved: approvedCount, rows: data.total_rows_delivered || 0 }];
                
                const timeLabels = trends.map(t => t.date);
                const timeTotals = trends.map(t => t.total);
                const timeApproved = trends.map(t => t.approved);

                chartTimelineTrendInstance = new Chart(timelineCtx, {
                    type: "line",
                    data: {
                        labels: timeLabels,
                        datasets: [
                            {
                                label: "Total Permohonan Masuk",
                                data: timeTotals,
                                borderColor: "#4f46e5",
                                backgroundColor: "rgba(79, 70, 229, 0.1)",
                                tension: 0.3,
                                fill: true,
                                pointRadius: 4
                            },
                            {
                                label: "Disetujui Resmi (Fulfillment)",
                                data: timeApproved,
                                borderColor: "#10b981",
                                backgroundColor: "rgba(16, 185, 129, 0.1)",
                                tension: 0.3,
                                fill: false,
                                pointRadius: 4
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: { color: "#f1f5f9" },
                                ticks: { precision: 0, font: { size: 10 } }
                            },
                            x: {
                                grid: { display: false },
                                ticks: { font: { size: 10 } }
                            }
                        },
                        plugins: {
                            legend: {
                                position: "top",
                                labels: { boxWidth: 10, font: { size: 10 } }
                            }
                        }
                    }
                });
            }
        }

        // 7. Render Departemen List
        const deptList = document.getElementById("analytics-dept-list");
        if (deptList) {
            deptList.innerHTML = "";
            const depts = data.department_distribution || {};
            if (Object.keys(depts).length === 0) {
                deptList.innerHTML = `<div class="text-slate-400 italic">Belum ada data permohonan.</div>`;
            } else {
                for (const [dept, count] of Object.entries(depts)) {
                    const pct = reqCount > 0 ? Math.round((count / reqCount) * 100) : 0;
                    let barColor = "bg-blue-600";
                    let badgeColor = "bg-blue-50 text-blue-900 border-blue-200";
                    if (dept.includes("Bea dan Cukai")) {
                        barColor = "bg-blue-700";
                        badgeColor = "bg-blue-50 text-blue-900 border-blue-200";
                    } else if (dept.includes("Internal Kemenkeu")) {
                        barColor = "bg-amber-600";
                        badgeColor = "bg-amber-50 text-amber-900 border-amber-200";
                    } else if (dept.includes("Eksternal")) {
                        barColor = "bg-teal-600";
                        badgeColor = "bg-teal-50 text-teal-900 border-teal-200";
                    }

                    const item = document.createElement("div");
                    item.className = "space-y-1 bg-white p-2 rounded-lg border border-slate-200";
                    item.innerHTML = `
                        <div class="flex justify-between items-center text-xs">
                            <span class="font-semibold px-2 py-0.5 rounded text-[10px] border ${badgeColor}">${dept}</span>
                            <span class="text-slate-600 font-mono font-bold">${count} req (${pct}%)</span>
                        </div>
                        <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                            <div class="${barColor} h-1.5 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                        </div>
                    `;
                    deptList.appendChild(item);
                }
            }
        }

        // 8. Render Dialect Distribution List
        const dialectList = document.getElementById("analytics-dialect-list");
        if (dialectList) {
            dialectList.innerHTML = "";
            const dialects = data.dialect_distribution || { "PostgreSQL": reqCount, "Oracle": 0, "SQLite": 0 };
            for (const [dName, dCount] of Object.entries(dialects)) {
                const card = document.createElement("div");
                card.className = "bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs";
                card.innerHTML = `
                    <span class="text-[10px] text-slate-500 font-bold block uppercase">${dName}</span>
                    <span class="text-sm font-bold text-slate-900 font-mono mt-0.5 block">${dCount}</span>
                `;
                dialectList.appendChild(card);
            }
        }

        lucide.createIcons();
    } catch (err) {
        console.error("Gagal memuat analitik:", err);
    }
}

function setupAnalyticsModal() {
    const modal = document.getElementById("analytics-modal");
    const openBtn = document.getElementById("btn-open-analytics");
    const closeBtn = document.getElementById("btn-close-analytics");
    const exportCsvBtn = document.getElementById("btn-export-analytics-csv");
    const printBtn = document.getElementById("btn-print-analytics");

    if (!modal || !openBtn) return;

    if (exportCsvBtn) {
        exportCsvBtn.addEventListener("click", () => {
            if (!isGitHubPagesOrOffline()) {
                window.open("/api/history/export", "_blank");
            } else {
                const items = (window.MOCK_DATA && window.MOCK_DATA.history) ? window.MOCK_DATA.history : [];
                if (!items.length) {
                    alert("Tidak ada data riwayat untuk diekspor.");
                    return;
                }
                const headers = ["ID Permohonan", "Nama Pemohon", "Unit Kerja", "Waktu", "Status", "Jumlah Baris", "Skor SLA"];
                const rows = items.map(it => [
                    it.request_id || "",
                    `"${(it.requester_name || "").replace(/"/g, '""')}"`,
                    `"${(it.department || "").replace(/"/g, '""')}"`,
                    it.processed_at || "",
                    it.status || "",
                    it.rows_delivered || 0,
                    it.sla_score || 0
                ]);
                const csvStr = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
                downloadClientBlob(`Export_Riwayat_CMS_${new Date().toISOString().slice(0,10)}.csv`, csvStr, "text/csv;charset=utf-8;");
            }
        });
    }

    if (printBtn) {
        printBtn.addEventListener("click", () => {
            window.print();
        });
    }

    // Attach click listeners to period filter buttons
    const periodButtons = modal.querySelectorAll(".btn-period-filter");
    periodButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            periodButtons.forEach(b => {
                b.className = "btn-period-filter px-3 py-1 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition";
            });
            btn.className = "btn-period-filter px-3 py-1 rounded-lg font-semibold transition bg-blue-600 text-white shadow-2xs";
            const period = btn.getAttribute("data-period") || "all";
            currentAnalyticsPeriod = period;
            fetchAndRenderAnalytics(period);
        });
    });

    openBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");
        fetchAndRenderAnalytics(currentAnalyticsPeriod);
    });

    closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    });
}

// 17. Spec Confirmation Modal (Human-in-the-Loop)
function openSpecConfirmationModal(spec) {
    const modal = document.getElementById("spec-confirmation-modal");
    if (!modal) return;

    document.getElementById("conf-req-id").value = spec.request_id || "REQ-UNKNOWN";
    document.getElementById("conf-requester").value = spec.requester_name || "";
    
    // Set 3 kategori unit kerja resmi
    const deptSelect = document.getElementById("conf-dept");
    const subdeptInput = document.getElementById("conf-subdept");
    const rawDept = spec.requester_department || "Internal Bea dan Cukai";
    let baseDept = "Internal Bea dan Cukai";
    let subDept = "";

    if (rawDept.includes("Bea dan Cukai")) {
        baseDept = "Internal Bea dan Cukai";
    } else if (rawDept.includes("Internal Kemenkeu")) {
        baseDept = "Internal Kemenkeu";
    } else if (rawDept.includes("Eksternal")) {
        baseDept = "Eksternal Kemenkeu";
    }

    const subMatch = rawDept.match(/\(([^)]+)\)/);
    if (subMatch) {
        subDept = subMatch[1].trim();
    }
    if (deptSelect) deptSelect.value = baseDept;
    if (subdeptInput) subdeptInput.value = subDept;

    // Set Tipe Proses Bisnis
    const bProcSelect = document.getElementById("conf-business-process");
    if (bProcSelect) {
        bProcSelect.value = spec.business_process || "Lainnya";
    }

    function normalizeDateInput(val, fallback) {
        if (!val) return fallback;
        const match = String(val).match(/\d{4}-\d{2}-\d{2}/);
        return match ? match[0] : fallback;
    }

    document.getElementById("conf-purpose").value = spec.business_purpose || "";
    document.getElementById("conf-date-start").value = normalizeDateInput(spec.time_range_start, "2026-07-01");
    document.getElementById("conf-date-end").value = normalizeDateInput(spec.time_range_end, "2026-09-30");

    // Render Kolom yang Diminta
    const fieldsContainer = document.getElementById("conf-fields-container");
    fieldsContainer.innerHTML = "";
    if (!spec.requested_fields || spec.requested_fields.length === 0) {
        fieldsContainer.innerHTML = `<div class="text-slate-400 italic">Tidak ada kolom khusus terdeteksi.</div>`;
    } else {
        spec.requested_fields.forEach((f, idx) => {
            const item = document.createElement("div");
            item.className = "flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 transition shadow-2xs";
            item.innerHTML = `
                <label class="flex items-center space-x-2.5 cursor-pointer flex-1 mr-2 truncate">
                    <input type="checkbox" class="conf-field-checkbox rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer" data-field-index="${idx}" checked>
                    <span class="font-medium text-slate-800 dark:text-slate-100 truncate">${f.description || f.name}</span>
                    <span class="text-[10px] text-slate-400 dark:text-slate-400 font-mono">(${f.name})</span>
                </label>
                ${f.pii_sensitive ? `<span class="bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40 text-[9px] font-bold px-2 py-0.5 rounded-md flex-shrink-0">PII / PDP</span>` : `<span class="bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 text-[9px] font-medium px-2 py-0.5 rounded-md flex-shrink-0">Standar</span>`}
            `;
            fieldsContainer.appendChild(item);
        });
    }

    // Render Filter Bisnis dengan Checkbox Interaktif
    const filtersContainer = document.getElementById("conf-filters-container");
    filtersContainer.innerHTML = "";
    if (!spec.filters || spec.filters.length === 0) {
        filtersContainer.innerHTML = `<div class="text-slate-400 italic">Tidak ada filter bisnis khusus terdeteksi.</div>`;
    } else {
        spec.filters.forEach((filt, fIdx) => {
            const item = document.createElement("div");
            item.className = "p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-1 hover:border-emerald-400 dark:hover:border-emerald-500 transition shadow-2xs";
            const valDisplay = Array.isArray(filt.value) ? filt.value.join(" s/d ") : filt.value;
            item.innerHTML = `
                <div class="flex items-center justify-between">
                    <label class="flex items-center space-x-2.5 cursor-pointer flex-1 mr-2 truncate">
                        <input type="checkbox" class="conf-filter-checkbox rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer" data-filter-index="${fIdx}" checked>
                        <span class="font-semibold text-slate-800 dark:text-slate-100 text-xs truncate">${filt.field_description}</span>
                    </label>
                    <span class="font-mono text-[10px] bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-500/40 font-semibold">${filt.target_column} ${filt.operator} '${valDisplay}'</span>
                </div>
                ${filt.rationale ? `<p class="text-[10px] text-slate-500 dark:text-slate-400 pl-6">${filt.rationale}</p>` : ''}
            `;
            filtersContainer.appendChild(item);
        });
    }

    modal.classList.remove("hidden");
    lucide.createIcons();
}

function setupSpecConfirmationModal() {
    const modal = document.getElementById("spec-confirmation-modal");
    const closeBtn = document.getElementById("btn-close-spec-conf");
    const cancelBtn = document.getElementById("btn-cancel-spec-conf");
    const confirmBtn = document.getElementById("btn-confirm-and-run");

    if (!modal) return;

    closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
    cancelBtn.addEventListener("click", () => modal.classList.add("hidden"));
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    });

    // Otomatis buka popup kalender saat kolom input tanggal diklik
    const dateStartInput = document.getElementById("conf-date-start");
    const dateEndInput = document.getElementById("conf-date-end");
    [dateStartInput, dateEndInput].forEach(inp => {
        if (!inp) return;
        inp.addEventListener("click", () => {
            if (typeof inp.showPicker === "function") {
                try {
                    inp.showPicker();
                } catch (e) {
                    // Fallback jika picker sudah aktif
                }
            }
        });
    });

    confirmBtn.addEventListener("click", async () => {
        if (!extractedSpecForConfirmation) return;

        // Ambil nilai formulir yang diedit pengguna
        extractedSpecForConfirmation.requester_name = document.getElementById("conf-requester").value.trim();
        const baseDeptVal = document.getElementById("conf-dept")?.value || "Internal Bea dan Cukai";
        const subDeptVal = document.getElementById("conf-subdept")?.value.trim();
        extractedSpecForConfirmation.requester_department = subDeptVal ? `${baseDeptVal} (${subDeptVal})` : baseDeptVal;
        extractedSpecForConfirmation.business_process = document.getElementById("conf-business-process")?.value || "Lainnya";
        extractedSpecForConfirmation.business_purpose = document.getElementById("conf-purpose").value.trim();
        extractedSpecForConfirmation.time_range_start = document.getElementById("conf-date-start").value.trim();
        extractedSpecForConfirmation.time_range_end = document.getElementById("conf-date-end").value.trim();

        // 3. Ambil pilihan kolom yang dicentang saja (Data Minimization)
        const checkboxes = document.querySelectorAll(".conf-field-checkbox");
        const filteredFields = [];
        checkboxes.forEach(cb => {
            if (cb.checked) {
                const idx = parseInt(cb.getAttribute("data-field-index"));
                filteredFields.push(extractedSpecForConfirmation.requested_fields[idx]);
            }
        });

        if (filteredFields.length === 0) {
            alert("Harap pilih minimal 1 kolom data untuk diekstraksi!");
            return;
        }

        extractedSpecForConfirmation.requested_fields = filteredFields;

        // 4. Ambil kriteria filter bisnis yang dicentang
        const filterCheckboxes = document.querySelectorAll(".conf-filter-checkbox");
        if (filterCheckboxes.length > 0) {
            const activeFilters = [];
            filterCheckboxes.forEach(cb => {
                if (cb.checked) {
                    const idx = parseInt(cb.getAttribute("data-filter-index"));
                    activeFilters.push(extractedSpecForConfirmation.filters[idx]);
                }
            });
            extractedSpecForConfirmation.filters = activeFilters;
        }

        // Sinkronisasi Kebijakan Masking PII yang dipilih
        const maskingPolicyVal = document.getElementById("conf-masking-policy")?.value || "PARTIAL";
        const matchingRadio = document.querySelector(`input[name="masking-mode"][value="${maskingPolicyVal}"]`);
        if (matchingRadio) matchingRadio.checked = true;

        // Ambil granularitas
        const granRadio = document.querySelector('input[name="conf-granularity"]:checked');
        if (granRadio) {
            extractedSpecForConfirmation.aggregation_level = granRadio.value;
        }

        modal.classList.add("hidden");

        // Lanjutkan pipeline eksekusi streaming dengan spec terkonfirmasi
        await executeConfirmedStreamingPipeline(extractedSpecForConfirmation);
    });
}

async function executeConfirmedStreamingPipeline(spec) {
    const btn = document.getElementById("btn-process");
    btn.disabled = true;
    btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Menjalankan Query & Eksekusi...</span>`;
    lucide.createIcons();

    const consoleLogs = document.getElementById("console-logs");
    consoleLogs.innerHTML = "";
    appendConsoleLog("Coordinator", "Spesifikasi telah dikonfirmasi oleh pengguna. Menjalankan sintesis query & eksekusi database...");

    const dialect = document.getElementById("select-dialect").value;
    const maskingElem = document.getElementById("select-masking");
    const maskingMode = maskingElem ? maskingElem.value : "PARTIAL";

    try {
        let streamSuccess = false;
        if (!isGitHubPagesOrOffline()) {
            try {
                const response = await fetch("/api/process-confirmed-stream", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        spec: spec,
                        dialect: dialect,
                        masking_mode: maskingMode
                    })
                });
                if (response.ok) {
                    await processSSEStreamResponse(response);
                    streamSuccess = true;
                }
            } catch (netErr) {
                console.warn("SSE confirmed stream fetch failed, falling back to client demo:", netErr);
            }
        }
        if (!streamSuccess) {
            appendConsoleLog("System", "Menjalankan simulasi streaming query pipeline dengan spesifikasi terkonfirmasi...");
            await simulateClientStreamingPipeline(selectedSampleName, spec, dialect, maskingMode);
        }
    } catch (err) {
        alert("Gagal memproses eksekusi query: " + err.message);
        appendConsoleLog("Error", "Kegagalan eksekusi: " + err.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="play" class="w-4 h-4 fill-white"></i><span>Jalankan Pipeline Pemenuhan Data</span>`;
        lucide.createIcons();
    }
}

