# ACX Payment Protocol — Working Reference
*Consolidates the money-mechanics discussion. Not legal or financial advice — confirm with a payments lawyer and a licensed processor before implementing.*

---

## 1. The Model: Split Payments via a Licensed Processor

ACX does **not** hold advertiser or creator funds directly. Money moves through a
licensed payment processor's regulated infrastructure; ACX configures *when* and
*how much* releases to whom, but never takes legal custody of funds that aren't
its own.

**Why not just use ACX's own bank account (the "pass-through" model)?**
The moment client/creator money sits in ACX's own account before being forwarded,
ACX starts to resemble a payment intermediary — an activity regulated in most
countries (money transmitter / e-money institution licensing), regardless of
ACX's actual business being ad brokering, not banking. This is how many
companies accidentally create serious regulatory exposure early on.

**Why split payments instead:**
This is how most real marketplaces operate at scale (Uber, Upwork, Airbnb-style
models). The processor's regulated infrastructure holds and splits the money;
ACX is the instruction layer on top, deciding timing and amounts based on its
own business logic (proof-of-publish, duration milestones, etc.) — without
carrying the fund-custody regulatory burden itself.

---

## 2. Money Flow, Step by Step

1. **Advertiser funds the campaign.** Full estimated campaign cost is paid
   upfront (bank transfer or card) once a campaign inquiry is confirmed —
   before any creator starts work.
2. **Funds land with the payment processor**, not ACX's own account — held in
   a regulated structure the processor manages.
3. **Approved publish triggers Tranche 1.** Once a creator's content is
   reviewed and confirmed live (day 1 of the duration clock), ACX instructs the
   processor to split the payment automatically:
   - Creator's share (e.g. 90%, minus ACX's commission on this tranche) →
     creator's registered payout method.
   - ACX's commission on this tranche → ACX's account.
4. **Duration-holdback triggers Tranche 2.** At the end of the agreed duration
   (e.g. day 100), contingent on the content still being live — prorated for
   early deletion, with legitimate exceptions (platform strike, takedown,
   suspension) carved out — the remaining tranche releases the same way.
5. **ACX's commission follows the same schedule as the creator's payout** —
   not collected upfront in full. This gives ACX real skin in the game on
   delivery, signals to brands that ACX isn't incentivized to rush a bad match
   through, and signals to creators that ACX isn't disappearing once money
   changes hands.

---

## 3. Commission Structure

Commission is a **percentage of total campaign spend**, not a separate fee —
standard agency/ad-network model, consistent with ACX's "trust product," not
"principal reseller," positioning.

**Starting reference range: 15–30%**, tiered:

| Tier | Suggested commission | Rationale |
|---|---|---|
| Emerging / Established | ~15–20% | Creators need volume more than margin; ACX still building trust here |
| Premium | ~20–25% | More curation and brand-safety work by ACX |
| Flagship | ~25–30% | Negotiated terms, more bespoke handling |
| ACX Faces | Highest of all | Closest to true agent work — cross-topical, higher brand-safety exposure |

**Transparency principle:** advertiser sees one all-in price; creator sees their
own payout separately via an earnings ledger. Neither side needs to see the
other's number, but the creator should always be able to see exactly what
they're owed and why (ties to the "ACX payouts aren't a black box, unlike
platform algorithms" differentiator).

---

## 4. FX / Currency Handling

Cross-border campaigns (e.g. a Nigerian advertiser funding Kenyan, Ghanaian,
and Nigerian creators) require currency conversion more than once. Someone
absorbs the spread — cleanest approach is a **small built-in FX margin folded
into ACX's commission**, rather than a separate surprise fee to either side.

**Open decision, not yet resolved:** does the advertiser pay in USD (simpler
for ACX, harder for some local advertisers) or local currency (better adoption,
more conversion work for ACX)? Worth testing with a real advertiser conversation
before locking in.

---

## 5. Candidate Payment Processors (research starting points, not endorsements)

