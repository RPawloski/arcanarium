import { useState } from "react";

const UNIT_RANGES = [
  { units: 1, min: 8, max: 22 },
  { units: 2, min: 23, max: 37 },
  { units: 3, min: 38, max: 52 },
  { units: 4, min: 53, max: 67 },
  { units: 5, min: 68, max: 82 },
  { units: 6, min: 83, max: 97 },
  { units: 7, min: 98, max: 112 },
  { units: 8, min: 113, max: 127 },
];

const TIMED_CODES = [
  { code: "97110", name: "Therapeutic Exercise" },
  { code: "97112", name: "Neuromuscular Reeducation" },
  { code: "97116", name: "Gait Training" },
  { code: "97140", name: "Manual Therapy" },
  { code: "97530", name: "Therapeutic Activities" },
  { code: "97035", name: "Ultrasound" },
  { code: "97032", name: "Electrical Stimulation (Attended)" },
  { code: "97033", name: "Iontophoresis" },
  { code: "97542", name: "Wheelchair Management" },
  { code: "97750", name: "Physical Performance Test" },
  { code: "97760", name: "Orthotic Training" },
  { code: "97761", name: "Prosthetic Training" },
];

const UNTIMED_CODES = [
  { code: "97014", name: "Electrical Stimulation (Unattended)" },
  { code: "97010", name: "Hot/Cold Packs" },
  { code: "97012", name: "Mechanical Traction" },
  { code: "97016", name: "Vasopneumatic Device" },
  { code: "97018", name: "Paraffin Bath" },
  { code: "97022", name: "Whirlpool" },
  { code: "97024", name: "Diathermy" },
  { code: "97028", name: "Ultraviolet" },
  { code: "97036", name: "Hydrotherapy (Hubbard)" },
];

function getUnitsForMinutes(totalMinutes) {
  if (totalMinutes < 8) return 0;
  for (let i = UNIT_RANGES.length - 1; i >= 0; i--) {
    if (totalMinutes >= UNIT_RANGES[i].min) return UNIT_RANGES[i].units;
  }
  const extra = Math.floor((totalMinutes - 127) / 15);
  return 8 + (totalMinutes > 127 ? extra + 1 : 0);
}

// Returns an array of possible distributions (usually 1, but >1 when tied remainders exist)
function getAllDistributions(services, totalUnits) {
  if (services.length === 0 || totalUnits === 0) return [[]];

  const base = services.map((s) => ({ ...s, assignedUnits: 0 }));

  // Step 1: Assign full 15-minute units
  let unitsAssigned = 0;
  for (const r of base) {
    const fullUnits = Math.floor(r.minutes / 15);
    if (r.minutes >= 15) {
      r.assignedUnits = Math.min(fullUnits, totalUnits - unitsAssigned);
      unitsAssigned += r.assignedUnits;
    }
  }

  // Step 2: Distribute remaining units, branching on ties
  function distribute(current, assigned) {
    if (assigned >= totalUnits) {
      return [current.map((c) => ({ ...c }))];
    }

    const remainders = current.map((r) => ({
      code: r.code,
      remainder: r.minutes - r.assignedUnits * 15,
    }));
    remainders.sort((a, b) => b.remainder - a.remainder);

    const best = remainders[0];
    if (best.remainder <= 0) return [current.map((c) => ({ ...c }))];

    // Find all codes tied at the best remainder value
    const tied = remainders.filter((r) => r.remainder === best.remainder);

    if (tied.length === 1) {
      const target = current.find((r) => r.code === tied[0].code);
      target.assignedUnits += 1;
      return distribute(current, assigned + 1);
    } else {
      // Tie: branch into all possibilities
      const allResults = [];
      for (const t of tied) {
        const branch = current.map((c) => ({ ...c }));
        const target = branch.find((r) => r.code === t.code);
        target.assignedUnits += 1;
        const results = distribute(branch, assigned + 1);
        allResults.push(...results);
      }
      // Deduplicate
      const seen = new Set();
      const unique = [];
      for (const res of allResults) {
        const key = res.map((r) => `${r.code}:${r.assignedUnits}`).sort().join("|");
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(res);
        }
      }
      return unique;
    }
  }

  return distribute(base, unitsAssigned);
}

const initialServices = [{ id: 1, code: "97110", minutes: "" }];

