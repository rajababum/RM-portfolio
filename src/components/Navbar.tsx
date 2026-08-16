import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  PlusCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Languages,
  Sparkles,
  Camera,
} from 'lucide-react';
import { Language, ProfileSettings } from '../types';

interface NavbarProps {
  language: Language;
  onToggleLanguage: () => void;
  isAdmin: boolean;
  onLogoutAdmin: () => void;
  onOpenUploadModal: () => void;
  onOpenSystemModal: () => void;
  profile: ProfileSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  isAdmin,
  onLogoutAdmin,
  onOpenUploadModal,
  onOpenSystemModal,
  profile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '#about', labelEn: 'About', labelNe: 'बारेमा' },
    { href: '#journey', labelEn: 'Visual Journey', labelNe: 'दृश्य यात्रा' },
    { href: '#experience', labelEn: 'Experience', labelNe: 'अनुभव' },
    { href: '#contact', labelEn: 'Contact', labelNe: 'सम्पर्क' },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Monogram */}
          <a
            href="#"
            id="nav-brand-logo"
            className="flex items-center gap-3.5 group focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-[1.5px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-heading font-black text-transparent bg-clip-text bg-gradient-to-tr from-blue-400 to-indigo-300 text-lg tracking-wider">
                RM
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base sm:text-lg text-slate-100 tracking-tight flex items-center gap-1.5 group-hover:text-blue-400 transition-colors">
                {profile.name}
              </span>
              <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                {language === 'NE' ? 'दूरदर्शी तथा प्रविधि नेतृत्व' : 'Visionary & Tech Leader'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900/80 transition-all"
              >
                {language === 'NE' ? item.labelNe : item.labelEn}
              </a>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher Pill */}
            <button
              id="btn-language-toggle-desktop"
              onClick={onToggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-inner"
              title={language === 'EN' ? 'नेपालीमा हेर्नुहोस्' : 'Switch to English'}
              aria-label="Switch Language"
            >
              <Languages className="w-3.5 h-3.5 text-blue-400" />
              <div className="flex items-center gap-1">
                <span className={language === 'EN' ? 'text-blue-400 font-bold' : 'text-slate-500'}>
                  EN
                </span>
                <span className="text-slate-600">/</span>
                <span className={language === 'NE' ? 'text-blue-400 font-bold' : 'text-slate-500'}>
                  नेपाली
                </span>
              </div>
            </button>

            {/* Admin Toolbar (When Authenticated) */}
            {isAdmin ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{language === 'NE' ? 'प्रशासक' : 'Admin'}</span>
                </div>

                <button
                  id="btn-nav-upload-photo"
                  onClick={onOpenUploadModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all active:scale-95"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{language === 'NE' ? '+ तस्बिर थप्नुहोस्' : '+ Add Photo'}</span>
                </button>

                <button
                  id="btn-nav-admin-cms"
                  onClick={onOpenSystemModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700/80 transition-all"
                  title="System CMS Settings"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>CMS</span>
                </button>

                <button
                  id="btn-nav-admin-logout"
                  onClick={onLogoutAdmin}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title={language === 'NE' ? 'लगआउट' : 'Logout Admin'}
                  aria-label="Logout Admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Language Switcher */}
            <button
              id="btn-language-toggle-mobile"
              onClick={onToggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-blue-400"
              aria-label="Toggle language"
            >
              {language === 'EN' ? 'नेपाली' : 'EN'}
            </button>

            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-2 pb-6 flex flex-col gap-3"
          >
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  {language === 'NE' ? item.labelNe : item.labelEn}
                </a>
              ))}
            </nav>

            {isAdmin && (
              <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between px-2 text-xs font-semibold text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    {language === 'NE' ? 'प्रशासक मोड सक्रिय' : 'Admin Mode Active'}
                  </span>
                  <button
                    onClick={() => {
                      onLogoutAdmin();
                      setMobileMenuOpen(false);
                    }}
                    className="text-rose-400 hover:underline text-xs"
                  >
                    {language === 'NE' ? 'लगआउट' : 'Logout'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    onClick={() => {
                      onOpenUploadModal();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-600/30"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{language === 'NE' ? '+ तस्बिर' : '+ Add Photo'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenSystemModal();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-400" />
                    <span>{language === 'NE' ? 'CMS सेटिङ्स' : 'System CMS'}</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
