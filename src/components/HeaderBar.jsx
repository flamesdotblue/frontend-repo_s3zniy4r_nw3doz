import React from 'react';
import { Globe, Volume2, Type } from 'lucide-react';

const LANG_LABELS = {
  en: 'English',
  hi: 'हिंदी',
  awa: 'Awadhi',
  bho: 'Bhojpuri',
};

export default function HeaderBar({ language, onLanguageChange, highContrast, onToggleContrast, largeText, onToggleText }) {
  return (
    <header className="w-full sticky top-0 z-20">
      <div
        className="px-4 py-3 text-white"
        style={{
          background: 'linear-gradient(135deg, #1565C0, #42A5F5)',
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center shadow-md">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold leading-tight">DistrictConnect</p>
              <p className="text-xs opacity-80 leading-tight">MGNREGA • Uttar Pradesh</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              aria-label="Language"
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="text-sm bg-white/10 border border-white/20 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-white/40 shadow-sm"
            >
              {Object.entries(LANG_LABELS).map(([code, label]) => (
                <option key={code} value={code} className="text-black">{label}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={onToggleText}
              className={`p-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition shadow-sm ${largeText ? 'ring-2 ring-white/40' : ''}`}
              aria-pressed={largeText}
              aria-label="Toggle large text"
              title="Text size"
            >
              <Type className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={onToggleContrast}
              className={`p-2 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition shadow-sm ${highContrast ? 'ring-2 ring-white/40' : ''}`}
              aria-pressed={highContrast}
              aria-label="Toggle high contrast"
              title="High contrast"
            >
              <Volume2 className="h-5 w-5 rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
