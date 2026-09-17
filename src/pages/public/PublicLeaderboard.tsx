import React, { useEffect, useState } from 'react';
import { EchoHeading } from '../../components/ui/EchoHeading';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LoadingState } from '../../components/ui/LoadingState';
import { apiService } from '../../services/api';
import { Trophy, Award } from 'lucide-react';

export const PublicLeaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getLeaderboard()
      .then((data) => setLeaderboard(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <div className="space-y-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Community Rankings</span>
        <EchoHeading text="GLOBAL LEADERBOARD" size="lg" />
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Leaderboard uses Dense Ranking. All members tied at cutoff ranks are included. Points are immutable and governed by Super Admin rules.
        </p>
      </div>

      {loading ? (
        <LoadingState message="Loading leaderboard rankings..." />
      ) : (
        <Card glass className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-purple-950 bg-gray-50/50 dark:bg-[#150A21]/50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Rank</th>
                  <th className="py-4 px-6">Member</th>
                  <th className="py-4 px-6">Research Team</th>
                  <th className="py-4 px-6">Achievements</th>
                  <th className="py-4 px-6 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-purple-950/60 text-sm">
                {leaderboard.map((entry) => (
                  <tr key={entry.memberId} className="hover:bg-purple-500/5 transition-colors">
                    <td className="py-4 px-6 font-bold flex items-center gap-2">
                      {entry.rank === 1 && <Trophy className="w-4 h-4 text-amber-400" />}
                      {entry.rank === 2 && <Trophy className="w-4 h-4 text-gray-300" />}
                      {entry.rank === 3 && <Trophy className="w-4 h-4 text-amber-600" />}
                      #{entry.rank}
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">
                      {entry.memberName}
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="purple">{entry.teamName || 'AI Research'}</Badge>
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-purple-500" /> {entry.achievementsCount || 5} Badges
                    </td>
                    <td className="py-4 px-6 text-right font-black text-purple-600 dark:text-purple-400 text-base">
                      {entry.points} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
