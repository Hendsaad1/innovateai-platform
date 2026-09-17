import React from 'react';
import { EchoHeading } from '../../components/ui/EchoHeading';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ArrowUpRight, Users } from 'lucide-react';

interface PublicTeamsProps {
  onSelectTeam: (id: string) => void;
}

export const PublicTeams: React.FC<PublicTeamsProps> = ({ onSelectTeam }) => {
  const teamsDirectory = [
    {
      id: 'hr',
      number: '01',
      name: 'HR',
      fullName: 'Human Resources & Talent Development',
      description: 'Building the people behind the community, managing talent acquisition, recruitment workflows, and member welfare.',
      category: 'OPERATIONS',
      memberCount: 15,
    },
    {
      id: 'graphic',
      number: '02',
      name: 'Graphic',
      fullName: 'Visual Design & Creative Direction',
      description: 'Crafting visual brand assets, event identity systems, and high-impact editorial design materials.',
      category: 'CREATIVE',
      memberCount: 18,
    },
    {
      id: 'pm',
      number: '03',
      name: 'PM',
      fullName: 'Project Management & Sprints',
      description: 'Coordinating research units, tracking milestones, and delivering technical deliverables across all initiatives.',
      category: 'MANAGEMENT',
      memberCount: 22,
    },
    {
      id: 'pr',
      number: '04',
      name: 'PR',
      fullName: 'Public Relations & Partnerships',
      description: 'Forging academic alliances, industry sponsorships, and external collaborations with partner institutions.',
      category: 'RELATIONS',
      memberCount: 16,
    },
    {
      id: 'edu-content',
      number: '05',
      name: 'EDU & Content',
      fullName: 'Educational Curriculum & AI Technical Content',
      description: 'Developing workshops, technical reading groups, and AI learning tracks for community members.',
      category: 'EDUCATION',
      memberCount: 30,
    },
    {
      id: 'media-marketing',
      number: '06',
      name: 'Media Marketing',
      fullName: 'Digital Growth & Community Outreach',
      description: 'Scaling social media presence, documenting community events, and driving external engagement.',
      category: 'MARKETING',
      memberCount: 20,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Research & Execution Units</span>
        <EchoHeading text="COMMUNITY TEAMS" size="lg" />
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Explore our six specialized divisions where members collaborate on cutting-edge AI research, technical infrastructure, and community growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamsDirectory.map((team) => (
          <Card
            key={team.id}
            hoverEffect
            glass
            className="cursor-pointer space-y-6 flex flex-col justify-between border border-purple-500/20 hover:border-[#8B2FC9] transition-all"
            onClick={() => onSelectTeam(team.id)}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-mono font-black text-purple-600 dark:text-purple-400">{team.number}</span>
                <Badge variant="purple">{team.category}</Badge>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-between">
                  {team.name}
                  <ArrowUpRight className="w-5 h-5 text-purple-500" />
                </h3>
                <p className="text-xs font-semibold text-[#8B2FC9]">{team.fullName}</p>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                {team.description}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-purple-950 flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-500" /> {team.memberCount} Active Members
              </span>
              <span className="text-[#8B2FC9] group-hover:underline">View Charter →</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
