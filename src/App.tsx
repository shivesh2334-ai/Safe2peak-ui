/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Mountain, 
  Wind, 
  Thermometer, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Search,
  Navigation,
  Droplets,
  Clock,
  ShieldAlert,
  MessageSquareText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip
} from 'recharts';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { POPULAR_PEAKS, type PeakData } from './types';
import { getSafetyAdvice } from './services/geminiService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [selectedPeak, setSelectedPeak] = useState<PeakData>(POPULAR_PEAKS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [liveData, setLiveData] = useState({ temp: 0, wind: 0 });

  useEffect(() => {
    setLiveData({ temp: selectedPeak.currentTemp, wind: selectedPeak.windSpeed });
    
    const interval = setInterval(() => {
      setLiveData(prev => ({
        temp: prev.temp + (Math.random() * 0.4 - 0.2),
        wind: Math.max(0, prev.wind + (Math.random() * 2 - 1))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedPeak]);

  const filteredPeaks = useMemo(() => {
    return POPULAR_PEAKS.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSymptomToggle = (symptom: string) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    );
  };

  const generateAdvice = async () => {
    setIsGenerating(true);
    const advice = await getSafetyAdvice(selectedPeak.name, selectedPeak.elevation, symptoms);
    setAiAdvice(advice);
    setIsGenerating(false);
  };

  const safetyData = [
    { name: 'Safety', value: selectedPeak.safetyScore },
    { name: 'Risk', value: 100 - selectedPeak.safetyScore },
  ];

  const COLORS = [
    selectedPeak.safetyScore > 70 ? '#10B981' : selectedPeak.safetyScore > 40 ? '#F59E0B' : '#EF4444',
    '#1F2937'
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-safety-orange/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-safety-orange rounded-lg flex items-center justify-center">
            <Mountain className="w-5 h-5 text-black" />
          </div>
          <span className="font-bold text-xl tracking-tighter">SAFE2PEAK</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
          <a href="#" className="hover:text-white transition-colors">DASHBOARD</a>
          <a href="#" className="hover:text-white transition-colors">PEAK FINDER</a>
          <a href="#" className="hover:text-white transition-colors">SAFETY PROTOCOLS</a>
          <a href="#" className="hover:text-white transition-colors">COMMUNITY</a>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search peaks..."
              className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-safety-orange/50 transition-colors w-48"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-white/90 transition-colors">
            CONNECT
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="relative mb-12 rounded-3xl overflow-hidden h-[400px] flex items-end p-12">
          <div className="absolute inset-0 z-0">
            <img 
              src={`https://picsum.photos/seed/${selectedPeak.name}/1920/1080`} 
              alt={selectedPeak.name}
              className="w-full h-full object-cover opacity-60 scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          </div>
          
          <div className="relative z-10 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={selectedPeak.name + "-meta"}
                className="flex items-center gap-2 text-safety-orange font-mono text-xs mb-2 tracking-widest uppercase"
              >
                <Navigation className="w-3 h-3" />
                {selectedPeak.location}
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={selectedPeak.name}
                className="text-6xl md:text-8xl font-bold tracking-tighter leading-none"
              >
                {selectedPeak.name.toUpperCase()}
              </motion.h1>
            </div>
            
            <div className="flex gap-4">
              <div className="glass rounded-2xl p-4 min-w-[120px]">
                <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Elevation</div>
                <div className="text-2xl font-mono font-bold">{selectedPeak.elevation}m</div>
              </div>
              <div className="glass rounded-2xl p-4 min-w-[120px]">
                <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Difficulty</div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  <Activity className={cn(
                    "w-5 h-5",
                    selectedPeak.difficulty === 'Extreme' ? 'text-danger-red' : 'text-safety-orange'
                  )} />
                  {selectedPeak.difficulty}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Peak Selector & Weather */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass rounded-3xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Peak Selection</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredPeaks.map((peak) => (
                  <button
                    key={peak.name}
                    onClick={() => setSelectedPeak(peak)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-xl transition-all group",
                      selectedPeak.name === peak.name ? "bg-white text-black" : "hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Mountain className={cn("w-4 h-4", selectedPeak.name === peak.name ? "text-black" : "text-white/40")} />
                      <span className="font-medium text-sm">{peak.name}</span>
                    </div>
                    <ChevronRight className={cn("w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity", selectedPeak.name === peak.name && "text-black")} />
                  </button>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Live Conditions</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <Thermometer className="w-5 h-5 text-summit-blue mb-2" />
                  <div className="text-2xl font-mono font-bold">{liveData.temp.toFixed(1)}°C</div>
                  <div className="text-[10px] text-white/40 uppercase font-bold">Temperature</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <Wind className="w-5 h-5 text-white/60 mb-2" />
                  <div className="text-2xl font-mono font-bold">{liveData.wind.toFixed(0)} km/h</div>
                  <div className="text-[10px] text-white/40 uppercase font-bold">Wind Speed</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <Droplets className="w-5 h-5 text-summit-blue mb-2" />
                  <div className="text-2xl font-mono font-bold">12%</div>
                  <div className="text-[10px] text-white/40 uppercase font-bold">Humidity</div>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <Clock className="w-5 h-5 text-safety-orange mb-2" />
                  <div className="text-2xl font-mono font-bold">06:42</div>
                  <div className="text-[10px] text-white/40 uppercase font-bold">Local Time</div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column: Safety Analysis */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass rounded-3xl p-8 flex flex-col items-center text-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-2">Safety Score</h3>
              <div className="relative w-full h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={safetyData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      startAngle={180}
                      endAngle={-180}
                    >
                      {safetyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold tracking-tighter">{selectedPeak.safetyScore}</span>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Index</span>
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                {selectedPeak.status === 'Open' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : selectedPeak.status === 'Caution' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                )}
                <span className="text-sm font-bold uppercase tracking-widest">
                  STATUS: {selectedPeak.status}
                </span>
              </div>
              
              <p className="mt-6 text-sm text-white/60 leading-relaxed">
                Current conditions indicate {selectedPeak.status.toLowerCase()} for climbing. 
                {selectedPeak.safetyScore < 50 ? " High risk of extreme weather and low visibility." : " Favorable window for summit attempts."}
              </p>
            </div>

            <div className="glass rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">AMS Risk Assessment</h3>
                <Activity className="w-4 h-4 text-safety-orange" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {[
                  'Headache', 'Nausea', 'Dizziness', 'Fatigue', 
                  'Shortness of Breath', 'Loss of Appetite', 'Insomnia', 'Vomiting'
                ].map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => handleSymptomToggle(symptom)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                      symptoms.includes(symptom) 
                        ? "bg-safety-orange/20 border-safety-orange text-safety-orange" 
                        : "bg-white/5 border-white/5 text-white/60 hover:border-white/20"
                    )}
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-sm border flex items-center justify-center",
                      symptoms.includes(symptom) ? "bg-safety-orange border-safety-orange" : "border-white/20"
                    )}>
                      {symptoms.includes(symptom) && <CheckCircle2 className="w-3 h-3 text-black" />}
                    </div>
                    <span className="text-xs font-medium">{symptom}</span>
                  </button>
                ))}
              </div>

              <button 
                onClick={generateAdvice}
                disabled={isGenerating}
                className="w-full bg-safety-orange text-black font-bold py-4 rounded-2xl hover:bg-safety-orange/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <MessageSquareText className="w-5 h-5" />
                )}
                GET AI SAFETY ADVICE
              </button>
            </div>
          </div>

          {/* Right Column: AI Advice & Insights */}
          <div className="lg:col-span-3 space-y-6">
            <AnimatePresence mode="wait">
              {aiAdvice ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass rounded-3xl p-8 h-full min-h-[400px]"
                >
                  <div className="flex items-center gap-2 text-safety-orange mb-6">
                    <ShieldAlert className="w-5 h-5" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">Expert Advisor</h3>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <Markdown>{aiAdvice}</Markdown>
                  </div>
                  <button 
                    onClick={() => setAiAdvice(null)}
                    className="mt-8 text-xs font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Clear Assessment
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center border-dashed border-white/10"
                >
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Activity className="w-8 h-8 text-white/20" />
                  </div>
                  <h4 className="font-bold mb-2">No Active Assessment</h4>
                  <p className="text-sm text-white/40 leading-relaxed">
                    Select symptoms and run the AI advisor to get personalized safety insights for your current elevation.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Mountain className="w-5 h-5 text-safety-orange" />
            <span className="font-bold tracking-tighter">SAFE2PEAK</span>
          </div>
          <div className="flex gap-8 text-[10px] font-bold text-white/40 uppercase tracking-widest">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Emergency Contacts</a>
            <a href="#" className="hover:text-white">API Documentation</a>
          </div>
          <div className="text-[10px] text-white/20 font-mono">
            © 2024 SAFE2PEAK SYSTEMS. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}
