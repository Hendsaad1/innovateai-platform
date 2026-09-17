import React from 'react';
import { EchoHeading } from '../../components/ui/EchoHeading';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Sparkles, ArrowRight, Cpu, Trophy, ShieldCheck, Terminal, Layers } from 'lucide-react';

interface PublicHomeProps {
  onNavigate: (route: string) => void;
}

export const PublicHome: React.FC<PublicHomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-24 pb-24">
      {/* Editorial Hero Section */}
      <section className="relative pt-16 sm:pt-28 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[#8B2FC9] text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              University Artificial Intelligence & Technology Community
            </div>

            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest text-purple-600 dark:text-purple-400 font-bold block">
                INnovateAI Platform Ecosystem
              </span>
              <EchoHeading text="SHAPING THE AI FUTURE." size="lg" />
            </div>

            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed font-normal">
              A high-performance student research and engineering ecosystem. We unite ambitious minds to build state-of-the-art AI infrastructure, conduct advanced research, and pioneer open-source technology.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onNavigate('join')}
                className="shadow-xl shadow-purple-500/25"
              >
                Join the Community <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onNavigate('teams')}
              >
                Explore the Community
              </Button>
            </div>
          </div>

          {/* Editorial Visual Composition (Non-Numeric, Architectural) */}
          <div className="lg:col-span-4">
            <div className="relative rounded-3xl bg-gradient-to-br from-purple-950/40 via-[#150A21] to-[#0A0610] p-8 border border-purple-500/30 shadow-2xl space-y-6 overflow-hidden backdrop-blur-xl text-white">
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex items-center justify-between border-b border-purple-950 pb-4">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> System Core
                </span>
                <span className="text-[10px] px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-200 border border-purple-500/20 font-mono">
                  v2.6.0-prod
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs text-purple-200">
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-900/40 flex items-center gap-3">
                  <Cpu className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Research Slabs: Active Sprints</span>
                </div>
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-900/40 flex items-center gap-3">
                  <Layers className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Submissions & Peer Review Engine</span>
                </div>
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-900/40 flex items-center gap-3">
                  <Trophy className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Gamified Leaderboard & Rewards</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => onNavigate('activities')}
                >
                  View Active Sprints →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Core Pillars</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">Engineered For Excellence</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Everything you need to grow from a curious student to an accomplished AI pioneer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card hoverEffect glass className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-[#8B2FC9]">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Research & SOTA Labs</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              Collaborate on deep learning, transformer fine-tuning, and open-source contributions with top student researchers.
            </p>
          </Card>

          <Card hoverEffect glass className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-[#8B2FC9]">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Gamified Growth & Rewards</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              Earn immutable point transactions through task execution, challenge participation, and community leadership.
            </p>
          </Card>

          <Card hoverEffect glass className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-[#8B2FC9]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Verified Certification</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              Receive official community standing, staff recommendations, and verified portfolio credentials upon project completion.
            </p>
          </Card>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-r from-[#3A0E4E] via-[#5C0F82] to-[#8B2FC9] p-10 sm:p-16 text-white text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,47,201,0.4),transparent_50%)]"></div>
          <h2 className="relative z-10 text-3xl sm:text-5xl font-black tracking-tight">Ready to join the next wave of AI innovation?</h2>
          <p className="relative z-10 text-purple-100 max-w-xl mx-auto text-base sm:text-lg font-medium">
            Applications for the Spring cohort are currently open. Secure your position in INnovateAI today.
          </p>
          <div className="relative z-10 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="bg-[#5C0F82] hover:bg-[#8B2FC9] text-white font-bold shadow-xl border border-white/20"
              onClick={() => onNavigate('join')}
            >
              Start Recruitment Application <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
