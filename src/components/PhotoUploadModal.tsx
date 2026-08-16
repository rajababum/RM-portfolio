import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  Link,
  Image as ImageIcon,
  Heart,
  Sparkles,
  Calendar,
  Tag,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { Language, Moment } from '../types';
import { compressImageFile } from '../utils/imageCompressor';
import { generateLikesFromPreset, formatLikes } from '../utils/likesFormatter';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onAddMoment: (moment: Moment) => void;
  onShowToast: (text: string, type: 'success' | 'error' | 'info') => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  language,
  onAddMoment,
  onShowToast,
}) => {
  const [sourceType, setSourceType] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Metadata form states
  const [titleEn, setTitleEn] = useState('');
  const [titleNe, setTitleNe] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descNe, setDescNe] = useState('');
  const [category, setCategory] = useState('Technology');
  const [customCategory, setCustomCategory] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);

  // Auto-likes preset selection
  const [likePreset, setLikePreset] = useState<'200' | '300' | '1k' | 'random' | 'custom'>('200');
  const [customLikesVal, setCustomLikesVal] = useState<number>(350);

  const predefinedCategories = ['Technology', 'Community', 'Networking', 'Professional', 'Milestone', 'Personal', 'Other'];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      onShowToast(language === 'NE' ? 'कृपया मान्य तस्बिर फाइल छान्नुहोस्।' : 'Please select a valid image file.', 'error');
      return;
    }

    try {
      setIsCompressing(true);
      const compressedDataUrl = await compressImageFile(file, 1400, 0.85);
      setImageUrl(compressedDataUrl);
      onShowToast(language === 'NE' ? 'तस्बिर सफलतापूर्वक तयार भयो!' : 'Photo processed and compressed!', 'success');
    } catch (err) {
      console.error(err);
      onShowToast(language === 'NE' ? 'तस्बिर प्रशोधन गर्न समस्या भयो।' : 'Failed to process image file.', 'error');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      onShowToast(language === 'NE' ? 'कृपया मान्य तस्बिर फाइल छान्नुहोस्।' : 'Please drop an image file.', 'error');
      return;
    }

    try {
      setIsCompressing(true);
      const compressedDataUrl = await compressImageFile(file, 1400, 0.85);
      setImageUrl(compressedDataUrl);
      onShowToast(language === 'NE' ? 'तस्बिर सफलतापूर्वक तयार भयो!' : 'Photo loaded and compressed!', 'success');
    } catch (err) {
      console.error(err);
      onShowToast(language === 'NE' ? 'तस्बिर प्रशोधन गर्न समस्या भयो।' : 'Failed to process dropped image.', 'error');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageUrl) {
      onShowToast(language === 'NE' ? 'कृपया पहिले तस्बिर छान्नुहोस् वा URL राख्नुहोस्।' : 'Please provide or upload a photo.', 'error');
      return;
    }

    const finalCategory = category === 'Other' ? (customCategory.trim() || 'General') : category;
    const generatedLikes = generateLikesFromPreset(likePreset, customLikesVal);

    const newMoment: Moment = {
      id: `moment-user-${Date.now()}`,
      titleEn: titleEn.trim() || 'Visual Milestone Moment',
      titleNe: titleNe.trim() || (titleEn.trim() || 'दृश्यात्मक माइलस्टोन'),
      descEn: descEn.trim() || 'Empowering leadership, community collaboration, and technological growth.',
      descNe: descNe.trim() || (descEn.trim() || 'सशक्त नेतृत्व, सामुदायिक सहकार्य र प्राविधिक विकास।'),
      imgUrl: imageUrl,
      likes: generatedLikes,
      category: finalCategory,
      date: eventDate,
      isUserUploaded: true,
      uploadedAt: new Date().toISOString(),
    };

    onAddMoment(newMoment);
    onShowToast(language === 'NE' ? 'नयाँ तस्बिर सफलतापूर्वक ग्यालरीमा थपियो!' : 'New moment uploaded to gallery!', 'success');

    // Reset fields & close
    setImageUrl('');
    setTitleEn('');
    setTitleNe('');
    setDescEn('');
    setDescNe('');
    setCustomCategory('');
    onClose();
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
            className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 my-auto overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100 font-heading">
                    {language === 'NE' ? 'नयाँ तस्बिर अपलोड गर्नुहोस्' : 'Upload New Moment'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language === 'NE' ? 'अनक्रप गरिएको तस्बिर र स्वतः-लाइक्स इन्जिन' : 'Uncropped high-res display with auto-likes engine'}
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

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-1 flex-1">
              
              {/* Photo Source Selector (Upload vs URL) */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setSourceType('upload')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      sourceType === 'upload'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{language === 'NE' ? 'फाइल अपलोड (कम्प्रेस सहित)' : 'Upload File (Auto-Compress)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSourceType('url')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      sourceType === 'url'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span>{language === 'NE' ? 'वेब इमेज लिंक (URL)' : 'Web Image Link (URL)'}</span>
                  </button>
                </div>

                {sourceType === 'upload' ? (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-6 text-center bg-slate-950/60 cursor-pointer transition-colors group"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-slate-500 group-hover:text-blue-400 mx-auto mb-2 transition-colors" />
                    <div className="text-sm font-semibold text-slate-200 mb-1">
                      {isCompressing
                        ? (language === 'NE' ? 'तस्बिर कम्प्रेस गरिँदैछ...' : 'Compressing photo on canvas...')
                        : (language === 'NE' ? 'यहाँ तस्बिर ड्र्याग गर्नुहोस् वा छान्नुहोस्' : 'Click to select or drag photo here')}
                    </div>
                    <div className="text-xs text-slate-500">
                      JPG, PNG, WebP • Auto-optimized for crisp rendering
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... or any image link"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                {/* Photo Preview Box */}
                {imageUrl && (
                  <div className="mt-3 relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-[16/9] flex items-center justify-center">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 p-1.5 rounded-xl bg-rose-600/90 text-white hover:bg-rose-500 transition-colors shadow-lg"
                      title="Clear photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Auto-Likes Engine Selector */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 fill-pink-400" />
                    <span>{language === 'NE' ? 'स्वतः-लाइक्स इन्जिन (Auto-Likes)' : 'Auto-Likes Generator Engine'}</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    Est: ~{formatLikes(generateLikesFromPreset(likePreset, customLikesVal))} likes
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() => setLikePreset('200')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                      likePreset === '200'
                        ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    200+
                  </button>

                  <button
                    type="button"
                    onClick={() => setLikePreset('300')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                      likePreset === '300'
                        ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    300+
                  </button>

                  <button
                    type="button"
                    onClick={() => setLikePreset('1k')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                      likePreset === '1k'
                        ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    1.0k+
                  </button>

                  <button
                    type="button"
                    onClick={() => setLikePreset('random')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                      likePreset === 'random'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    Random
                  </button>

                  <button
                    type="button"
                    onClick={() => setLikePreset('custom')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                      likePreset === 'custom'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {likePreset === 'custom' && (
                  <div className="mt-3">
                    <input
                      type="number"
                      min={0}
                      value={customLikesVal}
                      onChange={(e) => setCustomLikesVal(parseInt(e.target.value, 10) || 0)}
                      placeholder="Enter exact like count"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-pink-500"
                    />
                  </div>
                )}
              </div>

              {/* Bilingual Title Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Keynote Speech at Innovation Summit"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    शीर्षक (नेपाली)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. नवीनता शिखर सम्मेलनमा मुख्य मन्तव्य"
                    value={titleNe}
                    onChange={(e) => setTitleNe(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Bilingual Description Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Description (English)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Highlights and context about this event..."
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    विवरण (नेपाली)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="यस कार्यक्रम वा क्षणको संक्षिप्त विवरण..."
                    value={descNe}
                    onChange={(e) => setDescNe(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>

              {/* Category and Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  >
                    {predefinedCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>

                  {category === 'Other' && (
                    <input
                      type="text"
                      placeholder="Enter custom category name"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="mt-2 w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  {language === 'NE' ? 'रद्द गर्नुहोस्' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'NE' ? 'तस्बिर प्रकाशित गर्नुहोस्' : 'Publish Moment'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
