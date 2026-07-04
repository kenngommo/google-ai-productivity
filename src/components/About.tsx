import { Award, Zap, Users, Code } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  const stats = [
    { label: t('statLabelHours'), value: '450+', desc: t('statDescHours'), icon: Zap, color: 'text-google-yellow' },
    { label: t('statLabelTrained'), value: '2,500+', desc: t('statDescTrained'), icon: Users, color: 'text-google-blue' },
    { label: t('statLabelWorkflows'), value: '180+', desc: t('statDescWorkflows'), icon: Code, color: 'text-google-green' },
    { label: t('statLabelSatisfaction'), value: '99.4%', desc: t('statDescSatisfaction'), icon: Award, color: 'text-google-red' },
  ];

  return (
    <section id="about" className="py-20 bg-slate-900/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            {t('aboutTitle')}
            <span className="bg-gradient-to-r from-google-blue to-google-green bg-clip-text text-transparent">
              {t('aboutTitleHighlight')}
            </span>{' '}
            {t('aboutTitleEnd')}
          </h2>
          <p className="text-slate-400 mt-4 text-base sm:text-lg font-light">
            {t('aboutSubhead')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Avatar & Badges */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group">
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-google-blue via-google-red to-google-yellow opacity-75 blur-md group-hover:opacity-100 transition duration-300"></div>
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 w-full max-w-[320px] aspect-square">
                <img
                  src="alex_rivera_avatar.png"
                  alt="Alex Rivera - Google AI Productivity Consultant"
                  className="w-full h-full object-cover transition duration-550 group-hover:scale-105"
                />
              </div>
            </div>
            
            {/* Certifications row */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 max-w-[350px]">
              <span className="px-3.5 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center space-x-1.5 font-medium shadow-md">
                <span className="w-2 h-2 rounded-full bg-google-blue"></span>
                <span>Gemini & Gems Expert</span>
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center space-x-1.5 font-medium shadow-md">
                <span className="w-2 h-2 rounded-full bg-google-green"></span>
                <span>NotebookLM Specialist</span>
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center space-x-1.5 font-medium shadow-md">
                <span className="w-2 h-2 rounded-full bg-google-yellow"></span>
                <span>Antigravity IDE Partner</span>
              </span>
            </div>
          </div>

          {/* Bio Description */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h3 className="font-heading font-bold text-2xl text-white">
              {t('aboutName')}
            </h3>
            <p className="text-slate-400 font-light leading-relaxed">
              {t('aboutBio1')}
            </p>
            <p className="text-slate-400 font-light leading-relaxed">
              {t('aboutBio2')}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="glass-panel p-4.5 rounded-xl border border-slate-900 relative overflow-hidden group hover:border-slate-800 transition">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        {stat.value}
                      </span>
                      <Icon className={`h-5 w-5 ${stat.color} transition-transform group-hover:scale-110 duration-200`} />
                    </div>
                    <h4 className="text-slate-200 text-sm font-semibold mb-0.5">{stat.label}</h4>
                    <p className="text-[11px] text-slate-400 font-light">{stat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
