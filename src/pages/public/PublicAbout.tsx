import React from 'react';
import { EchoHeading } from '../../components/ui/EchoHeading';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ArrowRight, Sparkles, Compass, UserPlus, BookOpen, GitPullRequest, TrendingUp, Layers } from 'lucide-react';

interface PublicAboutProps {
  onNavigate: (route: string) => void;
}

export const PublicAbout: React.FC<PublicAboutProps> = ({ onNavigate }) => {
  const journeySteps = [
    { step: '01', title: 'DISCOVER', desc: 'Explore our open-source research units, technical sprints, and community channels.', icon: Compass },
    { step: '02', title: 'JOIN', desc: 'Apply through our structured recruitment cohorts for specialized teams and tracks.', icon: UserPlus },
    { step: '03', title: 'LEARN', desc: 'Participate in workshops, collaborative reading circles, and hands-on AI tutorials.', icon: BookOpen },
    { step: '04', title: 'CONTRIBUTE', desc: 'Build production repositories, author research papers, and lead community projects.', icon: GitPullRequest },
    { step: '05', title: 'GROW', desc: 'Earn verified credentials, mentorship from industry experts, and leadership standing.', icon: TrendingUp },
  ];

  const teamsList = [
    { num: '01', name: 'HR', desc: 'Human Resources & Talent Development' },
    { num: '02', name: 'Graphic', desc: 'Visual Design & Creative Direction' },
    { num: '03', name: 'PM', desc: 'Project Management & Sprints' },
    { num: '04', name: 'PR', desc: 'Public Relations & Partnerships' },
    { num: '05', name: 'EDU & Content', desc: 'Educational Curriculum & AI Technical Content' },
    { num: '06', name: 'Media Marketing', desc: 'Digital Growth & Community Outreach' },
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* Editorial Hero */}
      <section className="relative pt-20 sm:pt-32 px-4 max-w-7xl mx-auto">
        <div className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[#8B2FC9] text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            University Artificial Intelligence Ecosystem
          </div>
          <EchoHeading text="MORE THAN A COMMUNITY." size="lg" />
          <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-200 leading-relaxed font-normal">
            INnovateAI is a university-based technology and Artificial Intelligence community platform. We connect student researchers, engineers, and creators to advance machine learning literacy and open-source innovation.
          </p>
        </div>
      </section>

      {/* What is INnovateAI */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Our Core Purpose</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">Built By Students, For Innovators.</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              <p>
                We believe that the future of Artificial Intelligence is open, collaborative, and grounded in rigorous academic inquiry. INnovateAI provides a structured environment where students transition from theory to practice.
              </p>
              <p>
                Through active research units, technical sprints, and peer-to-peer mentorship, members tackle meaningful real-world challenges while upholding ethical AI principles.
              </p>
            </div>
          </div>
          <div className="lg:col-span-5">
            <Card glass className="p-8 space-y-6 border border-purple-500/30">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Foundational Principles</h3>
              <ul className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#8B2FC9] mt-2 shrink-0"></span>
                  <span><strong>Student Community:</strong> Inclusive environment welcoming all university disciplines and skill levels.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#8B2FC9] mt-2 shrink-0"></span>
                  <span><strong>Artificial Intelligence:</strong> Focused investigation of modern machine learning models and applications.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#8B2FC9] mt-2 shrink-0"></span>
                  <span><strong>Collaboration & Growth:</strong> Collective problem-solving over isolated competition.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Journey */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Member Experience</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">The Community Journey</h2>
          <p className="text-gray-700 dark:text-gray-300">
            A conceptual progression from initial exploration to active community leadership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {journeySteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} glass className="space-y-4 p-6 flex flex-col justify-between border border-purple-500/20">
                <div className="space-y-3">
                  <span className="text-xs font-mono font-bold text-[#8B2FC9]">{item.step}</span>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-[#8B2FC9]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Community Structure */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Operational Units</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">Six Specialized Teams</h2>
            <p className="text-gray-700 dark:text-gray-300">
              The community operates through six focused operational units, each driving critical aspects of our ecosystem.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => { onNavigate('teams'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            Explore Our Teams <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamsList.map((t, i) => (
            <Card key={i} glass className="p-6 space-y-3 border border-purple-500/20 hover:border-[#8B2FC9] transition-colors cursor-pointer" onClick={() => { onNavigate('teams'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              <span className="text-xs font-mono font-bold text-purple-500">{t.num}</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.name}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{t.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* About CTA */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-r from-[#3A0E4E] via-[#5C0F82] to-[#8B2FC9] p-10 sm:p-16 text-white text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,47,201,0.4),transparent_50%)]"></div>
          <h2 className="relative z-10 text-3xl sm:text-5xl font-black tracking-tight">READY TO FIND YOUR PLACE?</h2>
          <p className="relative z-10 text-purple-100 max-w-xl mx-auto text-base sm:text-lg font-medium">
            Join INnovateAI today and become part of our growing university technology community.
          </p>
          <div className="relative z-10 pt-2">
            <Button
              variant="primary"
              size="lg"
              className="bg-[#5C0F82] hover:bg-[#8B2FC9] text-white font-bold shadow-xl border border-white/20"
              onClick={() => { onNavigate('join'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              Join INnovateAI <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
