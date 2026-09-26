import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  Heart,
  ArrowRight,
  Shield,
  Brain,
  Users,
  BarChart3,
  Zap,
  Target,
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const features = [
    {
      icon: <Brain size={24} />,
      title: 'AI-Powered Predictions',
      description: 'Predict donor turnout and identify no-show risks before campaign day.',
    },
    {
      icon: <Target size={24} />,
      title: 'Turnout Rescue Mode',
      description: 'Intelligent system to bridge the gap between registrations and attendance.',
    },
    {
      icon: <Users size={24} />,
      title: 'Smart Mobilisation',
      description: 'Personalized reminders in English, Hindi, and Marathi with human approval.',
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Predictive Analytics',
      description: 'Compare predicted vs actual turnout. Continuous learning from real data.',
    },
    {
      icon: <Shield size={24} />,
      title: 'QR Registration',
      description: 'Quick donor registration via QR codes with instant confirmation.',
    },
    {
      icon: <Zap size={24} />,
      title: 'Real-time Updates',
      description: 'Live dashboard updates powered by WebSocket technology.',
    },
  ];

  return (
    <div className="min-h-screen bg-navy-950 overflow-hidden">
      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/20">
            <Heart size={20} className="text-white" fill="white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">DonorPulse</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-gray-300 hover:text-white">
            Sign In
          </Link>
          <Link to="/register" className="btn-primary text-sm px-5 py-2.5">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 lg:px-12 pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Background effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Intelligent Blood Donation Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6">
              Connecting Donors.{' '}
              <span className="gradient-text">Predicting Turnout.</span>{' '}
              Saving Lives.
            </h1>

            <p className="text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              DonorPulse doesn't just count registrations. It predicts turnout,
              identifies potential no-shows, recommends targeted actions, and
              learns from actual attendance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto"
              >
                Start Free <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="btn-secondary text-base px-8 py-3.5 w-full sm:w-auto"
              >
                Sign In
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-20"
          >
            {[
              { value: '98%', label: 'Prediction Accuracy' },
              { value: '2x', label: 'Turnout Improvement' },
              { value: '40%', label: 'No-Show Reduction' },
              { value: '24/7', label: 'Real-time Monitoring' },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-5 text-center">
                <p className="text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 lg:px-12 py-20 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Everything you need for{' '}
              <span className="gradient-text">smarter campaigns</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              From registration to analytics, DonorPulse covers the entire blood donation campaign lifecycle.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 hover:border-red-500/20 transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 mb-4 group-hover:bg-red-500/20 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-red-500" fill="currentColor" />
            <span className="text-sm text-gray-500">DonorPulse © 2026. Saving Lives with AI.</span>
          </div>
          <p className="text-xs text-gray-600">
            Built for hackathon demonstration. Not for production medical use.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
