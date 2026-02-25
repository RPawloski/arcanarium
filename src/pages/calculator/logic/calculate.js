export const UNIT_RANGES = [
  { units: 1, min: 8, max: 22 },
  { units: 2, min: 23, max: 37 },
  { units: 3, min: 38, max: 52 },
  { units: 4, min: 53, max: 67 },
  { units: 5, min: 68, max: 82 },
  { units: 6, min: 83, max: 97 },
  { units: 7, min: 98, max: 112 },
  { units: 8, min: 113, max: 127 },
];

export function getUnitsForMinutes(totalMinutes) {
  if (totalMinutes < 8) return 0;
  for (let i = UNIT_RANGES.length - 1; i >= 0; i--) {
    if (totalMinutes >= UNIT_RANGES[i].min) return UNIT_RANGES[i].units;
  }
  const extra = Math.floor((totalMinutes - 127) / 15);
  return 8 + (totalMinutes > 127 ? extra + 1 : 0);
}

// Returns an array of possible distributions (usually 1, but >1 when tied remainders exist)
export function getAllDistributions(services, totalUnits) {
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

    const tied = remainders.filter((r) => r.remainder === best.remainder);

    if (tied.length === 1) {
      const target = current.find((r) => r.code === tied[0].code);
      target.assignedUnits += 1;
      return distribute(current, assigned + 1);
    } else {
      const allResults = [];
      for (const t of tied) {
        const branch = current.map((c) => ({ ...c }));
        const target = branch.find((r) => r.code === t.code);
        target.assignedUnits += 1;
        const results = distribute(branch, assigned + 1);
        allResults.push(...results);
      }
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
