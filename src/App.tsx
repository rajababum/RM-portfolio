/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { AboutSection } from './components/AboutSection';
import { JourneySection } from './components/JourneySection';
import { ExperienceSection } from './components/ExperienceSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { PhotoUploadModal } from './components/PhotoUploadModal';
import { EditMomentModal } from './components/EditMomentModal';
import { AdminSystemModal } from './components/AdminSystemModal';
import { AdminShieldOverlay } from './components/AdminShieldOverlay';
import { ToastContainer, ToastMessage } from './components/Toast';

import { Language, Moment, Comment, SystemSettings } from './types';
import {
  STORAGE_KEYS,
  DEFAULT_SYSTEM_SETTINGS,
  DEFAULT_MOMENTS,
  DEFAULT_COMMENTS_MAP,
} from './data/defaults';

export default function App() {
  // 1. Language State
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return saved === 'NE' || saved === 'EN' ? saved : 'EN';
  });

  // 2. Admin Authentication State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });

  // 3. System Settings State (Profile, About, Experience, Contact, AutoLikes)
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SYSTEM_SETTINGS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load system settings from localStorage', e);
    }
    return DEFAULT_SYSTEM_SETTINGS;
  });

  // 4. Moments Gallery State (Permanent persistence with deletion tombstone protection)
  const [moments, setMoments] = useState<Moment[]>(() => {
    try {
      const deletedIdsStr = localStorage.getItem(STORAGE_KEYS.DELETED_MOMENT_IDS);
      const deletedIds: string[] = deletedIdsStr ? JSON.parse(deletedIdsStr) : [];

      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_MOMENTS);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Permanently filter out any deleted photos
          return parsed.filter((m: Moment) => !deletedIds.includes(m.id));
        }
      }
      // If first launch, load defaults excluding any permanently deleted IDs
      return DEFAULT_MOMENTS.filter((m) => !deletedIds.includes(m.id));
    } catch (e) {
      console.error('Failed to load moments from localStorage', e);
    }
    return DEFAULT_MOMENTS;
  });

  // 5. Comments Map State
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMMENTS_MAP);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load comments from localStorage', e);
    }
    return DEFAULT_COMMENTS_MAP;
  });

  // 6. User Liked Moments (Browser state)
  const [userLikedMoments, setUserLikedMoments] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_LIKED_MOMENTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load liked moments', e);
    }
    return [];
  });

  // 7. Modals & UI Overlays
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);
  const [editingMoment, setEditingMoment] = useState<Moment | null>(null);
  const [isAdminShieldOpen, setIsAdminShieldOpen] = useState(false);

  // 8. Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SYSTEM_SETTINGS, JSON.stringify(systemSettings));
    } catch (e) {
      console.error('Failed to save system settings', e);
    }
  }, [systemSettings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_MOMENTS, JSON.stringify(moments));
    } catch (e) {
      console.error('Failed to save moments', e);
    }
  }, [moments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMMENTS_MAP, JSON.stringify(commentsMap));
    } catch (e) {
      console.error('Failed to save comments', e);
    }
  }, [commentsMap]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_LIKED_MOMENTS, JSON.stringify(userLikedMoments));
    } catch (e) {
      console.error('Failed to save user liked moments', e);
    }
  }, [userLikedMoments]);

  // Handlers
  const handleToggleLanguage = () => {
    const nextLang = language === 'EN' ? 'NE' : 'EN';
    setLanguage(nextLang);
    showToast(
      nextLang === 'NE' ? 'भाषा नेपालीमा परिवर्तन गरियो' : 'Language switched to English',
      'info'
    );
  };

  const handleSecretAdminLogin = () => {
    setIsAdmin(true);
    setIsAdminShieldOpen(true);
    showToast(
      language === 'NE' ? 'गोप्य प्रशासक प्रमाणीकरण सफल भयो!' : 'Secret Administrator access verified!',
      'success'
    );
  };

  const handleConfirmShieldClose = () => {
    setIsAdminShieldOpen(false);
    // Smooth scroll to gallery
    const journeyEl = document.getElementById('journey');
    if (journeyEl) {
      journeyEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoutAdmin = () => {
    setIsAdmin(false);
    showToast(
      language === 'NE' ? 'प्रशासक मोडबाट लगआउट भयो।' : 'Logged out of Admin Mode.',
      'info'
    );
  };

  const handleAddMoment = (newMoment: Moment) => {
    // If this ID was previously marked deleted, remove it from tombstone blacklist
    try {
      const deletedIdsStr = localStorage.getItem(STORAGE_KEYS.DELETED_MOMENT_IDS);
      if (deletedIdsStr) {
        const deletedIds: string[] = JSON.parse(deletedIdsStr);
        const nextDeleted = deletedIds.filter((id) => id !== newMoment.id);
        localStorage.setItem(STORAGE_KEYS.DELETED_MOMENT_IDS, JSON.stringify(nextDeleted));
      }
    } catch (e) {
      console.error(e);
    }
    setMoments((prev) => [newMoment, ...prev]);
  };

  const handleUpdateMoment = (updated: Moment) => {
    setMoments((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleDeleteMoment = (id: string) => {
    // 1. Permanently record this ID into deleted blacklist in localStorage
    try {
      const deletedIdsStr = localStorage.getItem(STORAGE_KEYS.DELETED_MOMENT_IDS);
      const deletedIds: string[] = deletedIdsStr ? JSON.parse(deletedIdsStr) : [];
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem(STORAGE_KEYS.DELETED_MOMENT_IDS, JSON.stringify(deletedIds));
      }
    } catch (e) {
      console.error('Failed to update permanent deleted IDs', e);
    }

    // 2. Remove photo permanently from moments state and immediate localStorage
    setMoments((prev) => {
      const remaining = prev.filter((m) => m.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_MOMENTS, JSON.stringify(remaining));
      } catch (e) {
        console.error('Failed to persist moments after deletion', e);
      }
      return remaining;
    });

    // 3. Purge associated comments from state and localStorage
    setCommentsMap((prev) => {
      const nextComments = { ...prev };
      delete nextComments[id];
      try {
        localStorage.setItem(STORAGE_KEYS.COMMENTS_MAP, JSON.stringify(nextComments));
      } catch (e) {
        console.error('Failed to clean comments', e);
      }
      return nextComments;
    });

    // 4. Purge from user liked moments
    setUserLikedMoments((prev) => {
      const nextLikes = prev.filter((item) => item !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.USER_LIKED_MOMENTS, JSON.stringify(nextLikes));
      } catch (e) {
        console.error('Failed to clean likes', e);
      }
      return nextLikes;
    });
  };

  const handleLikeMoment = (id: string) => {
    const isAlreadyLiked = userLikedMoments.includes(id);

    if (isAlreadyLiked) {
      // Unlike
      setUserLikedMoments((prev) => prev.filter((item) => item !== id));
      setMoments((prev) =>
        prev.map((m) => (m.id === id ? { ...m, likes: Math.max(0, m.likes - 1) } : m))
      );
      showToast(language === 'NE' ? 'प्रतिक्रिया हटाइयो' : 'Like removed', 'info');
    } else {
      // Like
      setUserLikedMoments((prev) => [...prev, id]);
      setMoments((prev) =>
        prev.map((m) => (m.id === id ? { ...m, likes: m.likes + 1 } : m))
      );
      showToast(language === 'NE' ? 'तपाईँको प्रतिक्रिया सुरक्षित भयो! ❤️' : 'Thanks for your like! ❤️', 'success');
    }
  };

  const handleAutoBoostAllLikes = () => {
    const minRange = systemSettings.autoLikes.defaultBoostRangeMin || 150;
    const maxRange = systemSettings.autoLikes.defaultBoostRangeMax || 450;

    setMoments((prev) =>
      prev.map((m) => {
        const boost = Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
        return {
          ...m,
          likes: m.likes + boost,
        };
      })
    );

    showToast(
      language === 'NE'
        ? '⚡ सबै ग्यालरी तस्बिरहरूमा स्वतः लाइक्स वृद्धि गरियो!'
        : '⚡ Auto-boost applied! Photo engagement updated across gallery.',
      'success'
    );
  };

  const handleAddComment = (momentId: string, author: string, text: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      momentId,
      author,
      text,
      createdAt: new Date().toISOString(),
    };

    setCommentsMap((prev) => {
      const currentList = prev[momentId] || [];
      return {
        ...prev,
        [momentId]: [newComment, ...currentList],
      };
    });
  };

  const handleDeleteComment = (momentId: string, commentId: string) => {
    setCommentsMap((prev) => {
      const currentList = prev[momentId] || [];
      const updatedList = currentList.filter((c) => c.id !== commentId);
      const nextMap = { ...prev, [momentId]: updatedList };
      try {
        localStorage.setItem(STORAGE_KEYS.COMMENTS_MAP, JSON.stringify(nextMap));
      } catch (e) {
        console.error(e);
      }
      return nextMap;
    });
    showToast(
      language === 'NE' ? 'प्रतिक्रिया हटाइयो।' : 'Comment deleted.',
      'info'
    );
  };

  const handleSaveSystemSettings = (updated: SystemSettings) => {
    setSystemSettings(updated);
  };

  const handleResetToDefaults = () => {
    setSystemSettings(DEFAULT_SYSTEM_SETTINGS);
    const deletedIdsStr = localStorage.getItem(STORAGE_KEYS.DELETED_MOMENT_IDS);
    const deletedIds: string[] = deletedIdsStr ? JSON.parse(deletedIdsStr) : [];
    const nonDeletedMoments = DEFAULT_MOMENTS.filter((m) => !deletedIds.includes(m.id));
    setMoments(nonDeletedMoments);
    setCommentsMap(DEFAULT_COMMENTS_MAP);
    setUserLikedMoments([]);
  };

  const totalMoments = moments.length;
  const totalLikes = moments.reduce((acc, m) => acc + (m.likes || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Secret Admin Unlock Overlay */}
      <AdminShieldOverlay
        isOpen={isAdminShieldOpen}
        onClose={handleConfirmShieldClose}
        language={language}
      />

      {/* Sticky Navigation Bar */}
      <Navbar
        language={language}
        onToggleLanguage={handleToggleLanguage}
        isAdmin={isAdmin}
        onLogoutAdmin={handleLogoutAdmin}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenSystemModal={() => setIsSystemModalOpen(true)}
        profile={systemSettings.profile}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Header
          language={language}
          profile={systemSettings.profile}
          isAdmin={isAdmin}
          onOpenSystemModal={() => setIsSystemModalOpen(true)}
          totalMoments={totalMoments}
          totalLikes={totalLikes}
        />

        {/* About Section */}
        <AboutSection
          language={language}
          about={systemSettings.about}
        />

        {/* Visual Journey & Uncropped Photo Gallery */}
        <JourneySection
          language={language}
          moments={moments}
          isAdmin={isAdmin}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
          onOpenEditModal={(m) => setEditingMoment(m)}
          onDeleteMoment={handleDeleteMoment}
          onLikeMoment={handleLikeMoment}
          userLikedMoments={userLikedMoments}
          onAutoBoostAllLikes={handleAutoBoostAllLikes}
          commentsMap={commentsMap}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          onShowToast={showToast}
        />

        {/* Experience & Competencies Section */}
        <ExperienceSection
          language={language}
          experience={systemSettings.experience}
        />

        {/* Contact Section & Secret Admin Login Gateway */}
        <ContactSection
          language={language}
          contact={systemSettings.contact}
          onSecretAdminLogin={handleSecretAdminLogin}
          onShowToast={showToast}
        />
      </main>

      {/* Footer */}
      <Footer language={language} profile={systemSettings.profile} />

      {/* Admin Photo Upload Modal */}
      <PhotoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        language={language}
        onAddMoment={handleAddMoment}
        onShowToast={showToast}
      />

      {/* Edit Moment Metadata & Likes Modal */}
      <EditMomentModal
        moment={editingMoment}
        isOpen={!!editingMoment}
        onClose={() => setEditingMoment(null)}
        language={language}
        onUpdateMoment={handleUpdateMoment}
        onDeleteMoment={handleDeleteMoment}
        onShowToast={showToast}
      />

      {/* System-Wide Admin CMS Modal */}
      <AdminSystemModal
        isOpen={isSystemModalOpen}
        onClose={() => setIsSystemModalOpen(false)}
        language={language}
        systemSettings={systemSettings}
        onSaveSystemSettings={handleSaveSystemSettings}
        onResetToDefaults={handleResetToDefaults}
        onAutoBoostAllLikes={handleAutoBoostAllLikes}
        onShowToast={showToast}
        moments={moments}
        onDeleteMoment={handleDeleteMoment}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />
    </div>
  );
}
