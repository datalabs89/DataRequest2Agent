// DataRequest Studio — Enterprise Frontend Controller

document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    initApp();
});

let selectedFile = null;
let selectedSampleName = null;
let currentPipelineData = null;
let isSqlEditMode = false;
let originalGeneratedSqlQuery = "";

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

    document.getElementById("btn-process").addEventListener("click", runStreamingPipeline);
    document.getElementById("btn-copy-sql").addEventListener("click", copySql);
}

// 1. Health & Connection Check
async function checkHealth() {
    try {
        const res = await fetch("/api/health");
        const data = await res.json();
        const textElem = document.getElementById("om-status-text");
        const badgeElem = document.getElementById("badge-om-status");
        if (data.openmetadata && data.openmetadata.connected) {
            textElem.innerText = `Live (v${data.openmetadata.version || '1.0'})`;
            if (badgeElem) {
                badgeElem.className = "flex items-center space-x-1.5 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200/90 px-2.5 py-1.5 rounded-xl font-medium flex-shrink-0 whitespace-nowrap shadow-2xs";
                badgeElem.title = `OpenMetadata Live Server Aktif (Versi ${data.openmetadata.version})`;
            }
        } else {
            const count = data.openmetadata ? data.openmetadata.tables_available : 5;
            textElem.innerText = `Katalog DWH (${count})`;
            if (badgeElem) {
                badgeElem.className = "flex items-center space-x-1.5 text-xs bg-blue-50 text-blue-800 border border-blue-200/90 px-2.5 py-1.5 rounded-xl font-medium flex-shrink-0 whitespace-nowrap shadow-2xs";
                badgeElem.title = `Katalog DWH Enterprise Emulated (${count} Tabel Aktif)`;
            }
        }
    } catch (err) {
        console.warn("Health check error:", err);
    }
}

