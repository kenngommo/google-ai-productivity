import { useState, forwardRef } from 'react';
import { CheckCircle2, User, Mail, MessageSquare, Briefcase, FileText, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ContactProps {}

export default forwardRef<HTMLDivElement, ContactProps>((_, ref) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'office-worker',
    message: '',
    optInPlaybook: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { t } = useLanguage();

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = t('errName');
    if (!formData.email.trim()) {
      tempErrors.email = t('errEmailEmpty');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = t('errEmailInvalid');
    }
    if (!formData.message.trim()) {
      tempErrors.message = t('errMessageEmpty');
    } else if (formData.message.trim().length < 15) {
      tempErrors.message = t('errMessageLength');
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      
      // Simulate form submission to backend
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessModal(true);
        setFormData({
          name: '',
          email: '',
          role: 'office-worker',
          message: '',
          optInPlaybook: true
        });
      }, 1800);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <section ref={ref} id="contact" className="py-20 bg-slate-900/30 relative">
      <div className="glow-spot glow-blue w-[400px] h-[400px] top-[10%] left-[5%] opacity-35"></div>
      <div className="glow-spot glow-red w-[350px] h-[350px] bottom-[10%] right-[5%] opacity-35"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-google-red mb-4">
            <span>{t('contactBadge')}</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            {t('contactTitle')}
          </h2>
          <p className="text-slate-400 mt-4 text-base sm:text-lg font-light">
            {t('contactSubhead')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-900 shadow-2xl bg-gradient-to-tr from-slate-950 via-slate-900/40 to-slate-950">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name field */}
              <div className="text-left space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center">
                  <User className="h-4 w-4 mr-1.5 text-google-blue" />
                  {t('labelName')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('placeholderName')}
                  className={`form-input w-full text-xs ${errors.name ? 'border-google-red/60 focus:border-google-red focus:ring-google-red/20' : ''}`}
                />
                {errors.name && <p className="text-google-red text-[11px] font-medium">{errors.name}</p>}
              </div>

              {/* Email field */}
              <div className="text-left space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center">
                  <Mail className="h-4 w-4 mr-1.5 text-google-blue" />
                  {t('labelEmail')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('placeholderEmail')}
                  className={`form-input w-full text-xs ${errors.email ? 'border-google-red/60 focus:border-google-red focus:ring-google-red/20' : ''}`}
                />
                {errors.email && <p className="text-google-red text-[11px] font-medium">{errors.email}</p>}
              </div>

              {/* Role selection */}
              <div className="text-left space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center">
                  <Briefcase className="h-4 w-4 mr-1.5 text-google-blue" />
                  {t('labelRole')}
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-input w-full text-xs bg-slate-950 cursor-pointer"
                >
                  <option value="office-worker">{t('optRole1')}</option>
                  <option value="small-business">{t('optRole2')}</option>
                  <option value="manager">{t('optRole3')}</option>
                  <option value="individual">{t('optRole4')}</option>
                </select>
              </div>

              {/* Message field */}
              <div className="text-left space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1.5 text-google-blue" />
                  {t('labelMessage')}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder={t('placeholderMessage')}
                  className={`form-input w-full text-xs resize-none ${errors.message ? 'border-google-red/60 focus:border-google-red focus:ring-google-red/20' : ''}`}
                />
                {errors.message && <p className="text-google-red text-[11px] font-medium">{errors.message}</p>}
              </div>

              {/* Checkbox Opt-in */}
              <div className="flex items-start text-left pt-2">
                <div className="flex items-center h-5">
                  <input
                    id="optInPlaybook"
                    name="optInPlaybook"
                    type="checkbox"
                    checked={formData.optInPlaybook}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-google-blue focus:ring-google-blue/30 focus:ring-offset-slate-950"
                  />
                </div>
                <label htmlFor="optInPlaybook" className="ml-3 text-xs text-slate-400 font-light cursor-pointer select-none">
                  {t('optInPlaybook')}
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-google-blue via-google-red to-google-yellow hover:brightness-110 text-white font-bold py-3.5 px-6 rounded-lg text-xs tracking-wider uppercase transition duration-300 shadow-xl cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? t('btnSubmittingContact') : t('btnSubmitContact')}
              </button>
            </form>
          </div>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="glass-panel max-w-md w-full rounded-2xl p-8 border border-slate-800 relative shadow-2xl text-center space-y-4 animate-fade-in-up">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-google-green opacity-50 blur-xs"></div>
                  <div className="relative bg-slate-950 p-3 rounded-full">
                    <CheckCircle2 className="h-10 w-10 text-google-green" />
                  </div>
                </div>
              </div>

              <h4 className="font-heading font-extrabold text-xl text-white">
                {t('modalSuccessTitle')}
              </h4>
              
              <p className="text-slate-300 text-xs font-light leading-relaxed">
                {t('modalSuccessDesc')}
              </p>

              {formData.optInPlaybook && (
                <div className="p-3.5 rounded-lg border border-google-blue/20 bg-google-blue/5 text-slate-300 text-xs font-light flex items-center space-x-2 text-left">
                  <FileText className="h-5 w-5 text-google-blue shrink-0" />
                  <span>{t('modalSuccessPlaybook')}</span>
                </div>
              )}

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-google-blue to-blue-600 hover:brightness-105 text-white font-semibold text-xs transition duration-200 cursor-pointer"
              >
                {t('btnBackToSite')}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
});
