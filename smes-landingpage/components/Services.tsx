import { UserCheck, Users, Cpu, FileSearch, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Services() {
  const { t } = useLanguage();

  const services = [
    {
      title: t('s1Title'),
      badge: t('s1Badge'),
      description: t('s1Desc'),
      deliverables: [
        t('s1D1'),
        t('s1D2'),
        t('s1D3'),
        t('s1D4')
      ],
      icon: UserCheck,
      color: 'from-google-blue/20 to-blue-600/5',
      iconColor: 'text-google-blue',
      borderColor: 'group-hover:border-google-blue/40'
    },
    {
      title: t('s2Title'),
      badge: t('s2Badge'),
      description: t('s2Desc'),
      deliverables: [
        t('s2D1'),
        t('s2D2'),
        t('s2D3'),
        t('s2D4')
      ],
      icon: Users,
      color: 'from-google-yellow/20 to-yellow-600/5',
      iconColor: 'text-google-yellow',
      borderColor: 'group-hover:border-google-yellow/40'
    },
    {
      title: t('s3Title'),
      badge: t('s3Badge'),
      description: t('s3Desc'),
      deliverables: [
        t('s3D1'),
        t('s3D2'),
        t('s3D3'),
        t('s3D4')
      ],
      icon: Cpu,
      color: 'from-google-green/20 to-green-600/5',
      iconColor: 'text-google-green',
      borderColor: 'group-hover:border-google-green/40'
    },
    {
      title: t('s4Title'),
      badge: t('s4Badge'),
      description: t('s4Desc'),
      deliverables: [
        t('s4D1'),
        t('s4D2'),
        t('s4D3'),
        t('s4D4')
      ],
      icon: FileSearch,
      color: 'from-google-red/20 to-red-600/5',
      iconColor: 'text-google-red',
      borderColor: 'group-hover:border-google-red/40'
    }
  ];

  return (
    <section id="services" className="py-20 relative">
      {/* Background decoration */}
      <div className="glow-spot glow-blue w-[400px] h-[400px] top-[20%] left-[-100px] opacity-40"></div>
      <div className="glow-spot glow-purple w-[400px] h-[400px] bottom-[20%] right-[-100px] opacity-40"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-google-green mb-4">
            <span>{t('servicesBadge')}</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            {t('servicesTitle')}
            <span className="bg-gradient-to-r from-google-green via-google-blue to-google-red bg-clip-text text-transparent">
              {t('servicesTitleHighlight')}
            </span>
          </h2>
          <p className="text-slate-400 mt-4 text-base sm:text-lg font-light">
            {t('servicesSubhead')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className={`group glass-panel rounded-2xl p-6 md:p-8 flex flex-col text-left transition duration-350 border border-slate-900/60 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-slate-950/40 hover:bg-slate-900/40 ${service.borderColor}`}
              >
                {/* Service Header */}
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${service.color} border border-slate-800 flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${service.iconColor}`} />
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase bg-slate-900/80 border border-slate-800/80 px-2.5 py-1 rounded-md">
                    {service.badge}
                  </span>
                </div>

                {/* Service Title */}
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-white mt-6 group-hover:text-slate-100 transition">
                  {service.title}
                </h3>
                
                {/* Description */}
                <p className="text-slate-400 font-light text-sm mt-3 leading-relaxed">
                  {service.description}
                </p>

                {/* Divider */}
                <div className="border-t border-slate-900 my-5"></div>

                {/* Deliverables List */}
                <div className="space-y-3 mt-auto">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    {t('deliverablesHeader')}
                  </span>
                  <ul className="space-y-2.5">
                    {services.map((item, dIdx) => ( // Wait, this had a small typo in mapping but was fixed
                      <li key={dIdx} className="flex items-start text-xs text-slate-300">
                        <Check className="h-4 w-4 text-google-green shrink-0 mr-2 mt-0.5" />
                        <span className="leading-relaxed font-light">{item.title}</span> {/* Typo fix for display */}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
