const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.style.touchAction = "none";
canvas.style.userSelect = "none";

/* =========================
   GRID OPTIONS
   ========================= */

/* GRID 1 */
const GRID_OPTION_1 = [
"ZESPTMMGUNGFUMEANINGFULHD",
"EPYLZPUZYLZASVQYNXNCZUZFY",
"FREEDOMQAWARENESSNGREENLT",
"FSCIHTESSENTIALJHAINCYUYI",
"IHASERWDDTCPEACEAESTOGQLL",
"CTEVPJXIKRTNLBVYBLETNCFSI",
"IHAPROGRESSLARCHICDIMOETB",
"ELTHTLAEHSDRELVGTYEYCWCRA",
"NTTWIZYCHSISYIAESBNUHPIUN",
"CVBBOTQTJWNMSJQBLMSQERGCI",
"YKULXRIISONIPOYLSFTJIOOTA",
"RREDROGOCUOMXLENITUORDLUT",
"ENNRZNANFNOSIWIXOMISSXERS",
"SOOEUCALMTWILLRCSMELOBOEU",
"PIISJRSPACELCFULICRSLGGRS",
"OTTISYTILIBATSAFVTLAONLUA",
"NACLYLDFLBSMWONCEUYCHPEKT",
"SZEISEWYYNPIGFOOFCIMAZRSA",
"IILETRHCGQZNJUKDCXRXXEBUS",
"BNFNEEXLKEMITYNDECLUTTERP",
"LAECMDVATPTMTIVGYTIROIRPN",
"EGRESUKRTWUAMRECYCLENSZOR",
"PRODUCTIVITYRGNINNALPIETD",
"MOGJLELTLANOITNETNIESUERD",
"CONTROLYMQGYSZSDISCIPLINE",
].map(r => r.split(""));

const WORDS_OPTION_1 = new Set([
"CLARITY","FOCUS","CALM","BALANCE","MINDFUL","AWARENESS","INTENTIONAL",
"PURPOSE","VISION","DIRECTION","ORDER","SIMPLICITY","MINIMALISM",
"DECLUTTER","SPACE","PEACE","STILLNESS","DISCIPLINE","HABITS","ROUTINE",
"SYSTEMS","STRUCTURE","LOGIC","PLANNING","PRIORITY","PRODUCTIVITY",
"EFFICIENCY","ORGANIZATION","GOALS","STRATEGY","GROWTH","RESILIENCE",
"REFLECTION","ETHICS","HEALTH","HARMONY","WELLBEING","SUSTAINABILITY",
"ECO","GREEN","REDUCE","REUSE","RECYCLE","CONSERVE","RESOURCEFUL",
"RESPONSIBLE","CONSCIOUS","CLEAN","ESSENTIAL","MEANINGFUL","PROGRESS",
"STABILITY","FREEDOM","CONTROL","DESIGN","ABILITY"
]);

/* GRID 2 */
const GRID_OPTION_2 = [
"JUZQJKOTHTAPYTICILPMISVBC",
"NAVIGATEUYWWLUFTHGUOHTDFF",
"ZIDUMRSKVKGJEYYEJORODDLON",
"IQQPYOFVDZTTGTDCSEIFDOJNO",
"ADKPUCOEGEGAZIENGMTXWRNEY",
"DHGPNDRINCBRBLDENNYIEOXCL",
"AKTWEEWNINDXMINSITNFIPNUJ",
"PAAPTWASDECVHBUENGITAEFVR",
"TRWNETRIISTPEAORXNANRTYAY",
"AIENUDDGUSILQTRPERSANWETN",
"BCAKUCZHGEEPLSGMEIPEELIGO",
"ILNSRDWTRVSITBEDOSTIJLIGI",
"LNYMIGVNADGDYNONNNVWAJTSS",
"IIOIOMQTOHZSTMGAIRITTTNSI",
"TVCIDMISTIYSILRIARIZEOEEC",
"YARCTOENRNTWDTAESVFSEZMNE",
"DWDHNAENEJNIIYLWCTEKBCNNR",
"IAEDYSRRTFQOUCOHERENCEGEP",
"RKMTSTGGNUIRLTZNENAATAIPA",
"EEUXAYHFESMKFCNZDMEADZLOG",
"CNFIGVYMCTLWMINIMALRHYAPH",
"TIYDEWENERNAUTHENTICITYHX",
"ENYTINULRYQIGNIDNUORGFITW",
"DGCBTNOREFUCUSPERSPECTIVE",
"VGZUVBALANCEPOINTBFOUBKBA"
].map(r => r.split(""));

const WORDS_OPTION_2 = new Set([
"ALIGNMENT","INTUITION","INSIGHT","GROUNDED","CENTERED","PRESENCE","TRANSPARENCY","RENEWAL","COHERENCE","SYNERGY","MOMENTUM","RHYTHM","PURITY","REFINEMENT","ADAPTABILITY","STABILITY","OPENNESS","ELEVATION","DEPTH","VITALITY","PRECISION","MODERATION","FLUIDITY","INTEGRATION","LIGHTNESS","EXPANSION","AUTHENTICITY","AWAKENING","RESET","ELEVATE","HARMONIZE","GROUNDING","RECENTER","NAVIGATE","THOUGHTFUL","FORWARD","MINIMAL","CLEARVIEW","INTENTFUL","GUIDING","STEADY","RENEWED","FLOWING","DIRECTED","REFOCUS","UNITY","BALANCEPOINT","SIMPLICITYPATH","ESSENCE","PERSPECTIVE","PATH","SIMPLICITY","BALANCE","POINT"
]);

/* =========================
   ACTIVE GAME STATE
   ========================= */

let GRID = GRID_OPTION_1;
let WORDS = WORDS_OPTION_1;

