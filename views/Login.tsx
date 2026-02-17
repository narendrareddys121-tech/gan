
import React, { useState } from 'react';
import { LucideShield, LucideCheck, LucideMail, LucideLock, LucideEye, LucideEyeOff, LucideUser } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, would authenticate here
    onLogin();
  };

  return (
    <div className="flex-1 flex flex-col p-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-violet-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center relative z-10 space-y-8">
        {/* Logo & Branding */}
        <div className="text-center space-y-4 animate-fade-in-down">
          <div className="w-20 h-20 mx-auto bg-blue-600/20 rounded-full flex items-center justify-center animate-scale-in">
            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
              <LucideShield size={28} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">AuraScan AI</h1>
            <p className="text-sm opacity-60">Intelligent product analysis for your wellness</p>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-3 animate-fade-in-up stagger-1">
          <div className="flex items-start gap-3">
            <div className="mt-1 p-1.5 bg-emerald-500/20 rounded-lg">
              <LucideCheck size={14} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-semibold">Unlock personalized insights</p>
              <p className="text-xs opacity-50">Tailored to your health profile & preferences</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 p-1.5 bg-blue-500/20 rounded-lg">
              <LucideCheck size={14} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold">Save & sync your scans</p>
              <p className="text-xs opacity-50">Access your history across all devices</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 p-1.5 bg-violet-500/20 rounded-lg">
              <LucideCheck size={14} className="text-violet-500" />
            </div>
            <div>
              <p className="text-sm font-semibold">Compare & track products</p>
              <p className="text-xs opacity-50">Make informed choices with AI-powered comparison</p>
            </div>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up stagger-2">
          {isSignUp && (
            <div className="relative">
              <LucideUser size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
              />
            </div>
          )}
          
          <div className="relative">
            <LucideMail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
              required
            />
          </div>

          <div className="relative">
            <LucideLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity"
            >
              {showPassword ? <LucideEyeOff size={18} /> : <LucideEye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Social Login */}
        <div className="space-y-3 animate-fade-in-up stagger-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-[#0F1419] opacity-50">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={onLogin}
              className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 py-3 rounded-2xl text-sm font-semibold transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button 
              onClick={onLogin}
              className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 py-3 rounded-2xl text-sm font-semibold transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple
            </button>
          </div>
        </div>

        {/* Toggle Sign Up / Sign In */}
        <div className="text-center text-sm animate-fade-in-up stagger-4">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <span className="text-blue-400 font-semibold underline">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
