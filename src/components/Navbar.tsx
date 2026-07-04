import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onContactClick: () => void;
}

export default function Navbar({ onContactClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('navAbout'), href: '#about' },
    { name: t('navServices'), href: '#services' },
    { name: t('navOffers'), href: '#offers' },
    { name: t('navResources'), href: '#resources' },
    { name: t('navLaptop'), href: '#/laptop-us' },
  ];

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-350 ${
        isScrolled
          ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-900 shadow-lg py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-google-blue via-google-red to-google-yellow opacity-75 blur-xs group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-slate-950 p-1.5 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-google-blue animate-pulse" />
              </div>
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Gemini<span className="text-google-blue">Flow</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-sans font-medium text-sm text-slate-300 hover:text-white transition duration-200"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Language Switcher Switch */}
            <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800/80 p-0.5 rounded-full text-[10px] font-bold">
              <button
                onClick={() => setLanguage('vi')}
                className={`px-2.5 py-1 rounded-full transition duration-200 cursor-pointer ${
                  language === 'vi' ? 'bg-google-blue text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                VI
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-full transition duration-200 cursor-pointer ${
                  language === 'en' ? 'bg-google-blue text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={onContactClick}
              className="relative group overflow-hidden rounded-full p-[1px] focus:outline-none"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-google-blue via-google-red to-google-green rounded-full"></span>
              <span className="relative block px-5 py-2 rounded-full bg-slate-950 text-slate-100 font-medium text-sm transition-colors duration-250 group-hover:bg-transparent">
                {t('btnGetStarted')}
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Language Switcher Switch Mobile */}
            <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800/80 p-0.5 rounded-full text-[9px] font-bold">
              <button
                onClick={() => setLanguage('vi')}
                className={`px-2 py-0.5 rounded-full transition duration-200 cursor-pointer ${
                  language === 'vi' ? 'bg-google-blue text-white' : 'text-slate-450'
                }`}
              >
                VI
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-full transition duration-200 cursor-pointer ${
                  language === 'en' ? 'bg-google-blue text-white' : 'text-slate-450'
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white focus:outline-none p-1.5 rounded-lg border border-slate-900 bg-slate-900/50"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-[73px] left-0 w-full h-[calc(100vh-73px)] bg-slate-950/95 backdrop-blur-lg z-40 transition-transform duration-300 ease-in-out border-t border-slate-900/50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col space-y-6 p-8 h-full">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-slate-300 hover:text-white border-b border-slate-900 pb-2 transition duration-200"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => {
              setIsOpen(false);
              onContactClick();
            }}
            className="w-full bg-gradient-to-r from-google-blue to-google-green hover:opacity-95 text-white font-medium py-3 px-6 rounded-lg text-center shadow-lg transition duration-200 mt-4"
          >
            {t('btnBookFree')}
          </button>
        </div>
      </div>
    </nav>
  );
}
