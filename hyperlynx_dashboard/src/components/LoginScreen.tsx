import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AlertCircle } from 'lucide-react';
import hyperlynxLogo from '../assets/logo.png';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSwitchToSignup: () => void;
  error?: string;
}

export function LoginScreen({ onLogin, onSwitchToSignup, error }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center p-4">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-indigo-900/40 to-teal-800/40" />
      
      <div className="w-full max-w-2xl relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <img src={hyperlynxLogo} alt="Hyperlynx" className="w-10 h-10" />
          <span className="text-white text-2xl">Hyperlynx</span>
        </div>

        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-8 lg:p-12">
          <div className="mb-8">
            <p className="text-white/60 text-sm mb-2">Welcome back</p>
            <h2 className="text-white text-3xl">Sign in to your account</h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80 text-sm">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@company.com"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80 text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 h-12"
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black hover:bg-white/90 h-12"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="text-white hover:text-white/80 transition-colors underline"
              >
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
