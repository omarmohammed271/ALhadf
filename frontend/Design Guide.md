# ER Patient Experience Dashboard

**Data Inputs, KPIs & Calculation Logic (Code-Based)**

## Purpose

This dashboard monitors **patient experience drivers in the Emergency Room** by combining:

* Operational timing metrics
* Communication effectiveness
* Behavioral outcomes (LWBS, revisits)
* Satisfaction and risk indicators

All values shown are **explicit mock inputs defined in the frontend code** to validate KPI meaning, relationships, and visualization behavior.

---

## 1. Stat Cards (Top-Level KPIs)

These are **headline indicators** summarizing ER performance.

---

### 1.1 Average Time to First Clinical Contact

**Value (code):**

```ts
"12 min"
```

**Meaning:**
Average time from arrival to first clinical interaction.

**Intended calculation:**

```
AVG(first_contact_time - arrival_time)
```

---

### 1.2 % Receiving Timely Communication

**Value (code):**

```ts
"78%"
```

**Meaning:**
Patients who received at least one communication within a defined time threshold.

**Intended calculation:**

```
(visits_with_communication_within_threshold / total_visits) × 100
```

---

### 1.3 Overall Patient Satisfaction

**Value (code):**

```ts
"4.2 / 5"
```

**Meaning:**
Average patient satisfaction score.

**Intended calculation:**

```
AVG(satisfaction_score)
```

---

### 1.4 LWBS Rate

**Value (code):**

```ts
"5%"
```

**Meaning:**
Patients who left without being seen.

**Intended calculation:**

```
(LWBS_visits / total_visits) × 100
```

---

### 1.5 Revisit Rate (72 Hours)

**Value (code):**

```ts
"8%"
```

**Meaning:**
Patients returning within 72 hours of discharge.

**Intended calculation:**

```
(visits_with_revisit_within_72h / total_discharges) × 100
```

---

### 1.6 High Dissatisfaction Risk Visits

**Value (code):**

```ts
"10%"
```

**Meaning:**
Visits flagged by the dissatisfaction risk model.

**Intended calculation:**

```
(high_risk_visits / total_visits) × 100
```

---

## 2. Charts & KPIs (Exact Inputs + Logic)

---

### 2.1 Arrival → First Contact Trend

**Component:** `ArrivalToFirstContactTrend`

**Inputs (code):**

```ts
data={[
  { date: "2024-01-01", avgMinutes: 18 },
  { date: "2024-01-02", avgMinutes: 21 },
  { date: "2024-01-03", avgMinutes: 24 },
  { date: "2024-01-04", avgMinutes: 20 },
  { date: "2024-01-05", avgMinutes: 22 },
]}
granularity="daily"
threshold={20}
```

**Logic:**
Tracks daily average time to first contact and flags SLA breaches above 20 minutes.

---

### 2.2 Waiting Time by Triage Level

**Component:** `WaitingTimeByTriage`

**Inputs (code):**

```ts
data={[
  { level: "Level 1", minutes: [5, 7, 8, 6, 10] },
  { level: "Level 2", minutes: [10, 12, 15, 11, 14] },
  { level: "Level 3", minutes: [20, 25, 18, 22, 30] },
  { level: "Level 4", minutes: [30, 35, 28, 32, 40] },
  { level: "Level 5", minutes: [40, 45, 42, 38, 50] },
]}
threshold={30}
```

**Logic:**
Shows waiting-time distributions per triage level and highlights overload beyond 30 minutes.

---

### 2.3 Communication Coverage by Section

**Component:** `CommunicationCoverageBar`

**Inputs (code):**

```ts
sections={["Triage", "ER Room A", "ER Room B", "Observation", "ICU"]}
coverage={[95, 80, 85, 70, 60]}
threshold={85}
```

**Logic:**
Percentage of visits with documented communication per ER section.

---

### 2.4 Time to First Communication Trend

**Component:** `TimeToFirstCommunicationLine`

**Inputs (code):**

```ts
dates={["2025-10-01", "2025-10-02", "2025-10-03", "2025-10-04"]}
avgMinutes={[12, 15, 10, 18]}
threshold={15}
```

**Logic:**
Tracks responsiveness of communication after arrival.

---

### 2.5 Length of Stay vs Satisfaction

**Component:** `LOSvsSatisfaction`

**Inputs (code):**

```ts
lengthsOfStay={[30, 45, 60, 75, 90, 120]}
satisfactionScores={[95, 90, 85, 70, 60, 50]}
threshold={70}
```

**Logic:**
Visualizes satisfaction decay as length of stay increases.

---

### 2.6 First Contact Delay Impact on Satisfaction

**Component:** `FirstContactDelayLine`

**Inputs (code):**

```ts
buckets={["0-5 min", "5-10 min", "10-15 min", "15-30 min", "30+ min"]}
avgSatisfaction={[95, 88, 80, 70, 60]}
threshold={10}
```

**Logic:**
Demonstrates how early delays disproportionately affect satisfaction.

---

### 2.7 LWBS Rate by Section

**Component:** `LWBSRateBar`

**Inputs (code):**

```ts
sections={["Triage", "Fast Track", "Main ER", "Resuscitation"]}
lwbsRates={[3.2, 5.8, 9.4, 2.1]}
threshold={5}
```

**Logic:**
Identifies where patients are most likely to leave before being seen.

---

### 2.8 Revisit Rate vs Communication

**Component:** `RevisitVsCommunicationBar`

**Inputs (code):**

```ts
categories={["Communication Provided", "No Communication"]}
revisitRates={[8.5, 18.2]}
threshold={12}
```

**Logic:**
Quantifies the impact of communication on short-term returns.

---

### 2.9 Satisfaction by Shift & Pressure Level

**Component:** `SatisfactionByShiftPressure`

**Inputs (code):**

```ts
data={[
  { shift: "Morning", pressureLevel: "Low", satisfaction: 88 },
  { shift: "Morning", pressureLevel: "Medium", satisfaction: 75 },
  { shift: "Morning", pressureLevel: "High", satisfaction: 62 },
  { shift: "Afternoon", pressureLevel: "Low", satisfaction: 85 },
  { shift: "Afternoon", pressureLevel: "Medium", satisfaction: 70 },
  { shift: "Afternoon", pressureLevel: "High", satisfaction: 55 },
  { shift: "Night", pressureLevel: "Low", satisfaction: 80 },
  { shift: "Night", pressureLevel: "Medium", satisfaction: 68 },
  { shift: "Night", pressureLevel: "High", satisfaction: 50 },
]}
```

**Logic:**
Identifies operational conditions where patient experience is most fragile.

---

### 2.10 Dissatisfaction Risk by ER Section

**Component:** `DissatisfactionRiskBySection`

**Inputs (code):**

```ts
data={[
  { section: "Triage", riskScore: 85 },
  { section: "Pediatrics", riskScore: 70 },
  { section: "Trauma", riskScore: 55 },
  { section: "Cardiology", riskScore: 40 },
  { section: "General", riskScore: 25 },
]}
```

**Logic:**
Aggregated output of a dissatisfaction risk model by ER section.

---