import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Flame, Clock, Award, TrendingUp, Sparkles, Calendar, Layers } from 'lucide-react';

// Generate 30 days of realistic study activity data leading up to Oct 13, 2026
export const generate30DayData = () => {
  const data = [];
  const baseMastery = 70;

  for (let i = 29; i >= 0; i--) {
    const d = new Date(2026, 9, 13); // Oct 13, 2026
    d.setDate(d.getDate() - i);
    const dayOfMonth = d.getDate();
    const monthName = d.toLocaleString('en-US', { month: 'short' });
    const dayLabel = `${monthName} ${dayOfMonth}`;

    // Study hours variation (weekend surges, occasional rest days)
    const dayOfWeek = d.getDay();
    let hours = 0;
    if (i === 0) hours = 2.5; // Today
    else if (i === 1) hours = 3.2; // Yesterday
    else if (i === 2) hours = 1.8;
    else if (i === 6 || i === 7 || i === 13 || i === 14 || i === 20 || i === 27) {
      hours = +(1.2 + Math.random() * 2.4).toFixed(1); // Weekends
    } else if (i === 10 || i === 21) {
      hours = 0.4; // Light recovery days
    } else {
      hours = +(0.8 + Math.random() * 1.9).toFixed(1);
    }

    // Steady progression of mastery score from ~72% to ~88%
    const progressFactor = (30 - i) / 30;
    const noise = (Math.random() - 0.5) * 3;
    const masteryScore = Math.min(95, Math.round(baseMastery + progressFactor * 17 + noise));

    let skillFocus = 'Distributed Systems';
    if (i % 4 === 0) skillFocus = 'React 19 Concurrency';
    else if (i % 4 === 1) skillFocus = 'Raft Consensus & Quorum';
    else if (i % 4 === 2) skillFocus = 'Consistent Hashing & V8 Profiling';
    else skillFocus = 'EVM Security & Reentrancy';

    data.push({
      dateStr: dayLabel,
      dayNumber: 30 - i,
      dayLabel: i % 4 === 0 || i === 29 ? dayLabel : '',
      fullDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      hours,
      masteryScore,
      skillFocus,
      sessionsCount: hours > 2 ? 3 : hours > 0.8 ? 2 : 1
    });
  }

  return data;
};

const data30Days = generate30DayData();

