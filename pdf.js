/* ===================================================== */
/* ================= GLOBAL STATE ======================= */
/* ===================================================== */

let pdfDoc = null;
let currentPage = 1;
let scale = 1.2;
let currentPDF = null;
let totalPages = 0;

/* ===================================================== */
/* ================= CONFIG ============================= */
/* ===================================================== */

const GLOBAL_DMC = {
  tenth: "Assets/10thDMC.pdf",
  twelfth: "Assets/12thDMC.pdf",
  bca: [
    "Assets/BCASEM-1DMC.pdf",
    "Assets/BCASEM-2DMC.pdf",
    "Assets/BCASEM-3DMC.pdf",
    "Assets/BCASEM-4DMC.pdf",
    "Assets/BCASEM-5DMC.pdf",
    "Assets/BCASEM-6DMC.pdf"
  ]
};

/* ===================================================== */
/* ================= LOAD PDF =========================== */
/* ===================================================== */

function setMobileScale() {
  const width = window.innerWidth;

  if (width < 480) {
    scale = 1.5;
  } else if (width < 768) {
    scale = 1.8;
  } else {
    scale = 2.2;
  }
}

window.addEventListener("resize", () => {
  setMobileScale();
  renderPage();
});

async function loadPDF(url, canvasId = "pdfCanvas") {
  try {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

    currentPDF = url;

    pdfDoc = await pdfjsLib.getDocument(url).promise;
    totalPages = pdfDoc.numPages;
    currentPage = 1;

    renderPage(canvasId);
    generateThumbnails(url);

  } catch (err) {
    console.error("❌ PDF Load Error:", err);
    alert("Failed to load PDF.");
  }
}

/* ===================================================== */
/* ================= RENDER PAGE ======================== */
/* ===================================================== */

async function renderPage(canvasId = "pdfCanvas") {
  const page = await pdfDoc.getPage(currentPage);

  const dpr = window.devicePixelRatio || 1;

  // ✅ Combine zoom + DPR
  const viewport = page.getViewport({ scale: scale });

  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");

  // ✅ Real resolution
  canvas.width = viewport.width * dpr;
  canvas.height = viewport.height * dpr;

  // ✅ Display size
  canvas.style.width = viewport.width + "px";
  canvas.style.height = viewport.height + "px";

  // ✅ Reset + apply scaling properly
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  await page.render({
    canvasContext: ctx,
    viewport
  }).promise;

  updatePageInfo();
}

/* ===================================================== */
/* ================= NAVIGATION ========================= */
/* ===================================================== */

function nextPage(id="pdfCanvas") {
  if (currentPage < totalPages) {
    currentPage++;
    renderPage(id);
  }
}

function prevPage(id="pdfCanvas") {
  if (currentPage > 1) {
    currentPage--;
    renderPage(id);
  }
}

/* ===================================================== */
/* ================= FULLSCREEN ========================= */
/* ===================================================== */

function toggleFullscreen(wrapperId) {
  document.getElementById(wrapperId).classList.toggle("fullscreen");
}

/* ===================================================== */
/* ================= PAGE INFO ========================== */
/* ===================================================== */

function updatePageInfo() {
  const el = document.getElementById("pageInfo");
  if (el) {
    el.innerText = `Page ${currentPage} / ${totalPages}`;
  }
}

/* ===================================================== */
/* ================= THUMBNAILS ========================= */
/* ===================================================== */

async function generateThumbnails(url) {
  const bar = document.getElementById("thumbnailBar");
  if (!bar) return;

  bar.innerHTML = "";

  const pdfjsLib = window['pdfjs-dist/build/pdf'];
  const pdf = await pdfjsLib.getDocument(url).promise;

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 0.2 });

    const canvas = document.createElement("canvas");
    canvas.className = "thumbnail";

    const ctx = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: ctx, viewport }).promise;

    canvas.onclick = () => {
      currentPage = i;
      renderPage();
    };

    bar.appendChild(canvas);
  }
}

/* ===================================================== */
/* ================= DOWNLOAD =========================== */
/* ===================================================== */

function downloadPDF(url) {
  const link = document.createElement("a");
  link.href = url;
  link.download = url.split("/").pop();
  link.click();
}

/* ===================================================== */
/* ================= MERGE ENGINE ======================= */
/* ===================================================== */

async function mergeAndDownload(files, name="Merged_DMC.pdf") {
  const { PDFDocument } = PDFLib;

  const merged = await PDFDocument.create();

  for (let file of files) {
    const bytes = await fetch(file).then(r => r.arrayBuffer());
    const pdf = await PDFDocument.load(bytes);

    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(p => merged.addPage(p));
  }

  const mergedBytes = await merged.save();

  const blob = new Blob([mergedBytes], { type: "application/pdf" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
}

/* ===================================================== */
/* ================= BUTTON ACTIONS ===================== */
/* ===================================================== */

/* 🔹 For 10th & 12th */
function downloadCurrentDMC() {
  downloadPDF(currentPDF);
}

function downloadAllDMC() {
  mergeAndDownload([
    GLOBAL_DMC.tenth,
    GLOBAL_DMC.twelfth,
    ...GLOBAL_DMC.bca
  ], "All_DMC.pdf");
}

/* 🔹 BCA SPECIAL */
function downloadAllSemesters() {
  mergeAndDownload(GLOBAL_DMC.bca, "BCA_All_Semesters.pdf");
}

/* ===================================================== */
/* ================= SEMESTER SYSTEM ==================== */
/* ===================================================== */

function initSemesterSystem(config) {
  /*
    config = {
      containerId,
      canvasId,
      data: [{ sem, url }]
    }
  */

  const container = document.getElementById(config.containerId);

  container.innerHTML = "";

  config.data.forEach((item, index) => {
    const btn = document.createElement("button");
    btn.className = "sem-btn";
    btn.innerText = item.sem;

    btn.onclick = () => {
      document.querySelectorAll(".sem-btn")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");
      loadPDF(item.url, config.canvasId);
    };

    container.appendChild(btn);

    if (index === 0) {
      btn.classList.add("active");
      loadPDF(item.url, config.canvasId);
    }
  });
}

/* ===================================================== */
/* ================= SECURITY =========================== */
/* ===================================================== */

document.addEventListener("contextmenu", e => {
  if (e.target.tagName === "CANVAS") {
    e.preventDefault();
  }
});

function fitToWidth(canvasId="pdfCanvas") {
  const container = document.getElementById(canvasId).parentElement;

  const page = pdfDoc.getPage(currentPage).then(page => {
    const viewport = page.getViewport({ scale: 1 });

    scale = container.clientWidth / viewport.width;

    renderPage(canvasId);
  });
}