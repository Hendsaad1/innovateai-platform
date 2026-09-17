import React, { useEffect, useState } from 'react';
import { EchoHeading } from '../../components/ui/EchoHeading';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingState } from '../../components/ui/LoadingState';
import { apiService } from '../../services/api';
import { Calendar, MapPin, User, CheckCircle2, AlertCircle } from 'lucide-react';

export const PublicEvents: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [regEmail, setRegEmail] = useState('');
  const [regStatus, setRegStatus] = useState<{ success?: string; error?: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiService.getEvents()
      .then((data) => setEvents(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !regEmail) return;
    setSubmitting(true);
    setRegStatus(null);

    try {
      const res = await apiService.registerEvent(selectedEvent.id, regEmail);
      setRegStatus({ success: res.message || 'Successfully registered for public event!' });
      setRegEmail('');
    } catch (err: any) {
      setRegStatus({ error: err.message || 'Registration failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Workshops, Seminars & Sprints</span>
        <EchoHeading text="COMMUNITY EVENTS" size="lg" />
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
          Participate in expert-led technical sessions, hackathons, and research symposia. Enforced server-side uniqueness per registration.
        </p>
      </div>

      {loading ? (
        <LoadingState message="Loading events..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((ev) => (
            <Card key={ev.id} glass className="space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="purple">{ev.category || 'WORKSHOP'}</Badge>
                  <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-500" /> {ev.eventDate || ev.date}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {ev.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {ev.description}
                </p>
                <div className="space-y-2 pt-2 text-xs text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-500" /> {ev.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-500" /> Speaker: {ev.speaker}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-purple-950 flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-500">
                  {ev.registeredCount || 140} / {ev.capacity || 200} Seats Claimed
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedEvent(ev);
                    setRegStatus(null);
                  }}
                >
                  Register Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Registration Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#150A21] border border-gray-200 dark:border-purple-900/50 rounded-2xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative">
            <div className="space-y-2">
              <Badge variant="purple">Event Registration</Badge>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedEvent.title}</h3>
              <p className="text-xs text-gray-500">Note: A person may have only ONE registration per Public Event. Duplicate registration attempts are rejected server-side.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="student@university.edu"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-purple-950 bg-gray-50 dark:bg-[#0A0610] text-gray-900 dark:text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              {regStatus?.success && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {regStatus.success}
                </div>
              )}

              {regStatus?.error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {regStatus.error}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setSelectedEvent(null)}>
                  Close
                </Button>
                <Button variant="primary" size="sm" type="submit" isLoading={submitting}>
                  Confirm Registration
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
