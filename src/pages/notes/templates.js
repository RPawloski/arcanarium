export const TEMPLATES = [
  // ─── EVAL ───────────────────────────────────────────────────────────────────
  {
    id: 'eval-hip-rom',
    category: 'eval',
    title: 'Hip ROM',
    content: `HIP ROM (degrees, R/L):
Flexion:               /
Extension:             /
Abduction:             /
Adduction:             /
ER (supine):           /
IR (supine):           /`,
  },
  {
    id: 'eval-shoulder-rom',
    category: 'eval',
    title: 'Shoulder ROM',
    content: `SHOULDER ROM (degrees, R/L):
Flexion:               /
Extension:             /
Abduction:             /
ER (neutral):          /
IR (neutral):          /
ER (90/90):            /
IR (90/90):            /
Horiz. Adduction:      /`,
  },
  {
    id: 'eval-knee-rom',
    category: 'eval',
    title: 'Knee ROM',
    content: `KNEE ROM (degrees, R/L):
Flexion:               /
Extension:             /
Patellar mobility:     /`,
  },
  {
    id: 'eval-lumbar-rom',
    category: 'eval',
    title: 'Lumbar ROM',
    content: `LUMBAR ROM:
Flexion:
Extension:
R Lateral Flexion:
L Lateral Flexion:
R Rotation:
L Rotation:`,
  },
  {
    id: 'eval-le-strength',
    category: 'eval',
    title: 'LE Strength (MMT)',
    content: `LE STRENGTH - MMT (R/L):
Hip Flexion:           /
Hip Extension:         /
Hip Abduction:         /
Hip ER:                /
Hip IR:                /
Knee Flexion:          /
Knee Extension:        /
Ankle DF:              /
Ankle PF:              /
Ankle Inv:             /
Ankle Ev:              /`,
  },
  {
    id: 'eval-ue-strength',
    category: 'eval',
    title: 'UE Strength (MMT)',
    content: `UE STRENGTH - MMT (R/L):
Shoulder Flexion:      /
Shoulder Abduction:    /
Shoulder ER:           /
Shoulder IR:           /
Elbow Flexion:         /
Elbow Extension:       /
Wrist Flexion:         /
Wrist Extension:       /
Grip:                  /`,
  },
  {
    id: 'eval-functional-mobility',
    category: 'eval',
    title: 'Functional Mobility',
    content: `FUNCTIONAL MOBILITY:
Bed mobility:
Sit to stand:
Ambulation:
Stairs:
Gait pattern:
Assistive device:
Weight bearing status:`,
  },
  {
    id: 'eval-pain',
    category: 'eval',
    title: 'Pain Assessment',
    content: `PAIN:
Current:      /10
Best:         /10
Worst:        /10
Location:
Quality:
Aggravating factors:
Relieving factors:`,
  },

  // ─── GOALS ──────────────────────────────────────────────────────────────────
  {
    id: 'goal-stg-mobility',
    category: 'goals',
    title: 'STG — Mobility',
    content: `SHORT-TERM GOALS (2-4 weeks):
1. Patient will demonstrate improved ROM in [joint] to [degrees] to allow [functional activity].
2. Patient will ambulate [distance] with [assistive device] with [level of assist].
3. Patient will demonstrate [activity] with [level of assist] for [repetitions/duration].`,
  },
  {
    id: 'goal-stg-strength',
    category: 'goals',
    title: 'STG — Strength & Pain',
    content: `SHORT-TERM GOALS (2-4 weeks):
1. Patient will demonstrate improved strength in [muscle group] to [MMT grade] for [functional activity].
2. Patient will report pain [X]/10 or less with [activity].
3. Patient will independently perform HEP with [level] of cueing.`,
  },
  {
    id: 'goal-ltg-function',
    category: 'goals',
    title: 'LTG — Return to Function',
    content: `LONG-TERM GOALS (6-8 weeks):
1. Patient will return to [functional activity/sport/work] with minimal to no pain.
2. Patient will demonstrate independence with home exercise program.
3. Patient will achieve [specific functional goal] to facilitate discharge from PT.`,
  },
  {
    id: 'goal-ltg-independence',
    category: 'goals',
    title: 'LTG — Independence & Discharge',
    content: `LONG-TERM GOALS (8-12 weeks):
1. Patient will demonstrate independence with all functional mobility on level surfaces and stairs.
2. Patient will independently manage symptoms with self-care strategies.
3. Patient will be discharged to independent home program upon goal achievement.`,
  },

  // ─── DAILY NOTES ────────────────────────────────────────────────────────────
  {
    id: 'daily-progress-note',
    category: 'daily',
    title: 'General Progress Note',
    content: `S: Patient reports
O: Patient participated in skilled PT including:
-
-
-
Patient tolerated treatment with
A: Patient continues to demonstrate
P: Continue skilled PT [X]x/week for [X] weeks to address`,
  },
  {
    id: 'daily-manual-therapy',
    category: 'daily',
    title: 'Manual Therapy Note',
    content: `S: Patient reports pain [X]/10. States
O: Manual therapy techniques performed:
- Joint mobilization: [joint, grade, direction]
- Soft tissue mobilization: [region]
- PROM/AAROM: [joint, motion, degrees]
Patient response:
A: Patient demonstrates
P:`,
  },
  {
    id: 'daily-therapeutic-exercise',
    category: 'daily',
    title: 'Therapeutic Exercise Note',
    content: `S: Patient reports
O: Therapeutic exercise performed:
Exercise                  Sets  Reps  Weight  Notes
----------------------    ----  ----  ------  -----


Patient tolerated with
A: Patient demonstrates progress toward goals as evidenced by
P:`,
  },
  {
    id: 'daily-hep',
    category: 'daily',
    title: 'HEP Update',
    content: `S: Patient reports compliance with HEP:
O: HEP reviewed and updated today:
- [exercise]:   sets  reps
- [exercise]:   sets  reps
- [exercise]:   sets  reps
Patient demonstrates [independent/supervised/assisted] performance with [good/fair/poor] form.
Verbal/written instructions provided: [yes/no]
A:
P:`,
  },
  {
    id: 'daily-patient-ed',
    category: 'daily',
    title: 'Patient Education Note',
    content: `S:
O: Patient education provided on:
-
-
Patient verbalized understanding: [yes/no]
Patient able to demonstrate: [yes/no]
Barriers to learning noted:
A:
P:`,
  },
]

export const CATEGORIES = [
  { id: 'eval', label: 'Eval Templates' },
  { id: 'goals', label: 'Goal Templates' },
  { id: 'daily', label: 'Daily Note Templates' },
]
