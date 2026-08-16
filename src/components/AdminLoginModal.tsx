import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Lock, KeyRound, X, Sparkles, LogIn, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language: Language;
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  language,
  onShowToast,
}) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPass = passcode.trim().toLowerCase();

    // Valid passcodes: 'admin', '1234', 'rajababu', or direct unlock
    if (cleanPass === 'admin' || cleanPass === '1234' || cleanPass === 'rajababu' || cleanPass === 'login' || cleanPass === 'rajababum426@gmail.com') {
      setError(false);
      setPasscode('');
      onSuccess();
      onShowToast(
        language === 'NE'
          ? 'प्रशासक मोड सफलतापूर्वक सक्रिय भयो!'
          : 'Admin mode unlocked successfully! You can now edit & delete photos.',
        'success'
      );
      onClose();
    } else {
      setError(true);
      onShowToast(
        language === 'NE'
          ? 'गलत पासवर्ड। कृपया "admin" वा "1234" प्रयास गर्नुहोस्।'
          : 'Invalid passcode. Please enter "admin" or "1234".',
        'error'
      );
    }
  };

  const handleQuickBypass = () => {
    setError(false);
    setPasscode('');
    onSuccess();
    onShowToast(
      language === 'NE'
        ? 'राजाबाबु मेहता (प्रशासक) को रूपमा प्रमाणीकरण सफल!'
        : 'Authenticated as Rajababu Mehta (Admin)!',
      'success'
    );
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-blue-950/50 relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <KeyRound className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    {language === 'NE' ? 'प्रशासक प्रमाणीकरण' : 'Admin Mode Login'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language === 'NE' ? 'तस्बिरहरू मेटाउन र व्यवस्थापन गर्न' : 'To delete & manage gallery photos'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  {language === 'NE' ? 'प्रशासक पासवर्ड वा पिन' : 'Admin Passcode / PIN'}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter passcode (e.g. admin or 1234)"
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      setError(false);
                    }}
                    className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950 border text-slate-100 text-sm focus:outline-none transition-colors ${
                      error ? 'border-rose-500 focus:border-rose-500' : 'border-slate-800 focus:border-blue-500'
                    }`}
                    autoFocus
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                  <span>Tip: Default passcode is</span>
                  <code className="px-1.5 py-0.5 rounded bg-slate-800 text-blue-400 font-mono text-[10px]">admin</code>
                  <span>or</span>
                  <code className="px-1.5 py-0.5 rounded bg-slate-800 text-blue-400 font-mono text-[10px]">1234</code>
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{language === 'NE' ? 'लगइन गर्नुहोस्' : 'Login Admin'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickBypass}
                  className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-colors"
                  title="Instant Owner Quick Login"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'NE' ? 'द्रुत अनलक' : 'Quick Unlock'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
