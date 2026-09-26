import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { campaignService } from '../services/campaignService';
import { Campaign } from '../types';
import { motion } from 'framer-motion';
import {
  Plus,
  Megaphone,
  MapPin,
  Calendar,
  Users,
  ChevronRight,
  Search,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';

const statusColors: Record<string, string> = {
  draft: 'status-draft',
  published: 'status-published',
  active: 'status-active',
  completed: 'status-completed',
  cancelled: 'status-cancelled',
};

const CampaignsPage: React.FC = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await campaignService.getAll();
      if (response.success) {
        setCampaigns(response.data);
      }
    } catch (error) {
      toast.error('Failed to load campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const isOrganizer = user?.role === 'organizer' || user?.role === 'admin';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Campaigns</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isOrganizer ? 'Manage your blood donation campaigns' : 'Browse available campaigns'}
          </p>
        </div>
        {isOrganizer && (
          <Link to="/dashboard/campaigns/create" className="btn-primary">
            <Plus size={18} /> Create Campaign
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search campaigns by name, location, or city..."
          className="input-premium pl-11 w-full"
        />
        <Filter size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-5 animate-pulse">
              <div className="h-4 bg-white/5 rounded w-3/4 mb-3" />
              <div className="h-3 bg-white/5 rounded w-1/2 mb-4" />
              <div className="h-3 bg-white/5 rounded w-2/3 mb-2" />
              <div className="h-3 bg-white/5 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : filteredCampaigns.length === 0 ? (
        /* Empty State */
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
            <Megaphone size={32} className="text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {searchQuery ? 'No campaigns found' : 'No campaigns yet'}
          </h3>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            {searchQuery
              ? 'Try a different search term'
              : isOrganizer
              ? 'Create your first campaign to get started'
              : 'Check back later for available campaigns'}
          </p>
          {isOrganizer && !searchQuery && (
            <Link to="/dashboard/campaigns/create" className="btn-primary">
              <Plus size={18} /> Create Campaign
            </Link>
          )}
        </div>
      ) : (
        /* Campaign Cards */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/dashboard/campaigns/${campaign._id}`}
                className="glass-card p-5 block hover:border-red-500/20 transition-all duration-300 group h-full"
              >
                {/* Status badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`badge ${statusColors[campaign.status] || 'badge-neutral'} capitalize`}>
                    {campaign.status}
                  </span>
                  <ChevronRight size={16} className="text-gray-600 group-hover:text-red-400 transition-colors" />
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
                  {campaign.name}
                </h3>

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    <span>{formatDate(campaign.date)}</span>
                    <span className="text-gray-700">•</span>
                    <span>{campaign.startTime} - {campaign.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span className="truncate">{campaign.location}{campaign.city ? `, ${campaign.city}` : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>{campaign.registrationCount || 0} / {campaign.targetDonors} donors</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, ((campaign.registrationCount || 0) / campaign.targetDonors) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1.5">
                    {Math.round(((campaign.registrationCount || 0) / campaign.targetDonors) * 100)}% registered
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default CampaignsPage;
