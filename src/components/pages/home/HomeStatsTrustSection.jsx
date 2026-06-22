import React, { useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { DollarSign, Shield, TrendingUp, TrendingDown, UserRound } from 'lucide-react';
import { stats, statsIntro, statsTrustEyebrow, trustPoints } from '../../../data/homeSections';
import properties from '../../../data/properties';
import { containerVariants, itemVariants } from './homeMotion';

function StatLeadingGraphic({ stat }) {
  const className = 'h-10 w-10 shrink-0 text-brand-cyan sm:h-11 sm:w-11';
  const stroke = 1.35;

  if (stat.leading === 'dollar-up') {
    return (
      <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center text-brand-cyan sm:h-11 sm:w-11" aria-hidden>
        <DollarSign className="h-8 w-8 sm:h-9 sm:w-9" strokeWidth={stroke} />
        <TrendingUp className="absolute -right-0.5 -top-0.5 h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" strokeWidth={2.25} />
      </span>
    );
  }

  if (stat.leading === 'user-shield') {
    return (
      <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center text-brand-cyan sm:h-11 sm:w-11" aria-hidden>
        <UserRound className="h-9 w-9 sm:h-10 sm:w-10" strokeWidth={stroke} />
        <Shield className="absolute -bottom-0.5 -right-0.5 h-[1.125rem] w-[1.125rem] sm:h-5 sm:w-5" strokeWidth={2} />
      </span>
    );
  }

  const Icon = stat.icon;
  return <Icon className={className} strokeWidth={stroke} aria-hidden />;
}

/** ETH price ticker shown under property prices */
function EthPriceTicker({ ethData, property }) {
  if (!ethData || !ethData.price) {
    return (
      <div className="mt-1.5 flex items-center gap-1.5">
        <span className="inline-block h-3 w-20 animate-pulse rounded bg-white/10" />
      </div>
    );
  }

  const usdPrice = property.price * 2000;
  const ethAmount = (usdPrice / ethData.price).toFixed(3);
  const usdFormatted = Math.round(usdPrice).toLocaleString('en-US');

  return (
    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] sm:text-[11px]">
      <span className="font-mono font-semibold text-brand-gold-light">
        ETH {ethAmount}
      </span>
      <span className="text-brand-ink-muted">/</span>
      <span className="text-brand-ink-secondary">${usdFormatted}</span>
      {ethData.up ? (
        <TrendingUp className="h-3 w-3 text-green-400" strokeWidth={2.5} />
      ) : (
        <TrendingDown className="h-3 w-3 text-red-400" strokeWidth={2.5} />
      )}
      <span className={`font-mono font-medium ${ethData.up ? 'text-green-400' : 'text-red-400'}`}>
        {ethData.up ? '+' : ''}{ethData.change24h}%
      </span>
    </div>
  );
}

const HomeStatsTrustSection = () => {
  const reduceMotion = useReducedMotion();
  const [ethData, setEthData] = useState(null);
  const [priceKey, setPriceKey] = useState(0); // for pulse animation on update

  const fetchEthPrice = useCallback(async () => {
    try {
      const res = await fetch('/api/eth-price');
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      if (data.success) {
        setEthData(data);
        setPriceKey((k) => k + 1);
      }
    } catch (_err) {
      // silently retry on next interval
    }
  }, []);

  useEffect(() => {
    fetchEthPrice();
    const interval = setInterval(fetchEthPrice, 10000); // poll every 10 seconds
    return () => clearInterval(interval);
  }, [fetchEthPrice]);

  return (
    <section className="border-b border-white/[0.06] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <motion.div
        className="mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-brand-bg-panel/50 shadow-glass backdrop-blur-md sm:rounded-3xl">
          <div className="px-5 py-8 sm:px-8 sm:py-9 md:px-10 md:py-10">
            <motion.p
              variants={itemVariants}
              className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-gold-light sm:text-xs"
            >
              {statsTrustEyebrow}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-6 overflow-hidden rounded-xl border border-white/[0.06] bg-brand-bg-base/35 sm:mt-7"
            >
              <div className="flex flex-col divide-y divide-white/[0.07] md:flex-row md:divide-x md:divide-y-0">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="flex flex-1 flex-row items-center gap-4 px-4 py-5 sm:gap-5 sm:px-5 sm:py-6 md:py-6"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.35, delay: reduceMotion ? 0 : index * 0.04 }}
                    whileHover={reduceMotion ? undefined : { y: -1 }}
                  >
                    <StatLeadingGraphic stat={stat} />
                    <div className="min-w-0 text-left">
                      <div className="text-xl font-bold tabular-nums tracking-tight text-brand-cyan sm:text-2xl md:text-[1.65rem]">
                        {stat.value}
                      </div>
                      <div className="mt-0.5 text-xs leading-snug text-brand-ink-secondary sm:text-sm">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── ETH Price per Building ──────────────────────────────────── */}
            <motion.div
              variants={itemVariants}
              className="mt-6 sm:mt-7"
            >
              <div className="mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-brand-gold" strokeWidth={2} />
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold-light sm:text-sm">
                  Market Trends — Live ETH Prices
                </h3>
                {ethData && (
                  <motion.span
                    key={priceKey}
                    initial={reduceMotion ? false : { scale: 1.15, opacity: 0.6 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.35 }}
                    className={`ml-auto font-mono text-xs font-bold ${ethData.up ? 'text-green-400' : 'text-red-400'}`}
                  >
                    ETH ${ethData.price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    {' '}
                    {ethData.up ? '▲' : '▼'} {ethData.change24h}%
                  </motion.span>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {properties.slice(0, 6).map((property) => (
                  <motion.div
                    key={property.id}
                    className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-brand-bg-base/40 px-4 py-3 backdrop-blur-sm transition-colors hover:border-white/[0.12]"
                    whileHover={reduceMotion ? undefined : { y: -1 }}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{property.name}</p>
                      <p className="mt-0.5 text-xs text-brand-ink-muted">
                        {property.location.city}, {property.location.state}
                      </p>
                      <EthPriceTicker ethData={ethData} property={property} />
                    </div>
                    <div className="ml-3 text-right">
                      <p className="text-sm font-bold tabular-nums text-brand-cyan">
                        ${(property.price * 2000).toLocaleString('en-US')}
                      </p>
                      <p className="mt-0.5 text-[10px] text-brand-ink-muted sm:text-xs">
                        {property.profit}% yield
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-6 grid auto-rows-fr gap-4 sm:mt-7 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5"
            >
              {trustPoints.map((item) => (
                <motion.article
                  key={item.title}
                  variants={itemVariants}
                  className="flex h-full flex-col items-center rounded-2xl border border-white/[0.08] bg-brand-bg-raised/40 px-4 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm transition-colors hover:border-white/[0.12] sm:px-5 sm:py-7"
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                >
                  <item.icon
                    className="mb-4 h-11 w-11 shrink-0 text-brand-gold sm:mb-5 sm:h-[3.25rem] sm:w-[3.25rem]"
                    strokeWidth={1.12}
                    aria-hidden
                  />
                  <h3 className="mb-2 text-sm font-bold text-white sm:text-base">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-brand-ink-secondary sm:text-sm">{item.body}</p>
                </motion.article>
              ))}
            </motion.div>

            <p className="mx-auto mt-6 max-w-3xl text-center text-[11px] leading-relaxed text-brand-ink-muted sm:mt-7 sm:text-xs">
              {statsIntro}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HomeStatsTrustSection;
