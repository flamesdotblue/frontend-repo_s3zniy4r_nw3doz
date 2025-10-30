import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const formatNumber = (n) => new Intl.NumberFormat('en-IN').format(n ?? 0);

export default function StatCard({ icon: Icon, labelEn, labelHi, value, unit, trend = [], improving }) {
  const points = trend.map((v, i) => `${i * 12},${40 - v}`).join(' ');

  return (
    <div className="rounded-2xl border shadow-md p-4 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500">{labelEn}</span>
            <span className="text-sm font-medium">{labelHi}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold text-slate-900">{unit}{formatNumber(value)}</div>
          <div className={`mt-1 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
            improving ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {improving ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            <span>{improving ? '🟢 improving' : '🔴 declining'}</span>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <svg width="132" height="42" viewBox="0 0 132 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#42A5F5" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#42A5F5" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline points={points} fill="none" stroke="#1E88E5" strokeWidth="2" strokeLinecap="round" />
          <polygon points={`${points} 132,42 0,42`} fill="url(#grad)" opacity="0.6" />
        </svg>
        <p className="text-[11px] text-slate-500">Last 12 months</p>
      </div>
    </div>
  );
}
