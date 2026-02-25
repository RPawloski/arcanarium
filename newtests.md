# Medicare 8-Minute Rule – Test Scenarios

## Unit Chart

| Units | Min Minutes | Max Minutes |
|-------|-------------|-------------|
| 1     | 8           | 22          |
| 2     | 23          | 37          |
| 3     | 38          | 52          |
| 4     | 53          | 67          |
| 5     | 68          | 82          |
| 6     | 83          | 97          |
| 7     | 98          | 112         |
| 8     | 113         | 127         |

## Rules
- Only timed code minutes count toward the unit total
- Untimed codes (e.g. 97014, evaluations) = always bill 1 unit each, never add to timed total
- Single timed service under 8 min = 0 units
- Services ≥ 15 min must get at least 1 unit; ≥ 30 min = at least 2 units
- Extra units assigned to service with largest remainder after full units allocated
- Mixed remainders each under 8 min: if combined ≥ 8 min, bill 1 extra unit to largest remainder

---

## Test Cases

### Example 1 – Single Service, 40 min (VALID)
**Input:** `{ "97110": 40 }`
**Expected:** `{ "97110": 3 }`
**Logic:** 40 min → 3 units (38–52 range)

---

### Example 2 – Single Service Below Minimum (INVALID)
**Input:** `{ "97140": 7 }`
**Expected:** `{}` or `{ "97140": 0 }`
**Logic:** 7 min < 8 min threshold → 0 timed units billable

---

### Example 3 – Single Service, 60 min (VALID)
**Input:** `{ "97530": 60 }`
**Expected:** `{ "97530": 4 }`
**Logic:** 60 min → 4 units (53–67 range)

---

### Example 4 – Two Services, Equal Time, 40 min (VALID)
**Input:** `{ "97112": 20, "97110": 20 }`
**Expected:** one code = 2 units, the other = 1 unit (e.g. `{ "97112": 2, "97110": 1 }`)
**Logic:** 40 min → 3 units. Each has 5 min remainder after 1 full unit. Tied → assign extra to either.

---

### Example 5 – Two Services, Unequal Time, 60 min (VALID)
**Input:** `{ "97112": 35, "97110": 25 }`
**Expected:** `{ "97112": 2, "97110": 2 }`
**Logic:** 60 min → 4 units. 97112: 2 full units (rem 5). 97110: 1 full unit (rem 10). 4th unit → 97110 (larger remainder).

---

### Example 6 – Overbilling, 40 min (INVALID)
**Input:** `{ "97110": 25, "97140": 15 }`, billed as 4 units
**Expected:** `{ "97110": 2, "97140": 1 }` (3 total units)
**Logic:** 40 min → max 3 units. Billing 4 requires ≥ 53 min.

---

### Example 7 – Mixed Small Remainders, 40 min (VALID)
**Input:** `{ "97110": 33, "97140": 7 }`
**Expected:** `{ "97110": 2, "97140": 1 }`
**Logic:** 40 min → 3 units. 97110: 2 full units (rem 3). 97140: rem 7. Neither ≥ 8 alone, but 3+7=10 ≥ 8 → bill extra unit to 97140 (larger remainder).

---

### Example 8 – All Services Under 8 Min Each, Combined ≥ 8 (VALID)
**Input:** `{ "97112": 7, "97110": 7, "97140": 7 }`
**Expected:** 1 unit of the most clinically appropriate code
**Logic:** 21 min → 1 unit. No individual service ≥ 8 min, but total 21 supports 1 unit.

---

### Example 9 – Billing Each Sub-8-Min Service Separately (INVALID)
**Input:** `{ "97112": 7, "97110": 7, "97140": 7 }`, billed as 3 units
**Expected:** 1 total unit
**Logic:** 21 min → 1 unit only. Billing 3 units is overbilling.

---

### Example 10 – Three Services, Tied Remainders (VALID)
**Input:** `{ "97110": 23, "97140": 9, "97116": 8 }`
**Expected:** `{ "97110": 1, "97140": 1, "97116": 1 }` (3 total, tied 3rd unit can go to 97110 or 97116)
**Logic:** 40 min → 3 units. 97110: 1 full unit (rem 8). 97140: rem 9. 97116: rem 8. 1st extra → 97140 (9). 2nd extra → tied at 8 (97110 or 97116), either valid.

---

### Example 11 – One Minute Difference Changes Assignment (VALID)
**Input:** `{ "97110": 22, "97140": 9, "97116": 8 }`
**Expected:** `{ "97110": 1, "97140": 1, "97116": 1 }`
**Logic:** 39 min → 3 units. 97110: 1 full unit (rem 7). 97140: rem 9. 97116: rem 8. Extra units → 97140 (9) and 97116 (8). 97110 does NOT get extra (rem 7 < 8).

---

### Example 12 – Billing 4 Units for 40 Min (INVALID)
**Input:** `{ "97110": 23, "97140": 9, "97116": 8 }`, billed as 4 units
**Expected:** 3 total units
**Logic:** 40 min → max 3 units. 4 units requires ≥ 53 min.

---

### Example 13 – Timed + Untimed Services, 60 min (VALID)
**Input:** `{ "97110": 25, "97140": 15, "97112": 20, "97014": "untimed" }`
**Expected:** `{ "97110": 2, "97140": 1, "97112": 1, "97014": 1 }` (5 total)
**Logic:** Timed total = 60 min → 4 timed units. 97014 = 1 untimed unit (not counted in timed total). 97110: 1 full unit (rem 10) → gets 4th unit (largest rem). 97140: 1 full unit. 97112: 1 full unit.

---

### Example 14 – Adding Untimed Minutes to Timed Total (INVALID)
**Input:** `{ "97110": 25, "97014": "untimed" }`, therapist bills 3 timed units
**Expected:** `{ "97110": 2, "97014": 1 }` (3 total, but only 2 timed)
**Logic:** Timed total = 25 min → 2 timed units. Untimed minutes never added to timed total.

---

### Example 15 – Four Timed Services + Untimed, 60 min (VALID)
**Input:** `{ "97110": 20, "97112": 18, "97140": 12, "97530": 10, "97014": "untimed" }`
**Expected:** `{ "97110": 1, "97112": 1, "97140": 1, "97530": 1, "97014": 1 }` (5 total)
**Logic:** Timed total = 60 min → 4 timed units. Full units: 97110 (rem 5), 97112 (rem 3) = 2 units used. Remaining 2 → 97140 (12 min rem) and 97530 (10 min rem). Plus 1 untimed for 97014.

---

### Example 16 – Remainder Assignment, 40 min (VALID)
**Input:** `{ "97110": 22, "97116": 10, "97140": 8 }`
**Expected:** `{ "97110": 1, "97116": 1, "97140": 1 }`
**Logic:** 40 min → 3 units. 97110: 1 full unit (rem 7). 97116: rem 10. 97140: rem 8. Extra units → 97116 (10) and 97140 (8). 97110 gets no extra despite most total time (rem 7 < others).
