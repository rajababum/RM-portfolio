import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Settings,
  User,
  Info,
  Briefcase,
  Mail,
  Zap,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { SystemSettings, Language, StatItem, SkillItem, MilestoneItem } from '../types';

interface AdminSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  systemSettings: SystemSettings;
  onSaveSystemSettings: (updated: SystemSettings) => void;
  onResetToDefaults: () => void;
  onAutoBoostAllLikes: () => void;
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const AdminSystemModal: React.FC<AdminSystemModalProps> = ({
  isOpen,
  onClose,
  language,
  systemSettings,
  onSaveSystemSettings,
  onResetToDefaults,
  onAutoBoostAllLikes,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'about' | 'experience' | 'contact' | 'autoLikes'>('profile');
  const [draft, setDraft] = useState<SystemSettings>(systemSettings);

  useEffect(() => {
    setDraft(systemSettings);
  }, [systemSettings, isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSystemSettings(draft);
    onShowToast(
      language === 'NE' ? 'साइट सेटिङ्स सफलतापूर्वक सुरक्षित भयो!' : 'System CMS settings saved successfully!',
      'success'
    );
    onClose();
  };

  const handleReset = () => {
    if (window.confirm(language === 'NE' ? 'के तपाईँ सबै सेटिङ्स पूर्वनिर्धारित अवस्थामा फर्काउन चाहनुहुन्छ?' : 'Reset all system settings back to default values?')) {
      onResetToDefaults();
      onShowToast(language === 'NE' ? 'पूर्वनिर्धारित सेटिङ्स पुन:स्थापित भयो।' : 'System settings reset to default.', 'info');
      onClose();
    }
  };

  // Helper state updates
  const updateProfile = (key: keyof SystemSettings['profile'], val: string) => {
    setDraft((prev) => ({
      ...prev,
      profile: { ...prev.profile, [key]: val },
    }));
  };

  const updateAbout = (key: keyof SystemSettings['about'], val: any) => {
    setDraft((prev) => ({
      ...prev,
      about: { ...prev.about, [key]: val },
    }));
  };

  const updateExperience = (key: keyof SystemSettings['experience'], val: any) => {
    setDraft((prev) => ({
      ...prev,
      experience: { ...prev.experience, [key]: val },
    }));
  };

  const updateContact = (key: keyof SystemSettings['contact'], val: string) => {
    setDraft((prev) => ({
      ...prev,
      contact: { ...prev.contact, [key]: val },
    }));
  };

  const updateAutoLikes = (key: keyof SystemSettings['autoLikes'], val: any) => {
    setDraft((prev) => ({
      ...prev,
      autoLikes: { ...prev.autoLikes, [key]: val },
    }));
  };

  // Stat item handlers
  const updateStatItem = (index: number, field: keyof StatItem, val: string) => {
    const nextStats = [...draft.about.stats];
    nextStats[index] = { ...nextStats[index], [field]: val };
    updateAbout('stats', nextStats);
  };

  // Skill item handlers
  const updateSkillItem = (index: number, field: keyof SkillItem, val: any) => {
    const nextSkills = [...draft.experience.skills];
    nextSkills[index] = { ...nextSkills[index], [field]: val };
    updateExperience('skills', nextSkills);
  };

  // Milestone item handlers
  const updateMilestoneItem = (index: number, field: keyof MilestoneItem, val: string) => {
    const nextMilestones = [...draft.experience.milestones];
    nextMilestones[index] = { ...nextMilestones[index], [field]: val };
    updateExperience('milestones', nextMilestones);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 my-auto overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100 font-heading">
                    {language === 'NE' ? 'प्रणालीगत CMS व्यवस्थापन' : 'System-Wide Content CMS'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language === 'NE' ? 'पोर्टफोलियोको सम्पूर्ण पाठ र सेटिङ्स अनुकूलित गर्नुहोस्' : 'Manage portfolio content, localized texts, and engagement parameters'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Switcher Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 shrink-0 no-scrollbar border-b border-slate-800/80">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'profile'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{language === 'NE' ? '१. प्रोफाइल र हिरो' : '1. Profile & Hero'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('about')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'about'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>{language === 'NE' ? '२. बारेमा (About)' : '2. About CMS'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('experience')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'experience'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{language === 'NE' ? '३. अनुभव र सीप' : '3. Experience & Skills'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('contact')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'contact'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{language === 'NE' ? '४. सम्पर्क र सञ्जाल' : '4. Contact & Socials'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('autoLikes')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'autoLikes'
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>{language === 'NE' ? '५. स्वतः-लाइक्स कन्फिग' : '5. Auto-Likes Config'}</span>
              </button>
            </div>

            {/* Tab Form Contents */}
            <form onSubmit={handleSave} className="overflow-y-auto pr-1 flex-1 space-y-6">
              
              {/* TAB 1: PROFILE & HERO */}
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={draft.profile.name}
                        onChange={(e) => updateProfile('name', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Hero Portrait Image URL
                      </label>
                      <input
                        type="url"
                        value={draft.profile.heroImage}
                        onChange={(e) => updateProfile('heroImage', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Title / Role (English)
                      </label>
                      <input
                        type="text"
                        value={draft.profile.titleEn}
                        onChange={(e) => updateProfile('titleEn', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        पद / भूमिका (नेपाली)
                      </label>
                      <input
                        type="text"
                        value={draft.profile.titleNe}
                        onChange={(e) => updateProfile('titleNe', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Tagline Narrative (English)
                      </label>
                      <textarea
                        rows={3}
                        value={draft.profile.taglineEn}
                        onChange={(e) => updateProfile('taglineEn', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        ट्यागलाइन सन्देश (नेपाली)
                      </label>
                      <textarea
                        rows={3}
                        value={draft.profile.taglineNe}
                        onChange={(e) => updateProfile('taglineNe', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Primary CTA Button (EN / NE)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={draft.profile.ctaPrimaryEn}
                          onChange={(e) => updateProfile('ctaPrimaryEn', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                        />
                        <input
                          type="text"
                          value={draft.profile.ctaPrimaryNe}
                          onChange={(e) => updateProfile('ctaPrimaryNe', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Secondary CTA Button (EN / NE)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={draft.profile.ctaSecondaryEn}
                          onChange={(e) => updateProfile('ctaSecondaryEn', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                        />
                        <input
                          type="text"
                          value={draft.profile.ctaSecondaryNe}
                          onChange={(e) => updateProfile('ctaSecondaryNe', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ABOUT CMS */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Section Heading (English)
                      </label>
                      <input
                        type="text"
                        value={draft.about.headingEn}
                        onChange={(e) => updateAbout('headingEn', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        शीर्षक (नेपाली)
                      </label>
                      <input
                        type="text"
                        value={draft.about.headingNe}
                        onChange={(e) => updateAbout('headingNe', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Bio Paragraph 1 (English)
                      </label>
                      <textarea
                        rows={3}
                        value={draft.about.bioParagraph1En}
                        onChange={(e) => updateAbout('bioParagraph1En', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        बायो अनुच्छेद १ (नेपाली)
                      </label>
                      <textarea
                        rows={3}
                        value={draft.about.bioParagraph1Ne}
                        onChange={(e) => updateAbout('bioParagraph1Ne', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs resize-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Motto Quote (English)
                      </label>
                      <input
                        type="text"
                        value={draft.about.mottoEn}
                        onChange={(e) => updateAbout('mottoEn', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        आदर्श वाक्य (नेपाली)
                      </label>
                      <input
                        type="text"
                        value={draft.about.mottoNe}
                        onChange={(e) => updateAbout('mottoNe', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm"
                      />
                    </div>
                  </div>

                  {/* 4 Metric Stats Editor */}
                  <div className="pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                      Achievement Counters (4 Metric Cards)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {draft.about.stats.map((stat, idx) => (
                        <div key={stat.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={stat.value}
                              onChange={(e) => updateStatItem(idx, 'value', e.target.value)}
                              placeholder="Value (e.g. 45)"
                              className="w-1/2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs font-bold"
                            />
                            <input
                              type="text"
                              value={stat.suffix}
                              onChange={(e) => updateStatItem(idx, 'suffix', e.target.value)}
                              placeholder="Suffix (e.g. +)"
                              className="w-1/2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs"
                            />
                          </div>
                          <input
                            type="text"
                            value={stat.labelEn}
                            onChange={(e) => updateStatItem(idx, 'labelEn', e.target.value)}
                            placeholder="Label (EN)"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs"
                          />
                          <input
                            type="text"
                            value={stat.labelNe}
                            onChange={(e) => updateStatItem(idx, 'labelNe', e.target.value)}
                            placeholder="लेबल (नेपाली)"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: EXPERIENCE CMS */}
              {activeTab === 'experience' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Vision Quote (English)
                      </label>
                      <input
                        type="text"
                        value={draft.experience.quoteEn}
                        onChange={(e) => updateExperience('quoteEn', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        दूरदृष्टि भनाइ (नेपाली)
                      </label>
                      <input
                        type="text"
                        value={draft.experience.quoteNe}
                        onChange={(e) => updateExperience('quoteNe', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm"
                      />
                    </div>
                  </div>

                  {/* Skills Editor */}
                  <div className="pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                      Competency Progress Skills
                    </h4>
                    <div className="space-y-3">
                      {draft.experience.skills.map((skill, idx) => (
                        <div key={skill.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <input
                              type="text"
                              value={skill.nameEn}
                              onChange={(e) => updateSkillItem(idx, 'nameEn', e.target.value)}
                              placeholder="Skill Name (EN)"
                              className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs font-semibold"
                            />
                            <div className="flex items-center gap-1.5 w-24">
                              <input
                                type="number"
                                min={10}
                                max={100}
                                value={skill.level}
                                onChange={(e) => updateSkillItem(idx, 'level', parseInt(e.target.value, 10) || 0)}
                                className="w-14 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs font-mono text-center"
                              />
                              <span className="text-xs text-slate-400 font-mono">%</span>
                            </div>
                          </div>
                          <input
                            type="text"
                            value={skill.nameNe}
                            onChange={(e) => updateSkillItem(idx, 'nameNe', e.target.value)}
                            placeholder="सीपको नाम (नेपाली)"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Milestones Timeline Editor */}
                  <div className="pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                      Career Timeline Milestones
                    </h4>
                    <div className="space-y-4">
                      {draft.experience.milestones.map((m, idx) => (
                        <div key={m.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={m.year}
                              onChange={(e) => updateMilestoneItem(idx, 'year', e.target.value)}
                              placeholder="Year range"
                              className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-blue-400 font-mono text-xs"
                            />
                            <input
                              type="text"
                              value={m.roleType}
                              onChange={(e) => updateMilestoneItem(idx, 'roleType', e.target.value)}
                              placeholder="Role Type"
                              className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs"
                            />
                            <input
                              type="text"
                              value={m.orgEn}
                              onChange={(e) => updateMilestoneItem(idx, 'orgEn', e.target.value)}
                              placeholder="Organization"
                              className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-indigo-300 text-xs font-semibold"
                            />
                          </div>
                          <input
                            type="text"
                            value={m.titleEn}
                            onChange={(e) => updateMilestoneItem(idx, 'titleEn', e.target.value)}
                            placeholder="Title (EN)"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs font-bold"
                          />
                          <input
                            type="text"
                            value={m.descEn}
                            onChange={(e) => updateMilestoneItem(idx, 'descEn', e.target.value)}
                            placeholder="Description"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: CONTACT & SOCIALS */}
              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Primary Email
                      </label>
                      <input
                        type="email"
                        value={draft.contact.email}
                        onChange={(e) => updateContact('email', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={draft.contact.phone}
                        onChange={(e) => updateContact('phone', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Location (English)
                      </label>
                      <input
                        type="text"
                        value={draft.contact.locationEn}
                        onChange={(e) => updateContact('locationEn', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        स्थान (नेपाली)
                      </label>
                      <input
                        type="text"
                        value={draft.contact.locationNe}
                        onChange={(e) => updateContact('locationNe', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                      Social Profiles URLs
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Facebook URL</label>
                        <input
                          type="url"
                          value={draft.contact.facebookUrl}
                          onChange={(e) => updateContact('facebookUrl', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">LinkedIn URL</label>
                        <input
                          type="url"
                          value={draft.contact.linkedinUrl}
                          onChange={(e) => updateContact('linkedinUrl', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">GitHub URL</label>
                        <input
                          type="url"
                          value={draft.contact.githubUrl}
                          onChange={(e) => updateContact('githubUrl', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Instagram URL</label>
                        <input
                          type="url"
                          value={draft.contact.instagramUrl}
                          onChange={(e) => updateContact('instagramUrl', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: AUTO-LIKES CONFIG */}
              {activeTab === 'autoLikes' && (
                <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
                        <Zap className="w-4 h-4" />
                        <span>System-Wide Engagement Auto-Boost</span>
                      </div>
                      <button
                        type="button"
                        onClick={onAutoBoostAllLikes}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-pink-600/30 transition-all active:scale-95"
                      >
                        ⚡ Trigger Global Auto-Boost
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      This immediately boosts likes across all current photos in the visual gallery based on the configured randomized parameters below.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Default Boost Minimum Range
                      </label>
                      <input
                        type="number"
                        value={draft.autoLikes.defaultBoostRangeMin}
                        onChange={(e) => updateAutoLikes('defaultBoostRangeMin', parseInt(e.target.value, 10) || 100)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Default Boost Maximum Range
                      </label>
                      <input
                        type="number"
                        value={draft.autoLikes.defaultBoostRangeMax}
                        onChange={(e) => updateAutoLikes('defaultBoostRangeMax', parseInt(e.target.value, 10) || 500)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-rose-950/30 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all"
                  title="Reset settings to factory defaults"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'NE' ? 'पूर्वनिर्धारितमा फर्काउनुहोस्' : 'Reset Defaults'}</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    {language === 'NE' ? 'रद्द गर्नुहोस्' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>{language === 'NE' ? 'सेटिङ्स सेभ गर्नुहोस्' : 'Save System Settings'}</span>
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
