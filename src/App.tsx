import { useRef, useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import ProOffers from './components/ProOffers';
import Resources from './components/Resources';
import LaptopSection from './components/Laptop';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { useLanguage } from './context/LanguageContext';

function App() {
  const contactRef = useRef<HTMLDivElement>(null);
  const [contactIntent, setContactIntent] = useState<'buy' | 'zalo' | 'email'>('buy');
  const [contactRole, setContactRole] = useState<string>('opt1');
  const { t, language } = useLanguage();
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  // ── Banner drag state ────────────────────────────────────────────────────
  const BANNER_DEFAULT_TOP = 74; // px from top — just below navbar, bottom clears sandbox widget
  const BANNER_APPROX_HEIGHT = 140; // approx banner height
  const BOTTOM_RESERVED = 132; // zalo (56) + back-to-top (56) + spacing

  const [bannerTop, setBannerTop] = useState(BANNER_DEFAULT_TOP);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const dragStartY = useRef(0);
  const dragStartTop = useRef(0);
  const bannerRef = useRef<HTMLDivElement>(null);

  const clampTop = (y: number) => {
    const max = window.innerHeight - BOTTOM_RESERVED - BANNER_APPROX_HEIGHT;
    return Math.max(BANNER_DEFAULT_TOP, Math.min(y, max));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    hasDragged.current = false;
    dragStartY.current = e.clientY;
    dragStartTop.current = bannerTop;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const delta = e.clientY - dragStartY.current;
    if (Math.abs(delta) > 4) hasDragged.current = true;
    setBannerTop(clampTop(dragStartTop.current + delta));
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const onBannerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hasDragged.current) {
      hasDragged.current = false;
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    scrollToContact('buy', 'opt5');
  };
  // ────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setCurrentHash(hash);
      if (hash === '#/laptop-us' || hash === '#' || !hash) {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Smooth scroll to section anchors after route switch
  useEffect(() => {
    if (currentHash && currentHash !== '#/laptop-us') {
      const id = currentHash.replace('#', '');
      if (id) {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          const t = setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
          return () => clearTimeout(t);
        }
      }
    }
  }, [currentHash]);

  const scrollToContact = (intent?: 'buy' | 'zalo' | 'email', role?: string) => {
    if (intent) setContactIntent(intent);
    if (role) setContactRole(role);
    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── Shared floating UI ───────────────────────────────────────────────────
  const zaloHref = `https://zalo.me/${t('zaloNumber').replace(/[\s.+]/g, '')}`;

  const ZaloBtn = () => (
    <a
      href={zaloHref}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#0068FF] hover:bg-[#005AE0] text-white shadow-xl shadow-blue-500/30 transition duration-300 group hover:scale-110"
      title="Nhắn tin Zalo"
    >
      <span className="absolute -inset-1 rounded-full bg-[#0068FF] opacity-40 blur-xs animate-ping" />
      <svg className="w-8 h-8 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="#0068FF" stroke="#0068FF" />
        <text x="50%" y="47%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="12px" fontWeight="900" fontFamily="sans-serif">Z</text>
      </svg>
      <span className="absolute right-16 scale-0 group-hover:scale-100 transition duration-200 rounded-lg bg-slate-900 border border-slate-800 p-2 text-xs font-semibold text-white whitespace-nowrap shadow-xl">
        Chat Zalo: {t('zaloNumber')}
      </span>
    </a>
  );

  const BackTopBtn = () => (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 shadow-xl transition duration-300 group hover:scale-110"
      title="Lên đầu trang"
    >
      <ArrowUp className="w-6 h-6" />
      <span className="absolute right-16 scale-0 group-hover:scale-100 transition duration-200 rounded-lg bg-slate-900 border border-slate-800 p-2 text-xs font-semibold text-white whitespace-nowrap shadow-xl">
        {language === 'vi' ? 'Lên đầu trang' : 'Back to top'}
      </span>
    </button>
  );
  // ────────────────────────────────────────────────────────────────────────

  // ── Dedicated Laptop US Landing Page — no contact form, Zalo only ────────
  if (currentHash === '#/laptop-us') {
    return (
      <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600/35 selection:text-white">
        <Navbar onContactClick={() => scrollToContact()} />
        <main className="pt-20">
          <LaptopSection
            onBuyClick={() => {
              // Clicking "Liên hệ mua ngay" on laptop page opens Zalo directly
              window.open(zaloHref, '_blank');
            }}
          />
        </main>
        <Footer />
        <BackTopBtn />
        <ZaloBtn />
      </div>
    );
  }

  // ── Main Home Page ────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600/35 selection:text-white">
      <Navbar onContactClick={() => scrollToContact()} />

      <main>
        <Hero onContactClick={() => scrollToContact()} />

        {/* Sponsor strip */}
        <div className="border-y border-slate-900 bg-slate-950 py-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block mb-4">
              Helping Professionals Optimize Google AI Across Tools
            </span>
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 opacity-45 grayscale hover:opacity-75 transition duration-300">
              <span className="text-sm font-semibold tracking-wider text-slate-300 font-heading">Google Workspace</span>
              <span className="text-sm font-semibold tracking-wider text-slate-300 font-heading">Gmail</span>
              <span className="text-sm font-semibold tracking-wider text-slate-300 font-heading">Google Sheets</span>
              <span className="text-sm font-semibold tracking-wider text-slate-300 font-heading">Apps Script</span>
              <span className="text-sm font-semibold tracking-wider text-slate-300 font-heading">AppSheet</span>
            </div>
          </div>
        </div>

        <About />
        <Services />
        <ProOffers onContactClick={() => scrollToContact('buy', 'opt5')} />
        <Resources />
        <Contact ref={contactRef} initialIntent={contactIntent} initialRole={contactRole} />
      </main>

      <Footer />

      {/* ── Draggable Blinking Banner ────────────────────────────────────── */}
      <div
        ref={bannerRef}
        onClick={onBannerClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{ top: bannerTop }}
        className="fixed right-4 z-40 w-[185px] sm:w-[195px] p-3.5 rounded-2xl bg-slate-950/95 border border-google-red/40 shadow-2xl transition-[border-color,box-shadow] duration-300 hover:border-google-red cursor-grab active:cursor-grabbing group animate-glow-red select-none touch-none"
      >
        {/* Row: sale badge + green live dot */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wider bg-google-red text-white animate-pulse">
            Sale Off -90%
          </span>
          {/* Green blinking indicator */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-google-green opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-google-green" />
          </span>
        </div>

        {/* Banner text */}
        <p className="text-[11px] sm:text-[11.5px] leading-normal text-slate-300 font-light text-left group-hover:text-white transition">
          {language === 'vi' ? (
            <>
              Mua gói <span className="text-google-red font-bold animate-blink">Google AI Pro 5TB</span>
              <br />
              <span className="text-google-green font-extrabold">1 năm</span> với mức giảm giá <span className="text-google-yellow font-extrabold">90%</span>
              <br />
              và bảo hành trọn đời <span className="text-google-blue font-bold group-hover:text-blue-400 transition-colors">tại đây</span>.
            </>
          ) : (
            <>
              Buy the <span className="text-google-red font-bold animate-blink">Google AI Pro 5TB</span>
              <br />
              <span className="text-google-green font-extrabold">1-Year</span> package with <span className="text-google-yellow font-extrabold">90% off</span>
              <br />
              and a lifetime warranty <span className="text-google-blue font-bold group-hover:text-blue-400 transition-colors">here</span>.
            </>
          )}
        </p>

        {/* Drag handle hint */}
        <div className="mt-2.5 flex justify-center gap-1 opacity-25 group-hover:opacity-50 transition-opacity pointer-events-none">
          <span className="block w-6 h-0.5 rounded-full bg-slate-400" />
          <span className="block w-6 h-0.5 rounded-full bg-slate-400" />
        </div>
      </div>
      {/* ─────────────────────────────────────────────────────────────────── */}

      <BackTopBtn />
      <ZaloBtn />
    </div>
  );
}

export default App;
