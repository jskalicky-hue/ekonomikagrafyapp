// --- Nabídka: lineárně rostoucí nabídka (q = a + b*p) ---
// --- Poptávka: lineárně klesající poptávka (q = c - d*p) ---
// Parametry voleny tak, aby křivky byly rozumné a křížily se ve středu propojeného trhu

// Nabídka: q = 10 + 2*p
const nabidka_a = 10, nabidka_b = 2;

// Poptávka: q = 100 - 3*p
const poptavka_c = 100, poptavka_d = 3;

// Rozsahy
const cenaMin = 0, cenaMax = 100;
const trhCenaMin = 0, trhCenaMax = 46;
const trhMnozstviMin = -20, trhMnozstviMax = 120;

// --- UI ---
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        tabContents.forEach(tc => tc.style.display = 'none');
        document.getElementById(tab.dataset.tab).style.display = '';
    });
});

// --- Nabídka ---
const priceNabidka = document.getElementById('price-nabidka');
const outputNabidka = document.getElementById('output-nabidka');
const canvasNabidka = document.getElementById('canvas-nabidka');
function drawNabidka() {
    const ctx = canvasNabidka.getContext('2d');
    ctx.clearRect(0,0,canvasNabidka.width,canvasNabidka.height);

    // Osy
    drawAxes(ctx, 0, cenaMax, 0, poptavka_c, "Cena (Kč)", "Množství", canvasNabidka);

    // Křivka nabídky
    ctx.strokeStyle = "#1976d2";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for(let p=0; p<=cenaMax; p+=1) {
        let q = nabidka_a + nabidka_b*p;
        let {x, y} = mapToCanvas(p, q, 0, cenaMax, 0, poptavka_c, canvasNabidka);
        if(p===0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Bod pro zadanou cenu
    const p = Number(priceNabidka.value);
    const q = nabidka_a + nabidka_b*p;
    const {x, y} = mapToCanvas(p, q, 0, cenaMax, 0, poptavka_c, canvasNabidka);
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2*Math.PI);
    ctx.fill();
}
function updateNabidka() {
    const cena = Number(priceNabidka.value);
    const mnozstvi = nabidka_a + nabidka_b*cena;
    outputNabidka.textContent = `Nabídka při ceně ${cena} Kč: ${mnozstvi}`;
    drawNabidka();
}
priceNabidka.addEventListener('input', updateNabidka);

// --- Poptávka ---
const pricePoptavka = document.getElementById('price-poptavka');
const outputPoptavka = document.getElementById('output-poptavka');
const canvasPoptavka = document.getElementById('canvas-poptavka');
function drawPoptavka() {
    const ctx = canvasPoptavka.getContext('2d');
    ctx.clearRect(0,0,canvasPoptavka.width,canvasPoptavka.height);

    drawAxes(ctx, 0, cenaMax, 0, poptavka_c, "Cena (Kč)", "Množství", canvasPoptavka);

    ctx.strokeStyle = "#388e3c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for(let p=0; p<=cenaMax; p+=1) {
        let q = poptavka_c - poptavka_d*p;
        let {x, y} = mapToCanvas(p, q, 0, cenaMax, 0, poptavka_c, canvasPoptavka);
        if(p===0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Bod pro zadanou cenu
    const p = Number(pricePoptavka.value);
    const q = poptavka_c - poptavka_d*p;
    const {x, y} = mapToCanvas(p, q, 0, cenaMax, 0, poptavka_c, canvasPoptavka);
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, 2*Math.PI);
    ctx.fill();
}
function updatePoptavka() {
    const cena = Number(pricePoptavka.value);
    const mnozstvi = poptavka_c - poptavka_d*cena;
    outputPoptavka.textContent = `Poptávka při ceně ${cena} Kč: ${mnozstvi}`;
    drawPoptavka();
}
pricePoptavka.addEventListener('input', updatePoptavka);

// --- Propojený trh ---
const priceTrh = document.getElementById('price-trh');
const eqPrice = document.getElementById('eq-price');
const eqQty = document.getElementById('eq-qty');
const trhNabidka = document.getElementById('trh-nabidka');
const trhPoptavka = document.getElementById('trh-poptavka');
const canvasTrh = document.getElementById('canvas-trh');

function computeEquilibrium() {
    // nabidka_a + nabidka_b*p = poptavka_c - poptavka_d*p
    const p = (poptavka_c - nabidka_a) / (nabidka_b + poptavka_d);
    const q = nabidka_a + nabidka_b * p;
    return {p: Math.round(p*100)/100, q: Math.round(q*100)/100};
}
function drawTrh() {
    const ctx = canvasTrh.getContext('2d');
    ctx.clearRect(0,0,canvasTrh.width,canvasTrh.height);

    drawAxes(ctx, trhCenaMin, trhCenaMax, trhMnozstviMin, trhMnozstviMax, "Cena (Kč)", "Množství", canvasTrh);

    // Nabídka
    ctx.strokeStyle = "#1976d2";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for(let p=trhCenaMin; p<=trhCenaMax; p+=0.4) {
        let q = nabidka_a + nabidka_b*p;
        let {x, y} = mapToCanvas(p, q, trhCenaMin, trhCenaMax, trhMnozstviMin, trhMnozstviMax, canvasTrh);
        if(p===trhCenaMin) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Poptávka
    ctx.strokeStyle = "#388e3c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for(let p=trhCenaMin; p<=trhCenaMax; p+=0.4) {
        let q = poptavka_c - poptavka_d*p;
        let {x, y} = mapToCanvas(p, q, trhCenaMin, trhCenaMax, trhMnozstviMin, trhMnozstviMax, canvasTrh);
        if(p===trhCenaMin) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Body pro zadanou cenu
    const p = Number(priceTrh.value);
    const qN = nabidka_a + nabidka_b*p;
    const qP = poptavka_c - poptavka_d*p;
    let ptN = mapToCanvas(p, qN, trhCenaMin, trhCenaMax, trhMnozstviMin, trhMnozstviMax, canvasTrh);
    let ptP = mapToCanvas(p, qP, trhCenaMin, trhCenaMax, trhMnozstviMin, trhMnozstviMax, canvasTrh);

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(ptN.x, ptN.y, 6, 0, 2*Math.PI);
    ctx.fill();

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(ptP.x, ptP.y, 6, 0, 2*Math.PI);
    ctx.fill();

    // Rovnovážný bod
    const eq = computeEquilibrium();
    const ptE = mapToCanvas(eq.p, eq.q, trhCenaMin, trhCenaMax, trhMnozstviMin, trhMnozstviMax, canvasTrh);
    ctx.fillStyle = "#ffa000";
    ctx.beginPath();
    ctx.arc(ptE.x, ptE.y, 7, 0, 2*Math.PI);
    ctx.fill();
}
function updateTrh() {
    const cena = Number(priceTrh.value);
    const qN = nabidka_a + nabidka_b*cena;
    const qP = poptavka_c - poptavka_d*cena;
    const eq = computeEquilibrium();
    eqPrice.textContent = eq.p;
    eqQty.textContent = eq.q;
    trhNabidka.textContent = qN;
    trhPoptavka.textContent = qP;
    drawTrh();
}
priceTrh.addEventListener('input', updateTrh);

// --- Osy a převod souřadnic ---
function drawAxes(ctx, xmin, xmax, ymin, ymax, xlabel, ylabel, canvas) {
    ctx.save();
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 1;
    // osa X
    ctx.beginPath();
    ctx.moveTo(40, canvas.height-30);
    ctx.lineTo(canvas.width-20, canvas.height-30);
    ctx.stroke();
    // osa Y
    ctx.beginPath();
    ctx.moveTo(40, canvas.height-30);
    ctx.lineTo(40, 20);
    ctx.stroke();

    ctx.font = "12px Arial";
    ctx.fillStyle = "#222";
    ctx.fillText(xlabel, canvas.width/2-34, canvas.height-8);
    ctx.save();
    ctx.translate(12, canvas.height/2+28);
    ctx.rotate(-Math.PI/2);
    ctx.fillText(ylabel, 0, 0);
    ctx.restore();

    // popisky os
    ctx.fillText(xmin, 38, canvas.height-16);
    ctx.fillText(xmax, canvas.width-32, canvas.height-16);
    ctx.fillText(ymin, 8, canvas.height-32);
    ctx.fillText(ymax, 8, 28);

    ctx.restore();
}
function mapToCanvas(x, y, xmin, xmax, ymin, ymax, canvas) {
    // 40,canvas.height-30 je 0,0
    const px = 40 + (x-xmin)/(xmax-xmin)*(canvas.width-60);
    const py = canvas.height-30 - (y-ymin)/(ymax-ymin)*(canvas.height-50);
    return {x: px, y: py};
}

// --- Init ---
updateNabidka();
updatePoptavka();
updateTrh();
