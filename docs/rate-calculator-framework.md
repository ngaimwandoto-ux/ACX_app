# ACX Rate Calculator — Input Framework (Draft v0.1)
*Working reference — consolidates the country/category calculator discussion*

---

## Purpose

ACX rejects a single global CPM (the platform approach) in favor of country- and
category-specific pricing built from real local signals — a purchasing-power and
market-reality index purpose-built for creator ad pricing, not borrowed from
global ad-tech's historical undervaluation of African attention.

---

## The Eight Inputs

### 1. Market Size
**Population + GDP (GDP per capita specifically)**
Tells you the addressable audience and average purchasing power. GDP per capita
matters more than aggregate GDP for per-creator rate-setting — a large population
with lower per-capita income prices differently than a smaller, wealthier one.

### 2. Digital Reach (the gate, not a multiplier)
**Smartphone + internet penetration, 4G/5G breadth**
Answers: can this audience receive and act on a digital ad at all? Below a
threshold, none of the other inputs matter yet — this gates addressability
before anything else applies.
*Example finding: Kenya ~97% combined 4G/5G population coverage, ~83% mobile
internet penetration vs. Sub-Saharan Africa's ~23% average. Nigeria's 5G
penetration (~14%) currently exceeds Kenya's in share terms, though Kenya leads
on overall breadth — no single country wins every sub-metric.*

### 3. Infrastructure Reliability
**Electricity access % + outage frequency**
A sub-component of digital reach: not just "can they connect" but "does the
connection hold up." Access percentage alone understates real friction.
*Example finding: Kenya ~76.2% electricity access vs. Nigeria ~61.2% (2023,
World Bank). Nigerian households report ~7 outages/week, ~12 hours each —
functional connectivity is worse than the headline access number implies.*

### 4. Cost & Quality of Data
**Price per GB, price per Mbps, fixed broadband cost at standard speed tiers (e.g. 100Mbps)**
Access isn't just coverage — it's affordability of sustained use. Should be
expressed relative to local income, not flat USD, since a $1 data cost is a
different burden in different economies.
*Example finding: Nigeria has cheaper nominal data (~$0.13–0.39/GB in recent
readings) than Kenya (~$0.59–0.84/GB) — but Kenya's frontier (Starlink, new
fiber entrants) is improving fast on 100Mbps fixed broadband pricing. Treat
this as a composite/sanity-check metric — it reflects several other inputs at
once (infrastructure investment, competition, electricity reliability).*

### 5. Purchase Capacity
**Mobile money daily/stackable limits + card/bank digital transaction limits**
How easily does reached attention convert into a completed digital purchase —
the channel that actually matters for anything sold through Trade (mid-rolls,
mentions, integrations all point to a digital checkout).
*Example finding: M-Pesa's KES 500,000 daily limit is stackable across personal
+ Pochi La Biashara accounts; Nigeria's MTN MoMo entry tier caps near ₦100,000
daily, with friction-heavy KYC required to reach higher tiers most users don't
bother clearing.*

### 6. Attention Price
**Billboard/OOH rack rates by city**
The closest real-market proxy for what local advertisers already pay for
attention — not inferred from cost-of-living, but priced directly by the local
ad industry itself. ACX inventory (trackable, voice-driven, proof-of-publish)
arguably justifies pricing *above* this benchmark, not just matching it.
*Example finding: Nairobi prime highway billboards ~$1,150–4,600/month; Lagos
prime corridor ~$320–2,250/month (wide range, rack rates, pre-negotiation).*

### 7. Economic Stability
**Business confidence indices, investor sentiment, currency stability**
Distinct from market size — a smaller, more stable economy can support higher
attention prices than a larger, more volatile one.
*Example finding: Kenya overtook Nigeria as Africa's top startup investment
destination in 2025 ($984M, +52% YoY, avg deal size $6.9M) while Nigeria's
funding fell 17% YoY (avg deal size $1.6M) amid currency instability; Nigeria's
Business Confidence Monitor was flat/declining through mid-2026.*

### 8. Category
**Content-topic premium/discount**
Borrowed from validated platform data — finance/business commands materially
higher value than entertainment/music, consistently, across platforms.
Applied per index (Business 25, Culture 25, etc.), not just per country.

---

## Structural Notes

- **Inputs 2–4 (Digital Reach, Reliability, Data Cost/Quality) form a cluster** —
  together they answer "can this audience be reached at all, and how well."
  Consider scoring them as one combined "Connectivity Readiness" gate rather
  than three fully independent weights.
- **Inputs 6–7 (Attention Price, Economic Stability) are close but distinct** —
  price reflects what the market charges *today*; stability reflects how
  durable that price is going forward.
- **No country wins on every input** — this is a feature of the framework, not
  a flaw. Kenya leads on mobile money capacity, business confidence, billboard
  rates, and electricity reliability. Nigeria leads on raw market size, data
  cost, and 5G share. A single composite score would flatten real, useful
  differences; keep the inputs separate in the actual calculator.
- **Every number pulled this session is a rack rate, average, or single-source
  estimate** — directionally useful, not yet rigorous enough to set actual
  rate-card thresholds. Real calibration needs primary research (agency/creator
  conversations) plus a wider country set before any number goes into a live
  rate card.

---

## Still Open

1. **Formal weighting** — how much each input should count in the final formula
   (not yet assigned; today's session established *what* to measure, not *how
   much each counts*).
2. **Country coverage** — currently only Kenya and Nigeria have real pulled
   data. Needs Ghana, South Africa, Tanzania, Egypt, Dakar/Senegal, Gaborone
   at minimum before the calculator can support the tier structure already
   designed (ACX Kenya 50, ACX Nigeria 50, etc.).
3. **Refresh cadence** — currency volatility (Naira, Cedi) and fast-moving
   telecom competition (Kenya's fiber entrants) mean this dataset goes stale
   quickly. Quarterly refresh is a reasonable starting cadence.
