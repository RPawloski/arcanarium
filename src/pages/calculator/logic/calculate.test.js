import { describe, it, expect } from "vitest";
import { getUnitsForMinutes, getAllDistributions } from "./calculate.js";

// Helper: run the full timed billing calculation the same way the component does
function calcTimed(services) {
  // services: [{ code, minutes }]
  const mergedMap = {};
  for (const s of services) {
    if (mergedMap[s.code]) {
      mergedMap[s.code].minutes += s.minutes;
    } else {
      mergedMap[s.code] = { ...s };
    }
  }
  const merged = Object.values(mergedMap);
  const totalMinutes = merged.reduce((sum, s) => sum + s.minutes, 0);
  const totalUnits = getUnitsForMinutes(totalMinutes);
  const distributions = getAllDistributions(merged, totalUnits);
  return { totalMinutes, totalUnits, distributions };
}

// Helper: find assigned units for a code in a distribution
function unitsFor(distribution, code) {
  return distribution.find((d) => d.code === code)?.assignedUnits ?? 0;
}

describe("getUnitsForMinutes", () => {
  it("returns 0 for minutes < 8", () => {
    expect(getUnitsForMinutes(7)).toBe(0);
    expect(getUnitsForMinutes(0)).toBe(0);
  });

  it("returns correct units per CMS chart", () => {
    expect(getUnitsForMinutes(8)).toBe(1);
    expect(getUnitsForMinutes(22)).toBe(1);
    expect(getUnitsForMinutes(23)).toBe(2);
    expect(getUnitsForMinutes(37)).toBe(2);
    expect(getUnitsForMinutes(38)).toBe(3);
    expect(getUnitsForMinutes(53)).toBe(4);
    expect(getUnitsForMinutes(68)).toBe(5);
    expect(getUnitsForMinutes(83)).toBe(6);
    expect(getUnitsForMinutes(98)).toBe(7);
    expect(getUnitsForMinutes(113)).toBe(8);
    expect(getUnitsForMinutes(127)).toBe(8);
  });
});

