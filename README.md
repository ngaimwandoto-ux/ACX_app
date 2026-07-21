# ACX — Africa Creator Exchange

Prototype application and supporting documents for ACX: a searchable
creator index (Discover), a tiered ad-bundle marketplace (Trade), a
country-level rate calculator, and a creator/advertiser registration flow.

## Running locally

```
npm install
npm run dev
```

Then open the local address Vite prints (usually `http://localhost:5173`).

## Project structure

```
src/
  App.jsx           — the full application (Discover, Trade, Calculator, Register tabs)
  payment-engine.js — the tranche/commission/netting payment logic (Node-runnable, tested separately)
  main.jsx          — React entry point
docs/
  payment-protocol.md              — full payment architecture writeup
  tripartite-contract-terms.md     — contract term reference (creator/advertiser/ACX)
  terms-and-conditions.md          — draft platform T&Cs
  rate-calculator-framework.md     — the 8-input country scoring model
  country-research-template.md     — fillable template for researching new countries
```

## Status

This is a prototype and a set of working structural documents, not a
production system. See `docs/` for the caveats already flagged throughout
(unverified country data, placeholder legal sections, etc.) before treating
any of it as final.
