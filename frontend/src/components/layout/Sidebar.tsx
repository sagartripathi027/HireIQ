import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Video, 
  CheckSquare, 
  BookOpen, 
  FileText, 
  User as UserIcon, 
  Settings, 
  LogOut,
  Zap
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentPath, navigate, user, logout } = useApp();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'AI Mock Interview', icon: Video, path: '/interview/setup' },
    { label: 'Skill Assessments', icon: CheckSquare, path: '/assessment/setup' },
    { label: 'Curated Courses', icon: BookOpen, path: '/courses' },
    { label: 'Revision Notes', icon: FileText, path: '/notes' },
  ];

  return (
    <aside className="w-64 shrink-0 bg-[#24151F]/60 border-r border-[#24151F] flex flex-col justify-between p-4 min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3.5 rounded-xl bg-[#100D14]/80 border border-[#24151F] flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-lg object-cover border border-[#E879B9]/30"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-[#F5F1F5] truncate">{user.name}</h4>
            <div className="flex items-center gap-2 text-xs text-[#F5F1F5]/60">
              <span className="text-[#FF8866] font-mono font-medium">{user.credits} credits</span>
              <span>·</span>
              <span className="font-mono">{user.readinessScore}% score</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || 
              (item.path !== '/dashboard' && currentPath.startsWith(item.path.split('/')[1] ? `/${item.path.split('/')[1]}` : '____'));

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#E879B9]/15 text-[#E879B9] border border-[#E879B9]/30 font-semibold'
                    : 'text-[#F5F1F5]/70 hover:text-[#F5F1F5] hover:bg-[#100D14]/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF8866]' : 'text-[#F5F1F5]/50'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Readiness Meter Box */}
        <div className="p-4 rounded-xl bg-gradient-to-b from-[#24151F] to-[#100D14] border border-[#24151F] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#F5F1F5]/70">Interview Readiness</span>
            <span className="text-[#E879B9] font-mono font-bold">{user.readinessScore}%</span>
          </div>
          <div className="w-full bg-[#100D14] h-2 rounded-full overflow-hidden border border-[#24151F]">
            <div
              className="glow-pink-orange h-full rounded-full transition-all duration-500"
              style={{ width: `${user.readinessScore}%` }}
            />
          </div>
          <p className="text-[11px] text-[#F5F1F5]/50 leading-relaxed">
            Targeting Senior Tier-1 standards. 2 mock sessions recommended this week.
          </p>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="pt-4 border-t border-[#24151F] space-y-1">
        <button
          onClick={() => {
            navigate('/dashboard');
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#F5F1F5]/60 hover:text-[#F5F1F5] hover:bg-[#100D14]/40 transition-colors"
        >
          <Settings className="w-4 h-4 text-[#F5F1F5]/40" />
          <span>Settings</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
