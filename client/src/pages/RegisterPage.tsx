import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, Droplets, Building } from 'lucide-react';
import toast from 'react-hot-toast';

const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const RegisterPage: React.FC = () => {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'donor',
    bloodGroup: 'O+',
    organization: '',
    organizationType: 'college',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    try {
      await register(form);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4 sm:p-6">
      {/* Background effects */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-red-600/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/20">
            <Heart size={20} className="text-white" fill="white" />
          </div>
          <span className="text-xl font-bold text-white">DonorPulse</span>
        </div>

        <div className="glass-card p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white mb-1">Create your account</h2>
          <p className="text-gray-500 mb-6 text-sm">Join DonorPulse and help save lives</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">I am a</label>
              <div className="grid grid-cols-2 gap-2">
                {['donor', 'organizer'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm({ ...form, role })}
                    className={`py-2.5 px-4 rounded-xl text-sm font-medium capitalize transition-all ${
                      form.role === role
                        ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                        : 'bg-white/5 text-gray-400 border border-white/5 hover:border-white/10'
                    }`}
                  >
                    {role === 'donor' ? '🩸 Donor' : '📋 Organizer'}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First"
                    className="input-premium pl-10 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last"
                  className="input-premium text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-premium pl-10 text-sm"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Phone (Optional)</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="input-premium pl-10 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className="input-premium pl-10 pr-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role-specific fields */}
            {form.role === 'donor' && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Blood Group</label>
                <div className="relative">
                  <Droplets size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <select
                    name="bloodGroup"
                    value={form.bloodGroup}
                    onChange={handleChange}
                    className="input-premium pl-10 text-sm appearance-none cursor-pointer"
                  >
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg} className="bg-navy-900">{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {form.role === 'organizer' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Organization</label>
                  <div className="relative">
                    <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      name="organization"
                      value={form.organization}
                      onChange={handleChange}
                      placeholder="Organization name"
                      className="input-premium pl-10 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
                  <select
                    name="organizationType"
                    value={form.organizationType}
                    onChange={handleChange}
                    className="input-premium text-sm appearance-none cursor-pointer"
                  >
                    {['hospital', 'ngo', 'college', 'corporate', 'government', 'other'].map((t) => (
                      <option key={t} value={t} className="bg-navy-900 capitalize">{t}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-red-400 hover:text-red-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
