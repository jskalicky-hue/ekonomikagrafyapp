const { useState, useMemo, useEffect } = React;
const {
  LineChart, Line, CartesianGrid, XAxis, YAxis,
  Tooltip, ResponsiveContainer, ReferenceDot, Legend
} = Recharts;

function AplikaceTrh() {
  const [zalozka, nastavZalozku] = useState("nabidka");
  const [cena, nastavCena] = useState(20);

  const ROZMEZI_CEN = useMemo(() => {
    return zalozka === "propojeny" ? { min: 0, max: 46 } : { min: 0, max: 100 };
  }, [zalozka]);

  useEffect(() => {
    if (cena < ROZMEZI_CEN.min) nastavCena(ROZMEZI_CEN.min);
    if (cena > ROZMEZI_CEN.max) nastavCena(ROZMEZI_CEN.max);
  }, [ROZMEZI_CEN, cena]);

  // Funkce nabídky a poptávky
  const nabidka = (p) => 2 * p - 10;
  const poptavka = (p) => 100 - 1.5 * p;

  // Pomocná funkce na generování dat
  const generujData = (xMin, xMax, kroky = 50) => {
    const krok = (xMax - xMin) / kroky;
    const pole = [];
    for (let i = 0; i <= kroky; i++) {
      const x = +(xMin + krok * i).toFixed(2);
      pole.push({ cena: x, nabidka: nabidka(x), poptavka: poptavka(x) });
    }
    return pole;
  };

  const dataVelka = useMemo(() => generujData(0, 100, 100), []);
  const dataMala = useMemo(() => generujData(0, 46, 92), []);

  // Rovnovážný bod
  const rovnovaha = useMemo(() => {
    const P_eq = 110 / 3.5;
    const Q_eq = nabidka(P_eq);
    return { cena: +P_eq.toFixed(2), mnozstvi: +Q_eq.toFixed(2) };
  }, []);

  const hodnotyPriCene = useMemo(() => ({
    nabidka: +nabidka(cena).toFixed(2),
    poptavka: +poptavka(cena).toFixed(2),
  }), [cena]);

  return (
    <div>
      <h1>Grafy trhu</h1>

      {/* Záložky */}
      <div>
        <button onClick={() => nastavZalozku("nabidka")}>Nabídka</button>
        <button onClick={() => nastavZalozku("poptavka")}>Poptávka</button>
        <button onClick={() => nastavZalozku("propojeny")}>Propojený trh</button>
      </div>

      {/* Vstup pro cenu */}
      <input
        type="number"
        min={ROZMEZI_CEN.min}
        max={ROZMEZI_CEN.max}
        value={cena}
        onChange={(e) => nastavCena(Number(e.target.value))}
      />

      {/* Textové výstupy */}
      {zalozka === "nabidka" && (
        <p>Nabízené množství: {hodnotyPriCene.nabidka}</p>
      )}
      {zalozka === "poptavka" && (
        <p>Poptávané množství: {hodnotyPriCene.poptavka}</p>
      )}
      {zalozka === "propojeny" && (
        <div>
          <p>Rovnovážná cena: {rovnovaha.cena}</p>
          <p>Rovnovážné množství: {rovnovaha.mnozstvi}</p>
          <p>Nabídka při ceně: {hodnotyPriCene.nabidka}</p>
          <p>Poptávka při ceně: {hodnotyPriCene.poptavka}</p>
        </div>
      )}

      {/* Graf */}
      <div style={{ width: "100%", height: "400px" }}>
        <ResponsiveContainer>
          <LineChart
            data={zalozka === "propojeny" ? dataMala : dataVelka}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="cena" />
            <YAxis />
            <Tooltip />
            <Legend />

            {zalozka !== "poptavka" && (
              <Line type="linear" dataKey="nabidka" stroke="teal" dot={false} />
            )}
            {zalozka !== "nabidka" && (
              <Line type="linear" dataKey="poptavka" stroke="red" dot={false} />
            )}

            {/* Tečky */}
            {zalozka === "nabidka" && (
              <ReferenceDot x={cena} y={hodnotyPriCene.nabidka} r={5} fill="teal" />
            )}
            {zalozka === "poptavka" && (
              <ReferenceDot x={cena} y={hodnotyPriCene.poptavka} r={5} fill="red" />
            )}
            {zalozka === "propojeny" && (
              <>
                <ReferenceDot x={cena} y={hodnotyPriCene.nabidka} r={5} fill="teal" />
                <ReferenceDot x={cena} y={hodnotyPriCene.poptavka} r={5} fill="red" />
                <ReferenceDot x={rovnovaha.cena} y={rovnovaha.mnozstvi} r={6} fill="black" />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AplikaceTrh />);