| Processor | Relevant strength |
|---|---|
| **Flutterwave** | Pan-African coverage; "Flutterwave for Business" has split-payment/sub-account features suited to marketplace models |
| **Paystack** (Stripe-owned) | Strong in Nigeria/Ghana; "Subaccounts + split payments" built for marketplace-style splitting |
| **Cellulant** | Pan-African, mobile-money-heavy — useful if creator payouts skew mobile money over bank transfer |
| **Stripe Connect** | Useful for international/diaspora advertisers paying in USD/EUR; direct African payout coverage more limited |

**Questions to ask each provider directly** (terms are often not fully public):
1. Do you support split payments at time of transaction — auto-routing a
   platform cut plus a creator share to separate accounts?
2. Can payout release be delayed/triggered programmatically, not just instant —
   so it can match approved-publish and duration-based tranches?
3. What KYC do creators need to complete before receiving payouts through you?
   (Feeds directly into ACX's creator Register/payout step.)
4. What are your cross-border and currency-conversion fees, given ACX campaigns
   routinely span multiple countries?

---

## 6. Country Payment Configuration Layer

The tranche structure, commission tiers, and proration rules in Sections 2–3
are universal — they shouldn't change by country. What *does* change is the
rail underneath: which processor, which payout method, which KYC path. This
should be modeled as a swappable per-country configuration sitting under one
shared payment engine — the same pattern already used for country readiness
scores in the Rate Calculator — not a separate payment logic rewritten per
market.

**Illustrative config shape:**
```
countryPaymentConfig[country] = {
  processor: "...",
  payoutMethods: ["...", "..."],
  advertiserCollection: "...",
  kycNotes: "...",
  confidence: "Researched" | "Tier estimate"
}
```

### Kenya — Researched this session
| Field | Value |
|---|---|
| Likely processor | M-Pesa-native integration (Safaricom Daraja API or an aggregator built on it); Flutterwave also operates in Kenya |
| Dominant payout rail | Mobile money (M-Pesa) — creators can hold a personal account plus a Pochi La Biashara business till, each with its own ~KES 500,000 daily limit, giving real stackable capacity |
| Advertiser collection | Bank transfer or card for business-scale campaign funding; M-Pesa for smaller/local advertisers |
| KYC note | M-Pesa's tiered KYC is comparatively mature and widely adopted — lower friction than Nigeria's equivalent tiers |

### Nigeria — Researched this session
| Field | Value |
|---|---|
| Likely processor | Flutterwave or Paystack — both have strong Nigerian coverage and split-payment features |
| Dominant payout rail | Mixed — MTN MoMo mobile money exists but has lower, more KYC-gated tiers (entry tier ~₦100,000/day); bank transfer via NIBSS Instant Payment is a common higher-capacity alternative many creators may prefer for larger payouts |
| Advertiser collection | Bank transfer or card, standard for business-scale funding |
| KYC note | Full KYC (BVN-linked) needed to reach higher mobile money tiers — expect more creators to default to bank transfer for anything beyond small payouts |

### Every other country — Not yet researched
Ghana, South Africa, Egypt, Morocco, Ethiopia, and the rest of the countries in
the Rate Calculator's tier-estimate list need this same treatment before
launch: confirm which processor actually operates there, what creators
realistically use for payout, and what KYC threshold applies. Until then, treat
any assumption about their payment rail as unconfirmed — the same
"Tier estimate" flag used elsewhere in this framework applies here too.

**Practical sequencing implication:** this reinforces that Kenya and Nigeria
are the only two markets currently ready for a real payment integration
conversation with a processor. Any other country named for early expansion
should get this same research pass before its Trade campaigns go live.

---

## 7. Cross-Border Settlement — Internal Netting Pools

**The problem this solves:** same-country advertiser-to-creator payouts are
straightforward — money moves through one local processor, one currency, no
border crossed. The bottleneck appears specifically on cross-border campaigns
(a Nigerian advertiser funding a Kenyan creator, for example), where a
real-time cross-border transfer for every single payout is slow and costly.

**Why "ACX Coin" isn't the right fix:** a branded token doesn't remove the need
for local, licensed on/off-ramps in every country — a creator still can't pay
rent with it directly, so it just adds a token layer in front of the same
infrastructure. If it floats in value, it undermines the "equal value, not
equal currency" payout philosophy already established; if it's pegged to USD,
it duplicates existing stablecoins with none of their liquidity or trust, while
adding regulatory attention given how central banks across Africa have treated
private currency-like instruments.

**The actual solution — internal netting, no public token required:**
This is the same mechanism firms like Wise use to avoid real-time cross-border
transfers on every transaction.

1. ACX (via its licensed local partners — e.g. Flutterwave/Paystack in Nigeria,
   an M-Pesa-linked partner in Kenya) holds a **local currency balance pool in
   each country it operates in**, funded by that country's advertisers paying
   into local campaigns.
2. When a Nigerian advertiser funds a campaign paying a Kenyan creator, ACX
   does **not** wire naira to Kenya for that transaction. The naira lands in
   ACX's Nigerian pool; the Kenyan creator is paid out of ACX's *existing*
   Kenyan shilling pool.
3. ACX keeps an **internal ledger** of the resulting imbalance ("Nigeria pool
   owes Kenya pool $X") and periodically nets/settles those imbalances between
   country pools in bulk — not per transaction.

**Why this satisfies the "chip good at every branch" idea without the risks of
an issued currency:**
- Never touches the public — no buying, selling, or trading — so it doesn't
  raise the "is this a private currency" regulatory question at all.
- Needs no blockchain or token infrastructure — a database ledger sitting on
  top of the already-licensed local processor balances is sufficient.
- Directly removes the per-transaction cross-border bottleneck: creators are
  paid promptly out of an already-funded local pool, rather than waiting on a
  live cross-border wire for each payout.

**What this does not remove:** ACX still needs a licensed local entity or
partner holding the local balance in every country of operation. Internal
netting eliminates per-transaction cross-border friction and cost — it does
not eliminate the underlying requirement for local, regulated money-holding
relationships everywhere ACX operates.

### 7.1 Reference Implementation Notes

A working reference version of this ledger has been built (`acx-payment-engine.js`)
to pressure-test the logic. A few implementation details worth carrying into
any real build:

- **Tiered overdraft guard, not a single soft warning.** A country pool going
  briefly negative is expected — netting settles in bulk, not per transaction,
  so a small float is normal. But an unbounded negative balance is a real
  problem, not a rounding artifact. The reference implementation uses a
  configurable buffer (e.g. $1,000): a float within the buffer proceeds with a
  visible warning; a payout that would push the pool beyond the buffer is
  **blocked outright**, with pool state left untouched, rather than silently
  allowing debt to accumulate indefinitely. The exact buffer size is a real
  business decision — too tight and normal netting delays cause false alarms;
  too loose and a genuine shortfall goes unnoticed.
- **Full audit trail.** Every fund event and every payout (same-country or
  cross-border) is logged with a timestamp — necessary for reconciliation,
  dispute resolution, and eventually satisfying whatever financial reporting
  requirements come with real licensing.
- **FX rates are reference-only in code, never used to move real money.**
  Hardcoded currency-to-USD rates are useful for display and rough modeling,
  but a live FX service must supply the actual rate at the moment of
  settlement — a stale hardcoded rate would silently misprice every
  cross-border campaign it touched.
- **Validation at every entry point.** Negative or zero amounts are rejected
  before they can corrupt a pool balance; an unresearched country cannot have
  a campaign booked against it (the `paymentReady` gate from Section 6 is
  enforced in code, not just policy).

---

## 8. Open Items Still Requiring Real-World Input

- **USD vs. local-currency pricing for advertisers** — needs a real advertiser
  conversation, not a desk decision.
- **Which processor(s) ACX actually contracts with** — needs direct
  conversations with provider partnerships teams; public docs alone likely
  won't cover marketplace-specific split-payment terms.
- **KYC threshold for creator payouts** — depends on chosen processor's
  requirements per country, and needs to be reflected in the Register flow.
- **Legal review of the whole structure** — this document is a working
  structural reference, not a substitute for advice from a payments lawyer
  familiar with the specific countries ACX operates in.
- **Overdraft buffer sizing** — the reference implementation's buffer is a
  placeholder. The right number depends on real settlement frequency and
  typical campaign volume once ACX is live — needs revisiting with actual
  data, not fixed in advance.
