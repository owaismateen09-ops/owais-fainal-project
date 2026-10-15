import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuota } from '../context/QuotaContext';
import { Sparkles, Wand2, Video, Crop, Film, Shield, LogOut, Menu, X, Coins, UserCheck } from 'lucide-react';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const { user, role, logout, switchDemoRole, isSandbox } = useAuth();
  const { imageCredits, videoCredits } = useQuota();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-dark-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-electric-600 via-violet-600 to-cyan-500 flex items-center justify-center p-0.5 shadow-glow-blue transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-electric-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Flow AI<span className="text-electric-400 font-mono text-sm ml-1">STUDIO</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/features"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                isActive('/features') ? 'text-electric-400 bg-slate-800/50' : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
              }`}
            >
              Features
            </Link>
            <Link
              to="/image-generator"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                isActive('/image-generator') ? 'text-electric-400 bg-slate-800/50' : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
              }`}
            >
              <Wand2 className="w-4 h-4 text-electric-400" />
              AI Image
            </Link>
            <Link
              to="/video-generator"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                isActive('/video-generator') ? 'text-electric-400 bg-slate-800/50' : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
              }`}
            >
              <Video className="w-4 h-4 text-violet-400" />
              AI Video
            </Link>
            <Link
              to="/photo-editor"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                isActive('/photo-editor') ? 'text-electric-400 bg-slate-800/50' : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
              }`}
            >
              <Crop className="w-4 h-4 text-cyan-400" />
              Photo Editor
            </Link>
            <Link
              to="/video-editor"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                isActive('/video-editor') ? 'text-electric-400 bg-slate-800/50' : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
              }`}
            >
              <Film className="w-4 h-4 text-pink-400" />
              Video Editor
            </Link>
            <Link
              to="/pricing"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                isActive('/pricing') ? 'text-electric-400 bg-slate-800/50' : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
              }`}
            >
              Pricing
            </Link>
          </div>

          {/* User Credits, Sandbox Role Switcher & Profile */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* Live Quota Pill */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-dark-900 border border-slate-800 text-xs text-slate-300">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-semibold text-white">{imageCredits}</span>
                  <span className="text-slate-500">img</span>
                  <span className="text-slate-600">|</span>
                  <span className="font-semibold text-white">{videoCredits}</span>
                  <span className="text-slate-500">vid</span>
                </div>

                {/* Role Switcher Pill (Sandbox mode) */}
                {isSandbox && (
                  <div className="flex items-center bg-dark-900 border border-slate-800 rounded-xl p-0.5 text-xs">
                    <button
                      onClick={() => switchDemoRole('user')}
                      className={`px-2 py-1 rounded-lg transition ${role === 'user' ? 'bg-electric-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
                      title="Test as regular creator"
                    >
                      User
                    </button>
                    <button
                      onClick={() => switchDemoRole('admin')}
                      className={`px-2 py-1 rounded-lg transition ${role === 'admin' ? 'bg-violet-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
                      title="Test as staff moderator"
                    >
                      Admin
                    </button>
                    <button
                      onClick={() => switchDemoRole('super_admin')}
                      className={`px-2 py-1 rounded-lg transition ${role === 'super_admin' ? 'bg-amber-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
                      title="Test as system owner"
                    >
                      SuperAdmin
                    </button>
                  </div>
                )}

                {/* Dashboard / Admin links */}
                <Link to="/dashboard">
                  <Button variant="secondary" size="sm">
                    Dashboard
                  </Button>
                </Link>

                {role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" icon={<Shield className="w-3.5 h-3.5 text-violet-400" />}>
                      Admin
                    </Button>
                  </Link>
                )}

                {role === 'super_admin' && (
                  <Link to="/super-admin">
                    <Button variant="outline" size="sm" icon={<Shield className="w-3.5 h-3.5 text-amber-400" />}>
                      Super Admin
                    </Button>
                  </Link>
                )}

                <button
                  onClick={() => logout()}
                  className="p-2 text-slate-400 hover:text-rose-400 transition rounded-lg hover:bg-slate-800/40"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-dark-950 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800/50"
          >
            Features
          </Link>
          <Link
            to="/image-generator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800/50"
          >
            AI Image Generator
          </Link>
          <Link
            to="/video-generator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800/50"
          >
            AI Video Generator
          </Link>
          <Link
            to="/photo-editor"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800/50"
          >
            Photo Editor
          </Link>
          <Link
            to="/video-editor"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800/50"
          >
            Video Editor
          </Link>
          <Link
            to="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800/50"
          >
            Pricing
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800/50"
          >
            About & Team
          </Link>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Open Studio Dashboard
                  </Button>
                </Link>
                <Button variant="danger" className="w-full" onClick={() => logout()}>
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
