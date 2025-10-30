import React from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineBanner({ visible }) {
  if (!visible) return null;
  return (
    <div className="mx-auto max-w-md px-4 pt-3">
      <div className="w-full rounded-xl border border-blue-200 bg-blue-50 text-blue-800 px-3 py-2.5 flex items-center gap-2 shadow-sm">
        <WifiOff className="h-5 w-5" />
        <p className="text-sm">Offline mode active • Showing last saved data</p>
      </div>
    </div>
  );
}
