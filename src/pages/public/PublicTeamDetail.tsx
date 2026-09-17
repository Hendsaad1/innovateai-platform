import React from 'react';
import { EchoHeading } from '../../components/ui/EchoHeading';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Users, Calendar, ArrowLeft, Sparkles } from 'lucide-react';

interface PublicTeamDetailProps {
  teamId: string;
  onBack: () => void;
  onJoin: () => void;
}

export const PublicTeamDetail: React.FC<PublicTeamDetailProps> = ({ teamId, onBack, onJoin }) => {
  const teamsData: Record<string, { number: string; name: string; fullName: string; description: string; category: string; memberCount: number }> = {
    hr: { number: '01', name: 'HR', fullName: 'Human Resources & Talent Development', description: 'Building the people behind the community, managing talent acquisition, recruitment workflows, and member welfare.', category: 'OPERATIONS', memberCount: 15 },
    graphic: { number: '02', name: 'Graphic', fullName: 'Visual Design & Creative Direction', description: 'Crafting visual brand assets, event identity systems, and high-impact editorial design materials.', category: 'CREATIVE', memberCount: 18 },
    pm: { number: '03', name: 'PM', fullName: 'Project Management & Sprints', description: 'Coordinating research units, tracking milestones, and delivering technical deliverables across all initiatives.', category: 'MANAGEMENT', memberCount: 22 },
    pr: { number: '04', name: 'PR', fullName: 'Public Relations & Partnerships', description: 'Forging academic alliances, industry sponsorships, and external collaborations with partner institutions.', category: 'RELATIONS', memberCount: 16 },
    'edu-content': { number: '05', name: 'EDU & Content', fullName: 'Educational Curriculum & AI Technical Content', description: 'Developing workshops, technical reading groups, and AI learning tracks for community members.', category: 'EDUCATION', memberCount: 30 },
    'media-marketing': { number: '06', name: 'Media Marketing', fullName: 'Digital Growth & Community Outreach', description: 'Scaling social media presence, documenting community events, and driving external engagement.', category: 'MARKETING', memberCount: 20 },
  };

  const team = teamsData[teamId] || {
    number: '00',
    name: teamId.toUpperCase(),
    fullName: 'Specialized Research Unit',
    description: 'Specialized community division focused on advanced technological execution and collaboration.',
    category: 'GENERAL',
    memberCount: 20,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-12">
      {/* Back Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Teams Directory
      </button>

      {/* Hero Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl sm:text-6xl font-mono font-black text-purple-600 dark:text-purple-400">{team.number}</span>
          <Badge variant="purple">{team.category}</Badge>
        </div>

        <div className="space-y-2">
          <EchoHeading text={team.name} size="lg" />
          <p className="text-xl font-semibold text-[#8B2FC9]">{team.fullName}</p>
        </div>

        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-normal max-w-3xl">
          {team.description}
        </p>
      </div>

      {/* Team Details & Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Members Section */}
        <Card glass className="p-8 space-y-6 border border-purple-500/20">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-purple-950 pb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" /> Team Members
            </h3>
            <span className="text-xs font-mono text-gray-500">{team.memberCount} Registered</span>
          </div>

          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              No team members to display yet. Active member rosters sync securely via backend database.
            </p>
          </div>
        </Card>

        {/* Activities Section */}
        <Card glass className="p-8 space-y-6 border border-purple-500/20">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-purple-950 pb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" /> Team Activities & Sprints
            </h3>
            <span className="text-xs font-mono text-gray-500">Upcoming</span>
          </div>

          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              No team activities to display yet. Sprints and schedules will appear here upon publication.
            </p>
          </div>
        </Card>
      </div>

      {/* Action CTA */}
      <div className="pt-6">
        <Card glass className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-purple-500/30 bg-gradient-to-r from-purple-950/20 to-transparent">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-gray-900 dark:text-white text-lg">Interested in joining {team.name}?</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">Submit your application through our recruitment portal.</p>
          </div>
          <Button variant="primary" size="lg" onClick={onJoin}>
            Apply to Join This Team →
          </Button>
        </Card>
      </div>
    </div>
  );
};