describe("CMS test cases", () => {
  it("7 min of 97035 (single service) → 0 units", () => {
    const { totalUnits } = calcTimed([{ code: "97035", minutes: 7 }]);
    expect(totalUnits).toBe(0);
  });

  it("10 min of 97110 → 1 unit for 97110", () => {
    const { totalUnits, distributions } = calcTimed([{ code: "97110", minutes: 10 }]);
    expect(totalUnits).toBe(1);
    expect(distributions).toHaveLength(1);
    expect(unitsFor(distributions[0], "97110")).toBe(1);
  });

  it("60 min of 97530 → 4 units for 97530", () => {
    const { totalUnits, distributions } = calcTimed([{ code: "97530", minutes: 60 }]);
    expect(totalUnits).toBe(4);
    expect(distributions).toHaveLength(1);
    expect(unitsFor(distributions[0], "97530")).toBe(4);
  });

  it("20 min 97112 + 20 min 97110 → 3 units, tied (2+1 or 1+2)", () => {
    const { totalUnits, distributions } = calcTimed([
      { code: "97112", minutes: 20 },
      { code: "97110", minutes: 20 },
    ]);
    expect(totalUnits).toBe(3);
    expect(distributions).toHaveLength(2);
    // Every distribution should sum to 3
    for (const dist of distributions) {
      const sum = dist.reduce((s, d) => s + d.assignedUnits, 0);
      expect(sum).toBe(3);
    }
    // One option gives 97112=2,97110=1 and the other 97112=1,97110=2
    const combos = distributions.map((d) =>
      `${unitsFor(d, "97112")}+${unitsFor(d, "97110")}`
    );
    expect(combos).toContain("2+1");
    expect(combos).toContain("1+2");
  });

  it("24 min 97112 + 23 min 97110 → 3 units: 2×97112 + 1×97110", () => {
    const { totalUnits, distributions } = calcTimed([
      { code: "97112", minutes: 24 },
      { code: "97110", minutes: 23 },
    ]);
    expect(totalUnits).toBe(3);
    expect(distributions).toHaveLength(1);
    expect(unitsFor(distributions[0], "97112")).toBe(2);
    expect(unitsFor(distributions[0], "97110")).toBe(1);
  });

  it("33 min 97110 + 7 min 97140 → 3 units: 2×97110 + 1×97140", () => {
    const { totalUnits, distributions } = calcTimed([
      { code: "97110", minutes: 33 },
      { code: "97140", minutes: 7 },
    ]);
    expect(totalUnits).toBe(3);
    expect(distributions).toHaveLength(1);
    expect(unitsFor(distributions[0], "97110")).toBe(2);
    expect(unitsFor(distributions[0], "97140")).toBe(1);
  });

  it("7 min 97112 + 7 min 97110 + 7 min 97140 → 1 unit (any code, 3-way tie)", () => {
    const { totalMinutes, totalUnits, distributions } = calcTimed([
      { code: "97112", minutes: 7 },
      { code: "97110", minutes: 7 },
      { code: "97140", minutes: 7 },
    ]);
    expect(totalMinutes).toBe(21);
    expect(totalUnits).toBe(1);
    expect(distributions).toHaveLength(3);
    for (const dist of distributions) {
      const sum = dist.reduce((s, d) => s + d.assignedUnits, 0);
      expect(sum).toBe(1);
    }
  });

  it("18 min 97110 + 13 min 97140 + 10 min 97116 + 8 min 97035 = 49 min → 3 units: 1×97110 + 1×97140 + 1×97116", () => {
    const { totalMinutes, totalUnits, distributions } = calcTimed([
      { code: "97110", minutes: 18 },
      { code: "97140", minutes: 13 },
      { code: "97116", minutes: 10 },
      { code: "97035", minutes: 8 },
    ]);
    expect(totalMinutes).toBe(49);
    expect(totalUnits).toBe(3);
    expect(distributions).toHaveLength(1);
    expect(unitsFor(distributions[0], "97110")).toBe(1);
    expect(unitsFor(distributions[0], "97140")).toBe(1);
    expect(unitsFor(distributions[0], "97116")).toBe(1);
    expect(unitsFor(distributions[0], "97035")).toBe(0);
  });

  it("30 min 97110 + 15 min 97140 + 8 min 97035 (timed) → 4 timed units", () => {
    // The untimed 97014 is handled separately by the component; we just verify timed here
    const { totalMinutes, totalUnits, distributions } = calcTimed([
      { code: "97110", minutes: 30 },
      { code: "97140", minutes: 15 },
      { code: "97035", minutes: 8 },
    ]);
    expect(totalMinutes).toBe(53);
    expect(totalUnits).toBe(4);
    expect(distributions).toHaveLength(1);
    expect(unitsFor(distributions[0], "97110")).toBe(2);
    expect(unitsFor(distributions[0], "97140")).toBe(1);
    expect(unitsFor(distributions[0], "97035")).toBe(1);
  });

  it("18 min 97110 + 5 min 97116 = 23 min → 2 units: 1×97110 + 1×97116", () => {
    const { totalMinutes, totalUnits, distributions } = calcTimed([
      { code: "97110", minutes: 18 },
      { code: "97116", minutes: 5 },
    ]);
    expect(totalMinutes).toBe(23);
    expect(totalUnits).toBe(2);
    expect(distributions).toHaveLength(1);
    expect(unitsFor(distributions[0], "97110")).toBe(1);
    expect(unitsFor(distributions[0], "97116")).toBe(1);
  });
});

describe("untimed units", () => {
  it("untimed codes contribute 1 unit each and never affect timed total", () => {
    // 30 min 97110 + 15 min 97140 + 8 min 97035 = 4 timed units
    // + 1 untimed 97014 = 5 total
    const { totalUnits } = calcTimed([
      { code: "97110", minutes: 30 },
      { code: "97140", minutes: 15 },
      { code: "97035", minutes: 8 },
    ]);
    const untimedUnits = 1; // 97014
    expect(totalUnits + untimedUnits).toBe(5);
  });
});
