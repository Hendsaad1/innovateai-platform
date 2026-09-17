import React, { useState, useEffect } from 'react';
import { EchoHeading } from '../../components/ui/EchoHeading';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { apiService } from '../../services/api';
import { Calendar, Clock, MapPin, Users, ArrowUpRight, Filter, AlertCircle, Sparkles } from 'lucide-react';

interface PublicActivitiesProps {
  onSelectActivity: (id: string) => void;
}

export const PublicActivities: React.FC<PublicActivitiesProps> = ({ onSelectActivity }) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'PUBLIC' | 'INTERNAL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getActivities();
      setActivities(data || []);
    } catch (err: any) {
      setError(err.message || 'Unable to load activities.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredActivities = activities.filter((act) => {
    if (filterType !== 'ALL' && act.activityType !== filterType) return false;
    if (filterStatus !== 'ALL' && act.status !== filterStatus) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REGISTRATION_OPEN':
        return <Badge variant="purple">Registration Open</Badge>;
      case 'REGISTRATION_CLOSED':
        return <Badge variant="secondary">Registration Closed</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="purple">In Progress</Badge>;
      case 'UPCOMING':
        return <Badge variant="outline">Upcoming</Badge>;
      case 'COMPLETED':
        return <Badge variant="secondary">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
      {/* Editorial Hero */}
      <section className="space-y-6 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[#8B2FC9] text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          INnovateAI Activity Hub
        </div>
        <EchoHeading text="WHERE IDEAS BECOME ACTION." size="lg" />
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
          Explore structured community activities, workshops, research sprints, and operational sessions designed for members and public participants to learn, build, and grow.
        </p>
      </section>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-purple-950">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${filterType === 'ALL' ? 'bg-[#5C0F82] text-white' : 'bg-gray-100 dark:bg-purple-950/40 text-gray-700 dark:text-gray-300 hover:bg-purple-500/10'}`}
          >
            All Activities
          </button>
          <button
            onClick={() => setFilterType('PUBLIC')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${filterType === 'PUBLIC' ? 'bg-[#5C0F82] text-white' : 'bg-gray-100 dark:bg-purple-950/40 text-gray-700 dark:text-gray-300 hover:bg-purple-500/10'}`}
          >
            Public Activities
          </button>
          <button
            onClick={() => setFilterType('INTERNAL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${filterType === 'INTERNAL' ? 'bg-[#5C0F82] text-white' : 'bg-gray-100 dark:bg-purple-950/40 text-gray-700 dark:text-gray-300 hover:bg-purple-500/10'}`}
          >
            Internal Operations
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-purple-950/40 border border-gray-200 dark:border-purple-900/50 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-[#8B2FC9]"
          >
            <option value="ALL">All Statuses</option>
            <option value="REGISTRATION_OPEN">Registration Open</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REGISTRATION_CLOSED">Registration Closed</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} glass className="p-8 space-y-4 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-purple-950 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 dark:bg-purple-950 rounded w-3/4"></div>
              <div className="h-16 bg-gray-200 dark:bg-purple-950 rounded w-full"></div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card glass className="p-12 text-center space-y-4 border border-red-500/30">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Unable to load activities</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
          <Button variant="primary" size="md" onClick={fetchActivities}>Retry Connection</Button>
        </Card>
      ) : filteredActivities.length === 0 ? (
        <Card glass className="p-16 text-center space-y-4 border border-purple-500/20">
          <Calendar className="w-12 h-12 text-[#8B2FC9] mx-auto opacity-60" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Nothing happening right now.</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Check back soon for upcoming INnovateAI activities and research sprints.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredActivities.map((act) => (
            <Card
              key={act.id}
              hoverEffect
              glass
              className="cursor-pointer space-y-6 flex flex-col justify-between border border-purple-500/20 hover:border-[#8B2FC9] transition-all"
              onClick={() => onSelectActivity(act.id)}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={act.activityType === 'PUBLIC' ? 'purple' : 'secondary'}>
                      {act.activityType}
                    </Badge>
                    {getStatusBadge(act.status)}
                  </div>
                  {act.teamName && (
                    <span className="text-xs font-mono font-bold text-[#8B2FC9]">{act.teamName}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center justify-between">
                    {act.title}
                    <ArrowUpRight className="w-5 h-5 text-purple-500 shrink-0" />
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed font-medium">
                    {act.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-purple-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-4 flex-wrap">
                  {act.startDate && (
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-purple-500" /> {act.startDate} {act.startTime ? `• ${act.startTime}` : ''}
                    </span>
                  )}
                  {act.location && (
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-purple-500" /> {act.location}
                    </span>
                  )}
                </div>
                <span className="text-[#8B2FC9] font-bold group-hover:underline">View Details →</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
