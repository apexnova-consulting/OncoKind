'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getDictionary, normalizeLanguage } from '@/lib/i18n';

type DeferredPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export function PwaRegister() {
  const [installPrompt, setInstallPrompt] = useState<DeferredPrompt | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [lang, setLang] = useState<'en' | 'es' | 'zh-CN' | 'tl'>('en');

  useEffect(() => {
    const fromCookie = document.cookie
      .split('; ')
      .find((c) => c.startsWith('oncokind_lang='))
      ?.split('=')[1];
    const resolved = normalizeLanguage(fromCookie || navigator.language);
    setLang(resolved);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    let reloaded = false;
    let hadActiveController = !!navigator.serviceWorker.controller;
    const onControllerChange = () => {
      if (!hadActiveController) {
        hadActiveController = true;
        return;
      }
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    const register = () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          if (reg.waiting && navigator.serviceWorker.controller) {
            reg.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
          reg.addEventListener('updatefound', () => {
            const w = reg.installing;
            if (!w) return;
            w.addEventListener('statechange', () => {
              if (w.state === 'installed' && navigator.serviceWorker.controller) {
                reg.waiting?.postMessage({ type: 'SKIP_WAITING' });
              }
            });
          });
          void reg.update();
        })
        .catch(() => {});
    };

    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register, { once: true });
    }

    const interval = window.setInterval(() => {
      navigator.serviceWorker.getRegistration().then((reg) => void reg?.update());
    }, 60 * 60 * 1000);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const visits = Number(localStorage.getItem('oncokind_visit_count') ?? '0') + 1;
    localStorage.setItem('oncokind_visit_count', String(visits));

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const deferred = e as DeferredPrompt;
      setInstallPrompt(deferred);
      if (visits >= 2) setShowPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setShowPrompt(false);
    setInstallPrompt(null);
  }

  const t = getDictionary(lang);

  if (!showPrompt || !installPrompt) return null;
  return (
    <div className="fixed bottom-20 right-4 z-[60] max-w-xs rounded-lg border border-slate-200 bg-white p-4 shadow-lg md:bottom-4">
      <p className="font-heading text-sm font-semibold text-accent">{t['pwa.installTitle']}</p>
      <p className="mt-1 text-sm text-slate-600">{t['pwa.installBody']}</p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={handleInstall}>{t['pwa.installAction']}</Button>
        <Button size="sm" variant="outline" onClick={() => setShowPrompt(false)}>Later</Button>
      </div>
    </div>
  );
}
