import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";

export default function FLEPlanner() {
  // Général
  const [theme, setTheme] = useState("");
  const [niveau, setNiveau] = useState("A2");
  const [dureeTot, setDureeTot] = useState(90);
  const [objComm, setObjComm] = useState("");
  const [objLing, setObjLing] = useState("");

  // CE
  const [hasCE, setHasCE] = useState(false);
  const [ceTitre, setCeTitre] = useState("");
  const [ceTheme, setCeTheme] = useState("");
  const [ceDuree, setCeDuree] = useState(25);

  // CO
  const [hasCO, setHasCO] = useState(false);
  const [coTitre, setCoTitre] = useState("");
  const [coTheme, setCoTheme] = useState("");
  const [coDuree, setCoDuree] = useState(25);

  // Grammaire
  const [hasGRAM, setHasGRAM] = useState(false);
  const [gramConcept, setGramConcept] = useState("");
  const [gramDuree, setGramDuree] = useState(30);
  const [gramCorpus, setGramCorpus] = useState("");

  // Champs demandés (liens/exos & consigne production)
  const [entrainementRef, setEntrainementRef] = useState("");
  const [productionConsigne, setProductionConsigne] = useState("");

  const mins = (n: number) => `${n} min`;

  const blockMiseEnRoute = useMemo(() => {
    const prompt = theme ? `Thème : ${theme}` : "Thème : (à renseigner)";
    return `1) Mise en route — 5 min
• Objectif : activer les connaissances et introduire le thème.
• Déclencheur : image / question / courte vidéo liée au thème.
• Consignes (orales) : « Regardez / Écoutez… De quoi parle-t-on ? Qu’en pensez-vous ? »
• ${prompt}`;
  }, [theme]);

  const blockCE = useMemo(() => {
    if (!hasCE) return "";
    const t = ceTitre || "Document écrit (titre/source à préciser)";
    const th = ceTheme || "Support : article court / page web / affiche (à préciser)";
    return `— CE : ${t} — ${mins(ceDuree)}
2) Découverte du document (CE)
• Observation : paratexte, images, titres (qui ? quoi ? où ?).
• Consignes : « Observez et répondez : qu’est-ce que vous voyez ? où se passe la scène ? »

3) Compréhension globale (CE)
• Tâche : identifier le sujet, l’intention, 2–3 idées principales.
• Consignes : « Lisez rapidement et cochez l’idée principale. »

4) Compréhension détaillée (CE)
• Tâche : repérer informations précises (qui / quand / où / pourquoi).
• Consignes : « Relisez et répondez aux questions de détail. »

${th}`;
  }, [hasCE, ceTitre, ceTheme, ceDuree]);

  const blockCO = useMemo(() => {
    if (!hasCO) return "";
    const t = coTitre || "Document audio/vidéo (titre/source à préciser)";
    const th = coTheme || "Support : dialogue / reportage court (à préciser)";
    return `— CO : ${t} — ${mins(coDuree)}
5) Compréhension globale (CO)
• Écoute 1 (sans prise de notes) : qui parle ? où ? sujet ?
• Consignes : « Écoutez une première fois et dites qui/quoi/où. »

6) Compréhension détaillée (CO)
• Écoute 2 (avec prise de notes) : repérage d’informations ciblées.
• Consignes : « Réécoutez et complétez le tableau / répondez aux questions. »

${th}`;
  }, [hasCO, coTitre, coTheme, coDuree]);

  const blockGRAM = useMemo(() => {
    if (!hasGRAM) return "";
    const c = gramConcept || "Point de grammaire (à préciser)";
    const cor = gramCorpus ? `• Corpus :\n${gramCorpus.trim()}` : "• Corpus : (exemples authentiques à renseigner)";
    const ref = entrainementRef
      ? `\n• Réf. entraînement (lien / page / numéro) : ${entrainementRef}`
      : "";
    const prod = productionConsigne
      ? `\n• Consigne de production : ${productionConsigne}`
      : "\n• Consigne de production : (à compléter)";
    return `— Grammaire : ${c} — ${mins(gramDuree)}
7) Création du corpus
${cor}

8) Déduction de la règle
• Observation guidée : forme / sens / emploi. Mise en commun et formulation de la règle.

9) Entraînement & systématisation
• Exercices gradués : complétions, transformations, QCM, mini-dialogues.${ref}

10) Réutilisation / Production${prod}`;
  }, [hasGRAM, gramConcept, gramDuree, gramCorpus, entrainementRef, productionConsigne]);

  const synthese = useMemo(() => {
    return `Objectifs
• Communicatif : ${objComm || "(à préciser)"} 
• Linguistique : ${objLing || "(à préciser)"} 
Niveau : ${niveau}
Durée totale : ${dureeTot} min`;
  }, [objComm, objLing, niveau, dureeTot]);

  const plan = useMemo(() => {
    const parts: string[] = [];
    parts.push(synthese);
    parts.push(blockMiseEnRoute);
    if (hasCE) parts.push(blockCE);
    if (hasCO) parts.push(blockCO);
    if (hasGRAM) parts.push(blockGRAM);
    if (!hasCE && !hasCO && !hasGRAM) {
      parts.push("⚠️ Aucune activité spécifique cochée. Coche CE/CO/Grammaire pour générer les sections correspondantes.");
    }
    return parts.filter(Boolean).join("\n\n");
  }, [synthese, blockMiseEnRoute, blockCE, blockCO, blockGRAM, hasCE, hasCO, hasGRAM]);

  const exportPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 40;
    const maxWidth = 515;
    const lines = doc.splitTextToSize(plan, maxWidth);
    let y = margin;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    lines.forEach((line: string) => {
      if (y > 800) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 16;
    });
    const file = `Plan_FLE_${new Date().toISOString().slice(0,10)}.pdf`;
    doc.save(file);
  };

  const exportDOCX = async () => {
    const paragraphs = plan.split("\n").map(
      (line) => new Paragraph({ children: [new TextRun(line)], spacing: { after: 120 } })
    );
    const docx = new Document({
      sections: [{ properties: {}, children: [
        new Paragraph({ children: [new TextRun({ text: "Plan de cours FLE", bold: true, size: 28 })] }),
        new Paragraph({}),
        ...paragraphs
      ]}],
    });
    const blob = await Packer.toBlob(docx);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Plan_FLE_${new Date().toISOString().slice(0,10)}.docx`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const copyPlan = async () => {
    await navigator.clipboard.writeText(plan);
    alert("Plan copié dans le presse-papiers ✅");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100">
      {/* Outer container: wide, centered, with comfy gutters */}
      <div className="w-full max-w-screen-2xl mx-auto grid grid-cols-12 gap-6 px-4 md:px-8 py-6">
        
        {/* Header / Intro */}
        <div className="col-span-12 bg-slate-800/40 border border-slate-700 rounded-2xl p-5">
          <h1 className="text-xl font-extrabold">Générateur de plan FLE — CE • CO • Grammaire</h1>
          <p className="text-slate-400 text-sm mt-1">
            Coche les modules, renseigne (si tu veux) le thème, les durées et le concept grammatical.
            Le plan suit la méthodologie FLE et tu peux l'exporter en PDF/DOCX.
          </p>
        </div>
  
        {/* Infos générales (full width until lg, then 5/12) */}
        <div className="col-span-12 lg:col-span-5 bg-slate-800/40 border border-slate-700 rounded-2xl p-5 space-y-3">
          <div>
            <label className="font-semibold">Thème (optionnel)</label>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="ex. Jeunes talents / Voyages / Au restaurant"
            />
          </div>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold">Niveau</label>
              <select
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2"
                value={niveau}
                onChange={(e) => setNiveau(e.target.value)}
              >
                <option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option>
              </select>
            </div>
            <div>
              <label className="font-semibold">Durée totale (min)</label>
              <input
                type="number"
                min={30}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2"
                value={dureeTot}
                onChange={(e) => setDureeTot(parseInt(e.target.value || "0"))}
              />
            </div>
          </div>
  
          <div>
            <label className="font-semibold">Objectif communicatif (optionnel)</label>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2"
              value={objComm}
              onChange={(e) => setObjComm(e.target.value)}
              placeholder="ex. Raconter un événement passé"
            />
          </div>
          <div>
            <label className="font-semibold">Objectif linguistique (optionnel)</label>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2"
              value={objLing}
              onChange={(e) => setObjLing(e.target.value)}
              placeholder="ex. Passé composé / Futur proche / Partitifs"
            />
          </div>
        </div>
  
        {/* Sélections (full width until lg, then 7/12) */}
        <div className="col-span-12 lg:col-span-7 bg-slate-800/40 border border-slate-700 rounded-2xl p-5 space-y-5">
          {/* CE */}
          <div className="space-y-2">
            <label className="inline-flex items-center gap-2 font-bold">
              <input type="checkbox" checked={hasCE} onChange={(e) => setHasCE(e.target.checked)} /> Compréhension écrite (CE)
            </label>
            {hasCE && (
              <div className="space-y-3">
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2"
                  value={ceTitre}
                  onChange={(e) => setCeTitre(e.target.value)}
                  placeholder="Titre / source du document (facultatif)"
                />
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2"
                  value={ceTheme}
                  onChange={(e) => setCeTheme(e.target.value)}
                  placeholder="Support / thème (facultatif)"
                />
                <div>
                  <label className="font-semibold">Durée CE (min)</label>
                  <input
                    type="number"
                    min={10}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2"
                    value={ceDuree}
                    onChange={(e) => setCeDuree(parseInt(e.target.value || "0"))}
                  />
                </div>
              </div>
            )}
          </div>
  
          {/* CO */}
          <div className="space-y-2">
            <label className="inline-flex items-center gap-2 font-bold">
              <input type="checkbox" checked={hasCO} onChange={(e) => setHasCO(e.target.checked)} /> Compréhension orale (CO)
            </label>
            {hasCO && (
              <div className="space-y-3">
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2"
                  value={coTitre}
                  onChange={(e) => setCoTitre(e.target.value)}
                  placeholder="Titre / source de l’audio/vidéo (facultatif)"
                />
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2"
                  value={coTheme}
                  onChange={(e) => setCoTheme(e.target.value)}
                  placeholder="Support / thème (facultatif)"
                />
                <div>
                  <label className="font-semibold">Durée CO (min)</label>
                  <input
                    type="number"
                    min={10}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2"
                    value={coDuree}
                    onChange={(e) => setCoDuree(parseInt(e.target.value || "0"))}
                  />
                </div>
              </div>
            )}
          </div>
  
          {/* Grammaire */}
          <div className="space-y-2">
            <label className="inline-flex items-center gap-2 font-bold">
              <input type="checkbox" checked={hasGRAM} onChange={(e) => setHasGRAM(e.target.checked)} /> Grammaire
            </label>
            {hasGRAM && (
              <div className="space-y-3">
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2"
                  value={gramConcept}
                  onChange={(e) => setGramConcept(e.target.value)}
                  placeholder="Concept (ex. passé récent / futur proche / partitifs)"
                />
                <textarea
                  rows={4}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2"
                  value={gramCorpus}
                  onChange={(e) => setGramCorpus(e.target.value)}
                  placeholder="Corpus / exemples (optionnel)"
                />
                <input
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2"
                  value={entrainementRef}
                  onChange={(e) => setEntrainementRef(e.target.value)}
                  placeholder="Lien / numéro de page / référence d’exercices (pour l’entraînement)"
                />
                <textarea
                  rows={3}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2"
                  value={productionConsigne}
                  onChange={(e) => setProductionConsigne(e.target.value)}
                  placeholder="Consigne de production (écrite/orale)"
                />
                <div>
                  <label className="font-semibold">Durée Grammaire (min)</label>
                  <input
                    type="number"
                    min={10}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2"
                    value={gramDuree}
                    onChange={(e) => setGramDuree(parseInt(e.target.value || "0"))}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
  
        {/* Sortie + actions (full width) */}
        <div className="col-span-12 bg-slate-800/40 border border-slate-700 rounded-2xl p-5 space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={copyPlan}
              className="px-4 py-2 rounded-xl bg-sky-500/20 border border-sky-500/40 hover:brightness-110"
            >
              Copier le plan
            </button>
            <button
              onClick={exportPDF}
              className="px-4 py-2 rounded-xl bg-slate-700 hover:brightness-110"
            >
              Exporter PDF
            </button>
            <button
              onClick={exportDOCX}
              className="px-4 py-2 rounded-xl bg-slate-700 hover:brightness-110"
            >
              Exporter DOCX
            </button>
          </div>
  
          <textarea
            readOnly
            className="w-full min-h-[260px] rounded-xl border border-slate-700 bg-slate-900 p-3"
            value={plan}
          />
          <p className="text-xs text-slate-400">
            Astuce : modifie les durées / contenus et ré-exporte. Les exports incluent tous les blocs visibles.
          </p>
        </div>
      </div>
    </div>
  );  
}
