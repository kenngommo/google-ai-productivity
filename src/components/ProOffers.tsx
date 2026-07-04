import { useState } from 'react';
import { Star, Check, X, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ProOffersProps {
  onContactClick: () => void;
}

export default function ProOffers({ onContactClick }: ProOffersProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'individual' | 'workspace'>('individual');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const tiers = [
    {
      name: 'Gemini Standard',
      price: t('offersTableFree'),
      target: 'Casual Users',
      features: {
        access: 'Standard models (1.5 Flash)',
        workspace: false,
        appsScript: false,
        privacy: t('offersTablePrivacyFree'),
        context: t('offersTableContextStandard')
      }
    },
    {
      name: 'Gemini Advanced',
      price: language === 'vi'
        ? (billingPeriod === 'monthly' ? '₫225,000 / tháng' : '₫2,250,000 / năm')
        : (billingPeriod === 'monthly' ? '$19.99 / mo' : '$199.99 / yr'),
      target: t('offersTableAdvancedDesc'),
      featured: true,
      features: {
        access: 'Premium models (1.5 Pro)',
        workspace: 'Integrates in Docs, Gmail, Sheets, Slides',
        appsScript: 'Advanced code generation support',
        privacy: t('offersTablePrivacyAdvanced'),
        context: t('offersTableContextAdvanced')
      }
    },
    {
      name: 'Gemini Business',
      price: language === 'vi'
        ? (billingPeriod === 'monthly' ? '₫470,000 - ₫700,000 / tháng' : '₫4,700,000 - ₫7,000,000 / năm')
        : (billingPeriod === 'monthly' ? '$20-$30 / mo' : '$200-$300 / yr'),
      target: t('offersTableBusinessDesc'),
      features: {
        access: 'Premium models (1.5 Pro)',
        workspace: 'Full admin controls & sidebar logs',
        appsScript: 'Full integration & Apps Script execution',
        privacy: t('offersTablePrivacyBusiness'),
        context: t('offersTableContextAdvanced')
      }
    }
  ];

  const googleAITiers = [
    {
      name: 'Google AI Plus',
      capacity: '400 GB',
      price: {
        vi: {
          monthly: '132,000',
          yearly: '1,319,000',
          periodTextMonthly: 'Billed monthly',
          periodTextYearly: 'Billed annually. Save 16%',
        },
        en: {
          monthly: '5.99',
          yearly: '59.99',
          periodTextMonthly: 'Billed monthly',
          periodTextYearly: 'Billed annually. Save 16%',
        }
      },
      hasYearly: true,
      badgeText: language === 'vi' ? 'Trải nghiệm các tính năng mới và mạnh mẽ' : 'Get access to new and powerful features',
    },
    {
      name: 'Google AI Plus',
      capacity: '2 TB',
      price: {
        vi: {
          monthly: '225,000',
          yearly: '2,250,000',
          periodTextMonthly: 'Billed monthly',
          periodTextYearly: 'Billed annually. Save 16%',
        },
        en: {
          monthly: '19.99',
          yearly: '199.99',
          periodTextMonthly: 'Billed monthly',
          periodTextYearly: 'Billed annually. Save 16%',
        }
      },
      hasYearly: true,
      featured: true,
      badgeText: language === 'vi' ? 'Trải nghiệm các tính năng mới và mạnh mẽ' : 'Get access to new and powerful features',
    },
    {
      name: 'Google AI Pro',
      capacity: '5 TB',
      price: {
        vi: {
          monthly: '489,000',
          yearly: '5,000,000',
          periodTextMonthly: 'Billed monthly',
          periodTextYearly: 'Billed annually. Save 14%',
        },
        en: {
          monthly: '24.99',
          yearly: '249.99',
          periodTextMonthly: 'Billed monthly',
          periodTextYearly: 'Billed annually. Save 16%',
        }
      },
      hasYearly: true,
      badgeText: language === 'vi' ? 'Trải nghiệm các tính năng mới và mạnh mẽ' : 'Get access to new and powerful features',
    },
    {
      name: 'Google AI Pro',
      capacity: '10 TB',
      price: {
        vi: {
          monthly: '1,125,000',
          yearly: '1,125,000',
          periodTextMonthly: 'Billed monthly',
          periodTextYearly: 'Billed monthly only',
        },
        en: {
          monthly: '49.99',
          yearly: '49.99',
          periodTextMonthly: 'Billed monthly',
          periodTextYearly: 'Billed monthly only',
        }
      },
      hasYearly: false,
      badgeText: language === 'vi' ? 'Trải nghiệm các tính năng mới và mạnh mẽ' : 'Get access to new and powerful features',
    },
    {
      name: 'Google AI Ultra',
      capacity: '20 TB',
      price: {
        vi: {
          monthly: '2,250,000',
          yearly: '2,250,000',
          periodTextMonthly: 'Billed monthly',
          periodTextYearly: 'Billed monthly only',
        },
        en: {
          monthly: '99.99',
          yearly: '99.99',
          periodTextMonthly: 'Billed monthly',
          periodTextYearly: 'Billed monthly only',
        }
      },
      hasYearly: false,
      badgeText: language === 'vi' ? 'Trải nghiệm các tính năng mới và mạnh mẽ' : 'Get access to new and powerful features',
    },
    {
      name: 'Google AI Ultra',
      capacity: '30 TB',
      price: {
        vi: {
          monthly: '5,500,000',
          yearly: '5,500,000',
          periodTextMonthly: 'Billed monthly',
          periodTextYearly: 'Billed monthly only',
        },
        en: {
          monthly: '149.99',
          yearly: '149.99',
          periodTextMonthly: 'Billed monthly',
          periodTextYearly: 'Billed monthly only',
        }
      },
      hasYearly: false,
      badgeText: language === 'vi' ? 'Mở khóa quyền truy cập cao nhất vào các công nghệ AI tốt nhất của Google' : 'Unlock the highest access to the best of Google AI',
    }
  ];

  const packages = [
    {
      title: t('pkg1Title'),
      price: '$399',
      period: 'one-time',
      tag: t('pkg1Badge'),
      description: t('pkg1Desc'),
      bullets: [
        t('s1D2'),
        t('s1D1'),
        t('s1D3')
      ]
    },
    {
      title: t('pkg2Title'),
      price: '$1,499',
      period: 'one-time',
      tag: t('pkg2Badge'),
      featured: true,
      description: t('pkg2Desc'),
      bullets: [
        t('s4D1'),
        t('s3D1'),
        t('s2D1'),
        t('s2D4')
      ]
    }
  ];

  return (
    <section id="offers" className="py-20 bg-slate-900/40 relative">
      <div className="glow-spot glow-blue w-[350px] h-[350px] top-[10%] right-[5%] opacity-50"></div>
      <div className="glow-spot glow-purple w-[300px] h-[300px] bottom-[10%] left-[5%] opacity-50"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-google-blue mb-4">
            <span>{t('offersBadge')}</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            {t('offersTitle')}
          </h2>
          <p className="text-slate-400 mt-4 text-base sm:text-lg font-light">
            {t('offersSubhead')}
          </p>
        </div>

        {/* Tab & Billing Controls */}
        <div className="flex flex-col items-center justify-center space-y-6 mb-12">
          {/* Tab Selector */}
          <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveTab('individual')}
              className={`px-5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'individual'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'vi' ? 'Gói tài khoản Google AI cá nhân' : 'Google AI Storage Plans'}
            </button>
            <button
              onClick={() => setActiveTab('workspace')}
              className={`px-5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'workspace'
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {language === 'vi' ? 'So sánh tính năng Workspace' : 'Workspace Feature Comparison'}
            </button>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center space-x-3">
            <span className={`text-xs transition ${billingPeriod === 'monthly' ? 'text-white font-medium' : 'text-slate-500'}`}>
              {language === 'vi' ? 'Thanh toán hàng tháng' : 'Billed monthly'}
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 rounded-full bg-slate-800 border border-slate-700 relative p-1 transition duration-200 cursor-pointer"
            >
              <div
                className={`w-4 h-4 rounded-full bg-google-blue transition duration-200 ${
                  billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
            <span className={`text-xs transition ${billingPeriod === 'yearly' ? 'text-white font-medium' : 'text-slate-500'} flex items-center`}>
              {language === 'vi' ? 'Thanh toán hàng năm' : 'Billed annually'}
              <span className="ml-1.5 px-2 py-0.5 rounded-full bg-google-green/15 text-[10px] font-bold text-google-green border border-google-green/20 animate-pulse">
                {language === 'vi' ? 'Tiết kiệm đến 16%' : 'Save up to 16%'}
              </span>
            </span>
          </div>
        </div>

        {/* Dynamic Display based on Tab */}
        {activeTab === 'individual' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {googleAITiers.map((tier, idx) => {
              const hasYearlyOption = tier.hasYearly;
              const isYearlySelected = billingPeriod === 'yearly';
              
              // Decide display values
              let priceValue = '';
              let periodText = '';
              let billedText = '';
              
              if (language === 'vi') {
                if (isYearlySelected && hasYearlyOption) {
                  priceValue = `₫${tier.price.vi.yearly}`;
                  periodText = ' / năm';
                  billedText = tier.price.vi.periodTextYearly;
                } else {
                  priceValue = `₫${tier.price.vi.monthly}`;
                  periodText = ' / tháng';
                  billedText = tier.price.vi.periodTextMonthly;
                }
              } else {
                if (isYearlySelected && hasYearlyOption) {
                  priceValue = `$${tier.price.en.yearly}`;
                  periodText = ' / year';
                  billedText = tier.price.en.periodTextYearly;
                } else {
                  priceValue = `$${tier.price.en.monthly}`;
                  periodText = ' / month';
                  billedText = tier.price.en.periodTextMonthly;
                }
              }
              
              return (
                <div
                  key={idx}
                  className={`group glass-panel rounded-2xl p-6 flex flex-col text-center transition duration-300 border relative ${
                    tier.featured
                      ? 'border-google-blue/35 bg-slate-900/50 shadow-blue-500/5 hover:border-google-blue/50 animate-glow'
                      : 'border-slate-900/60 hover:border-slate-800 bg-slate-950/40'
                  }`}
                >
                  {tier.featured && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-gradient-to-r from-google-blue to-blue-600 text-[10px] font-bold tracking-wider uppercase text-white shadow-lg">
                        <Star className="h-3 w-3 fill-current text-google-yellow" />
                        <span>{t('offersTableRecommended')}</span>
                      </span>
                    </div>
                  )}

                  <div className="text-slate-300 text-sm font-semibold tracking-wide mt-2">
                    {tier.name}
                  </div>
                  
                  <div className="text-4xl font-extrabold text-white my-3 tracking-tight">
                    {tier.capacity}
                  </div>

                  <div className="my-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {priceValue}
                    </span>
                    {(!isYearlySelected || hasYearlyOption) && (
                      <span className="text-xs font-light text-slate-400">
                        {periodText}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs font-light text-slate-400 mb-6 min-h-[16px]">
                    {billedText}
                  </div>

                  {/* Upgrade CTA */}
                  <button
                    onClick={onContactClick}
                    className={`w-full py-2.5 px-6 rounded-full text-center font-semibold text-xs tracking-wide transition duration-200 cursor-pointer mb-6 border ${
                      tier.featured
                        ? 'bg-gradient-to-r from-google-blue via-google-blue to-blue-600 text-white shadow-md shadow-blue-500/10 hover:brightness-110 border-transparent'
                        : 'bg-transparent border-slate-700 text-slate-200 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    {language === 'vi' ? 'Nâng cấp' : 'Upgrade'}
                  </button>

                  {/* Bullet feature */}
                  <div className="text-xs text-slate-300 font-light border-t border-slate-900/60 pt-4 pb-4">
                    {language === 'vi' ? 'Chia sẻ bộ nhớ với tối đa 5 người khác' : 'Share storage with up to 5 others'}
                  </div>

                  {/* Bottom Access Box */}
                  <div className="mt-auto px-4 py-3 rounded-xl bg-slate-900 border border-slate-800/60 flex items-start text-left">
                    <svg className="w-5 h-5 mr-2 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" fill="url(#geminiGrad)" />
                      <defs>
                        <linearGradient id="geminiGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#4285F4" />
                          <stop offset="30%" stopColor="#9B51E0" />
                          <stop offset="70%" stopColor="#EA4335" />
                          <stop offset="100%" stopColor="#FBBC05" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <span className="text-[11px] leading-relaxed text-slate-400 font-normal">
                      {tier.badgeText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Comparison Table */
          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-900 shadow-2xl mb-16">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-900">
                    <th className="p-5 text-sm font-semibold text-slate-300">{t('offersTableFeature')}</th>
                    {tiers.map((tier, idx) => (
                      <th key={idx} className="p-5 text-sm font-semibold text-white min-w-[200px]">
                        <div className="flex items-center justify-between">
                          <span>{tier.name}</span>
                          {tier.featured && (
                            <span className="text-[10px] font-bold text-google-blue bg-google-blue/15 px-2 py-0.5 rounded-full border border-google-blue/20">
                              {t('offersTableRecommended')}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 font-light mt-1">{tier.target}</div>
                        <div className="text-base font-bold text-slate-200 mt-2">{tier.price}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-xs text-slate-300">
                  <tr>
                    <td className="p-5 font-semibold text-slate-400">Gemini Access</td>
                    {tiers.map((tier, idx) => (
                      <td key={idx} className="p-5">{tier.features.access}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-5 font-semibold text-slate-400">Workspace Integration</td>
                    {tiers.map((tier, idx) => (
                      <td key={idx} className="p-5">
                        {typeof tier.features.workspace === 'string' ? (
                          <span className="flex items-center text-google-green">
                            <Check className="h-4 w-4 mr-1 text-google-green" />
                            {tier.features.workspace}
                          </span>
                        ) : (
                          <span className="flex items-center text-slate-500">
                            <X className="h-4 w-4 mr-1 text-google-red" />
                            {t('offersTableNoWorkspace')}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-5 font-semibold text-slate-400">Apps Script & Code</td>
                    {tiers.map((tier, idx) => (
                      <td key={idx} className="p-5">
                        {tier.features.appsScript ? (
                          <span className="flex items-center text-google-green">
                            <Check className="h-4 w-4 mr-1 text-google-green" />
                            {tier.features.appsScript}
                          </span>
                        ) : (
                          <span className="flex items-center text-slate-500">
                            <X className="h-4 w-4 mr-1 text-google-red" />
                            {t('offersTableBasicCode')}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-5 font-semibold text-slate-400">Data Privacy</td>
                    {tiers.map((tier, idx) => (
                      <td key={idx} className="p-5">
                        <div className="flex items-center">
                          {tier.features.privacy.includes('Enterprise') || tier.features.privacy.includes('Doanh nghiệp') ? (
                            <ShieldCheck className="h-4 w-4 text-google-green mr-1.5 shrink-0" />
                          ) : null}
                          <span>{tier.features.privacy}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-5 font-semibold text-slate-400">{t('offersTableContext')}</td>
                    {tiers.map((tier, idx) => (
                      <td key={idx} className="p-5">{tier.features.context}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Package Offers */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h3 className="font-heading font-extrabold text-2xl text-white">
            {t('offersPackagesTitle')}
          </h3>
          <p className="text-slate-400 mt-2 text-sm font-light">
            {t('offersPackagesSubhead')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {packages.map((pkg, idx) => (
            <div
              key={idx}
              className={`group glass-panel rounded-2xl p-6 md:p-8 flex flex-col text-left transition duration-350 border relative ${
                pkg.featured
                  ? 'border-google-blue/35 bg-slate-900/50 shadow-blue-500/5 hover:border-google-blue/50'
                  : 'border-slate-900/60 hover:border-slate-800'
              }`}
            >
              {pkg.featured && (
                <div className="absolute top-0 right-8 transform -translate-y-1/2">
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-gradient-to-r from-google-blue to-blue-600 text-[10px] font-bold tracking-wider uppercase text-white shadow-lg">
                    <Star className="h-3 w-3 fill-current text-google-yellow" />
                    <span>{t('pkgBestseller')}</span>
                  </span>
                </div>
              )}

              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {pkg.tag}
              </span>
              <h4 className="font-heading font-bold text-xl sm:text-2xl text-white mt-3">
                {pkg.title}
              </h4>
              <p className="text-slate-400 font-light text-xs mt-3 leading-relaxed">
                {pkg.description}
              </p>

              {/* Price */}
              <div className="my-6 flex items-baseline">
                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {pkg.price}
                </span>
                <span className="ml-2 text-xs font-light text-slate-400">
                  / {pkg.period}
                </span>
              </div>

              {/* Bullets */}
              <ul className="space-y-3 mb-8 text-xs text-slate-300">
                {pkg.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start">
                    <Check className="h-4.5 w-4.5 text-google-green mr-2 shrink-0" />
                    <span className="font-light">{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={onContactClick}
                className={`w-full py-3 px-6 rounded-lg text-center font-semibold text-xs tracking-wide transition duration-200 cursor-pointer ${
                  pkg.featured
                    ? 'bg-gradient-to-r from-google-blue via-google-blue to-blue-600 text-white shadow-md shadow-blue-500/10 hover:brightness-110'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                {t('btnInquirePackage')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
