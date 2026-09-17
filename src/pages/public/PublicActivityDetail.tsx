import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { apiService } from '../../services/api';
import { Calendar, Clock, MapPin, Users, ArrowLeft, CheckCircle2, AlertCircle, Ticket, Shield, ChevronRight } from 'lucide-react';

interface PublicActivityDetailProps {
  activityId: string;
  onBack: () => void;
  onJoinCommunity: () => void;
}

export const PublicActivityDetail: React.FC<PublicActivityDetailProps> = ({ activityId, onBack, onJoinCommunity }) => {
  const [activity, setActivity] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Registration state
  const [emailInput, setEmailInput] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<any | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivityDetail();
  }, [activityId]);

  const fetchActivityDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getActivityById(activityId);
      setActivity(data);
    } catch (err: any) {
      setError(err.message || 'Activity not found.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      setRegistrationError('Please provide a valid email address.');
      return;
    }

    setIsRegistering(true);
    setRegistrationError(null);
    try {
      const res = await apiService.registerEvent(activityId, emailInput);
      setRegistrationSuccess(res);
    } catch (err: any) {
      setRegistrationError(err.message || 'Registration failed.');
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 pt-28 sm:pt-36 pb-16 space-y-6 animate-pulse">
        <div className="h-5 bg-gray-200 dark:bg-purple-950 rounded w-1/6"></div>
        <div className="h-12 bg-gray-200 dark:bg-purple-950 rounded w-3/4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          <div className="lg:col-span-7 h-64 bg-gray-200 dark:bg-purple-950 rounded"></div>
          <div className="lg:col-span-5 h-64 bg-gray-200 dark:bg-purple-950 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-28 sm:pt-36 pb-20 text-center space-y-6">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Activities Directory
        </button>
        <Card glass className="p-12 space-y-4 border border-red-500/30">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Activity Not Found</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{error || 'The requested activity does not exist or has been removed.'}</p>
          <Button variant="primary" size="md" onClick={onBack}>Return to Activities</Button>
        </Card>
      </div>
    );
  }

  const isInternal = activity.activityType === 'INTERNAL';
  const isRegistrationOpen = activity.status === 'REGISTRATION_OPEN';

  return (
    <div className="max-w-5xl mx-auto px-4 pt-28 sm:pt-36 pb-20 space-y-10">
      {/* Back Navigation & Breadcrumb */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Activities
        </button>
        <div className="flex items-center gap-2">
          <Badge variant={isInternal ? 'secondary' : 'purple'}>
            {activity.activityType}
          </Badge>
          <Badge variant="outline">{activity.status?.replace(/_/g, ' ')}</Badge>
        </div>
      </div>

      {/* Hero Title & Compact Metadata Row */}
      <div className="space-y-6 pb-8 border-b border-gray-200 dark:border-purple-950/60">
        <div className="space-y-3">
          {/* Responsive adaptive title scaling with clamp */}
          <h1 
            className="font-black tracking-tight text-gray-900 dark:text-white leading-[1.15] max-w-4xl"
            style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
          >
            {activity.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed font-normal max-w-3xl">
            {activity.description}
          </p>
        </div>

        {/* Compact Metadata Row: 1-col mobile, 2-col tablet, 4-col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/10 space-y-1 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-500 shrink-0" /> Date
            </span>
            <p className="text-xs font-semibold text-gray-900 dark:text-white break-words">{activity.startDate || 'TBD'}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/10 space-y-1 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-500 shrink-0" /> Time
            </span>
            <p className="text-xs font-semibold text-gray-900 dark:text-white break-words">{activity.startTime || 'TBD'}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/10 space-y-1 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" /> Location
            </span>
            <p className="text-xs font-semibold text-gray-900 dark:text-white break-words">{activity.location || 'Hybrid / Online'}</p>
          </div>
          <div className="p-3.5 rounded-xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/10 space-y-1 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-500 shrink-0" /> Context
            </span>
            <p className="text-xs font-semibold text-gray-900 dark:text-white break-words">{activity.teamName || 'Community Unit'}</p>
          </div>
        </div>
      </div>

      {/* Two-Column Structured Layout (~60% Content / ~40% Registration Panel on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: About & What to Expect (~60%) */}
        <div className="lg:col-span-7 space-y-8">
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#8B2FC9]">About This Activity</h2>
            <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed space-y-4 font-normal">
              <p>
                {activity.description}
              </p>
              <p>
                Participating in this INnovateAI activity provides direct engagement with our core curriculum, collaborative problem-solving frameworks, and peer-to-peer technical mentorship. All community members and registered participants receive comprehensive documentation and post-session resources.
              </p>
            </div>
          </section>

          <section className="space-y-4 pt-6 border-t border-gray-200 dark:border-purple-950/60">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#8B2FC9]">What to Expect</h2>
            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300 font-medium">
              <li className="flex items-start gap-3">
                <ChevronRight className="w-4 h-4 text-[#8B2FC9] shrink-0 mt-0.5" />
                <span className="break-words">Structured technical walkthrough and open interactive discussion.</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-4 h-4 text-[#8B2FC9] shrink-0 mt-0.5" />
                <span className="break-words">Collaborative exercises, repository access, and resource sharing.</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-4 h-4 text-[#8B2FC9] shrink-0 mt-0.5" />
                <span className="break-words">Direct Q&A with community researchers and technical unit leads.</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Right Column: Registration Panel (~40%) */}
        <div className="lg:col-span-5 w-full">
          {isInternal ? (
            <Card glass className="p-6 space-y-4 border border-amber-500/30 bg-amber-500/5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">Internal Activity</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Members only operational session.</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium break-words">
                Public registration is disabled for internal unit operations. Active members can access session links through the member portal.
              </p>
              <Button variant="outline" size="sm" className="w-full justify-center" onClick={onJoinCommunity}>
                Explore Community Membership →
              </Button>
            </Card>
          ) : (
            <Card glass className="p-6 space-y-5 border border-purple-500/30 w-full">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-purple-950 pb-3">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-[#8B2FC9]" /> Registration Panel
                </h3>
                <span className="text-[11px] font-mono text-[#8B2FC9]">
                  {isRegistrationOpen ? 'Open' : 'Closed'}
                </span>
              </div>

              {registrationSuccess ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">Registration Confirmed</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300">Your seat has been reserved.</p>
                    </div>
                  </div>

                  {/* Compact Ticket Credential Widget with overflow safety */}
                  <div className="p-4 rounded-xl bg-[#0A0610] border border-purple-500/30 space-y-2 text-white overflow-hidden">
                    <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-widest text-purple-400">
                      <span>YOUR TICKET</span>
                      <span>SECURED</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-sm tracking-wider break-all" style={{ overflowWrap: 'anywhere' }}>
                        {registrationSuccess.ticketCode || 'TICK-SECURE-99'}
                      </span>
                      <span className="text-[10px] text-gray-400 shrink-0">INnovateAI Pass</span>
                    </div>
                  </div>
                </div>
              ) : isRegistrationOpen ? (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@university.edu"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-[#0A0610] border border-gray-200 dark:border-purple-900/50 text-gray-900 dark:text-white text-xs focus:outline-none focus:border-[#8B2FC9]"
                    />
                  </div>

                  {registrationError && (
                    <p className="text-xs text-red-500 font-medium break-words">{registrationError}</p>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full justify-center text-xs"
                    isLoading={isRegistering}
                  >
                    Register for Activity
                  </Button>
                </form>
              ) : (
                <div className="py-6 text-center space-y-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    Registration is currently closed for this activity.
                  </p>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
