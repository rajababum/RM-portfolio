import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Heart,
  Calendar,
  Tag,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Layers,
  Sparkles,
  Link,
  Plus,
} from 'lucide-react';
import { Language, Moment } from '../types';
import { compressImageFile } from '../utils/imageCompressor';
import { generateLikesFromPreset, formatLikes } from '../utils/likesFormatter';

interface UploadedFileItem {
  id: string;
  dataUrl: string;
  name: string;
  size: number;
}

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
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileItem[]>([]);
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState('');
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

  const processFiles = async (files: FileList | File[]) => {
    const validImageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));

    if (validImageFiles.length === 0) {
      onShowToast(
        language === 'NE'
          ? 'कृपया मान्य तस्बिर फाइलहरू (JPG, PNG, WebP) छान्नुहोस्।'
          : 'Please select valid image files (JPG, PNG, WebP).',
        'error'
      );
      return;
    }

    try {
      setIsCompressing(true);
      const newItems: UploadedFileItem[] = [];

      for (let i = 0; i < validImageFiles.length; i++) {
        const file = validImageFiles[i];
        const compressedDataUrl = await compressImageFile(file, 1400, 0.85);
        newItems.push({
          id: `file-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
          dataUrl: compressedDataUrl,
          name: file.name.replace(/\.[^/.]+$/, ''),
          size: file.size,
        });
      }

      setUploadedFiles((prev) => {
        const combined = [...prev, ...newItems];
        if (prev.length === 0 && newItems.length > 0) {
          setTitleEn(newItems[0].name.replace(/[-_]/g, ' '));
        }
        return combined;
      });

      onShowToast(
        language === 'NE'
          ? `${newItems.length} तस्बिर(हरू) सफलतापूर्वक लोड गरियो!`
          : `${newItems.length} photo(s) processed & compressed successfully!`,
        'success'
      );
    } catch (err) {
      console.error(err);
      onShowToast(
        language === 'NE' ? 'तस्बिर प्रशोधन गर्न समस्या भयो।' : 'Failed to compress image file.',
        'error'
      );
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(e.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveUploadedItem = (indexToRemove: number) => {
    setUploadedFiles((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      if (activeFileIndex >= updated.length) {
        setActiveFileIndex(Math.max(0, updated.length - 1));
      }
      return updated;
    });
  };

  const handleAddUrlPhoto = () => {
    if (!fallbackUrl.trim()) return;
    setUploadedFiles((prev) => [
      ...prev,
      {
        id: `url-${Date.now()}`,
        dataUrl: fallbackUrl.trim(),
        name: 'Web Image',
        size: 0,
      },
    ]);
    setFallbackUrl('');
    setShowUrlFallback(false);
    onShowToast(language === 'NE' ? 'तस्बिर लिंक थपियो!' : 'Image link attached!', 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (uploadedFiles.length === 0) {
      onShowToast(
        language === 'NE'
          ? 'कृपया पहिले आफ्नो डिभाइसबाट तस्बिर अपलोड गर्नुहोस्।'
          : 'Please upload at least one photo from your device.',
        'error'
      );
      return;
    }

    const finalCategory = category === 'Other' ? (customCategory.trim() || 'General') : category;

    // If single image or currently configured
    if (uploadedFiles.length === 1) {
      const targetItem = uploadedFiles[0];
      const generatedLikes = generateLikesFromPreset(likePreset, customLikesVal);

      const newMoment: Moment = {
        id: `moment-user-${Date.now()}`,
        titleEn: titleEn.trim() || targetItem.name || 'Visual Milestone Moment',
        titleNe: titleNe.trim() || (titleEn.trim() || 'दृश्यात्मक माइलस्टोन'),
        descEn: descEn.trim() || 'Empowering leadership, community collaboration, and technological growth.',
        descNe: descNe.trim() || (descEn.trim() || 'सशक्त नेतृत्व, सामुदायिक सहकार्य र प्राविधिक विकास।'),
        imgUrl: targetItem.dataUrl,
        likes: generatedLikes,
        category: finalCategory,
        date: eventDate,
        isUserUploaded: true,
        uploadedAt: new Date().toISOString(),
      };

      onAddMoment(newMoment);
    } else {
      // Multiple images batch upload
      uploadedFiles.forEach((item, index) => {
        const generatedLikes = generateLikesFromPreset(likePreset, customLikesVal);
        const itemTitleEn = index === 0 && titleEn.trim() ? titleEn.trim() : (item.name || `Visual Moment ${index + 1}`);
        const itemTitleNe = index === 0 && titleNe.trim() ? titleNe.trim() : itemTitleEn;

        const newMoment: Moment = {
          id: `moment-user-${Date.now()}-${index}`,
          titleEn: itemTitleEn,
          titleNe: itemTitleNe,
          descEn: descEn.trim() || 'Empowering leadership, community collaboration, and technological growth.',
          descNe: descNe.trim() || 'सशक्त नेतृत्व, सामुदायिक सहकार्य र प्राविधिक विकास।',
          imgUrl: item.dataUrl,
          likes: generatedLikes,
          category: finalCategory,
          date: eventDate,
          isUserUploaded: true,
          uploadedAt: new Date().toISOString(),
        };

        onAddMoment(newMoment);
      });
    }

    onShowToast(
      language === 'NE'
        ? `${uploadedFiles.length} नयाँ तस्बिर(हरू) ग्यालरीमा सुरक्षित भयो!`
        : `${uploadedFiles.length} photo(s) added to gallery!`,
      'success'
    );

    // Reset & close
    setUploadedFiles([]);
    setTitleEn('');
    setTitleNe('');
    setDescEn('');
    setDescNe('');
    setCustomCategory('');
    onClose();
  };

  const currentPreview = uploadedFiles[activeFileIndex] || uploadedFiles[0];

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
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100 font-heading">
                    {language === 'NE' ? 'डिभाइसबाट तस्बिर अपलोड गर्नुहोस्' : 'Direct Photo Upload System'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {language === 'NE'
                      ? 'तपाईँको मोबाइल वा कम्प्युटरबाट सिधै तस्बिर छान्नुहोस् वा ड्र्याग गर्नुहोस्'
                      : 'Select or drag photos directly from phone/PC with canvas auto-compression'}
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
              
              {/* PRIMARY UPLOAD DROP ZONE ON TOP */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                    isDragging
                      ? 'border-blue-500 bg-blue-950/30 scale-[1.01]'
                      : 'border-slate-700 hover:border-blue-500/80 bg-slate-950/70 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/30 group-hover:scale-110 transition-transform">
                      {isCompressing ? (
                        <RefreshCw className="w-7 h-7 animate-spin" />
                      ) : (
                        <Upload className="w-7 h-7" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-100 mb-1 font-heading">
                        {isCompressing
                          ? (language === 'NE' ? 'तस्बिरहरू कम्प्रेस र अप्टिमाइज गरिँदैछ...' : 'Optimizing & Compressing Photos...')
                          : (language === 'NE' ? 'यहाँ थिचेर तस्बिर छान्नुहोस् वा ड्रप गर्नुहोस्' : 'Tap to Browse or Drag Photos Here')}
                      </h4>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        {language === 'NE'
                          ? 'मोबाइल ग्यालरी, क्यामेरा वा कम्प्युटरबाट एक वा धेरै तस्बिरहरू सिधै चयन गर्नुहोस् (JPG, PNG, WebP)'
                          : 'Select one or multiple photos directly from your phone gallery or PC (JPG, PNG, WebP)'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/40 text-[11px] font-semibold text-blue-300">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        {language === 'NE' ? 'अनक्रप एचडी डिस्प्ले' : 'Uncropped High-Res'}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300">
                        <Layers className="w-3 h-3 text-blue-400" />
                        {language === 'NE' ? 'मल्टी-अपलोड सपोर्ट' : 'Batch Upload Ready'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Optional Web URL Accordion Trigger */}
                <div className="mt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowUrlFallback(!showUrlFallback)}
                    className="text-[11px] text-slate-400 hover:text-blue-400 flex items-center gap-1 transition-colors"
                  >
                    <Link className="w-3 h-3" />
                    <span>{language === 'NE' ? 'वा बाह्य इमेज लिंक (URL) प्रयोग गर्नुहोस्' : 'Or attach an external image link'}</span>
                  </button>

                  {uploadedFiles.length > 0 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{language === 'NE' ? 'थप तस्बिर जोड्नुहोस्' : 'Add more photos'}</span>
                    </button>
                  )}
                </div>

                {showUrlFallback && (
                  <div className="mt-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={fallbackUrl}
                      onChange={(e) => setFallbackUrl(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrlPhoto}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shrink-0"
                    >
                      {language === 'NE' ? 'लिंक जोड्नुहोस्' : 'Attach Link'}
                    </button>
                  </div>
                )}

                {/* Uploaded Photos Preview Reel */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-200">
                          {language === 'NE' ? 'अपलोड गरिएका तस्बिरहरू' : 'Selected Photos'} ({uploadedFiles.length})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadedFiles([])}
                        className="text-[11px] text-rose-400 hover:text-rose-300 font-medium"
                      >
                        {language === 'NE' ? 'सबै हटाउनुहोस्' : 'Clear all'}
                      </button>
                    </div>

                    {/* Thumbnail queue */}
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                      {uploadedFiles.map((item, idx) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setActiveFileIndex(idx);
                            setTitleEn(item.name.replace(/[-_]/g, ' '));
                          }}
                          className={`relative shrink-0 w-20 h-20 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group ${
                            activeFileIndex === idx
                              ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/20'
                              : 'border-slate-800 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={item.dataUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveUploadedItem(idx);
                            }}
                            className="absolute top-1 right-1 p-1 rounded-lg bg-slate-950/80 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Active Uncropped Preview */}
                    {currentPreview && (
                      <div className="mt-3 relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 p-2 flex items-center justify-center min-h-[200px] max-h-[280px]">
                        <img
                          src={currentPreview.dataUrl}
                          alt={currentPreview.name}
                          className="max-h-[260px] max-w-full object-contain rounded-xl drop-shadow-xl"
                        />
                        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur text-[11px] font-mono text-slate-300 border border-slate-800">
                          {currentPreview.name}
                        </div>
                      </div>
                    )}
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
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none focus:border-pink-500"
                    />
                  </div>
                )}
              </div>

              {/* Title & Description Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {language === 'NE' ? 'शीर्षक (अंग्रेजी)' : 'Moment Title (English)'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Community Tech Summit 2026"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {language === 'NE' ? 'शीर्षक (नेपाली)' : 'Moment Title (Nepali)'}
                    </label>
                    <input
                      type="text"
                      placeholder="उदा: सामुदायिक प्रविधि सम्मेलन"
                      value={titleNe}
                      onChange={(e) => setTitleNe(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {language === 'NE' ? 'विवरण (अंग्रेजी)' : 'Description (English)'}
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Key highlights and context of this moment..."
                      value={descEn}
                      onChange={(e) => setDescEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {language === 'NE' ? 'विवरण (नेपाली)' : 'Description (Nepali)'}
                    </label>
                    <textarea
                      rows={2}
                      placeholder="यस क्षणका मुख्य उपलब्धि र सन्दर्भ..."
                      value={descNe}
                      onChange={(e) => setDescNe(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>

                {/* Category & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-blue-400" />
                      <span>{language === 'NE' ? 'विधा / श्रेणी' : 'Category'}</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
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
                        placeholder="Custom category name"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="mt-2 w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{language === 'NE' ? 'मिति' : 'Event Date'}</span>
                    </label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  {language === 'NE' ? 'रद्द गर्नुहोस्' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={uploadedFiles.length === 0 || isCompressing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {language === 'NE'
                      ? `${uploadedFiles.length || 1} तस्बिर ग्यालरीमा राख्नुहोस्`
                      : `Save ${uploadedFiles.length || 1} Photo(s) to Gallery`}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
