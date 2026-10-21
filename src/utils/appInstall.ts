import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export const APK_DOWNLOAD_URL = '/SmartNeighborhood-v1.0.apk';
export const APK_VERSION = 'v1.0';
export const APK_SIZE = '38 KB (Optimized Release)';
export const APK_SHA256 = '7DDFFF92A7E8642C6F0B98B96D78C7C97DD0461A6E26C07F5F56F183ADB15A26';

export function triggerApkDownload(onSuccess?: () => void) {
  try {
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
  } catch {
    // fallback
  }

  const anchor = document.createElement('a');
  anchor.href = APK_DOWNLOAD_URL;
  anchor.setAttribute('download', 'SmartNeighborhood-v1.0.apk');
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  setTimeout(() => {
    document.body.removeChild(anchor);
    if (onSuccess) onSuccess();
  }, 300);
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      // @ts-ignore
      window.navigator.standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) {
      return false;
    }
    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      setIsInstalled(true);
      setIsInstallable(false);
      try {
        confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 } });
      } catch {}
      return true;
    }
    return false;
  };

  return {
    isInstallable,
    isInstalled,
    promptInstall,
  };
}