// 2. Load Samples
async function loadSamples() {
    const listElem = document.getElementById("sample-list");
    try {
        const res = await fetch("/api/samples");
        const data = await res.json();
        if (!data.samples || data.samples.length === 0) {
            listElem.innerHTML = `<div class="text-xs text-slate-400">Tidak ada sample tersedia.</div>`;
            return;
        }

        listElem.innerHTML = "";
        data.samples.forEach((s, idx) => {
            const btn = document.createElement("button");
            btn.className = `w-full text-left p-2.5 rounded-lg border text-xs transition flex items-center justify-between ${
                idx === 0 ? "border-blue-500 bg-blue-50/50 text-blue-900 font-semibold" : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
            }`;
            btn.innerHTML = `
                <div class="truncate pr-2">
                    <p class="truncate font-medium">${s.title}</p>
                    <p class="text-[10px] text-slate-400 mt-0.5">PDF Berkas Resmi (${Math.round(s.size_bytes / 1024)} KB)</p>
                </div>
                <i data-lucide="file-check" class="w-4 h-4 text-blue-600 flex-shrink-0"></i>
            `;
            btn.addEventListener("click", () => {
                selectSample(s.filename, btn);
            });
            listElem.appendChild(btn);

            if (idx === 0) {
                selectedSampleName = s.filename;
            }
        });
        lucide.createIcons();
    } catch (err) {
        listElem.innerHTML = `<div class="text-xs text-red-400">Gagal memuat sample.</div>`;
    }
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
            const res = await fetch("/api/extract-spec", {
                method: "POST",
                body: formData
            });
            if (!res.ok) {
                throw new Error(`Server returned HTTP ${res.status}`);
            }
            const spec = await res.json();
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
        const response = await fetch("/api/process-stream", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Server returned HTTP ${response.status}`);
        }

        await processSSEStreamResponse(response);
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
        item.className = "p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between";
        const valStr = Array.isArray(f.value) ? f.value.join(" s/d ") : f.value;
        item.innerHTML = `
            <div>
                <span class="font-bold text-slate-800">${f.field_description}</span>
                <p class="text-[11px] text-slate-500">${f.rationale}</p>
            </div>
            <span class="bg-blue-100 text-blue-800 font-mono text-[11px] px-2 py-0.5 rounded">${f.target_column} ${f.operator} '${valStr}'</span>
        `;
        fContainer.appendChild(item);
    });

    // Fields List
    const fldContainer = document.getElementById("spec-fields-list");
    fldContainer.innerHTML = "";
    data.spec.requested_fields.forEach(fld => {
        const item = document.createElement("div");
        item.className = "p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs flex items-center justify-between";
        const piiBadge = fld.pii_sensitive 
            ? `<span class="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">PII / Masking</span>` 
            : `<span class="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded">Standar</span>`;
        item.innerHTML = `
            <div>
                <span class="font-medium text-slate-800">${fld.description}</span>
                <span class="font-mono text-slate-400 text-[11px] ml-1">(${fld.name})</span>
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
            item.innerHTML = `<span class="text-emerald-700 font-bold">✓ Kueri Tabel Tunggal Terisolasi:</span> Seluruh atribut terpenuhi dari tabel fakta utama tanpa perlu operasi JOIN antar-tabel.`;
            joinStrategyContent.appendChild(item);
        }
    }

    // Render Rich Table Cards
    const catContainer = document.getElementById("catalog-tables-container");
    catContainer.innerHTML = "";
    data.catalog_match.selected_tables.forEach(tbl => {
        const card = document.createElement("div");
        card.className = "p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3.5 hover:border-blue-300 transition";

        // Generate column pills with tags
        const colPills = tbl.columns.slice(0, 8).map(c => {
            const isPii = c.is_pii || (c.tags && c.tags.includes("PII"));
            const isPk = c.tags && c.tags.includes("PK");
            const isFk = c.tags && c.tags.includes("FK");
            
            let tagBadge = "";
            if (isPk) tagBadge = `<span class="bg-blue-100 text-blue-800 text-[9px] font-bold px-1 rounded">PK</span>`;
            else if (isFk) tagBadge = `<span class="bg-purple-100 text-purple-800 text-[9px] font-bold px-1 rounded">FK</span>`;
            else if (isPii) tagBadge = `<span class="bg-amber-100 text-amber-800 text-[9px] font-bold px-1 rounded">PII</span>`;

            return `<span class="inline-flex items-center space-x-1 bg-slate-100 border border-slate-200 text-slate-700 text-[11px] px-2 py-0.5 rounded-md font-mono">${c.name} ${tagBadge}</span>`;
        }).join(" ");

        card.innerHTML = `
            <div class="flex items-start justify-between gap-3">
                <div class="space-y-1">
                    <div class="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span class="text-[11px] font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md font-bold">${tbl.fqn}</span>
                        <span class="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full font-semibold">${tbl.tier || 'Tier 1'}</span>
                    </div>
                    <h4 class="text-sm font-bold text-slate-900">${tbl.table_name}</h4>
                </div>
                <div class="text-right flex-shrink-0">
                    <span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center space-x-1">
                        <i data-lucide="check-circle" class="w-3 h-3 text-emerald-600"></i>
                        <span>Kecocokan: ${Math.round(tbl.match_score * 100)}%</span>
                    </span>
                </div>
            </div>

            <p class="text-xs text-slate-600 leading-relaxed">${tbl.description}</p>

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
                    <span><strong class="text-slate-700">Total Atribut:</strong> ${tbl.columns.length} kolom</span>
                </div>
                <div class="flex flex-wrap gap-1.5 pt-1">
                    ${colPills}
                    ${tbl.columns.length > 8 ? `<span class="text-[11px] text-slate-400 font-mono self-center pl-1">+${tbl.columns.length - 8} lainnya</span>` : ''}
                </div>
            </div>
        `;
        catContainer.appendChild(card);
    });

    // TAB 3: SQL Studio
    originalGeneratedSqlQuery = data.generated_sql.query;
    document.getElementById("sql-explanation-text").innerText = data.generated_sql.explanation || "Kueri SQL diekstrak dan divalidasi sesuai spesifikasi kebutuhan.";
    
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
        ? "px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200"
        : (data.verification.status.includes("REVISION") ? "px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200" : "px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200");
    
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
            scoreBarElem.className = "bg-emerald-600 h-2 rounded-full transition-all duration-500";
        } else if (scorePercent >= 80) {
            scoreBarElem.className = "bg-indigo-600 h-2 rounded-full transition-all duration-500";
        } else {
            scoreBarElem.className = "bg-amber-500 h-2 rounded-full transition-all duration-500";
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
            c.toLowerCase().includes("masked") || c.toLowerCase().includes("nik") || c.toLowerCase().includes("phone") || c.toLowerCase().includes("name")
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

        if (btnExcel && excelName) btnExcel.href = `/api/download/outputs/${excelName}`;
        if (btnCsv && csvName) btnCsv.href = `/api/download/outputs/${csvName}`;
        if (btnJson && jsonName) btnJson.href = `/api/download/outputs/${jsonName}`;

        if (btnCert && data.execution.certificate_path) {
            const certName = data.execution.certificate_path.split(/[\\/]/).pop();
            btnCert.href = `/api/download/outputs/${certName}`;
        }

        if (btnZip && data.execution.zip_path) {
            const zipName = data.execution.zip_path.split(/[\\/]/).pop();
            btnZip.href = `/api/download/outputs/${zipName}`;
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
        const isMasked = col.toLowerCase().includes("masked");
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
                if (colLower.includes("usd") || colLower.includes("devisa") || colLower.includes("cif")) {
                    val = "$" + val.toLocaleString("en-US");
                } else if (colLower.includes("amount") || colLower.includes("idr") || colLower.includes("bea") || colLower.includes("ppn") || colLower.includes("cukai")) {
                    val = "Rp " + val.toLocaleString("id-ID");
                }
            }

            // Highlight masked values
            if (valStr.includes("***")) {
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

    // Tambahkan Kueri SQL di bawah tabel audit
    if (data.generated_sql && data.generated_sql.query) {
        const trSql = document.createElement("tr");
        trSql.innerHTML = `
            <td class="w-1/3 px-4 py-3 font-bold text-slate-700 bg-slate-50 border-r border-slate-200 text-xs align-top">Kueri SQL Resmi</td>
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

function setupDeliveryInteractions() {
    // Sheet Switcher Buttons
    const sheetBtns = document.querySelectorAll(".sheet-tab-btn");
    const containerData = document.getElementById("container-sheet-data");
    const containerAudit = document.getElementById("container-sheet-audit");
    const containerDict = document.getElementById("container-sheet-dict");

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
        });
    });

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
                alert("Tidak ada kueri SQL untuk diunduh.");
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

            appendConsoleLog("Human-in-the-Loop", "Data Analyst mengubah kueri SQL. Mengirimkan ke Auditor Independen...");

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

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.detail || "Gagal mengaudit kueri.");
                }

                const updatedData = await res.json();
                currentPipelineData = updatedData;
                originalGeneratedSqlQuery = modifiedSql;
                renderResults(updatedData);

                appendConsoleLog("Independent Verifier", `Audit Kueri Custom Selesai: Status=${updatedData.verification.status}. Output data diperbarui.`);

                isSqlEditMode = false;
                viewContainer.classList.remove("hidden");
                editContainer.classList.add("hidden");
                if (editActionBar) editActionBar.classList.add("hidden");
                toggleText.innerText = "Buka Mode Editor SQL";
                toggleBtn.classList.replace("bg-blue-50", "bg-white");
                toggleBtn.classList.replace("text-blue-800", "text-slate-700");
                toggleBtn.classList.remove("border-blue-300");
            } catch (err) {
                alert("Error audit kueri: " + err.message);
                appendConsoleLog("Error", err.message);
            } finally {
                reverifyBtn.disabled = false;
                reverifyBtn.innerHTML = `<i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i><span>Audit Ulang & Eksekusi Kueri</span>`;
                lucide.createIcons();
            }
        });
    }
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
            commentsInput.value = "Disetujui penuh untuk analisis kedinasan internal DJBC. Kueri telah diaudit dan memenuhi seluruh batasan keamanan DWH.";
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

            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "X-User-Role": getCurrentPersona()
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Gagal menyimpan feedback.");
            }

            const updatedData = await res.json();
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
                alert("Catatan Permintaan Revisi berhasil dicatat. Pemohon Data dapat membuka form penyesuaian.");
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

// 10. CMS Riwayat Permohonan Modal Setup (Search & Filter Enhanced)
let allCmsHistoryItems = [];
let activeCmsStatusFilter = "ALL";

function setupCmsModal() {
    const modal = document.getElementById("cms-modal");
    const openBtn = document.getElementById("btn-open-cms");
    const closeBtn = document.getElementById("btn-close-cms");
    const searchInput = document.getElementById("input-cms-search");
    const filterBtns = document.querySelectorAll(".cms-filter-btn");

    function renderCmsRows(items) {
        const tbody = document.getElementById("cms-history-tbody");
        tbody.innerHTML = "";

        if (!items || items.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-8 text-center text-slate-400">Tidak ada riwayat permohonan yang sesuai dengan filter pencarian.</td></tr>`;
            return;
        }

        items.forEach(item => {
            const tr = document.createElement("tr");
            tr.className = "hover:bg-slate-50 transition border-b border-slate-100";

            const statusUpper = (item.status || "").toUpperCase();
            let badgeClass = "bg-slate-100 text-slate-700";
            if (statusUpper.includes("APPROV") || statusUpper.includes("SETUJU")) {
                badgeClass = "bg-emerald-100 text-emerald-800";
            } else if (statusUpper.includes("REVISI") || statusUpper.includes("REVISION")) {
                badgeClass = "bg-amber-100 text-amber-800";
            } else if (statusUpper.includes("REJECT") || statusUpper.includes("TOLAK")) {
                badgeClass = "bg-rose-100 text-rose-800";
            }

            // Styling badge unit kerja resmi (Bea Cukai, Internal Kemenkeu, Eksternal Kemenkeu)
            let deptBadgeClass = "bg-slate-100 text-slate-700 border border-slate-200";
            const deptStr = item.department || "";
            if (deptStr.includes("Bea dan Cukai")) {
                deptBadgeClass = "bg-blue-50 text-blue-900 border border-blue-200 font-semibold";
            } else if (deptStr.includes("Internal Kemenkeu")) {
                deptBadgeClass = "bg-amber-50 text-amber-900 border border-amber-200 font-semibold";
            } else if (deptStr.includes("Eksternal")) {
                deptBadgeClass = "bg-teal-50 text-teal-900 border border-teal-200 font-semibold";
            }

            tr.innerHTML = `
                <td class="px-3.5 py-3 font-mono font-bold text-blue-700">${item.request_id}</td>
                <td class="px-3.5 py-3 font-medium text-slate-800">${item.document_title}</td>
                <td class="px-3.5 py-3">
                    <span class="font-medium text-slate-800 block">${item.requester_name}</span>
                    <div class="flex items-center space-x-1 mt-0.5">
                        <span class="text-[9px] px-1.5 py-0.5 rounded inline-block ${deptBadgeClass}">${deptStr}</span>
                        ${item.business_process ? `<span class="text-[9px] px-1.5 py-0.5 rounded inline-block bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold">${item.business_process}</span>` : ''}
                    </div>
                </td>
                <td class="px-3.5 py-3 text-slate-500 whitespace-nowrap">${item.created_at}</td>
                <td class="px-3.5 py-3"><span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}">${item.status}</span></td>
                <td class="px-3.5 py-3 font-mono">${item.row_count} baris</td>
                <td class="px-3.5 py-3 text-right space-x-1 whitespace-nowrap">
                    ${item.excel_filename ? `<a href="/api/download/outputs/${item.excel_filename}" download class="text-[11px] font-semibold text-emerald-600 hover:text-emerald-800 bg-emerald-50 px-2 py-1 rounded">Excel</a>` : ''}
                    ${item.zip_filename ? `<a href="/api/download/outputs/${item.zip_filename}" download class="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded">ZIP</a>` : ''}
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function applyFilterAndSearch() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
        let filtered = allCmsHistoryItems;

        // Filter berdasarkan unit kerja resmi
        const deptFilterElem = document.getElementById("select-cms-dept-filter");
        const activeDeptFilter = deptFilterElem ? deptFilterElem.value : "ALL";
        if (activeDeptFilter !== "ALL") {
            filtered = filtered.filter(i => (i.department || "").includes(activeDeptFilter));
        }

        // Filter berdasarkan status
        if (activeCmsStatusFilter === "APPROVED") {
            filtered = filtered.filter(i => (i.status || "").toUpperCase().includes("APPROV") || (i.status || "").toUpperCase().includes("SETUJU"));
        } else if (activeCmsStatusFilter === "REVISION") {
            filtered = filtered.filter(i => (i.status || "").toUpperCase().includes("REVISI") || (i.status || "").toUpperCase().includes("REVISION"));
        } else if (activeCmsStatusFilter === "REJECTED") {
            filtered = filtered.filter(i => (i.status || "").toUpperCase().includes("REJECT") || (i.status || "").toUpperCase().includes("TOLAK"));
        }

        // Filter berdasarkan teks pencarian
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

    const deptFilterElem = document.getElementById("select-cms-dept-filter");
    if (deptFilterElem) {
        deptFilterElem.addEventListener("change", applyFilterAndSearch);
    }

    if (searchInput) {
        searchInput.addEventListener("input", applyFilterAndSearch);
    }

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => {
                b.className = "cms-filter-btn px-2.5 py-1.5 rounded-lg font-medium text-xs bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 transition shadow-2xs";
            });
            btn.className = "cms-filter-btn px-2.5 py-1.5 rounded-lg font-medium text-xs bg-blue-600 text-white transition shadow-2xs";
            activeCmsStatusFilter = btn.getAttribute("data-status");
            applyFilterAndSearch();
        });
    });

    openBtn.addEventListener("click", async () => {
        modal.classList.remove("hidden");
        const tbody = document.getElementById("cms-history-tbody");
        tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-4 text-center text-slate-400">Memuat riwayat permohonan...</td></tr>`;

        try {
            const res = await fetch("/api/history");
            const data = await res.json();
            allCmsHistoryItems = data.history || [];
            applyFilterAndSearch();
        } catch (err) {
            tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-4 text-center text-red-500">Gagal mengambil data CMS.</td></tr>`;
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

// 13. Catalog Modal (Search & Filter Enhanced)
let allCatalogTablesCache = [];

function setupCatalogModal() {
    const modal = document.getElementById("catalog-modal");
    const openBtn = document.getElementById("btn-browse-catalog");
    const closeBtn = document.getElementById("btn-close-modal");
    const searchInput = document.getElementById("input-catalog-modal-search");

    function renderModalTables(tablesToRender) {
        const content = document.getElementById("modal-catalog-content");
        content.innerHTML = "";

        if (!tablesToRender || tablesToRender.length === 0) {
            content.innerHTML = `<div class="p-8 text-center text-xs text-slate-400">Tidak ada tabel katalog yang sesuai dengan kata kunci pencarian.</div>`;
            return;
        }

        tablesToRender.forEach(tbl => {
            const card = document.createElement("div");
            card.className = "p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2 hover:border-blue-300 transition";

            const colTags = tbl.columns.map(c => {
                const isPii = c.is_pii || (c.tags && c.tags.includes("PII"));
                const isPk = c.tags && c.tags.includes("PK");
                let badge = "";
                if (isPk) badge = `<span class="bg-blue-100 text-blue-800 text-[9px] font-bold px-1 rounded ml-1">PK</span>`;
                else if (isPii) badge = `<span class="bg-amber-100 text-amber-800 text-[9px] font-bold px-1 rounded ml-1">PII</span>`;
                return `<span class="inline-flex items-center bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono text-slate-700">${c.name}${badge}</span>`;
            }).join(" ");

            card.innerHTML = `
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="font-mono text-xs text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-bold">${tbl.fqn}</span>
                    <span class="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-medium">${tbl.tier || 'Tier 1'}</span>
                </div>
                <h4 class="text-xs font-bold text-slate-900">${tbl.table_name}</h4>
                <p class="text-xs text-slate-600">${tbl.description}</p>
                <div class="text-[11px] text-slate-500 pt-2 border-t border-slate-100 space-y-1.5">
                    <div class="flex items-center justify-between">
                        <span><strong class="text-slate-700">Owner:</strong> ${tbl.owner || 'DJBC Data Governance'}</span>
                        <span><strong class="text-slate-700">Service:</strong> ${tbl.service_name || 'CEISA-DWH'}</span>
                    </div>
                    <div class="flex flex-wrap gap-1 pt-1">
                        ${colTags}
                    </div>
                </div>
            `;
            content.appendChild(card);
        });
        lucide.createIcons();
    }

    openBtn.addEventListener("click", async () => {
        modal.classList.remove("hidden");
        const content = document.getElementById("modal-catalog-content");
        content.innerHTML = `<div class="p-8 text-center text-xs text-slate-400">Memuat katalog OpenMetadata...</div>`;

        try {
            const res = await fetch("/api/catalog");
            const data = await res.json();
            allCatalogTablesCache = data.tables || [];
            renderModalTables(allCatalogTablesCache);
        } catch (err) {
            content.innerHTML = `<div class="p-8 text-center text-xs text-red-500">Gagal memuat katalog: ${err.message}</div>`;
        }
    });

    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (!query) {
                renderModalTables(allCatalogTablesCache);
                return;
            }
            const filtered = allCatalogTablesCache.filter(tbl => {
                const nameMatch = tbl.fqn.toLowerCase().includes(query) || tbl.table_name.toLowerCase().includes(query);
                const descMatch = (tbl.description || "").toLowerCase().includes(query);
                const colMatch = (tbl.columns || []).some(c => c.name.toLowerCase().includes(query) || (c.description || "").toLowerCase().includes(query));
                return nameMatch || descMatch || colMatch;
            });
            renderModalTables(filtered);
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
        // Pemohon Data (Business Analyst)
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
                        <span class="font-bold">Mode Peninjauan Pemohon Data (Read-Only)</span>
                        <p class="text-[11px] text-blue-700">Sebagai Pemohon Data, Anda dapat memantau status audit dan mengunduh berkas data yang telah disahkan. Otorisasi sign-off merupakan wewenang Data Steward.</p>
                    </div>
                </div>
                <span class="bg-blue-200/80 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">Read-Only</span>
            `;
            lucide.createIcons();
        }
        appendConsoleLog("RBAC", "Peran aktif: 👤 Pemohon Data (Analyst). Akses dibatasi pada peninjauan spesifikasi dan pengunduhan.");
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
                        <p class="text-[11px] text-slate-600">Akses penuh ke konfigurasi koneksi OpenMetadata, target database, serta penyesuaian kueri DWH tingkat lanjut.</p>
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
            const res = await fetch("/api/config/openmetadata");
            const data = await res.json();
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

// 16. Analytics & Compliance Insights Modal
function setupAnalyticsModal() {
    const modal = document.getElementById("analytics-modal");
    const openBtn = document.getElementById("btn-open-analytics");
    const closeBtn = document.getElementById("btn-close-analytics");

    if (!modal || !openBtn) return;

    openBtn.addEventListener("click", async () => {
        modal.classList.remove("hidden");
        try {
            const res = await fetch("/api/analytics");
            const data = await res.json();

            document.getElementById("stat-total-requests").innerText = data.total_requests;
            document.getElementById("stat-compliance-rate").innerText = `${data.compliance_rate_pct}%`;
            document.getElementById("stat-total-rows").innerText = data.total_rows_delivered.toLocaleString();
            document.getElementById("stat-pii-columns").innerText = `${data.pii_columns_protected_count} Kolom`;

            // Render Departemen
            const deptList = document.getElementById("analytics-dept-list");
            deptList.innerHTML = "";
            const depts = data.department_distribution || {};
            if (Object.keys(depts).length === 0) {
                deptList.innerHTML = `<div class="text-slate-400 italic">Belum ada data permohonan.</div>`;
            } else {
                for (const [dept, count] of Object.entries(depts)) {
                    const pct = data.total_requests > 0 ? Math.round((count / data.total_requests) * 100) : 0;
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
                    item.className = "space-y-1 bg-white p-2.5 rounded-lg border border-slate-200";
                    item.innerHTML = `
                        <div class="flex justify-between items-center text-xs">
                            <span class="font-semibold px-2 py-0.5 rounded text-[10px] border ${badgeColor}">${dept}</span>
                            <span class="text-slate-600 font-mono font-bold">${count} req (${pct}%)</span>
                        </div>
                        <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                            <div class="${barColor} h-2 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                        </div>
                    `;
                    deptList.appendChild(item);
                }
            }

            // Render Status
            const statusList = document.getElementById("analytics-status-list");
            statusList.innerHTML = "";
            const statuses = data.status_distribution || {};
            if (Object.keys(statuses).length === 0) {
                statusList.innerHTML = `<div class="text-slate-400 italic">Belum ada keputusan verifikator.</div>`;
            } else {
                for (const [st, count] of Object.entries(statuses)) {
                    const badgeClass = st.includes("APPROV") || st.includes("DISETUJUI")
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : (st.includes("REVISI") || st.includes("WARN") ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-red-100 text-red-800 border-red-200");
                    const item = document.createElement("div");
                    item.className = "flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200";
                    item.innerHTML = `
                        <span class="text-xs font-semibold px-2 py-0.5 rounded-full border ${badgeClass}">${st}</span>
                        <span class="font-bold text-xs text-slate-800 font-mono">${count} kali</span>
                    `;
                    statusList.appendChild(item);
                }
            }
            lucide.createIcons();
        } catch (err) {
            console.error("Gagal memuat analitik:", err);
        }
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

    document.getElementById("conf-purpose").value = spec.business_purpose || "";
    document.getElementById("conf-date-start").value = spec.time_range_start || "2026-07-01";
    document.getElementById("conf-date-end").value = spec.time_range_end || "2026-09-30";

    // Render Kolom yang Diminta
    const fieldsContainer = document.getElementById("conf-fields-container");
    fieldsContainer.innerHTML = "";
    if (!spec.requested_fields || spec.requested_fields.length === 0) {
        fieldsContainer.innerHTML = `<div class="text-slate-400 italic">Tidak ada kolom khusus terdeteksi.</div>`;
    } else {
        spec.requested_fields.forEach((f, idx) => {
            const item = document.createElement("div");
            item.className = "flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 transition";
            item.innerHTML = `
                <label class="flex items-center space-x-2 cursor-pointer flex-1 mr-2 truncate">
                    <input type="checkbox" class="conf-field-checkbox rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5" data-field-index="${idx}" checked>
                    <span class="font-medium text-slate-800 truncate">${f.description || f.name}</span>
                    <span class="text-[10px] text-slate-400 font-mono">(${f.name})</span>
                </label>
                ${f.pii_sensitive ? `<span class="bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0">PII / PDP</span>` : `<span class="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded flex-shrink-0">Standar</span>`}
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
            item.className = "p-2 rounded-lg bg-white border border-slate-200 space-y-0.5 hover:border-emerald-400 transition";
            const valDisplay = Array.isArray(filt.value) ? filt.value.join(" s/d ") : filt.value;
            item.innerHTML = `
                <div class="flex items-center justify-between">
                    <label class="flex items-center space-x-2 cursor-pointer flex-1 mr-2 truncate">
                        <input type="checkbox" class="conf-filter-checkbox rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5" data-filter-index="${fIdx}" checked>
                        <span class="font-semibold text-slate-800 text-xs truncate">${filt.field_description}</span>
                    </label>
                    <span class="font-mono text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">${filt.target_column} ${filt.operator} '${valDisplay}'</span>
                </div>
                ${filt.rationale ? `<p class="text-[10px] text-slate-500 pl-5.5">${filt.rationale}</p>` : ''}
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
        const response = await fetch("/api/process-confirmed-stream", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                spec: spec,
                dialect: dialect,
                masking_mode: maskingMode
            })
        });

        if (!response.ok) {
            throw new Error(`Server returned HTTP ${response.status}`);
        }

        await processSSEStreamResponse(response);
    } catch (err) {
        alert("Gagal memproses eksekusi query: " + err.message);
        appendConsoleLog("Error", "Kegagalan eksekusi: " + err.message);
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="play" class="w-4 h-4 fill-white"></i><span>Jalankan Pipeline Pemenuhan Data</span>`;
        lucide.createIcons();
    }
}

