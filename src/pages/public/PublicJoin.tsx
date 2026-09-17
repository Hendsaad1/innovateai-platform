import React, { useState, useEffect } from 'react';
import { EchoHeading } from '../../components/ui/EchoHeading';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { apiService } from '../../services/api';
import { CheckCircle2, AlertCircle, Send, Sparkles, Clock, ShieldCheck } from 'lucide-react';

export const PublicJoin: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    arabicFirstName: '',
    arabicLastName: '',
    englishFirstName: '',
    englishLastName: '',
    phone: '',
    whatsappPhone: '',
    nationalId: '',
    university: '',
    academicYear: 'Sophomore',
    address: '',
    arabicAddress: '',
    linkedin: '',
    selectedTeam: 'HR',
    motivation: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{
    referenceCode: string;
    message: string;
    isExisting?: boolean;
    status?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiService.getTeams()
      .then((res) => {
        if (Array.isArray(res)) setTeams(res);
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await apiService.submitApplication(formData);
      setSuccessData({
        referenceCode: res.referenceCode || 'INNOVATE-APP-' + Math.floor(1000 + Math.random() * 9000),
        message: res.message || 'Application submitted successfully.',
        isExisting: !!res.isExisting,
        status: res.status || 'SUBMITTED',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="space-y-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Recruitment Portal</span>
        <EchoHeading text="JOIN INNOVATEAI" size="lg" />
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Become part of the INnovateAI university technology community. Fill out your details below to begin your recruitment journey.
        </p>
      </div>

      {successData ? (
        <Card glass className="p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              {successData.isExisting ? 'APPLICATION ALREADY EXISTS' : 'APPLICATION SUBMITTED'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {successData.isExisting
                ? 'You already have an active recruitment application.'
                : 'Your application has been successfully received by our recruitment committee.'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 max-w-sm mx-auto space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Application Reference</span>
            <div className="text-xl font-mono font-black text-gray-900 dark:text-white">{successData.referenceCode}</div>
          </div>

          <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 max-w-sm mx-auto flex items-center justify-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Current Status:</span>
            <Badge variant={successData.status === 'ACCEPTED' ? 'emerald' : successData.status === 'REJECTED' ? 'danger' : 'purple'}>
              {successData.status || 'SUBMITTED'}
            </Badge>
          </div>

          {successData.status === 'ACCEPTED' && (
            <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 max-w-md mx-auto space-y-3">
              <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">APPLICATION ACCEPTED</h4>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Your application has been accepted. Next step: Activate your INnovateAI member account.
              </p>
              <Button variant="primary" size="sm" onClick={() => window.location.href = '/login'}>
                Activate Account
              </Button>
            </div>
          )}

          {successData.status === 'REJECTED' && (
            <div className="p-5 rounded-xl bg-red-500/10 border border-red-500/20 max-w-md mx-auto space-y-2">
              <h4 className="text-sm font-bold text-red-600 dark:text-red-400">APPLICATION STATUS: REJECTED</h4>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Thank you for your interest in INnovateAI. Unfortunately, your application was not selected in this recruitment cycle.
              </p>
            </div>
          )}

          <div className="pt-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Application Status Journey</h4>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 ${['SUBMITTED', 'SCREENING', 'SHORTLISTED', 'INTERVIEW', 'ACCEPTED', 'REJECTED'].includes(successData.status || 'SUBMITTED') ? 'bg-emerald-500/20 text-emerald-500' : 'bg-gray-100 text-gray-500'}`}>
                ✓ Submitted
              </span>
              <span className="text-gray-400">→</span>
              <span className={`px-3 py-1.5 rounded-lg font-medium ${successData.status === 'SCREENING' || ['SHORTLISTED', 'INTERVIEW', 'ACCEPTED'].includes(successData.status || '') ? 'bg-purple-500/20 text-purple-400 font-bold' : 'bg-gray-100 dark:bg-purple-950/40 text-gray-500'}`}>
                Screening
              </span>
              <span className="text-gray-400">→</span>
              <span className={`px-3 py-1.5 rounded-lg font-medium ${successData.status === 'SHORTLISTED' || ['INTERVIEW', 'ACCEPTED'].includes(successData.status || '') ? 'bg-purple-500/20 text-purple-400 font-bold' : 'bg-gray-100 dark:bg-purple-950/40 text-gray-500'}`}>
                Shortlisted
              </span>
              <span className="text-gray-400">→</span>
              <span className={`px-3 py-1.5 rounded-lg font-medium ${successData.status === 'INTERVIEW' || successData.status === 'ACCEPTED' ? 'bg-purple-500/20 text-purple-400 font-bold' : 'bg-gray-100 dark:bg-purple-950/40 text-gray-500'}`}>
                Interview
              </span>
              <span className="text-gray-400">→</span>
              <span className={`px-3 py-1.5 rounded-lg font-medium ${successData.status === 'ACCEPTED' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : successData.status === 'REJECTED' ? 'bg-red-500/20 text-red-400 font-bold' : 'bg-gray-100 dark:bg-purple-950/40 text-gray-500'}`}>
                Decision
              </span>
            </div>
          </div>
        </Card>
      ) : (
        <Card glass className="p-6 sm:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Contact & Identification */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-purple-950 pb-3">
                1. Personal & Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="student@university.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-purple-950 bg-gray-50 dark:bg-[#0A0610] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">National ID / University ID *</label>
                  <input
                    type="text"
                    name="nationalId"
                    required
                    placeholder="ID Number"
                    value={formData.nationalId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-purple-950 bg-gray-50 dark:bg-[#0A0610] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Names (Separate Arabic & English) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4 p-4 rounded-xl border border-gray-200 dark:border-purple-950/60 bg-gray-50/50 dark:bg-[#120A1D]">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">English Name (الاسم بالإنجليزية)</span>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="englishFirstName"
                      required
                      placeholder="First Name"
                      value={formData.englishFirstName}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-purple-950 bg-white dark:bg-[#0A0610] text-sm text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      name="englishLastName"
                      required
                      placeholder="Last Name"
                      value={formData.englishLastName}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-purple-950 bg-white dark:bg-[#0A0610] text-sm text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4 p-4 rounded-xl border border-gray-200 dark:border-purple-950/60 bg-gray-50/50 dark:bg-[#120A1D]">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Arabic Name (الاسم بالعربية)</span>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="arabicFirstName"
                      required
                      placeholder="الاسم الأول"
                      value={formData.arabicFirstName}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-purple-950 bg-white dark:bg-[#0A0610] text-sm text-gray-900 dark:text-white text-right"
                    />
                    <input
                      type="text"
                      name="arabicLastName"
                      required
                      placeholder="اسم العائلة"
                      value={formData.arabicLastName}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-purple-950 bg-white dark:bg-[#0A0610] text-sm text-gray-900 dark:text-white text-right"
                    />
                  </div>
                </div>
              </div>

              {/* Phone & WhatsApp (Separate fields) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+20 100 000 0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-purple-950 bg-gray-50 dark:bg-[#0A0610] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">WhatsApp Phone *</label>
                  <input
                    type="tel"
                    name="whatsappPhone"
                    required
                    placeholder="+20 100 000 0000"
                    value={formData.whatsappPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-purple-950 bg-gray-50 dark:bg-[#0A0610] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Academic & Address */}
            <div className="space-y-6 pt-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-purple-950 pb-3">
                2. Academic & Location Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">University *</label>
                  <input
                    type="text"
                    name="university"
                    required
                    placeholder="University Name"
                    value={formData.university}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-purple-950 bg-gray-50 dark:bg-[#0A0610] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Academic Year *</label>
                  <select
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-purple-950 bg-gray-50 dark:bg-[#0A0610] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Address (English) *</label>
                  <textarea
                    name="address"
                    required
                    rows={2}
                    placeholder="Street, City, Country"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-purple-950 bg-gray-50 dark:bg-[#0A0610] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">العنوان (Arabic) *</label>
                  <textarea
                    name="arabicAddress"
                    required
                    rows={2}
                    placeholder="الشارع، المدينة، الدولة"
                    value={formData.arabicAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-purple-950 bg-gray-50 dark:bg-[#0A0610] text-sm text-gray-900 dark:text-white text-right focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">LinkedIn Profile (URL)</label>
                  <input
                    type="url"
                    name="linkedin"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-purple-950 bg-gray-50 dark:bg-[#0A0610] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Selected Team *</label>
                  <select
                    name="selectedTeam"
                    value={formData.selectedTeam}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-purple-950 bg-gray-50 dark:bg-[#0A0610] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="HR">HR Team</option>
                    <option value="Graphic">Graphic Design</option>
                    <option value="PM">Project Management (PM)</option>
                    <option value="PR">Public Relations (PR)</option>
                    <option value="EDU & Content">EDU & Content</option>
                    <option value="Media Marketing">Media Marketing</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Motivation & Experience *</label>
                <textarea
                  name="motivation"
                  required
                  rows={4}
                  placeholder="Describe your background, AI research interest, and why you wish to join this team..."
                  value={formData.motivation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-purple-950 bg-gray-50 dark:bg-[#0A0610] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <Button variant="primary" size="lg" type="submit" isLoading={submitting}>
                Submit Recruitment Application <Send className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

