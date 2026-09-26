import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  Megaphone,
  Users,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowRight,
  Activity,
  Heart,
  Calendar,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  // Organizer Dashboard
  if (user?.role === 'organizer' || user?.role === 'admin') {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Campaign Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your blood donation campaigns</p>
          </div>
          <Link to="/dashboard/campaigns/create" className="btn-primary">
            <Plus size={18} /> Create Campaign
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Campaigns', value: '0', icon: <Megaphone size={20} />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Registrations', value: '0', icon: <Users size={20} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Predicted Turnout', value: '0%', icon: <TrendingUp size={20} />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { label: 'High Risk Donors', value: '0', icon: <AlertTriangle size={20} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-5 hover:border-white/10 transition-all">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-4">
          <Link to="/dashboard/campaigns/create" className="glass-card p-5 hover:border-red-500/20 transition-all group flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 transition-all">
              <Plus size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white">Create New Campaign</h3>
              <p className="text-xs text-gray-500">Set up a new blood donation drive</p>
            </div>
            <ArrowRight size={18} className="text-gray-600 group-hover:text-red-400 transition-colors" />
          </Link>
          <Link to="/dashboard/campaigns" className="glass-card p-5 hover:border-blue-500/20 transition-all group flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-all">
              <Megaphone size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white">View All Campaigns</h3>
              <p className="text-xs text-gray-500">Monitor and manage your campaigns</p>
            </div>
            <ArrowRight size={18} className="text-gray-600 group-hover:text-blue-400 transition-colors" />
          </Link>
        </motion.div>

        {/* Empty State */}
        <motion.div variants={itemVariants} className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <Activity size={32} className="text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No campaigns yet</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            Create your first blood donation campaign to start tracking registrations, predictions, and turnout.
          </p>
          <Link to="/dashboard/campaigns/create" className="btn-primary">
            <Plus size={18} /> Create Your First Campaign
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  // Donor Dashboard
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-white">Donor Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Your donation journey at a glance</p>
      </motion.div>

      {/* Donor Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Upcoming Campaigns', value: '0', icon: <Calendar size={20} />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'My Registrations', value: '0', icon: <Heart size={20} />, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Donations Made', value: '0', icon: <Target size={20} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Impact Score', value: '0', icon: <TrendingUp size={20} />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-5 hover:border-white/10 transition-all">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Quick Action: Find Campaigns */}
      <motion.div variants={itemVariants}>
        <Link to="/dashboard/campaigns" className="glass-card p-5 hover:border-red-500/20 transition-all group flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 transition-all">
            <Megaphone size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white">Browse Campaigns</h3>
            <p className="text-xs text-gray-500">Find blood donation campaigns near you</p>
          </div>
          <ArrowRight size={18} className="text-gray-600 group-hover:text-red-400 transition-colors" />
        </Link>
      </motion.div>

      {/* Empty State */}
      <motion.div variants={itemVariants} className="glass-card p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <Heart size={32} className="text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No registrations yet</h3>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
          Browse available campaigns and register to donate blood. Every drop counts!
        </p>
        <Link to="/dashboard/campaigns" className="btn-primary">
          Find Campaigns <ArrowRight size={18} />
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