export default function Medicare8MinuteCalculator() {
  const [timedServices, setTimedServices] = useState(initialServices);
  const [untimedServices, setUntimedServices] = useState([]);
  const [nextId, setNextId] = useState(2);
  const [showReference, setShowReference] = useState(false);

  const addTimedService = () => {
    setTimedServices((prev) => [...prev, { id: nextId, code: "97110", minutes: "" }]);
    setNextId((n) => n + 1);
  };
  const addUntimedService = () => {
    setUntimedServices((prev) => [...prev, { id: nextId, code: "97014", minutes: "" }]);
    setNextId((n) => n + 1);
  };
  const removeTimed = (id) => setTimedServices((prev) => prev.filter((s) => s.id !== id));
  const removeUntimed = (id) => setUntimedServices((prev) => prev.filter((s) => s.id !== id));
  const updateTimed = (id, field, value) => {
    setTimedServices((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };
  const updateUntimed = (id, field, value) => {
    setUntimedServices((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };
  const clearAll = () => {
    setTimedServices([{ id: nextId, code: "97110", minutes: "" }]);
    setUntimedServices([]);
    setNextId((n) => n + 1);
  };

  // Calculate
  const validTimed = timedServices
    .filter((s) => s.minutes !== "" && parseInt(s.minutes) > 0)
    .map((s) => ({
      ...s,
      minutes: parseInt(s.minutes),
      name: TIMED_CODES.find((c) => c.code === s.code)?.name || "Unknown",
    }));

  const mergedMap = {};
  validTimed.forEach((s) => {
    if (mergedMap[s.code]) {
      mergedMap[s.code].minutes += s.minutes;
    } else {
      mergedMap[s.code] = { ...s };
    }
  });
  const merged = Object.values(mergedMap);

  const totalTimedMinutes = merged.reduce((sum, s) => sum + s.minutes, 0);
  const totalTimedUnits = getUnitsForMinutes(totalTimedMinutes);
  const allDistributions = getAllDistributions(merged, totalTimedUnits);
  const hasAlternatives = allDistributions.length > 1;

  const validUntimed = untimedServices.filter((s) => s.code);
  const totalUntimedUnits = validUntimed.length;
  const totalBillableUnits = totalTimedUnits + totalUntimedUnits;

  // Warnings
  const warnings = [];
  if (totalTimedMinutes > 0 && totalTimedMinutes < 8 && merged.length === 1) {
    warnings.push("Single timed service under 8 minutes cannot be billed.");
  }
  if (totalTimedMinutes > 0 && totalTimedMinutes < 8 && merged.length > 1) {
    if (totalTimedMinutes < 8) {
      warnings.push("Total timed minutes are below 8. No timed units can be billed.");
    }
  }

  // Render a single distribution block
  const renderDistribution = (distribution, label) => (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <div
          style={{
            display: "inline-block",
            background: label === "Option A" ? "rgba(56,189,248,0.15)" : "rgba(168,85,247,0.15)",
            border: `1px solid ${label === "Option A" ? "rgba(56,189,248,0.3)" : "rgba(168,85,247,0.3)"}`,
            borderRadius: 6, padding: "4px 12px", marginBottom: 8,
            fontSize: 12, fontWeight: 700, letterSpacing: "0.04em",
            color: label === "Option A" ? "#38bdf8" : "#a855f7",
          }}
        >
          {label}
        </div>
      )}
      {distribution
        .filter((d) => d.assignedUnits > 0)
        .map((d) => (
          <div
            key={d.code}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 12px", marginBottom: 4,
              background: "rgba(0,0,0,0.15)", borderRadius: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: "#38bdf8" }}>{d.code}</span>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>{d.name}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#475569" }}>{d.minutes} min →</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: "#34d399" }}>
                {d.assignedUnits} {d.assignedUnits === 1 ? "unit" : "units"}
              </span>
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a1628 0%, #132744 40%, #1a3a5c 100%)",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        color: "#e8edf4", padding: "0",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;1,9..40,300&family=JetBrains+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
        select { cursor: pointer; }
        ::selection { background: #38bdf8; color: #0a1628; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .card { animation: fadeIn 0.3s ease-out; }
        .result-badge { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @media (max-width: 520px) {
          .service-row { flex-wrap: wrap; }
          .service-row select { width: 100%; flex: 1 1 100%; }
        }
      `}</style>

      {/* Header */}
      <div style={{ padding: "32px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.15)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #38bdf8, #818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#0a1628" }}>8</div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, background: "linear-gradient(135deg, #e2e8f0, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.02em" }}>
              Medicare 8-Minute Rule Calculator
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#64748b", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.02em" }}>
            CMS Medicare Part B &middot; Outpatient Therapy Billing
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 24px 60px" }}>
        {/* TIMED SERVICES */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#38bdf8", letterSpacing: "0.06em", textTransform: "uppercase" }}>Timed Services</h2>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#475569" }}>Direct one-on-one patient contact (15-min unit codes)</p>
            </div>
            <button
              onClick={addTimedService}
              style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.25)", color: "#38bdf8", borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
              onMouseOver={(e) => { e.target.style.background = "rgba(56,189,248,0.2)"; }}
              onMouseOut={(e) => { e.target.style.background = "rgba(56,189,248,0.1)"; }}
            >+ Add Service</button>
          </div>

          {timedServices.map((service) => (
            <div key={service.id} className="card service-row" style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", padding: "10px 14px" }}>
              <select
                value={service.code}
                onChange={(e) => updateTimed(service.id, "code", e.target.value)}
                style={{ flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none" }}
              >
                {TIMED_CODES.map((c) => (<option key={c.code} value={c.code}>{c.code} — {c.name}</option>))}
              </select>
              <div style={{ position: "relative" }}>
                <input
                  type="number" min="0" max="999" placeholder="0"
                  value={service.minutes}
                  onChange={(e) => updateTimed(service.id, "minutes", e.target.value)}
                  style={{ width: 80, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", borderRadius: 8, padding: "10px 36px 10px 12px", fontSize: 14, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, textAlign: "right", outline: "none" }}
                  onFocus={(e) => { e.target.style.borderColor = "#38bdf8"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
                />
                <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "#475569", fontFamily: "'JetBrains Mono', monospace", pointerEvents: "none" }}>min</span>
              </div>
              <button
                onClick={() => removeTimed(service.id)}
                style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 18, padding: "4px 6px", borderRadius: 6, lineHeight: 1, transition: "color 0.15s" }}
                onMouseOver={(e) => { e.target.style.color = "#ef4444"; }}
                onMouseOut={(e) => { e.target.style.color = "#475569"; }}
              >×</button>
            </div>
          ))}
        </div>

        {/* UNTIMED SERVICES */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#818cf8", letterSpacing: "0.06em", textTransform: "uppercase" }}>Untimed Services</h2>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#475569" }}>Service-based codes (1 unit each, not added to timed total)</p>
            </div>
            <button
              onClick={addUntimedService}
              style={{ background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.25)", color: "#818cf8", borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
              onMouseOver={(e) => { e.target.style.background = "rgba(129,140,248,0.2)"; }}
              onMouseOut={(e) => { e.target.style.background = "rgba(129,140,248,0.1)"; }}
            >+ Add Service</button>
          </div>
          {untimedServices.length === 0 && (
            <p style={{ fontSize: 13, color: "#334155", margin: "8px 0 0", fontStyle: "italic" }}>No untimed services added.</p>
          )}
          {untimedServices.map((service) => (
            <div key={service.id} className="card service-row" style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", padding: "10px 14px" }}>
              <select
                value={service.code}
                onChange={(e) => updateUntimed(service.id, "code", e.target.value)}
                style={{ flex: 1, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none" }}
              >
                {UNTIMED_CODES.map((c) => (<option key={c.code} value={c.code}>{c.code} — {c.name}</option>))}
              </select>
              <div style={{ background: "rgba(129,140,248,0.15)", borderRadius: 6, padding: "8px 14px", fontSize: 13, color: "#818cf8", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, whiteSpace: "nowrap" }}>1 unit</div>
              <button
                onClick={() => removeUntimed(service.id)}
                style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 18, padding: "4px 6px", borderRadius: 6, lineHeight: 1 }}
                onMouseOver={(e) => { e.target.style.color = "#ef4444"; }}
                onMouseOut={(e) => { e.target.style.color = "#475569"; }}
              >×</button>
            </div>
          ))}
        </div>

        {/* CLEAR */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
          <button onClick={clearAll} style={{ background: "none", border: "1px solid rgba(255,255,255,0.08)", color: "#64748b", borderRadius: 8, padding: "7px 16px", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>Clear All</button>
        </div>

        {/* RESULTS */}
        <div className="result-badge" style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.08), rgba(129,140,248,0.08))", border: "1px solid rgba(56,189,248,0.15)", borderRadius: 16, padding: "24px 28px", marginBottom: 20 }}>
          <h2 style={{ margin: "0 0 18px", fontSize: 13, fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase" }}>Billing Summary</h2>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[
              { label: "Timed Minutes", value: totalTimedMinutes, color: "#38bdf8" },
              { label: "Timed Units", value: totalTimedUnits, color: "#38bdf8" },
              { label: "Total Billable", value: totalBillableUnits, color: "#34d399" },
            ].map((stat) => (
              <div key={stat.label} style={{ background: "rgba(0,0,0,0.25)", borderRadius: 12, padding: "16px 14px", textAlign: "center" }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: stat.color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.1 }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 4, fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Distribution(s) */}
          {allDistributions.length > 0 && allDistributions[0].length > 0 && allDistributions[0].some((d) => d.assignedUnits > 0) && (
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 600, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Unit Distribution
              </h3>

              {hasAlternatives && (
                <div style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: "#c4b5fd", lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 700 }}>Tied remainders detected.</span>{" "}
                  There {allDistributions.length === 2 ? "are 2 equally valid ways" : `are ${allDistributions.length} equally valid ways`} to distribute units. Either option is correct — it's your choice.
                </div>
              )}

              {hasAlternatives
                ? allDistributions.map((dist, i) => {
                    const label = `Option ${String.fromCharCode(65 + i)}`;
                    return <div key={i}>{renderDistribution(dist, label)}</div>;
                  })
                : renderDistribution(allDistributions[0], null)
              }

              {/* Untimed (same across all options) */}
              {validUntimed.map((s) => {
                const info = UNTIMED_CODES.find((c) => c.code === s.code);
                return (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", marginBottom: 4, background: "rgba(0,0,0,0.15)", borderRadius: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, color: "#818cf8" }}>{s.code}</span>
                      <span style={{ fontSize: 13, color: "#94a3b8" }}>{info?.name}</span>
                      <span style={{ fontSize: 10, color: "#475569", background: "rgba(129,140,248,0.1)", padding: "2px 6px", borderRadius: 4 }}>UNTIMED</span>
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: "#34d399" }}>1 unit</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Warnings */}
          {warnings.length > 0 && (
            <div style={{ marginTop: 12 }}>
              {warnings.map((w, i) => (
                <div key={i} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 6, fontSize: 13, color: "#fca5a5", display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <span style={{ fontSize: 14, lineHeight: 1.4 }}>⚠</span>
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* REFERENCE TABLE */}
        <button
          onClick={() => setShowReference(!showReference)}
          style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#94a3b8", borderRadius: 12, padding: "14px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}
        >
          <span>Unit-to-Minutes Reference Chart</span>
          <span style={{ fontSize: 16, transform: showReference ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
        </button>

        {showReference && (
          <div className="card" style={{ background: "rgba(0,0,0,0.2)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", marginBottom: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Units", "Min Minutes", "Max Minutes"].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {UNIT_RANGES.map((r, i) => {
                  const isActive = totalTimedMinutes >= r.min && totalTimedMinutes <= r.max;
                  return (
                    <tr key={r.units} style={{ background: isActive ? "rgba(56,189,248,0.1)" : i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                      <td style={{ padding: "8px 16px", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: isActive ? "#38bdf8" : "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{r.units}</td>
                      <td style={{ padding: "8px 16px", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: isActive ? "#e2e8f0" : "#64748b", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{r.min}</td>
                      <td style={{ padding: "8px 16px", textAlign: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: isActive ? "#e2e8f0" : "#64748b", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{r.max}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* DISCLAIMER */}
        <div style={{ padding: "16px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.04)" }}>
          <p style={{ margin: 0, fontSize: 11, color: "#475569", lineHeight: 1.6 }}>
            <strong style={{ color: "#64748b" }}>Disclaimer:</strong> This calculator applies the CMS Medicare 8-Minute Rule for Part B outpatient therapy billing only. It does not apply to the AMA Rule of Eights or other payer-specific rules. Always verify against current CMS guidelines and consult your compliance team.
          </p>
        </div>
      </div>
    </div>
  );
}
