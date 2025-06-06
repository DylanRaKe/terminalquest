'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Wifi, WifiOff, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineNotification, setShowOfflineNotification] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà installée
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };

    // Gérer l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    // Gérer les changements de statut réseau
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineNotification(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineNotification(true);
      // Masquer la notification après 5 secondes
      setTimeout(() => setShowOfflineNotification(false), 5000);
    };

    // Gérer l'installation réussie
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    checkIfInstalled();
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Vérifier le statut initial
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
      } else {
        console.log('PWA installation dismissed');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Error during PWA installation:', error);
    }
  };

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* Bouton d'installation PWA */}
      <AnimatePresence>
        {showInstallPrompt && !isInstalled && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-4 shadow-2xl border border-purple-500/30 max-w-sm">
              <div className="flex items-start gap-3">
                <div className="bg-white/20 rounded-full p-2">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-sm mb-1">
                    Installer TerminalQuest
                  </h3>
                  <p className="text-white/80 text-xs mb-3">
                    Accédez rapidement à l&apos;app et utilisez-la hors-ligne !
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleInstallClick}
                      className="bg-white text-purple-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-white/90 transition-colors"
                    >
                      Installer
                    </button>
                    <button
                      onClick={dismissInstallPrompt}
                      className="text-white/80 hover:text-white px-2 py-1.5 text-xs transition-colors"
                    >
                      Plus tard
                    </button>
                  </div>
                </div>
                <button
                  onClick={dismissInstallPrompt}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicateur de statut réseau */}
      <div className="fixed top-20 right-4 z-40">
        <AnimatePresence>
          {showOfflineNotification && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="bg-orange-500/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-orange-400/30"
            >
              <div className="flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">
                  Mode hors-ligne
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Indicateur permanent discret */}
        <motion.div
          className={`p-2 rounded-full transition-colors ${
            isOnline 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-orange-500/20 text-orange-400'
          }`}
          animate={{ scale: isOnline ? 1 : [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: isOnline ? 0 : Infinity }}
        >
          {isOnline ? (
            <Wifi className="w-4 h-4" />
          ) : (
            <WifiOff className="w-4 h-4" />
          )}
        </motion.div>
      </div>
    </>
  );
}; 