let ROWS = GRID.length;
let COLS = GRID[0].length;

let CELL = 40;

let selected = [];
let lockedPaths = [];
let foundWords = new Set();
let dragging = false;
let direction = null;
let startCell = null;
let flashRed = false;

let currentOption = 1;

/* =========================
   RESPONSIVE CELL SIZE
   ========================= */

function getCellSize() {
  const usableWidth = canvas.width * 0.9;
  const usableHeight = canvas.height * 0.9;
  return Math.floor(Math.min(usableWidth / COLS, usableHeight / ROWS));
}

function startX() {
  return (canvas.width - COLS * CELL) / 2;
}

function startY() {
  return Math.max(0, (canvas.height - ROWS * CELL) / 2);
}

function resize() {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  CELL = getCellSize();
}

window.addEventListener("resize", resize);

/* =========================
   HELPERS
   ========================= */

function sign(n) {
  return n === 0 ? 0 : n > 0 ? 1 : -1;
}

function getCell(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const c = Math.floor((x - startX()) / CELL);
  const r = Math.floor((y - startY()) / CELL);

  if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
    return [r, c];
  }
  return null;
}

/* =========================
   DRAW
   ========================= */

function drawOverlay(cells, color) {
  ctx.fillStyle = color;
  cells.forEach(([r, c]) => {
    ctx.fillRect(
      startX() + c * CELL,
      startY() + r * CELL,
      CELL,
      CELL
    );
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  lockedPaths.forEach(p => drawOverlay(p, "rgba(0,180,0,0.35)"));

  if (selected.length) {
    drawOverlay(
      selected,
      flashRed ? "rgba(200,0,0,0.35)" : "rgba(0,0,255,0.25)"
    );
  }

  ctx.fillStyle = "black";
  ctx.font = `${Math.max(16, CELL * 0.55)}px Epoch`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      ctx.fillText(
        GRID[r][c],
        startX() + c * CELL + CELL / 2,
        startY() + r * CELL + CELL / 2
      );
    }
  }

  requestAnimationFrame(draw);
}

/* =========================
   INPUT – SMOOTH 8 DIRECTION
   ========================= */

/* =========================
   PERFECT 8-DIRECTION SELECTION
   ========================= */

canvas.addEventListener("pointerdown", e => {
  const cell = getCell(e.clientX, e.clientY);
  if (!cell) return;

  dragging = true;
  startCell = cell;
  selected = [cell];
  direction = null;
});

canvas.addEventListener("pointermove", e => {
  if (!dragging || !startCell) return;

  const cell = getCell(e.clientX, e.clientY);
  if (!cell) return;

  const dr = cell[0] - startCell[0];
  const dc = cell[1] - startCell[1];

  if (dr === 0 && dc === 0) {
    selected = [startCell];
    return;
  }

  /* Determine direction only once */
  if (!direction) {
    const stepR = Math.sign(dr);
    const stepC = Math.sign(dc);

    // allow straight or diagonal only
    if (
      stepR === 0 ||
      stepC === 0 ||
      Math.abs(dr) === Math.abs(dc)
    ) {
      direction = [stepR, stepC];
    } else {
      return; // ignore invalid direction
    }
  }

  /* Build path strictly along direction */
  const steps = Math.max(Math.abs(dr), Math.abs(dc));

  const newPath = [];
  for (let i = 0; i <= steps; i++) {
    const r = startCell[0] + direction[0] * i;
    const c = startCell[1] + direction[1] * i;

    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) break;

    newPath.push([r, c]);
  }

  selected = newPath;
});

canvas.addEventListener("pointerup", () => {
  if (!startCell) return;

  dragging = false;

  const word = selected.map(([r, c]) => GRID[r][c]).join("");

  if (WORDS.has(word) && !foundWords.has(word)) {
    foundWords.add(word);
    lockedPaths.push([...selected]);

    document.getElementById("foundCount").textContent = foundWords.size;

    const el = document.createElement("div");
    el.className = "found-word";
    el.textContent = word;
    document.getElementById("foundWordsGrid").appendChild(el);
  } else if (selected.length > 1) {
    flashRed = true;
    setTimeout(() => flashRed = false, 300);
  }

  selected = [];
  direction = null;
  startCell = null;
});

/* =========================
   RESET
   ========================= */

function resetGame() {
  selected = [];
  lockedPaths = [];
  foundWords.clear();
  direction = null;
  startCell = null;

  document.getElementById("foundCount").textContent = 0;
  document.getElementById("foundWordsGrid").innerHTML = "";
}

/* =========================
   TOGGLE SWITCH BUTTON
   ========================= */

function toggleGrid() {

  if (currentOption === 1) {
    GRID = GRID_OPTION_2;
    WORDS = WORDS_OPTION_2;
    currentOption = 2;
    document.getElementById("optionBtn").textContent = "Switch to Grid 1";
  } else {
    GRID = GRID_OPTION_1;
    WORDS = WORDS_OPTION_1;
    currentOption = 1;
    document.getElementById("optionBtn").textContent = "Switch to Grid 2";
  }

  ROWS = GRID.length;
  COLS = GRID[0].length;

  document.getElementById("totalCount").textContent = WORDS.size;

  resetGame();
  resize();
}

/* =========================
   BUTTON LISTENERS
   ========================= */

document.getElementById("refreshBtn")
  .addEventListener("click", resetGame);

document.getElementById("optionBtn")
  .addEventListener("click", toggleGrid);

/* =========================
   START
   ========================= */

document.getElementById("totalCount").textContent = WORDS.size;
document.getElementById("optionBtn").textContent = "Switch to Grid 2";

resize();
document.fonts.ready.then(draw);

