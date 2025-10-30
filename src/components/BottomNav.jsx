import React from 'react';
import { Home, BarChart2, Scale, BookOpen } from 'lucide-react';

export default function BottomNav({ tab, onChange }) {
  const items = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { key: 'compare', label: 'Compare', icon: Scale },
    { key: 'glossary', label: 'Glossary', icon: BookOpen },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 border-t bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto max-w-md grid grid-cols-4">
        {items.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex flex-col items-center justify-center gap-1 py-2.5 text-xs ${
              tab === key ? 'text-blue-600' : 'text-slate-600'
            }`}
            aria-current={tab === key ? 'page' : undefined}
          >
            <span className={`h-6 w-6 ${tab === key ? '' : 'opacity-80'}`}>
              <Icon className="h-6 w-6" />
            </span>
            <span className="leading-none">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
