import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Edit2,
  Heart,
  Calendar,
  Tag,
  Trash2,
  CheckCircle2,
  Upload,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Language, Moment } from '../types';
import { generateLikesFromPreset, formatLikes } from '../utils/likesFormatter';
import { compressImageFile } from '../utils/imageCompressor';

interface EditMomentModalProps {
  moment: Moment | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onUpdateMoment: (updated: Moment) => void;
  onDeleteMoment: (id: string) => void;
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const EditMomentModal: React.FC<EditMomentModalProps> = ({
  moment,
  isOpen,
  onClose,
  language,
  onUpdateMoment,
  onDeleteMoment,
  onShowToast,
}) => {
  const [titleEn, setTitleEn] = useState('');
  const [titleNe, setTitleNe] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descNe, setDescNe] = useState('');
  const [category, setCategory] = useState('Technology');
  const [eventDate, setEventDate] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [likes, setLikes] = useState<number>(0);
  const [customLikesInput, setCustomLikesInput] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (moment) {
      setTitleEn(moment.titleEn);
      setTitleNe(moment.titleNe);
      setDescEn(moment.descEn);
      setDescNe(moment.descNe);
      setCategory(moment.category);
      setEventDate(moment.date);
      setImgUrl(moment.imgUrl);
      setLikes(moment.likes);
      setCustomLikesInput(moment.likes.toString());
    }
  }, [moment]);

  if (!moment) return null;

  const categories = ['Technology', 'Community', 'Networking', 'Professional', 'Milestone', 'Personal'];

  const handleApplyPreset = (preset: '200' | '300' | '1k' | 'random') => {
    const newLikes = generateLikesFromPreset(preset);
    setLikes(newLikes);
    setCustomLikesInput(newLikes.toString());
  };

  const handleCustomLikesChange = (val: string) => {
    setCustomLikesInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed)) {
      setLikes(parsed);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      onShowToast(
        language === 'NE' ? 'कृपया मान्य तस्बिर फाइल छान्नुहोस्।' : 'Please select a valid image file.',
        'error'
      );
      return;
    }

    try {
      setIsCompressing(true);
      const compressed = await compressImageFile(file, 1400, 0.85);
      setImgUrl(compressed);
      onShowToast(
        language === 'NE' ? 'नयाँ तस्बिर सफलतापूर्वक लोड भयो!' : 'New photo loaded & compressed!',
        'success'
      );
    } catch (err) {
      console.error(err);
      onShowToast(
        language === 'NE' ? 'तस्बिर प्रशोधनमा समस्या आयो।' : 'Failed to process image file.',
        'error'
      );
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: Moment = {
      ...moment,
      titleEn: titleEn.trim() || moment.titleEn,
      titleNe: titleNe.trim() || moment.titleNe,
      descEn: descEn.trim() || moment.descEn,
      descNe: descNe.trim() || moment.descNe,
      imgUrl: imgUrl || moment.imgUrl,
      category,
      date: eventDate,
      likes: Math.max(0, likes),
    };

    onUpdateMoment(updated);
    onShowToast(
      language === 'NE' ? 'तस्बिर विवरण अद्यावधिक भयो!' : 'Moment details updated successfully!',
      'success'
    );
    onClose();
  };

  const handleDelete = () => {
    if (
      window.confirm(
        language === 'NE'
          ? 'के तपाईँ यो तस्बिर मेटाउन चाहनुहुन्छ?'
          : 'Are you sure you want to permanently delete this photo?'
      )
    ) {
      onDeleteMoment(moment.id);
      onShowToast(language === 'NE' ? 'तस्बिर हटाइयो।' : 'Moment deleted from gallery.', 'info');
      onClose();
    }
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
            className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 my-auto overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100 font-heading">
                    {language === 'NE' ? 'तस्बिर विवरण सम्पादन गर्नुहोस्' : 'Edit Moment & Photo'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    ID: <span className="font-mono text-slate-300">{moment.id}</span>
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto pr-1 flex-1">
              {/* Photo Display & Direct Device Upload / Replace */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                    <img
                      src={imgUrl}
                      alt={titleEn}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
                    <div className="text-xs font-bold text-slate-200">
                      {language === 'NE' ? 'तस्बिर परिवर्तन गर्नुहोस्' : 'Change Photo from Device'}
                    </div>
                    <p className="text-xs text-slate-400">
                      {language === 'NE'
                        ? 'आफ्नो कम्प्युटर वा मोबाइलबाट नयाँ तस्बिर सिधै अपलोड गर्नुहोस्'
                        : 'Upload a replacement photo directly from your device storage.'}
                    </p>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isCompressing}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-semibold transition-all active:scale-95"
                    >
                      {isCompressing ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {isCompressing
                          ? (language === 'NE' ? 'प्रशोधन हुँदै...' : 'Compressing...')
                          : (language === 'NE' ? 'नयाँ तस्बिर छान्नुहोस्' : 'Browse New Photo')}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Likes Adjustment Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 fill-pink-400" />
                    <span>{language === 'NE' ? 'लाइक्स संख्या समायोजन' : 'Engagement Likes Adjustment'}</span>
                  </label>
                  <span className="text-sm font-mono font-bold text-pink-400">
                    {formatLikes(likes)} likes ({likes})
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('200')}
                    className="py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-pink-600/20 text-slate-300 hover:text-pink-300 border border-slate-800 text-xs font-bold transition-all"
                  >
                    +200
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('300')}
                    className="py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-pink-600/20 text-slate-300 hover:text-pink-300 border border-slate-800 text-xs font-bold transition-all"
                  >
                    +300
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('1k')}
                    className="py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-pink-600/20 text-slate-300 hover:text-pink-300 border border-slate-800 text-xs font-bold transition-all"
                  >
                    +1.0k
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('random')}
                    className="py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-purple-600/20 text-slate-300 hover:text-purple-300 border border-slate-800 text-xs font-bold transition-all"
                  >
                    Random
                  </button>
                </div>

                <div>
                  <input
                    type="number"
                    min={0}
                    value={customLikesInput}
                    onChange={(e) => handleCustomLikesChange(e.target.value)}
                    placeholder="Enter custom count"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Title EN & NE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Title (English)
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    शीर्षक (नेपाली)
                  </label>
                  <input
                    type="text"
                    value={titleNe}
                    onChange={(e) => setTitleNe(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Description EN & NE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    विवरण (नेपाली)
                  </label>
                  <textarea
                    rows={2}
                    value={descNe}
                    onChange={(e) => setDescNe(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>

              {/* Category and Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 text-xs font-semibold transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'NE' ? 'तस्बिर मेटाउनुहोस्' : 'Delete Moment'}</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    {language === 'NE' ? 'रद्द गर्नुहोस्' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'NE' ? 'परिवर्तन सुरक्षित गर्नुहोस्' : 'Save Changes'}</span>
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
