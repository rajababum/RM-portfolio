import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Send,
  Shield,
  Edit3,
  Award,
  Layers,
  Heart,
  ChevronDown,
} from 'lucide-react';
import { Language, ProfileSettings } from '../types';

interface HeaderProps {
  language: Language;
  profile: ProfileSettings;
  isAdmin: boolean;
  onOpenSystemModal: () => void;
  totalMoments: number;
  totalLikes: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  profile,
  isAdmin,
  onOpenSystemModal,
  totalMoments,
  totalLikes,
}) => {
  const rolesEn = [
    'Visionary Community Leader',
    'Technology & Strategy Specialist',
    'Youth Empowerment Advocate',
    'Digital Transformation Architect',
  ];

  const rolesNe = [
    'दूरदर्शी सामुदायिक नेता',
    'प्रविधि तथा रणनीति विशेषज्ञ',
    'युवा सशक्तिकरण अधिवक्ता',
    'डिजिटल रूपान्तरण योजनाकार',
  ];

  const roles = language === 'NE' ? rolesNe : rolesEn;
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-purple-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Role Rotator & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            
            {/* Welcome Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 shadow-inner text-xs sm:text-sm font-medium text-slate-300 mb-6"
            >
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
              <span>{language === 'NE' ? profile.welcomeBadgeNe : profile.welcomeBadgeEn}</span>
            </motion.div>

            {/* Dynamic Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl text-slate-100 tracking-tight leading-[1.1] mb-4"
            >
              <span>{profile.name}</span>
            </motion.h1>

            {/* Animated Rotating Subtitle Banner */}
            <div className="h-10 sm:h-12 flex items-center mb-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRoleIndex + (language === 'NE' ? '-ne' : '-en')}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -24, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="font-heading font-semibold text-lg sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400"
                >
                  {roles[currentRoleIndex]}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Localized Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300/90 max-w-2xl leading-relaxed mb-8"
            >
              {language === 'NE' ? profile.taglineNe : profile.taglineEn}
            </motion.p>

            {/* Action Buttons & Admin Quick Trigger */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              <a
                href="#journey"
                id="btn-hero-primary-cta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{language === 'NE' ? profile.ctaPrimaryNe : profile.ctaPrimaryEn}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                id="btn-hero-secondary-cta"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-200 font-medium text-sm transition-all"
              >
                <Send className="w-4 h-4 text-slate-400" />
                <span>{language === 'NE' ? profile.ctaSecondaryNe : profile.ctaSecondaryEn}</span>
              </a>

              {isAdmin && (
                <button
                  id="btn-hero-admin-quick-cms"
                  onClick={onOpenSystemModal}
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-950/40 text-xs font-semibold transition-all"
                  title="Admin CMS Settings"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{language === 'NE' ? 'साइट सेटिङ्स सम्पादन' : 'Customize Profile & CMS'}</span>
                </button>
              )}
            </motion.div>

            {/* Quick Hero Floating Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-8 mt-8 border-t border-slate-850 w-full"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-slate-100 font-heading">{totalMoments}</div>
                  <div className="text-xs text-slate-400">{language === 'NE' ? 'ग्यालरी तस्बिर' : 'Moments Captured'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-slate-100 font-heading">
                    {totalLikes >= 1000 ? `${(totalLikes / 1000).toFixed(1)}k` : totalLikes}
                  </div>
                  <div className="text-xs text-slate-400">{language === 'NE' ? 'कुल प्रतिक्रिया' : 'Community Likes'}</div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xl font-extrabold text-slate-100 font-heading">100%</div>
                  <div className="text-xs text-slate-400">{language === 'NE' ? 'समर्पण र निष्ठा' : 'Impact Driven'}</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: High Polish Uncropped Hero Image with Ambient Frame */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative w-full max-w-[380px] sm:max-w-[420px]"
            >
              {/* Outer glowing halo */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-lg opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
              
              {/* Hero Image Container */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
                {/* Background blurred ambiance */}
                <img
                  src={profile.heroImage}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-30 scale-110"
                />

                {/* Main Hero Image */}
                <div className="relative aspect-[4/5] w-full flex items-center justify-center p-2">
                  <img
                    id="hero-profile-image"
                    src={profile.heroImage}
                    alt={profile.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-2xl drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)]"
                  />
                </div>

                {/* Floating Prestige Badge */}
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <div>
                      <div className="text-xs font-bold text-slate-100">
                        {language === 'NE' ? 'सक्रिय पहल तथा परामर्श' : 'Available for Collaborations'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {language === 'NE' ? 'काठमाडौं, नेपाल' : 'Kathmandu, Nepal'}
                      </div>
                    </div>
                  </div>
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Down Scroll Indicator */}
      <div className="hidden sm:flex justify-center mt-12">
        <a
          href="#about"
          className="p-2 rounded-full text-slate-500 hover:text-slate-300 transition-colors animate-bounce"
          aria-label="Scroll to About Section"
        >
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
};
