import React from 'react';

interface PublicFooterProps {
  onNavigate: (route: string) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-[#5C0F82]/30 bg-[#3A0E4E] text-white py-16 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand & Mission */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5C0F82] to-[#8B2FC9] flex items-center justify-center text-white font-black text-lg shadow-md border border-purple-400/30">
              IN
            </div>
            <span className="font-black text-lg tracking-tighter text-white">
              INnovateAI
            </span>
          </div>
          <p className="text-xs text-[#D8B4FE] leading-relaxed font-medium">
            University Artificial Intelligence & technology community platform. Connecting student researchers, engineers, and innovators in a high-performance ecosystem.
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#CFA7FF]">Navigation</h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            <li>
              <button onClick={() => onNavigate('about')} className="text-white hover:text-[#CFA7FF] transition-colors">About Us</button>
            </li>
            <li>
              <button onClick={() => onNavigate('teams')} className="text-white hover:text-[#CFA7FF] transition-colors">Community Teams</button>
            </li>
            <li>
              <button onClick={() => onNavigate('activities')} className="text-white hover:text-[#CFA7FF] transition-colors">Activities & Sprints</button>
            </li>
            <li>
              <button onClick={() => onNavigate('events')} className="text-white hover:text-[#CFA7FF] transition-colors">Workshops & Events</button>
            </li>
            <li>
              <button onClick={() => onNavigate('leaderboard')} className="text-white hover:text-[#CFA7FF] transition-colors">Global Leaderboard</button>
            </li>
          </ul>
        </div>

        {/* Community */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#CFA7FF]">Community</h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            <li>
              <button onClick={() => onNavigate('join')} className="text-white hover:text-[#CFA7FF] transition-colors">Join Recruitment</button>
            </li>
            <li>
              <button onClick={() => onNavigate('contact')} className="text-white hover:text-[#CFA7FF] transition-colors">Contact Staff</button>
            </li>
            <li>
              <span className="text-[#D8B4FE]/60 cursor-not-allowed">Member Portal (Secure Login)</span>
            </li>
          </ul>
        </div>

        {/* Legal & Support */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#CFA7FF]">Legal & Support</h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            <li>
              <button onClick={() => onNavigate('contact')} className="text-white hover:text-[#CFA7FF] transition-colors">Privacy Policy</button>
            </li>
            <li>
              <button onClick={() => onNavigate('contact')} className="text-white hover:text-[#CFA7FF] transition-colors">Terms of Service</button>
            </li>
            <li>
              <button onClick={() => onNavigate('contact')} className="text-white hover:text-[#CFA7FF] transition-colors">Support & Help Desk</button>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#D8B4FE]">
        <div>
          © 2026 INnovateAI Community Platform. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <span>University AI Community Desk</span>
          <span>•</span>
          <span>Configurable Contact Point</span>
        </div>
      </div>
    </footer>
  );
};
