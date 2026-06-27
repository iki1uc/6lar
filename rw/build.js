async function buildTop10() {
  // 1) Daten laden
  const res = await fetch("../cyx/respo.json");
  const data = await res.json();

  // 2) EVO / ACTION / FIT berechnen
  const enriched = data.map(r => {
    const evo = r.evo ?? 0;
    const action = r.action ?? 0;
    const fit = r.fit ?? 0;

    // Score-Formel (erweiterbar)
    const score = (evo * 2) + (action * 1.5) + (fit * 1.2);

    return {
      ...r,
      evo,
      action,
      fit,
      score
    };
  });

  // 3) Nur aktive Respos
  const active = enriched.filter(r => r.active === true);

  // 4) Sortieren nach Score
  const sorted = active.sort((a, b) => b.score - a.score);

  // 5) Top‑10 schneiden
  const top10 = sorted.slice(0, 10);

  // 6) Molekül‑Format erzeugen
  const mol = top10.map((r, i) => `
TOP10 {
  pos: ${i + 1}
  id: ${r.id}
  name: "${r.name}"
  evo: ${r.evo}
  action: ${r.action}
  fit: ${r.fit}
  score: ${r.score.toFixed(2)}
}
`).join("\n");

  // 7) Schreiben in list.mol
  await fetch("../10/list.mol", {
    method: "POST",
    body: mol
  });

  console.log("Top‑10 erfolgreich erzeugt (EVO/ACTION/FIT aktiv).");
}

buildTop10();
