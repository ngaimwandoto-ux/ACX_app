# ACX Country Research Template
*For scoring a new country against the Rate Calculator's 8 inputs and the Payment Config layer. Fill one copy per country. Kenya and Nigeria (researched mid-2026) are the calibration anchors — score new countries relative to them, not in a vacuum.*

---

## How to Use This

1. Gather the raw data point for each input below (source it directly — a
   government stat bureau, GSMA/ITU report, World Bank data, a local ad
   agency, etc.). Note the source and the date, since these are 2026/2027
   data points that will go stale.
2. Convert each raw number into a 0–100 score **relative to Kenya and
   Nigeria's existing scores** (shown below as anchors) — not from an
   abstract 0–100 scale. If a country's data looks clearly stronger or
   weaker than both anchors, score outside their range accordingly.
3. Once all 7 scores are filled and sourced, change `confidence` from
   `"Tier estimate"` to `"Researched"` in the app's country data.
4. Fill in the Payment Config section separately — a country can be
   "Researched" for pricing purposes while still not "payment-ready" if its
   processor/payout rail isn't confirmed.

---

## Country: _______________________ | Region: _______________________
**Research date:** _______________ | **Researcher:** _______________________

---

### 1. Market Size
*What to find:* Population, GDP, and GDP per capita (most recent full-year
figure, note the year).
- Population: ___________
- GDP (total): ___________
- GDP per capita: ___________
- Source(s): ___________________________________________________
- **Score (0–100):** _______
  - *Anchors: Kenya = 45, Nigeria = 90*

---

### 2. Digital Reach
*What to find:* Smartphone penetration %, mobile internet penetration %,
combined 4G/5G population coverage %.
- Smartphone penetration: ___________
- Mobile internet penetration: ___________
- 4G/5G combined coverage: ___________
- Source(s): ___________________________________________________
- **Score (0–100):** _______
  - *Anchors: Kenya = 80, Nigeria = 65*

---

### 3. Infrastructure Reliability
*What to find:* Electricity access % (World Bank), average outage
frequency/duration per week if available.
- Electricity access %: ___________
- Outage frequency (per week): ___________
- Average outage duration: ___________
- Source(s): ___________________________________________________
- **Score (0–100):** _______
  - *Anchors: Kenya = 78, Nigeria = 40*

---

### 4. Data Cost & Quality
*What to find:* Cost per GB (mobile data), cost of a 100Mbps fixed broadband
plan, cost per Mbps if calculable.
- Cost per GB (USD): ___________
- 100Mbps fixed broadband monthly cost (USD): ___________
- Cost per Mbps (USD, if calculable): ___________
- Source(s): ___________________________________________________
- **Score (0–100):** _______
  - *Anchors: Kenya = 55, Nigeria = 75*
  - *Note: cheaper ≠ automatically higher score — weigh against income
    (cost as % of average daily wage) where possible, per the earlier
    "effective affordability" discussion.*

---

### 5. Purchase Capacity
*What to find:* Dominant mobile money provider and daily/per-transaction
limit; whether limits are stackable across multiple accounts; card/bank
digital transaction limits if mobile money is not dominant.
- Dominant mobile money provider: ___________
- Daily/per-transaction limit: ___________
- Stackable across accounts? (Y/N): ___________
- Card/bank digital limit (if relevant): ___________
- Source(s): ___________________________________________________
- **Score (0–100):** _______
  - *Anchors: Kenya = 85, Nigeria = 40*

---

### 6. Attention Price
*What to find:* Prime billboard/OOH rack rate (monthly, capital city
highway/prime location) — get a range if possible, not just one figure.
- Prime billboard rate range (monthly, USD): ___________
- City/location the rate is from: ___________
- Source(s): ___________________________________________________
- **Score (0–100):** _______
  - *Anchors: Kenya = 70, Nigeria = 45*
  - *Note: this is the hardest input to source reliably — treat single-source
    figures cautiously and note if only one source was found.*

---

### 7. Economic Stability
*What to find:* Recent business confidence index trend, investor
sentiment/startup funding trend, currency stability over the past 12 months.
- Business confidence trend (up/down/flat): ___________
- Startup funding trend (up/down/flat, % if known): ___________
- Currency stability note: ___________
- Source(s): ___________________________________________________
- **Score (0–100):** _______
  - *Anchors: Kenya = 80, Nigeria = 45*

---

## Payment Config Layer (separate from pricing — this gates `paymentReady`)

- **Likely processor(s) operating here:** ___________________________
- **Dominant creator payout rail** (mobile money / bank transfer / card /
  other): ___________________________
- **Advertiser collection method(s):** ___________________________
- **KYC notes** (tiers, thresholds, what's required for creators to receive
  payouts): ___________________________
- **Does a split-payment/marketplace feature exist with this processor?**
  (Y/N/Unconfirmed): ___________
- **`paymentReady` flag:** ☐ True ☐ False
  *(Only set to True once a processor conversation has actually confirmed
  split-payment support — not just because this template is filled in.)*

---

## Summary Block (paste this into the app's country data once complete)

```
countryname: {
  name: "___________",
  region: "___________",
  confidence: "Researched",
  scores: {
    marketSize: ___,
    digitalReach: ___,
    reliability: ___,
    dataQuality: ___,
    purchaseCapacity: ___,
    attentionPrice: ___,
    stability: ___,
  },
  billboardAnchorUSD: ___,
},
```

```
countryPaymentConfig["___________"] = {
  currency: "___",
  processor: "___",
  payoutMethods: ["___"],
  advertiserCollection: ["___"],
  kyc: { /* notes from above */ },
  paymentReady: false, // flip only after processor confirmation
  confidence: "Researched",
}
```

---

### Reminders
- Kenya and Nigeria's own scores were themselves directional, not perfectly
  precise — use them as anchors, not gospel.
- A country can be "Researched" for pricing (Sections 1–7 complete) while
  still `paymentReady: false` — these are two separate gates, don't conflate
  them.
- Note the research date on every entry. 2026/2027 data will need refreshing
  — currency volatility and fast-moving telecom competition both make this
  framework perishable, not a one-time exercise.
