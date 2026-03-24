'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDictionary, normalizeLanguage } from '@/lib/i18n';

type Option = 'ok' | 'hard' | 'support';

const RESOURCES: Record<Option, Array<{ label: string; href: string }>> = {
  ok: [
    { label: 'CancerCare', href: 'https://www.cancercare.org/' },
  ],
  hard: [
    { label: 'Caregiver Action Network', href: 'https://www.caregiveraction.org/' },
    { label: 'CancerCare Support', href: 'https://www.cancercare.org/support_groups' },
  ],
  support: [
    { label: 'NAMI Support Resources', href: 'https://www.nami.org/Support-Education' },
    { label: 'Caregiver Action Network', href: 'https://www.caregiveraction.org/' },
    { label: 'CancerCare Counseling', href: 'https://www.cancercare.org/counseling' },
  ],
};

export function CaregiverWellbeingCheckin() {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const [lang, setLang] = useState<'en' | 'es' | 'zh-CN' | 'tl'>('en');
  const t = useMemo(() => getDictionary(lang), [lang]);

  useEffect(() => {
    const fromCookie = document.cookie
      .split('; ')
      .find((c) => c.startsWith('oncokind_lang='))
      ?.split('=')[1];
    setLang(normalizeLanguage(fromCookie || navigator.language));

    const now = Date.now();
    const lastShown = Number(localStorage.getItem('oncokind_wellbeing_last_shown') ?? '0');
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    if (!lastShown || now - lastShown > weekMs) {
      setVisible(true);
      localStorage.setItem('oncokind_wellbeing_last_shown', String(now));
    }
  }, []);

  function dismiss() {
    setVisible(false);
  }

  function choose(option: Option) {
    setSelected(option);
    localStorage.setItem('oncokind_wellbeing_response', option);
  }

  if (!visible) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <CardTitle>{t['wellbeing.prompt']}</CardTitle>
        <Button variant="ghost" size="sm" onClick={dismiss}>Dismiss</Button>
      </CardHeader>
      <CardContent>
        {!selected ? (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => choose('ok')}>{t['wellbeing.ok']}</Button>
            <Button variant="outline" onClick={() => choose('hard')}>{t['wellbeing.hard']}</Button>
            <Button variant="outline" onClick={() => choose('support')}>{t['wellbeing.support']}</Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-slate-700">
              {selected === 'ok'
                ? "You're carrying a lot. It's good to keep checking in with yourself."
                : selected === 'hard'
                  ? "You're carrying a lot. It's okay to ask for support."
                  : "You deserve support too. Here are trusted resources you can explore right away."}
            </p>
            <ul className="list-inside list-disc text-sm text-slate-700">
              {RESOURCES[selected].map((r) => (
                <li key={r.href}>
                  <a href={r.href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
