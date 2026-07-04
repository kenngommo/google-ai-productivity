import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Mail, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onContactClick: () => void;
}

type TabType = 'gmail' | 'sheets' | 'docs';

export default function Hero({ onContactClick }: HeroProps) {
  const [activeTab, setActiveTab] = useState<TabType>('gmail');
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { language, t } = useLanguage();

  const getSimulatorContent = (tab: TabType) => {
    switch (tab) {
      case 'gmail':
        return {
          prompt: t('simPromptGmail'),
          output: t('simOutputGmail'),
          icon: Mail,
          color: "text-google-blue",
          borderColor: "border-google-blue/30"
        };
      case 'sheets':
        return {
          prompt: t('simPromptSheets'),
          output: t('simOutputSheets'),
          icon: FileSpreadsheet,
          color: "text-google-green",
          borderColor: "border-google-green/30"
        };
      case 'docs':
        return {
          prompt: t('simPromptDocs'),
          output: t('simOutputDocs'),
          icon: FileText,
          color: "text-google-red",
          borderColor: "border-google-red/30"
        };
    }
  };

  const currentContent = getSimulatorContent(activeTab);

  useEffect(() => {
    setIsTyping(true);
    setDisplayText('');
    let index = 0;
    const fullText = currentContent.output;
    
    // Typewriter effect speed depends on active tab content length
    const speed = fullText.length > 300 ? 5 : 8;
    
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [activeTab, language]); // Re-run typewriter whenever tab or language changes

  const TabIcon = currentContent.icon;

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Blurs */}
      <div className="glow-spot glow-blue w-[350px] h-[350px] -top-20 left-10 md:w-[600px] md:h-[600px] md:-top-40 md:left-20"></div>
      <div className="glow-spot glow-purple w-[300px] h-[300px] top-40 -right-20 md:w-[500px] md:h-[500px] md:right-10"></div>
      <div className="glow-spot glow-green w-[250px] h-[250px] bottom-0 left-[20%] opacity-70"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Copy Writing / Headline */}
          <div className="lg:col-span-7 space-y-6 text-left animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-google-blue">
              <Sparkles className="h-3.5 w-3.5 animate-spin-slow text-google-yellow" />
              <span>{t('heroBadge')}</span>
            </div>
            
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
              {t('heroTitleStart')}
              <span className="bg-gradient-to-r from-google-blue via-google-indigo to-google-red bg-clip-text text-transparent">
                {t('heroTitleHighlight')}
              </span>
            </h1>
            
            <p className="text-slate-400 text-lg sm:text-xl max-w-2xl font-light leading-relaxed">
              {t('heroSubhead')}
            </p>

            {/* Feature bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-google-green shrink-0" />
                <span>{t('heroF1')}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-google-blue shrink-0" />
                <span>{t('heroF2')}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-google-yellow shrink-0" />
                <span>{t('heroF3')}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-google-red shrink-0" />
                <span>{t('heroF4')}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                onClick={onContactClick}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-google-blue via-google-blue to-blue-600 hover:brightness-110 text-white font-semibold py-3.5 px-8 rounded-lg shadow-xl shadow-blue-500/10 transition duration-200 cursor-pointer"
              >
                <span>{t('btnBookAudit')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#services"
                className="flex items-center justify-center border border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-300 hover:text-white font-semibold py-3.5 px-8 rounded-lg transition duration-200"
              >
                {t('btnExploreServices')}
              </a>
            </div>
          </div>

          {/* Interactive Workspace Simulator */}
          <div className="lg:col-span-5 relative animate-fade-in-up [animation-delay:200ms]">
            <div className="absolute inset-0 bg-gradient-to-tr from-google-blue/10 to-purple-500/10 rounded-2xl blur-xl -z-10"></div>
            
            <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80">
              {/* Simulator Header */}
              <div className="bg-slate-900/90 px-4 py-3.5 flex items-center justify-between border-b border-slate-800/80">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-google-red/80"></div>
                  <div className="w-3 h-3 rounded-full bg-google-yellow/80"></div>
                  <div className="w-3 h-3 rounded-full bg-google-green/80"></div>
                </div>
                <div className="text-xs text-slate-500 font-mono flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-google-green animate-pulse"></span>
                  <span>{t('simHeader')}</span>
                </div>
              </div>

              {/* Simulator Tabs */}
              <div className="grid grid-cols-3 border-b border-slate-800/60 bg-slate-950/45">
                {(['gmail', 'sheets', 'docs'] as TabType[]).map((tab) => {
                  const Icon = tab === 'gmail' ? Mail : tab === 'sheets' ? FileSpreadsheet : FileText;
                  const activeColor = tab === 'gmail' ? 'border-b-2 border-google-blue text-google-blue bg-google-blue/5' : tab === 'sheets' ? 'border-b-2 border-google-green text-google-green bg-google-green/5' : 'border-b-2 border-google-red text-google-red bg-google-red/5';
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center justify-center space-x-2 py-3 text-xs font-semibold uppercase tracking-wider transition duration-200 cursor-pointer ${
                        activeTab === tab
                          ? activeColor
                          : 'text-slate-400 hover:text-slate-200 bg-transparent hover:bg-slate-900/25'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab}</span>
                    </button>
                  );
                })}
              </div>

              {/* Simulator Screen */}
              <div className="p-5 font-mono text-left text-sm h-[320px] overflow-y-auto bg-slate-950/80">
                <div className="flex items-start space-x-2 text-slate-400 text-xs border-b border-slate-800 pb-3 mb-3">
                  <Sparkles className="h-4 w-4 text-google-yellow shrink-0 mt-0.5" />
                  <p className="leading-relaxed italic font-sans">{currentContent.prompt}</p>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed text-xs text-slate-200">
                  {displayText}
                  {isTyping && (
                    <span className="inline-block w-1.5 h-4 ml-0.5 bg-google-blue animate-pulse align-middle"></span>
                  )}
                </div>
              </div>

              {/* Simulator Status */}
              <div className="bg-slate-900/60 px-5 py-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>{t('simGeneratedIn')} 0.4s</span>
                <span className={`flex items-center ${currentContent.color}`}>
                  <TabIcon className="h-3 w-3 mr-1 animate-pulse" />
                  {t('simActiveLink')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
