import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-dark-950/60 backdrop-blur-md pt-12 pb-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-electric-600 to-violet-600 flex items-center justify-center p-0.5">
                <div className="w-full h-full bg-dark-950 rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-electric-400" />
                </div>
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Flow AI <span className="text-electric-400 font-mono text-xs">STUDIO</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Production-oriented creative SaaS platform integrating multi-model AI Image and Video generation with professional in-browser editing suites.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Systems Operational
            </div>
          </div>

          {/* Creative Tools */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">Creative Studio</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/image-generator" className="hover:text-white transition">AI Image Studio</Link></li>
              <li><Link to="/video-generator" className="hover:text-white transition">AI Video Synthesis</Link></li>
              <li><Link to="/photo-editor" className="hover:text-white transition">Canvas Photo Editor</Link></li>
              <li><Link to="/video-editor" className="hover:text-white transition">Video Timeline Editor</Link></li>
              <li><Link to="/my-creations" className="hover:text-white transition">My Creations Cloud</Link></li>
            </ul>
          </div>

          {/* Resources & Docs */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">Project & Specs</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/features" className="hover:text-white transition">Feature Architecture</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition">Credit Quotas & Tiers</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Project & Team</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Support & Feedback</Link></li>
              <li><a href="/docs/FINAL_PROJECT_REPORT.md" target="_blank" className="hover:text-white transition">Academic Report (PDF/MD)</a></li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase">Security & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-white transition">Terms of Service</Link></li>
              <li><span className="text-slate-500">PostgreSQL RLS Protected</span></li>
              <li><span className="text-slate-500">Netlify + Supabase Architecture</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Flow AI Studio. Developed by Owais for Final Project Evaluation.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> & React TypeScript
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
