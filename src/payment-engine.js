/**
 * ACX PAYMENT ENGINE — reference implementation
 * ------------------------------------------------
 * Illustrative code, not wired to a real payment processor. Shows the
 * architecture discussed: one universal tranche/commission engine on top,
 * a swappable per-country config block underneath, and an internal netting
 * ledger for cross-border settlement.
 *
 * NOT legal, financial, or compliance advice — confirm all of this with a
 * payments lawyer and your actual licensed processor(s) before building.
 */

/**
 * Approximate FX rates for display/reporting only — NOT used to move real
 * money. A real implementation calls a live FX service at settlement time;
 * hardcoding rates here would silently go stale and misprice every campaign.
 */
const CURRENCY_TO_USD_RATE_REFERENCE_ONLY = {
  KES: 0.0077,
  NGN: 0.00062,
  // Add further currencies here as countries are researched.
};

// =====================================================================
// 1. PER-COUNTRY CONFIG — extend this one block at a time per market.
//    Nothing else in this file should need to change when a new country
//    is added; that's the whole point of this layer.
// =====================================================================

const COUNTRY_PAYMENT_CONFIG = {
  Kenya: {
    currency: "KES",
    processor: "M-Pesa-native (Daraja API) + Flutterwave fallback",
    payoutMethods: ["mobile_money"],
    advertiserCollection: ["bank_transfer", "card", "mobile_money"],
    kyc: {
      tier1Daily: 500000, // KES, per M-Pesa account
      stackable: true,    // personal + Pochi La Biashara can both be used
    },
    paymentReady: true,
    confidence: "Researched",
  },

  Nigeria: {
    currency: "NGN",
    processor: "Flutterwave / Paystack",
    payoutMethods: ["bank_transfer", "mobile_money"],
    advertiserCollection: ["bank_transfer", "card"],
    kyc: {
      mobileMoneyEntryTierDaily: 100000, // NGN, low KYC tier
      bankTransferPreferredAbove: 100000, // NGN — steer larger payouts to bank
    },
    paymentReady: true,
    confidence: "Researched",
  },

  // --- Every entry below reflects directional research (processor names,
  //     KYC notes, dominant payout rail) but paymentReady stays false until
  //     a real conversation with each processor confirms split-payment
  //     support — a processor name being known is not the same as the rail
  //     being confirmed usable. That confirmation is the actual launch gate.

  Ghana: {
    currency: "GHS",
    processor: "unconfirmed — MTN Mobile Money dominant",
    payoutMethods: ["mobile_money (MTN MoMo, Vodafone Cash, AirtelTigo Money)"],
    advertiserCollection: ["mobile_money", "card", "bank_transfer", "USSD"],
    kyc: { requirements: "Bank of Ghana EMI guidelines; tiered wallet KYC" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  "South Africa": {
    currency: "ZAR",
    processor: "unconfirmed — no scalable mobile money; bank-led market",
    payoutMethods: ["bank_transfer (EFT)"],
    advertiserCollection: ["card", "EFT", "BNPL (e.g. PayJustNow)"],
    kyc: { requirements: "FICA — ID/passport, proof of address, bank account" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Namibia: {
    currency: "NAD",
    processor: "unconfirmed — likely South African processors with cross-border support",
    payoutMethods: ["bank_transfer (EFT)"],
    advertiserCollection: ["card", "EFT"],
    kyc: { requirements: "Standard banking KYC; no scalable mobile money identified" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Botswana: {
    currency: "BWP",
    processor: "unconfirmed — Orange Money / Smega / Myzaka / Poso Money present",
    payoutMethods: ["bank_transfer (EFT)", "mobile_money"],
    advertiserCollection: ["card", "EFT", "mobile_money"],
    kyc: { requirements: "Mobile money requires ID registration; standard bank KYC for EFT" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Eswatini: {
    currency: "SZL",
    processor: "unconfirmed — MTN MoMo / e-Mali present",
    payoutMethods: ["mobile_money (MTN MoMo, e-Mali)", "bank_transfer (EFT)"],
    advertiserCollection: ["card", "EFT", "mobile_money", "EPS fast payments"],
    kyc: { requirements: "ID registration for mobile money; standard bank KYC for EFT/EPS" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Lesotho: {
    currency: "LSL",
    processor: "unconfirmed — Vodacom Lesotho (M-Pesa) dominant",
    payoutMethods: ["mobile_money (M-Pesa)", "bank_transfer (EFT)"],
    advertiserCollection: ["mobile_money", "card", "EFT"],
    kyc: { requirements: "M-Pesa mobile registration + PIN; standard bank KYC for EFT" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Mozambique: {
    currency: "MZN",
    processor: "unconfirmed — Vodacom Mozambique (M-Pesa) dominant",
    payoutMethods: ["mobile_money (M-Pesa)", "bank_transfer (EFT)"],
    advertiserCollection: ["mobile_money", "card", "EFT"],
    kyc: { requirements: "M-Pesa mobile registration + PIN; no bank account required" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Zambia: {
    currency: "ZMW",
    processor: "unconfirmed — MTN Mobile Money dominant",
    payoutMethods: ["mobile_money (MTN MoMo, Airtel Money, Zamtel Kwacha)", "bank_transfer (EFT)"],
    advertiserCollection: ["mobile_money", "card (via UBA POS)", "EFT"],
    kyc: { requirements: "Standard mobile money registration" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Zimbabwe: {
    currency: "USD / ZiG (dual currency)",
    processor: "unconfirmed — EcoCash dominant",
    payoutMethods: ["mobile_money (EcoCash)"],
    advertiserCollection: ["EcoCash merchant payments", "bank_transfer", "card"],
    kyc: { requirements: "16+, original ID (national ID/passport/driver's license); up to 3 accounts per user" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Malawi: {
    currency: "MWK",
    processor: "unconfirmed — TNM Mpamba dominant",
    payoutMethods: ["mobile_money (TNM Mpamba, Airtel Money)"],
    advertiserCollection: ["mobile_money", "bank_transfer"],
    kyc: { requirements: "Standard mobile money registration (ID, phone number)" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Angola: {
    currency: "AOA",
    processor: "unconfirmed — Unitel Money dominant; KWIK/Multicaixa also present",
    payoutMethods: ["mobile_money (Unitel Money)", "bank_transfer (KWIK/Multicaixa)"],
    advertiserCollection: ["mobile_money", "card (Multicaixa)", "bank_transfer (KWIK)", "QR code"],
    kyc: { requirements: "Unitel Money app/phone registration; BNA digital wallet (CME) standards" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Tanzania: {
    currency: "TZS",
    processor: "unconfirmed — M-Pesa Tanzania (Vodacom) dominant",
    payoutMethods: ["mobile_money (M-Pesa)"],
    advertiserCollection: ["mobile_money", "card", "bank_transfer"],
    kyc: { requirements: "Standard mobile money registration (SIM registration, ID)" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  "DR Congo": {
    currency: "CDF",
    processor: "unconfirmed — Vodacom (M-Pesa) dominant",
    payoutMethods: ["mobile_money (M-Pesa)"],
    advertiserCollection: ["mobile_money", "cash"],
    kyc: { requirements: "Standard mobile money registration; ongoing AML/CFT reforms" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  "Republic of the Congo": {
    currency: "XAF",
    processor: "unconfirmed — no dominant processor identified",
    payoutMethods: [],
    advertiserCollection: [],
    kyc: { requirements: "No data available" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Gabon: {
    currency: "XAF",
    processor: "unconfirmed — Moov Money and CLIKPAY dominant",
    payoutMethods: ["mobile_money (Moov Money, CLIKPAY)"],
    advertiserCollection: ["mobile_money", "QR code", "card", "bank_transfer"],
    kyc: { requirements: "ID/phone registration; CLIKPAY offers business accounts" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  "Central African Republic": {
    currency: "XAF",
    processor: "unconfirmed — Orange Money dominant",
    payoutMethods: ["mobile_money (Orange Money)"],
    advertiserCollection: ["mobile_money", "cash"],
    kyc: { requirements: "SIM/ID registration; extremely low digital adoption limits addressable creators" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Uganda: {
    currency: "UGX",
    processor: "unconfirmed — MTN MoMo dominant; Airtel Money also present",
    payoutMethods: ["mobile_money (MTN MoMo, Airtel Money)"],
    advertiserCollection: ["mobile_money", "card", "bank_transfer"],
    kyc: { requirements: "Standard mobile money registration (SIM/ID)" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Rwanda: {
    currency: "RWF",
    processor: "unconfirmed — MTN MoMo dominant",
    payoutMethods: ["mobile_money (MTN MoMo, MoMoPay)"],
    advertiserCollection: ["MoMoPay merchant payments", "bank_transfer", "card"],
    kyc: { requirements: "MoMoPay merchant: RDB/RGB Certificate (TIN), signed request letter, ID of representative" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Burundi: {
    currency: "BIF",
    processor: "unconfirmed — EcoCash / LumiCash / i HELA present",
    payoutMethods: ["mobile_money (EcoCash, LumiCash, i HELA)"],
    advertiserCollection: ["mobile_money", "cash"],
    kyc: { requirements: "Standard mobile money registration; extremely low digital adoption limits addressable creators" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Cameroon: {
    currency: "XAF",
    processor: "unconfirmed — MTN Mobile Money and Orange Money dominant",
    payoutMethods: ["mobile_money (MTN Mobile Money, Orange Money)"],
    advertiserCollection: ["mobile_money", "card", "bank_transfer"],
    kyc: { requirements: "Standard mobile money registration (SIM/ID)" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  "South Sudan": {
    currency: "SSP",
    processor: "unconfirmed — MTN MoMo and Digitel present",
    payoutMethods: ["mobile_money (MTN MoMo, Digitel)"],
    advertiserCollection: ["mobile_money", "cash"],
    kyc: { requirements: "Agent KYC requires national ID, trading license; majority of population remains offline" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Djibouti: {
    currency: "DJF",
    processor: "unconfirmed — no dominant processor identified",
    payoutMethods: [],
    advertiserCollection: [],
    kyc: { requirements: "No data available" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Somalia: {
    currency: "SOS",
    processor: "unconfirmed — EVC Plus (Hormuud) dominant",
    payoutMethods: ["mobile_money (EVC Plus)"],
    advertiserCollection: ["mobile_money"],
    kyc: { requirements: "EVC Plus is GSMA-certified with AML/consumer protection standards" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Togo: {
    currency: "XOF",
    processor: "unconfirmed — Mixx (YAS) and Flooz (Moov Africa) dominant",
    payoutMethods: ["mobile_money (Mixx, Flooz)"],
    advertiserCollection: ["mobile_money", "bank_transfer"],
    kyc: { requirements: "Standard mobile money registration (SIM/ID)" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Benin: {
    currency: "XOF",
    processor: "unconfirmed — MTN Mobile Money dominant",
    payoutMethods: ["mobile_money (MTN Mobile Money, Celtiis Cash, Moov Money)"],
    advertiserCollection: ["mobile_money", "card", "bank_transfer"],
    kyc: { requirements: "Standard mobile money registration (SIM/ID)" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  "Côte d'Ivoire": {
    currency: "XOF",
    processor: "unconfirmed — MTN Mobile Money, Orange Money, Moov Africa dominant",
    payoutMethods: ["mobile_money"],
    advertiserCollection: ["mobile_money", "card", "bank_transfer"],
    kyc: { requirements: "BCEAO-regulated mobile money KYC (SIM registration, tiered limits)" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  "Sierra Leone": {
    currency: "SLL",
    processor: "unconfirmed — Afrimoney (Africell) dominant; Orange Money also present",
    payoutMethods: ["mobile_money (Afrimoney, Orange Money)"],
    advertiserCollection: ["mobile_money", "prepaid Visa card", "bank_transfer"],
    kyc: { requirements: "Standard mobile money registration; prepaid Visa card needs no bank account" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Liberia: {
    currency: "LRD",
    processor: "unconfirmed — MTN Mobile Money, Orange Money present",
    payoutMethods: ["mobile_money (MTN, Orange Money)"],
    advertiserCollection: ["mobile_money", "bank_transfer", "card"],
    kyc: { requirements: "Standard mobile money registration; Mojaloop-based interoperable rail in development" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  "The Gambia": {
    currency: "GMD",
    processor: "unconfirmed — Wave / QMoney / Africell Money present",
    payoutMethods: ["mobile_money (Wave, QMoney, Africell Money)"],
    advertiserCollection: ["mobile_money", "bank_transfer (BANTABA 2.0)", "card"],
    kyc: { requirements: "Standard mobile money registration; BANTABA 2.0 national rail" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  "Burkina Faso": {
    currency: "XOF",
    processor: "unconfirmed — likely Orange Money or MTN Mobile Money",
    payoutMethods: ["mobile_money (inferred)"],
    advertiserCollection: ["mobile_money", "bank_transfer"],
    kyc: { requirements: "Standard mobile money registration under BCEAO regulations; significant research gap" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Niger: {
    currency: "XOF",
    processor: "unconfirmed — likely Orange Money or MTN Mobile Money",
    payoutMethods: ["mobile_money"],
    advertiserCollection: ["mobile_money", "cash"],
    kyc: { requirements: "Mobile money adoption is among the lowest in Sub-Saharan Africa; extremely limited agent network" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Mali: {
    currency: "XOF",
    processor: "unconfirmed — Orange Money and Moov Money dominant",
    payoutMethods: ["mobile_money (Orange Money, Moov Money)"],
    advertiserCollection: ["mobile_money", "bank_transfer"],
    kyc: { requirements: "Standard mobile money registration under BCEAO regulations" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Chad: {
    currency: "XAF",
    processor: "unconfirmed — Moov Money dominant",
    payoutMethods: ["mobile_money (Moov Money, Airtel Money, Konoom, Cashi)"],
    advertiserCollection: ["mobile_money", "cash"],
    kyc: { requirements: "Standard mobile money registration; ecosystem nascent (~10-15% adult adoption)" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Algeria: {
    currency: "DZD",
    processor: "unconfirmed — Switch Mobile (SATIM), national mobile money rail",
    payoutMethods: ["mobile_money (Switch Mobile)", "bank_transfer"],
    advertiserCollection: ["mobile_money", "card", "bank_transfer"],
    kyc: { requirements: "Standard financial KYC; regulatory framework still developing (rail launched 2024/2025)" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Morocco: {
    currency: "MAD",
    processor: "unconfirmed — m-wallet providers present",
    payoutMethods: ["m-wallet (mobile wallet)"],
    advertiserCollection: ["m-wallet", "card", "bank_transfer"],
    kyc: { requirements: "Tiered m-wallet KYC (Level 1/2/3); overall mobile money adoption still low (~12% adults)" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Tunisia: {
    currency: "TND",
    processor: "D17 (La Poste Tunisienne) — explicitly documents split-payment support",
    payoutMethods: ["mobile_money (D17, e-Dinar)", "bank_transfer"],
    advertiserCollection: ["mobile_money", "card", "bank_transfer"],
    kyc: { requirements: "D17 online registration; standard financial KYC for formal accounts" },
    // D17's own documentation describes split-payment support directly — the
    // one entry in this set with a specific, checkable claim rather than a
    // general inference. Still worth confirming directly before relying on
    // it; flag stays as Tier estimate until that confirmation happens.
    paymentReady: false,
    confidence: "Tier estimate — flagged for priority verification (documented split-payment claim)",
  },
  "Cape Verde": {
    currency: "CVE",
    processor: "unconfirmed — SICV (interbank clearing) dominant; mobile money nascent",
    payoutMethods: ["bank_transfer (SICV)", "card"],
    advertiserCollection: ["card", "bank_transfer", "mobile_money"],
    kyc: { requirements: "Standard financial KYC; SICV manages interbank clearing" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  "São Tomé and Príncipe": {
    currency: "STN",
    processor: "unconfirmed — no dominant processor identified",
    payoutMethods: [],
    advertiserCollection: [],
    kyc: { requirements: "No data available; bank-led infrastructure likely" },
    paymentReady: false,
    confidence: "Tier estimate",
  },
  Madagascar: {
    currency: "MGA",
    processor: "unconfirmed — no dominant processor identified",
    payoutMethods: [],
    advertiserCollection: [],
    kyc: { requirements: "Mobile money adoption ~6% of adults; banking penetration ~18% — among the lowest in Africa" },
    paymentReady: false,
    confidence: "Tier estimate",
  },

  // Add further countries here in the same shape as they're researched.
};

function getCountryConfig(country) {
  const config = COUNTRY_PAYMENT_CONFIG[country];
  if (!config) {
    throw new Error(`No payment config exists for "${country}" yet — add one to COUNTRY_PAYMENT_CONFIG before onboarding creators/advertisers there.`);
  }
  return config;
}

/** The actual launch gate: nothing books a campaign in a country until this passes. */
function assertPaymentReady(country) {
  const config = getCountryConfig(country);
  if (!config.paymentReady) {
    throw new Error(`${country} is not payment-ready yet (${config.confidence}). Content can be indexed in Discover, but Trade campaigns cannot complete here until the payment rail is confirmed.`);
  }
  return config;
}

// =====================================================================
// 2. UNIVERSAL TIER + COMMISSION RULES — identical in every country.
// =====================================================================

const TIER_COMMISSION = {
  Emerging: 0.15,
  Established: 0.18,
  Premium: 0.25,
  Flagship: 0.28,
  Faces: 0.32,
};

/** Tranche schedule: 90% on approved publish, 10% at the end of the duration window. */
const TRANCHE_SCHEDULE = [
  { id: "publish", share: 0.9, trigger: "approved_publish" },
  { id: "duration_end", share: 0.1, trigger: "duration_end", durationDays: 100 },
];

/**
 * Splits one campaign's total spend into what the creator receives and what
 * ACX earns, per tranche — before any country-specific routing happens.
 */
function calculateSplit({ totalCampaignSpend, creatorTier }) {
  if (totalCampaignSpend <= 0) throw new Error("Invalid campaign spend");
  const commissionRate = TIER_COMMISSION[creatorTier];
  if (commissionRate === undefined) {
    throw new Error(`Unknown creator tier "${creatorTier}"`);
  }

  return TRANCHE_SCHEDULE.map(tranche => {
    const trancheTotal = totalCampaignSpend * tranche.share;
    const acxCommission = trancheTotal * commissionRate;
    const creatorPayout = trancheTotal - acxCommission;
    return {
      trancheId: tranche.id,
      trigger: tranche.trigger,
      trancheTotal,
      acxCommission,
      creatorPayout,
    };
  });
}

/**
 * Prorates the final tranche if content was taken down early — scales the
 * penalty to actual duration honored, rather than all-or-nothing, with
 * legitimate exceptions (platform strike, takedown, suspension) passed in
 * as `excused: true` to bypass the penalty entirely.
 */
function prorateFinalTranche({ finalTranche, daysLive, requiredDays, excused = false }) {
  if (excused || daysLive >= requiredDays) {
    return finalTranche;
  }
  const ratio = Math.max(0, daysLive / requiredDays);
  return {
    ...finalTranche,
    trancheTotal: finalTranche.trancheTotal * ratio,
    acxCommission: finalTranche.acxCommission * ratio,
    creatorPayout: finalTranche.creatorPayout * ratio,
    prorated: true,
    daysLive,
    requiredDays,
  };
}

// =====================================================================
// 3. CROSS-BORDER SETTLEMENT — internal netting pools, not a token.
//    Each country's pool is a running balance funded by local advertisers,
//    drawn down by local creator payouts. Cross-border campaigns create an
//    internal IOU between pools instead of a real-time cross-border wire.
// =====================================================================

class NettingLedger {
  constructor(initialPools = {}, options = {}) {
    // pool[country] = running local-currency-equivalent balance (in a
    // shared accounting unit, e.g. USD-equivalent, for cross-pool comparison)
    this.pools = { ...initialPools };
    // debts: array of { fromCountry, toCountry, amountUSD, campaignId }
    this.debts = [];
    // full audit trail — every fund/payout event, in order
    this.transactions = [];

    // A pool going temporarily negative is expected — netting settles in
    // bulk, not per transaction, so a small float is normal, not a bug.
    // Beyond this buffer, something is actually wrong (netting has fallen
    // behind, or a country pool is under-funded) and payout should block
    // rather than silently let debt pile up indefinitely.
    this.overdraftBufferUSD = options.overdraftBufferUSD ?? 1000;
  }

  fundPool(country, amountUSD, campaignId = null) {
    if (amountUSD <= 0) throw new Error("Invalid fund amount");
    this.pools[country] = (this.pools[country] || 0) + amountUSD;
    this.transactions.push({ type: "fund", country, amountUSD, campaignId, timestamp: new Date() });
  }

  /**
   * Advertiser in `advertiserCountry` is funding a payout to a creator in
   * `creatorCountry`. No cross-border wire happens per transaction — the
   * creator is paid from the creator-country pool, and the imbalance is
   * recorded for later bulk settlement.
   */
  recordCrossBorderPayout({ advertiserCountry, creatorCountry, amountUSD, campaignId }) {
    if (amountUSD <= 0) throw new Error("Invalid payout amount");

    const currentBalance = this.pools[creatorCountry] || 0;
    const balanceAfter = currentBalance - amountUSD;

    if (balanceAfter < -this.overdraftBufferUSD) {
      // Beyond the allowed float — block rather than let an unbounded debt
      // accumulate. In production this should also trigger an ops alert so
      // someone actually goes and tops up or nets the pool, not just retries.
      throw new Error(
        `Payout blocked: ${creatorCountry} pool would fall to ${balanceAfter.toFixed(2)}, beyond the ` +
        `${this.overdraftBufferUSD} overdraft buffer. Top up the pool or run netOutstandingDebts() before retrying.`
      );
    }
    if (balanceAfter < 0) {
      // Within the allowed float — proceed, but make it visible.
      console.warn(`${creatorCountry} pool going temporarily negative (${balanceAfter.toFixed(2)}) — within the ${this.overdraftBufferUSD} buffer, expected while cross-border debts await bulk netting.`);
    }

    if (advertiserCountry === creatorCountry) {
      this.pools[creatorCountry] = balanceAfter;
      this.transactions.push({ type: "sameCountryPayout", advertiserCountry, creatorCountry, amountUSD, campaignId, timestamp: new Date() });
      return { crossBorder: false };
    }

    this.pools[creatorCountry] = balanceAfter;
    this.debts.push({ fromCountry: advertiserCountry, toCountry: creatorCountry, amountUSD, campaignId });
    this.transactions.push({ type: "crossBorderPayout", advertiserCountry, creatorCountry, amountUSD, campaignId, timestamp: new Date() });

    return { crossBorder: true, recordedDebt: amountUSD };
  }

  /** Periodic bulk reconciliation between pools — not done per transaction. */
  netOutstandingDebts() {
    const netByPair = {};
    for (const debt of this.debts) {
      const key = [debt.fromCountry, debt.toCountry].sort().join("::");
      const sign = debt.fromCountry < debt.toCountry ? 1 : -1;
      netByPair[key] = (netByPair[key] || 0) + sign * debt.amountUSD;
    }
    this.debts = []; // cleared after netting
    return netByPair; // { "Kenya::Nigeria": 1200 } means one owes the other net $1,200
  }

  /** Quick snapshot for dashboards/monitoring — pool balances plus audit counts. */
  getPoolStatus() {
    return {
      pools: { ...this.pools },
      outstandingDebtCount: this.debts.length,
      transactionCount: this.transactions.length,
      overdraftBufferUSD: this.overdraftBufferUSD,
    };
  }
}

// =====================================================================
// 4. EXAMPLE USAGE — a cross-border campaign end to end
// =====================================================================

function exampleCampaignSettlement() {
  try {
    const ledger = new NettingLedger();
    ledger.fundPool("Nigeria", 10000); // Nigerian advertisers have funded campaigns
    ledger.fundPool("Kenya", 4000);    // Kenyan advertisers have funded campaigns

    assertPaymentReady("Nigeria"); // throws if not ready — gate enforced before booking
    assertPaymentReady("Kenya");

    const tranches = calculateSplit({ totalCampaignSpend: 1000, creatorTier: "Premium" });
    const publishTranche = tranches[0];

    // Nigerian advertiser's campaign pays a Kenyan creator on approved publish.
    const result = ledger.recordCrossBorderPayout({
      advertiserCountry: "Nigeria",
      creatorCountry: "Kenya",
      amountUSD: publishTranche.creatorPayout,
      campaignId: "camp_001",
    });

    return {
      tranches,
      result,
      poolsAfter: ledger.getPoolStatus(),
      outstandingDebts: ledger.debts,
    };
  } catch (e) {
    console.error("Payment engine error:", e.message);
    throw e; // re-throw so callers/tests still see the failure, not a silent undefined
  }
}

module.exports = {
  COUNTRY_PAYMENT_CONFIG,
  getCountryConfig,
  assertPaymentReady,
  TIER_COMMISSION,
  TRANCHE_SCHEDULE,
  calculateSplit,
  prorateFinalTranche,
  NettingLedger,
  exampleCampaignSettlement,
};
