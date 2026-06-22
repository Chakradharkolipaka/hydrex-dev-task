const https = require("https");

// ── Module-level state (in-memory cache + history) ──────────────────────────
let currentPrice = null;
let previousPrice = null;
let lastUpdated = null;
let cachedAt = 0; // epoch ms
let change24h = 0;
let initialized = false;

const CACHE_TTL_MS = 6000; // 6 seconds
const DRIFT_MIN = -0.02; // -2%
const DRIFT_MAX = 0.02; // +2%

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Random float in [min, max) */
function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

/** Fetch real ETH/USD from Kraken public ticker (no auth required). */
function fetchKrakenPrice() {
  return new Promise((resolve, reject) => {
    const url = "https://api.kraken.com/0/public/Ticker?pair=ETHUSD";

    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            if (json.error && json.error.length > 0) {
              return reject(new Error(json.error.join(", ")));
            }
            // Kraken returns the pair as XETHZUSD
            const pairKey = Object.keys(json.result)[0];
            const lastTrade = parseFloat(json.result[pairKey].c[0]); // c = last trade closed [price, lot-volume]
            resolve(lastTrade);
          } catch (err) {
            reject(err);
          }
        });
      })
      .on("error", reject);
  });
}

/** Apply a random ±0-2% drift to the current price and update state. */
function simulatePriceTick() {
  previousPrice = currentPrice;
  const drift = randomInRange(DRIFT_MIN, DRIFT_MAX);
  currentPrice = parseFloat((currentPrice * (1 + drift)).toFixed(2));
  lastUpdated = new Date().toISOString();

  // Simulate a 24h % change (±1-5%)
  const direction = currentPrice >= previousPrice ? 1 : -1;
  // Blend: 70% previous change24h + 30% fresh random (keeps it realistic)
  const freshChange = randomInRange(1, 5) * direction;
  change24h = parseFloat((change24h * 0.7 + freshChange * 0.3).toFixed(2));
}

// ── Controller ──────────────────────────────────────────────────────────────

/**
 * GET /api/eth-price
 *
 * Returns the simulated ETH/USD price.
 * On first call, fetches the real price from Kraken.
 * On subsequent calls, applies ±0-2% drift per request with a 6s cache.
 */
exports.getEthPrice = async (req, res, next) => {
  try {
    const now = Date.now();

    // ── First-time initialisation ───────────────────────────────────────
    if (!initialized) {
      try {
        currentPrice = await fetchKrakenPrice();
      } catch (_fetchErr) {
        // Fallback to a sensible default if Kraken is unreachable
        currentPrice = 2064.0;
      }
      previousPrice = currentPrice;
      lastUpdated = new Date().toISOString();
      change24h = parseFloat(randomInRange(-3, 3).toFixed(2));
      cachedAt = now;
      initialized = true;
    }

    // ── Re-simulate only if cache has expired ───────────────────────────
    if (now - cachedAt >= CACHE_TTL_MS) {
      simulatePriceTick();
      cachedAt = now;
    }

    return res.status(200).json({
      success: true,
      price: currentPrice,
      lastUpdated,
      up: currentPrice >= (previousPrice || currentPrice),
      change24h,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch ETH price",
    });
  }
};
