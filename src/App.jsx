import React, { useEffect, useMemo, useState } from 'react';
import HeaderBar from './components/HeaderBar';
import BottomNav from './components/BottomNav';
import OfflineBanner from './components/OfflineBanner';
import StatCard from './components/StatCard';
import { Users, Briefcase, IndianRupee, CheckCircle2, Volume2 } from 'lucide-react';

const numberIN = (n) => new Intl.NumberFormat('en-IN').format(n ?? 0);

export default function App() {
  const [tab, setTab] = useState('home');
  const [language, setLanguage] = useState('en');
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [offline, setOffline] = useState(false);
  const [district, setDistrict] = useState('Lucknow');
  const [stateName] = useState('Uttar Pradesh');
  const [meta, setMeta] = useState({ updatedAt: null, source: 'data.gov.in' });
  const [metrics, setMetrics] = useState(null);
  const [compare, setCompare] = useState(null);

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        // Auto-resolve district
        const res = await fetch(`${baseUrl}/api/v1/geo/resolve`, { signal: controller.signal });
        if (!res.ok) throw new Error('geo failed');
        const data = await res.json();
        if (data?.district) setDistrict(data.district);
      } catch {
        setOffline(true);
      }
    })();
    return () => controller.abort();
  }, [baseUrl]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const perfRes = await fetch(`${baseUrl}/api/v1/performance/${encodeURIComponent(district)}?months=12`, { signal: controller.signal });
        const cmpRes = await fetch(`${baseUrl}/api/v1/compare/${encodeURIComponent(district)}`, { signal: controller.signal });
        if (!perfRes.ok || !cmpRes.ok) throw new Error('api');
        const perf = await perfRes.json();
        const cmp = await cmpRes.json();
        setMetrics(perf);
        setCompare(cmp);
        setMeta({ updatedAt: perf?.updatedAt || null, source: 'data.gov.in' });
        setOffline(false);
      } catch {
        setOffline(true);
        // Fallback demo data for offline mode
        const demo = {
          householdsWorked: 12450,
          personDays: 452310,
          avgWage: 228,
          worksCompleted: 385,
          trends: {
            householdsWorked: [10,12,13,14,15,16,18,19,17,18,19,20],
            personDays: [8,9,10,12,12,14,15,16,15,16,17,18],
            avgWage: [20,19,20,21,22,22,23,24,25,25,26,27],
            worksCompleted: [4,5,5,6,6,7,7,8,8,9,9,10],
          },
          summary: {
            wageDelta: 32,
            wageImproved: true,
          }
        };
        setMetrics(demo);
        setCompare({ district: { score: 114 }, state: { score: 100 } });
        setMeta({ updatedAt: new Date().toISOString(), source: 'cached' });
      }
    })();
    return () => controller.abort();
  }, [baseUrl, district]);

  const speak = (text) => {
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'hi-IN';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch {
      // no-op
    }
  };

  const summaryText = useMemo(() => {
    const delta = metrics?.summary?.wageDelta ?? 0;
    if (language === 'hi') return `आपके जिले की औसत मज़दूरी पिछले महीने से ₹${delta} सुधरी है।`;
    if (language === 'awa') return `तोहरे जिलेमी औसत मजूरी पिछला महीना से ₹${delta} बढ़ि गय बा।`;
    if (language === 'bho') return `रउरा जिला के औसत मजूरी पिचला महीना से ₹${delta} बढ़ल बा।`;
    return `Your district’s average wage improved by ₹${delta} since last month.`;
  }, [language, metrics]);

  const containerClasses = [
    'min-h-screen pb-16',
    highContrast ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900',
    largeText ? 'text-[17px]' : 'text-[15px]'
  ].join(' ');

  const labels = {
    households: language === 'hi' ? 'काम किए परिवार' : language === 'bho' ? 'काम कइले घर' : language === 'awa' ? 'काम कइले घर' : 'Households Worked',
    personDays: language === 'hi' ? 'व्यक्ति-दिवस' : language === 'bho' ? 'पर्सन-डेज' : language === 'awa' ? 'पर्सन-डेज' : 'Person-Days',
    avgWage: language === 'hi' ? 'औसत मज़दूरी' : language === 'bho' ? 'औसत मजूरी' : language === 'awa' ? 'औसत मजूरी' : 'Average Wage',
    worksCompleted: language === 'hi' ? 'पूर्ण कार्य' : language === 'bho' ? 'पूरा भइल काम' : language === 'awa' ? 'पूरा काम' : 'Works Completed',
    viewBtn: language === 'hi' ? '📊 अपने ज़िले का प्रदर्शन देखें' : language === 'bho' ? '📊 अपन जिला के परफॉर्मेंस देखीं' : language === 'awa' ? '📊 अपन ज़िला देखब' : "📊 View My District’s Performance",
    lastUpdated: language === 'hi' ? 'अंतिम अद्यतन' : language === 'bho' ? 'आखिरी अपडेट' : language === 'awa' ? 'अंतिम अपडेट' : 'Last updated',
    source: language === 'hi' ? 'स्रोत' : 'Source',
    yourDistrict: language === 'hi' ? 'आपका ज़िला' : 'Your District',
    stateAvg: language === 'hi' ? 'उत्तर प्रदेश औसत' : 'Uttar Pradesh Avg',
    glossary: language === 'hi' ? 'शब्दावली' : 'Glossary',
    compareSummaryPrefix: language === 'hi' ? 'आपका ज़िला राज्य औसत से' : 'Your district performed',
    compareSummarySuffix: language === 'hi' ? 'ऊपर रहा।' : 'above the state average.',
  };

  return (
    <div className={containerClasses}>
      <HeaderBar
        language={language}
        onLanguageChange={setLanguage}
        highContrast={highContrast}
        onToggleContrast={() => setHighContrast((v) => !v)}
        largeText={largeText}
        onToggleText={() => setLargeText((v) => !v)}
      />

      <OfflineBanner visible={offline} />

      {/* Home Screen */}
      {tab === 'home' && (
        <main className="mx-auto max-w-md">
          <div className="px-4 pt-4">
            <div className="rounded-2xl overflow-hidden shadow-md" style={{ background: 'linear-gradient(135deg, #1565C0, #42A5F5)' }}>
              <div className="p-5 text-white">
                <p className="text-sm/5 opacity-90">{stateName}</p>
                <h1 className="text-2xl font-semibold">{district}</h1>
                <button
                  onClick={() => setTab('dashboard')}
                  className="mt-5 w-full bg-white text-blue-700 font-semibold rounded-xl py-3 shadow hover:shadow-md active:shadow-sm transition"
                >
                  {labels.viewBtn}
                </button>
                <div className="mt-3 text-xs/5 opacity-90">
                  <p>{labels.lastUpdated}: {meta.updatedAt ? new Date(meta.updatedAt).toLocaleString() : '-'}</p>
                  <p>{labels.source}: {meta.source}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 mt-4">
            <label className="text-sm block mb-1">{language === 'hi' ? 'ज़िला चुनें' : 'Choose District'}</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full rounded-xl border bg-white px-3 py-2 shadow-sm"
            >
              {['Lucknow','Kanpur Nagar','Varanasi','Gorakhpur','Prayagraj','Agra'].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="px-4 mt-4">
            <div className="rounded-xl border p-3 flex items-center justify-between bg-white shadow-sm">
              <div className="text-sm">
                <p className="font-medium">Voice Assist</p>
                <p className="text-xs text-slate-500">{language === 'hi' ? 'हिंदी में पढ़कर सुनाएँ' : 'Read Hindi summary aloud'}</p>
              </div>
              <button
                onClick={() => speak(summaryText)}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-white"
                style={{ background: 'linear-gradient(135deg, #1565C0, #42A5F5)' }}
              >
                <Volume2 className="h-5 w-5" /> {language === 'hi' ? 'सुनें' : 'Listen'}
              </button>
            </div>
          </div>
        </main>
      )}

      {/* Dashboard */}
      {tab === 'dashboard' && (
        <main className="mx-auto max-w-md px-4 pt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <StatCard
              icon={Users}
              labelEn="Households Worked"
              labelHi={labels.households}
              value={metrics?.householdsWorked}
              unit=""
              trend={(metrics?.trends?.householdsWorked || []).map((v) => v * 2)}
              improving={true}
            />
            <StatCard
              icon={Briefcase}
              labelEn="Person-Days Generated"
              labelHi={labels.personDays}
              value={metrics?.personDays}
              unit=""
              trend={(metrics?.trends?.personDays || []).map((v) => v * 2)}
              improving={true}
            />
            <StatCard
              icon={IndianRupee}
              labelEn="Average Wage"
              labelHi={labels.avgWage}
              value={metrics?.avgWage}
              unit="₹"
              trend={(metrics?.trends?.avgWage || []).map((v) => v * 2)}
              improving={metrics?.summary?.wageImproved}
            />
            <StatCard
              icon={CheckCircle2}
              labelEn="Works Completed"
              labelHi={labels.worksCompleted}
              value={metrics?.worksCompleted}
              unit=""
              trend={(metrics?.trends?.worksCompleted || []).map((v) => v * 2)}
              improving={true}
            />
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-md">
            <p className="text-sm">{summaryText}</p>
          </div>
        </main>
      )}

      {/* Compare */}
      {tab === 'compare' && (
        <main className="mx-auto max-w-md px-4 pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border bg-white p-4 shadow-md">
              <p className="text-xs text-slate-500">{labels.yourDistrict}</p>
              <p className="text-xl font-semibold mt-1">{numberIN(compare?.district?.score || 0)}</p>
              <div className="mt-2 h-20 flex items-end gap-1">
                {[60, 65, 70, 80, 90, 100, 114].map((h, i) => (
                  <div key={i} className="w-4 bg-blue-500/70 rounded-t" style={{ height: `${Math.min(100, h)}%` }} />
                ))}
              </div>
            </div>
            <div className="rounded-2xl border bg-white p-4 shadow-md">
              <p className="text-xs text-slate-500">{labels.stateAvg}</p>
              <p className="text-xl font-semibold mt-1">{numberIN(compare?.state?.score || 0)}</p>
              <div className="mt-2 h-20 flex items-end gap-1">
                {[60, 62, 65, 70, 85, 95, 100].map((h, i) => (
                  <div key={i} className="w-4 bg-slate-400/70 rounded-t" style={{ height: `${Math.min(100, h)}%` }} />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-md">
            <p className="text-sm">
              {labels.compareSummaryPrefix} {Math.max(0, ((compare?.district?.score || 0) - (compare?.state?.score || 0)))}% {labels.compareSummarySuffix}
            </p>
          </div>
        </main>
      )}

      {/* Glossary */}
      {tab === 'glossary' && (
        <main className="mx-auto max-w-md px-4 pt-4 space-y-3">
          {[
            { key: 'jobcard', en: 'Job Card', hi: 'जॉब कार्ड', desc: 'काम के अधिकार का पहचान पत्र।' },
            { key: 'persondays', en: 'Person-Days', hi: 'व्यक्ति-दिवस', desc: 'एक व्यक्ति द्वारा किया गया एक दिन का काम।' },
            { key: 'muster', en: 'Muster Roll', hi: 'मस्टर रोल', desc: 'काम पर उपस्थित श्रमिकों की सूची।' },
            { key: 'fto', en: 'FTO', hi: 'FTO', desc: 'Fund Transfer Order — मजदूरी भुगतान का आदेश।' },
          ].map((item) => (
            <div key={item.key} className="rounded-2xl border bg-white p-4 shadow-md flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{language === 'hi' ? item.hi : item.en}</p>
                <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
              </div>
              <button
                onClick={() => speak(`${item.hi}. ${item.desc}`)}
                className="shrink-0 h-9 px-3 rounded-lg text-white"
                style={{ background: 'linear-gradient(135deg, #1565C0, #42A5F5)' }}
              >
                🎧
              </button>
            </div>
          ))}
        </main>
      )}

      <div className="h-16" />
      <BottomNav tab={tab} onChange={setTab} />
    </div>
  );
}
