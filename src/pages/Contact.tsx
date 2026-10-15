import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mockStorage } from '../lib/mockStorage';
import { SupportRequest } from '../types';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { Mail, MessageSquare, Send, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorNotice('Please provide a valid email address.');
      return;
    }
    if (!subject.trim()) {
      setErrorNotice('Please provide a subject for your ticket.');
      return;
    }
    if (!message.trim()) {
      setErrorNotice('Please write a message.');
      return;
    }

    setErrorNotice(null);
    setSubmitting(true);

    setTimeout(() => {
      const ticket: SupportRequest = {
        id: 'ticket_' + Date.now(),
        owner_id: user?.user_id,
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      mockStorage.saveSupportTicket(ticket);
      setSubmitting(false);
      setSubmitted(true);
      setSubject('');
      setMessage('');
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-xs font-medium mb-4">
          <MessageSquare className="w-3.5 h-3.5" />
          Support & Feedback Desk
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3 font-['Space_Grotesk']">
          Contact the Flow AI Team
        </h1>
        <p className="text-sm text-slate-400">
          Have an inquiry, feature suggestion, or need quota assistance? Open a support ticket below.
        </p>
      </div>

      <GlassCard className="p-8 sm:p-10">
        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Ticket Submitted Successfully</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your request has been recorded in the Flow AI support queue. Staff administrators can inspect tickets in the Admin Center.
            </p>
            <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
              Submit Another Message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorNotice && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorNotice}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Your Email Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Subject Topic <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Quota allocation question or feedback"
                  className="w-full bg-dark-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Detailed Message <span className="text-rose-400">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Explain your inquiry or issue in detail..."
                className="w-full bg-dark-950 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-electric-500 resize-none"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={submitting}
              icon={<Send className="w-4 h-4" />}
            >
              Submit Support Request
            </Button>
          </form>
        )}
      </GlassCard>
    </div>
  );
};
