import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '../ui/Logo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return undefined;
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  const panelVariants = {
    closed: { opacity: 0, y: -12 },
    open: { opacity: 1, y: 0 },
  };

  /* Shared nav-link classes for uniform typography */
  const navLinkBase =
    'inline-flex items-center rounded-lg px-3.5 py-2 font-sans text-[0.9375rem] font-medium whitespace-nowrap transition-colors duration-200';
  const navLinkActive =
    'bg-brand-cyan/10 text-brand-cyan ring-1 ring-inset ring-brand-cyan/35';
  const navLinkIdle =
    'text-brand-ink-secondary hover:text-brand-cyan hover:bg-white/[0.06]';

  return (
    <>
      <motion.header
        className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-300 ${
          isScrolled
            ? 'border-b border-white/[0.08] bg-brand-bg-raised/90 backdrop-blur-xl'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between md:h-[72px]">
            {/* ── Logo ────────────────────────────────────── */}
            <motion.div className="min-w-0 flex-shrink-0 pr-2" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Link to="/" className="flex min-w-0 items-center" onClick={closeMenu} aria-label="Billion Towers home">
                <Logo placement="header" />
              </Link>
            </motion.div>

            {/* ── Desktop nav — horizontal row, gap-8, uniform type ─── */}
            <nav className="hidden items-center gap-8 md:flex" id="desktop-nav">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${navLinkBase} ${isActive ? navLinkActive : navLinkIdle}`}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* ── Connect CTA button (gold gradient) ──── */}
              <motion.button
                type="button"
                className="ml-4 inline-flex items-center justify-center rounded-xl px-6 py-2.5 font-sans text-[0.875rem] font-semibold text-[#0a0f18] whitespace-nowrap"
                style={{
                  background: 'linear-gradient(120deg, #f6e08b 0%, #e8c547 35%, #d4af37 70%, #c9a030 100%)',
                  boxShadow: '0 4px 22px rgba(212, 175, 55, 0.28)',
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 6px 30px rgba(212, 175, 55, 0.38)',
                }}
                whileTap={{ scale: 0.97 }}
                id="connect-btn-desktop"
              >
                Connect
              </motion.button>
            </nav>

            {/* ── Hamburger (mobile) ──────────────────────── */}
            <motion.button
              type="button"
              className="min-h-[44px] min-w-[44px] p-2 text-brand-ink-secondary transition-colors hover:text-brand-cyan md:hidden"
              onClick={() => setIsMenuOpen((o) => !o)}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              id="mobile-menu-toggle"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0">
          <div className="cyber-grid opacity-[0.12]" />
        </div>
      </motion.header>

      {/* ── Mobile menu panel ─────────────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              role="presentation"
              className="fixed inset-0 top-16 z-[90] bg-black/75 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
            />
            <motion.nav
              className="fixed left-0 right-0 top-16 z-[95] max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-b border-white/10 bg-brand-bg-raised/98 px-4 py-4 shadow-2xl backdrop-blur-xl md:hidden"
              variants={panelVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.25, ease: 'easeOut' }}
              id="mobile-nav-panel"
            >
              <div className="mx-auto flex max-w-lg flex-col gap-1 pb-6">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex min-h-[48px] items-center rounded-xl px-4 py-3 font-sans text-[0.9375rem] font-medium transition-colors ${
                        isActive
                          ? 'bg-brand-cyan/12 text-brand-cyan ring-1 ring-inset ring-brand-cyan/35'
                          : 'text-brand-ink-secondary hover:bg-brand-cyan/10 hover:text-brand-cyan'
                      }`}
                      onClick={closeMenu}
                    >
                      {item.name}
                    </Link>
                  );
                })}

                <div className="my-3 border-t border-white/10" />

                {/* ── Connect CTA (mobile — full width) ────── */}
                <motion.button
                  type="button"
                  className="flex min-h-[48px] w-full items-center justify-center rounded-xl px-6 py-3 font-sans text-[0.9375rem] font-semibold text-[#0a0f18]"
                  style={{
                    background: 'linear-gradient(120deg, #f6e08b 0%, #e8c547 35%, #d4af37 70%, #c9a030 100%)',
                    boxShadow: '0 4px 22px rgba(212, 175, 55, 0.28)',
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0 6px 30px rgba(212, 175, 55, 0.38)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  id="connect-btn-mobile"
                >
                  Connect
                </motion.button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
