import React, { useState } from 'react';
import { Download, BookOpen, CheckCircle, Mail, Send, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Resources() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubsubscribed] = useState(false);
  const [activeDownload, setActiveDownload] = useState<string | null>(null);
  const [downloadEmail, setDownloadEmail] = useState('');
  const [downloadSubmitted, setDownloadSubmitted] = useState(false);
  const { t } = useLanguage();

  const freebies = [
    {
      id: 'playbook',
      title: t('simPromptDocs').includes('SOP') ? 'Gemini Prompt Playbook' : 'Thư viện Prompt Gemini',
      desc: t('resFormatPlaybook').includes('24')
        ? 'Get 50+ copy-paste prompts designed specifically for office administration, scheduling, sheet parsing, and report writing.'
        : 'Nhận 50+ mẫu prompt sao chép và sử dụng ngay cho quản trị văn phòng, sắp xếp lịch trình, phân tích trang tính và báo cáo.',
      format: t('resFormatPlaybook'),
      downloads: `1,420+ ${t('resDownloads')}`,
      color: 'border-google-blue/30 text-google-blue bg-google-blue/5'
    },
    {
      id: 'checklist',
      title: t('simPromptDocs').includes('SOP') ? 'Workspace AI Starter Guide' : 'Hướng dẫn Khởi động Workspace AI',
      desc: t('resFormatPlaybook').includes('24')
        ? 'A checklist of admin switches, browser shortcuts, and sidebar configurations to get your Google Workspace ready for AI automation.'
        : 'Danh mục kiểm tra các cài đặt quản trị, phím tắt trình duyệt và cấu hình thanh bên để Google Workspace sẵn sàng cho tự động hóa AI.',
      format: t('resFormatChecklist'),
      downloads: `890+ ${t('resDownloads')}`,
      color: 'border-google-green/30 text-google-green bg-google-green/5'
    }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubsubscribed(true);
      setEmail('');
      setTimeout(() => {
        setSubsubscribed(false);
      }, 5000);
    }
  };

  const handleDownloadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (downloadEmail.trim()) {
      setDownloadSubmitted(true);

      // Trigger actual download of the selected PDF resource
      const fileName = activeDownload === 'playbook' ? 'gemini-prompt-playbook.pdf' : 'workspace-ai-starter-guide.pdf';
      const link = document.createElement('a');
      link.href = `./${fileName}`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        setDownloadSubmitted(false);
        setActiveDownload(null);
        setDownloadEmail('');
      }, 3000);
    }
  };

  return (
    <section id="resources" className="py-20 relative">
      <div className="glow-spot glow-green w-[350px] h-[350px] top-[20%] left-[-50px] opacity-40"></div>
      <div className="glow-spot glow-blue w-[350px] h-[350px] bottom-[20%] right-[-50px] opacity-40"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-google-yellow mb-4">
            <span>{t('resourcesBadge')}</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            {t('resourcesTitle')}
            <span className="bg-gradient-to-r from-google-yellow to-google-red bg-clip-text text-transparent">
              {t('resourcesTitleHighlight')}
            </span>
          </h2>
          <p className="text-slate-400 mt-4 text-base sm:text-lg font-light">
            {t('resourcesSubhead')}
          </p>
        </div>

        {/* Free Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {freebies.map((freebie) => (
            <div
              key={freebie.id}
              className="glass-panel rounded-2xl p-6 border border-slate-900 flex flex-col text-left group hover:border-slate-850 hover:bg-slate-900/30 transition duration-300"
            >
              <div className="flex justify-between items-start">
                <div className={`p-2.5 rounded-lg border ${freebie.color} flex items-center justify-center`}>
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    {freebie.format}
                  </span>
                  <span className="text-[10px] text-google-green font-medium block mt-0.5">
                    {freebie.downloads}
                  </span>
                </div>
              </div>

              <h3 className="font-heading font-bold text-lg text-white mt-5">
                {freebie.title}
              </h3>
              <p className="text-slate-400 font-light text-xs mt-2.5 leading-relaxed">
                {freebie.desc}
              </p>

              {/* Download Trigger */}
              <button
                onClick={() => setActiveDownload(freebie.id)}
                className="mt-6 flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition duration-200 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>{t('resGetPDF')}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Newsletter Signup Form */}
        <div className="glass-panel rounded-3xl p-8 md:p-12 max-w-4xl mx-auto border border-slate-900 relative overflow-hidden bg-gradient-to-tr from-slate-950 via-slate-900/50 to-slate-950">
          <div className="absolute inset-0 bg-radial-gradient(circle at top right, rgba(251,188,5,0.06), transparent 50%)"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-6 text-left">
              <h3 className="font-heading font-extrabold text-2xl text-white">
                {t('newsTitle')}
              </h3>
              <p className="text-slate-400 font-light text-xs mt-3 leading-relaxed">
                {t('newsDesc')}
              </p>
              <div className="flex items-center space-x-2 text-xs text-slate-500 mt-4 font-light">
                <Award className="h-4 w-4 text-google-yellow" />
                <span>{t('newsSubNoSpam')}</span>
              </div>
            </div>

            {/* Newsletter Input Box */}
            <div className="lg:col-span-6">
              {subscribed ? (
                <div className="flex flex-col items-center justify-center p-6 border border-google-green/20 bg-google-green/5 rounded-2xl text-center space-y-2 animate-fade-in-up">
                  <CheckCircle className="h-10 w-10 text-google-green" />
                  <h4 className="text-white font-bold text-sm">{t('newsSuccessTitle')}</h4>
                  <p className="text-slate-400 text-xs">
                    {t('newsSuccessDesc')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-grow">
                    <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
                    <input
                      type="email"
                      required
                      placeholder={t('newsPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input w-full pl-10 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-google-yellow to-orange-500 hover:brightness-105 text-slate-950 font-bold px-6 py-3 rounded-lg text-xs tracking-wider flex items-center justify-center space-x-2 transition duration-200 cursor-pointer"
                  >
                    <span>{t('btnSubscribe')}</span>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Modal for PDF downloads */}
        {activeDownload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="glass-panel max-w-md w-full rounded-2xl p-6 border border-slate-800 relative shadow-2xl animate-fade-in-up">
              <h4 className="font-heading font-bold text-lg text-white mb-2">
                {t('modalDownloadTitle')} {activeDownload === 'playbook' ? (t('simPromptDocs').includes('SOP') ? 'Gemini Prompt Playbook' : 'Thư viện Prompt Gemini') : (t('simPromptDocs').includes('SOP') ? 'Workspace AI Starter Guide' : 'Hướng dẫn Khởi động Workspace AI')}
              </h4>
              <p className="text-slate-400 text-xs mb-4">
                {t('modalDownloadDesc')}
              </p>

              {downloadSubmitted ? (
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-2 animate-fade-in-up">
                  <CheckCircle className="h-10 w-10 text-google-green" />
                  <h5 className="text-white font-bold text-sm">{t('modalDownloadSuccessTitle')}</h5>
                  <p className="text-slate-400 text-xs">
                    {t('modalDownloadSuccessDesc')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleDownloadSubmit} className="space-y-4">
                  <input
                    type="email"
                    required
                    placeholder="Enter your work email"
                    value={downloadEmail}
                    onChange={(e) => setDownloadEmail(e.target.value)}
                    className="form-input w-full text-xs"
                  />
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveDownload(null)}
                      className="w-1/2 py-2.5 rounded-lg border border-slate-800 text-xs font-semibold text-slate-400 hover:bg-slate-900 transition duration-200"
                    >
                      {t('modalDownloadCancel')}
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-2.5 rounded-lg bg-gradient-to-r from-google-blue to-blue-600 hover:brightness-105 text-white font-semibold text-xs transition duration-200"
                    >
                      {t('modalDownloadSubmit')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