// Custom Recharts Tooltip styled in Web3 Charcoal/Plum/Coral/Sunset palette
const CustomHeatmapTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3.5 rounded-xl bg-[#100D14]/95 border border-[#E879B9]/40 backdrop-blur-md shadow-2xl text-xs space-y-2 z-50">
        <div className="flex items-center justify-between gap-4 border-b border-[#24151F] pb-1.5">
          <span className="font-bold text-[#F5F1F5] font-mono">{data.fullDate}</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#24151F] text-[#FF8866]">
            Day {data.dayNumber} of 30
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[#F5F1F5]/60 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#E879B9]" />
              <span>Active Study Hours:</span>
            </span>
            <span className="font-mono font-bold text-[#E879B9]">{data.hours} hrs</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-[#F5F1F5]/60 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#FF8866]" />
              <span>Skill Mastery Index:</span>
            </span>
            <span className="font-mono font-bold text-[#FF8866]">{data.masteryScore}%</span>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1 text-[11px]">
            <span className="text-[#F5F1F5]/50">Primary Focus:</span>
            <span className="text-[#F5F1F5] font-semibold">{data.skillFocus}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const SkillMasteryHeatmap: React.FC = () => {
  const [hoveredDay, setHoveredDay] = useState<any | null>(null);
  const [activeView, setActiveView] = useState<'chart' | 'grid'>('chart');

  // Compute 30-day stats
  const totalHours = data30Days.reduce((acc, d) => acc + d.hours, 0).toFixed(1);
  const avgHours = (Number(totalHours) / 30).toFixed(1);
  const activeDaysCount = data30Days.filter(d => d.hours > 0.5).length;
  const peakDay = data30Days.reduce((max, d) => (d.hours > max.hours ? d : max), data30Days[0]);

  return (
    <div className="p-6 rounded-2xl bg-[#24151F]/50 border border-[#24151F] space-y-6 shadow-xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF8866]" />
            <h3 className="text-base font-bold text-[#F5F1F5]">
              Skill Mastery Heatmap & 30-Day Velocity
            </h3>
            <span className="text-[10px] bg-[#100D14] border border-[#E879B9]/30 text-[#E879B9] px-2 py-0.5 rounded font-mono font-bold">
              Recharts Analytics
            </span>
          </div>
          <p className="text-xs text-[#F5F1F5]/60">
            Correlation between daily active learning time and composite readiness score progression.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#100D14] rounded-xl border border-[#24151F]">
          <button
            type="button"
            onClick={() => setActiveView('chart')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeView === 'chart'
                ? 'glow-pink-orange text-[#100D14] shadow-sm'
                : 'text-[#F5F1F5]/60 hover:text-white'
            }`}
          >
            Dual Velocity Curve
          </button>
          <button
            type="button"
            onClick={() => setActiveView('grid')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeView === 'grid'
                ? 'glow-pink-orange text-[#100D14] shadow-sm'
                : 'text-[#F5F1F5]/60 hover:text-white'
            }`}
          >
            30-Day Activity Matrix
          </button>
        </div>
      </div>

      {/* 30-Day Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#100D14] border border-[#24151F] space-y-1">
          <p className="text-[10px] text-[#F5F1F5]/50 uppercase tracking-wider font-mono">30-Day Hours Logged</p>
          <p className="text-xl font-bold font-mono text-[#E879B9] tabular-nums">{totalHours} hrs</p>
          <p className="text-[10px] text-[#F5F1F5]/40">Verified prep time</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#100D14] border border-[#24151F] space-y-1">
          <p className="text-[10px] text-[#F5F1F5]/50 uppercase tracking-wider font-mono">Daily Pace</p>
          <p className="text-xl font-bold font-mono text-[#FF8866] tabular-nums">{avgHours} hrs/day</p>
          <p className="text-[10px] text-[#F5F1F5]/40">{activeDaysCount} active days / 30</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#100D14] border border-[#24151F] space-y-1">
          <p className="text-[10px] text-[#F5F1F5]/50 uppercase tracking-wider font-mono">Mastery Surge</p>
          <p className="text-xl font-bold font-mono text-gradient-warm tabular-nums">+16.4%</p>
          <p className="text-[10px] text-[#F5F1F5]/40">71% → 87.5% score</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#100D14] border border-[#24151F] space-y-1">
          <p className="text-[10px] text-[#F5F1F5]/50 uppercase tracking-wider font-mono">Peak Session</p>
          <p className="text-xl font-bold font-mono text-[#F5F1F5] tabular-nums">{peakDay.hours} hrs</p>
          <p className="text-[10px] text-[#F5F1F5]/40">{peakDay.dateStr} (Consensus focus)</p>
        </div>
      </div>

      {/* Main Recharts Visualization Stage */}
      {activeView === 'chart' ? (
        <div className="space-y-4">
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data30Days}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  {/* Hours Bar Gradient */}
                  <linearGradient id="rechartsHoursBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E879B9" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#FF8866" stopOpacity={0.35} />
                  </linearGradient>

                  {/* Mastery Area Glow */}
                  <linearGradient id="rechartsMasteryArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF8866" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#FF8866" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#24151F"
                  vertical={false}
                  strokeOpacity={0.7}
                />

                <XAxis
                  dataKey="dateStr"
                  stroke="rgba(245, 241, 245, 0.3)"
                  tick={{ fill: 'rgba(245, 241, 245, 0.45)', fontSize: 10 }}
                  interval={3}
                  tickLine={false}
                  axisLine={{ stroke: '#24151F' }}
                />

                {/* Left Axis: Study Hours (0 to 4.5h) */}
                <YAxis
                  yAxisId="hours"
                  stroke="rgba(245, 241, 245, 0.3)"
                  tick={{ fill: 'rgba(232, 121, 185, 0.7)', fontSize: 10 }}
                  unit="h"
                  domain={[0, 4.5]}
                  tickLine={false}
                  axisLine={false}
                />

                {/* Right Axis: Mastery Score (50% to 100%) */}
                <YAxis
                  yAxisId="mastery"
                  orientation="right"
                  stroke="rgba(245, 241, 245, 0.3)"
                  tick={{ fill: 'rgba(255, 136, 102, 0.7)', fontSize: 10 }}
                  unit="%"
                  domain={[50, 100]}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip content={<CustomHeatmapTooltip />} />

                {/* Study Hours Bar Series */}
                <Bar
                  yAxisId="hours"
                  dataKey="hours"
                  name="Study Hours"
                  fill="url(#rechartsHoursBar)"
                  radius={[4, 4, 0, 0]}
                  barSize={10}
                />

                {/* Soft Area fill under mastery line */}
                <Area
                  yAxisId="mastery"
                  type="monotone"
                  dataKey="masteryScore"
                  fill="url(#rechartsMasteryArea)"
                  stroke="none"
                />

                {/* Mastery Trend Line */}
                <Line
                  yAxisId="mastery"
                  type="monotone"
                  dataKey="masteryScore"
                  name="Mastery Score"
                  stroke="#FF8866"
                  strokeWidth={2.5}
                  dot={{ r: 2, fill: '#FF8866', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#E879B9', stroke: '#100D14', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-[#F5F1F5]/60 pt-2 border-t border-[#24151F] px-1">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-gradient-to-b from-[#E879B9] to-[#FF8866]" />
                <span>Active Study Hours (Bar)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-[#FF8866]" />
                <span>Readiness Score (Curve)</span>
              </div>
            </div>
            <span className="font-mono text-[11px] text-[#F5F1F5]/40">
              Interactive Tooltip on Hover
            </span>
          </div>
        </div>
      ) : (
        /* 30-Day Activity Matrix Heatmap Grid */
        <div className="space-y-4">
          <div className="grid grid-cols-6 sm:grid-cols-10 gap-2.5">
            {data30Days.map((day) => {
              // Color density mapping based on study hours
              let bgClass = 'bg-[#100D14] border-[#24151F] text-[#F5F1F5]/40';
              if (day.hours >= 3.0) {
                bgClass = 'bg-[#FF8866] border-[#FF8866] text-[#100D14] shadow-md shadow-[#FF8866]/30';
              } else if (day.hours >= 2.0) {
                bgClass = 'bg-[#E879B9] border-[#E879B9] text-[#100D14] shadow-md shadow-[#E879B9]/30';
              } else if (day.hours >= 1.0) {
                bgClass = 'bg-[#4a1c38] border-[#E879B9]/40 text-[#F5F1F5]';
              } else if (day.hours > 0) {
                bgClass = 'bg-[#24151F] border-[#24151F] text-[#F5F1F5]/70';
              }

              return (
                <div
                  key={day.dayNumber}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer hover:scale-105 ${bgClass}`}
                >
                  <p className="text-[10px] font-mono opacity-80">{day.dateStr}</p>
                  <p className="text-sm font-bold font-mono mt-0.5">{day.hours}h</p>
                  <p className="text-[9px] font-mono opacity-80">{day.masteryScore}%</p>
                </div>
              );
            })}
          </div>

          {/* Hovered details drawer */}
          <div className="p-3.5 rounded-xl bg-[#100D14] border border-[#24151F] flex items-center justify-between text-xs">
            {hoveredDay ? (
              <div className="flex items-center gap-4">
                <span className="font-bold text-[#F5F1F5] font-mono">{hoveredDay.fullDate}</span>
                <span className="text-[#E879B9] font-mono">{hoveredDay.hours} study hours</span>
                <span className="text-[#FF8866] font-mono">{hoveredDay.masteryScore}% readiness</span>
                <span className="text-[#F5F1F5]/70">Focus: {hoveredDay.skillFocus}</span>
              </div>
            ) : (
              <span className="text-[#F5F1F5]/50">
                Hover over any day tile to inspect granular logged hours and skill focus.
              </span>
            )}
            <div className="flex items-center gap-1.5 text-[10px] text-[#F5F1F5]/40 font-mono">
              <span>Less</span>
              <span className="w-2.5 h-2.5 rounded bg-[#100D14] border border-[#24151F]" />
              <span className="w-2.5 h-2.5 rounded bg-[#24151F]" />
              <span className="w-2.5 h-2.5 rounded bg-[#4a1c38]" />
              <span className="w-2.5 h-2.5 rounded bg-[#E879B9]" />
              <span className="w-2.5 h-2.5 rounded bg-[#FF8866]" />
              <span>More</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
