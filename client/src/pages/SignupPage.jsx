import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

const perks = ['5 Professional Templates', 'AI-Powered Content', 'PDF Export', 'ATS Score Checker'];

export default function SignupPage() {
  const [showPw, setShowPw] = useState(false);
  const { register: registerUser, isLoading } = useAuthStore();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    const result = await registerUser(data.name, data.email, data.password);
    if (!result.success) toast.error(result.message);
    else toast.success('Account created! Welcome aboard 🎉');
  };

  return (
    <div className="min-h-screen bg-dark-100 bg-mesh flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-dark-900">ResumeAI</span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-dark-900 mb-2">Create your account</h1>
          <p className="text-dark-600">Start building beautiful resumes for free</p>
        </div>

        {/* Perks */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {perks.map(perk => (
            <span key={perk} className="flex items-center gap-1 text-xs text-dark-700 bg-white px-3 py-1 rounded-full border border-dark-200">
              <CheckCircle className="w-3 h-3 text-primary-600" /> {perk}
            </span>
          ))}
        </div>

        <div className="card border border-dark-200/80">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="input-label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
                  type="text" placeholder="John Doe"
                  className="input-field pl-10" id="signup-name"
                />
              </div>
              {errors.name && <p className="input-error">{errors.name.message}</p>}
            </div>

            <div>
              <label className="input-label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' }
                  })}
                  type="email" placeholder="you@example.com"
                  className="input-field pl-10" id="signup-email"
                />
              </div>
              {errors.email && <p className="input-error">{errors.email.message}</p>}
            </div>

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'At least 6 characters' }
                  })}
                  type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters"
                  className="input-field pl-10 pr-10" id="signup-password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-900 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="input-error">{errors.password.message}</p>}
            </div>

            <div>
              <label className="input-label">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm password',
                    validate: val => val === password || 'Passwords do not match'
                  })}
                  type={showPw ? 'text' : 'password'} placeholder="••••••••"
                  className="input-field pl-10" id="signup-confirm-password"
                />
              </div>
              {errors.confirmPassword && <p className="input-error">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center" id="signup-submit">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Creating account...
                </span>
              ) : (
                <><span>Create Account — It's Free</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <p className="text-center text-xs text-dark-500">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          <div className="divider" />
          <p className="text-center text-sm text-dark-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium transition-colors font-semibold">
              Sign in
            </Link>
          </p>
        </div>

        <div className="fixed top-20 right-10 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-20 left-10 w-48 h-48 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
      </motion.div>
    </div>
  );
}
