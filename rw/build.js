async function buildTop10() {
  // 1) Daten laden
  const res = await fetch("../cyx/respo.json");
  const data = await res.json();

  // 2) Nur aktive Respos
  const active = data.filter(r => r.active === true);

  // 3) Sortieren nach Score
  const sorted = active.sort((a, b) => b.score - a.score);

  // 4) Top‑10 schneiden
  const top10 = sorted.slice(0, 10);

  // 5) Molekül‑Format erzeugen
  const mol = top10.map((r, i) => `
TOP10 {
  pos: ${i + 1}
  id: ${r.id}
  name: ${r.name}
  score: ${r.score}
}
`).join("\n");

  // 6) Schreiben in list.mol
  await fetch("../10/list.mol", {
    method: "POST",
    body: mol
  });

  console.log("Top‑10 erfolgreich erzeugt.");
}

buildTop10();
