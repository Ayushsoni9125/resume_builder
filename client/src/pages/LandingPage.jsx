import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, ArrowRight, Zap, FileText, Download, TrendingUp,
  Brain, Palette, Shield, Star, CheckCircle, ChevronRight, Code2
} from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI-Powered Content', desc: 'Gemini AI generates professional summaries, project descriptions, and skill suggestions tailored to your profile.', color: 'from-primary-500 to-purple-500' },
  { icon: Palette, title: '5 Premium Templates', desc: 'Choose from Modern Professional, Minimal Clean, Developer Portfolio, Corporate ATS, and Creative Designer.', color: 'from-blue-500 to-cyan-500' },
  { icon: TrendingUp, title: 'ATS Score Checker', desc: 'Get instant feedback on your ATS compatibility score with actionable improvement suggestions.', color: 'from-green-500 to-teal-500' },
  { icon: Download, title: 'One-Click PDF Export', desc: 'Download a pixel-perfect PDF that maintains exact formatting across all templates.', color: 'from-orange-500 to-red-500' },
  { icon: Shield, title: 'ATS-Optimized', desc: 'All templates are designed to pass ATS filters with clean, parseable layouts and relevant keywords.', color: 'from-pink-500 to-rose-500' },
  { icon: Zap, title: 'Real-time Preview', desc: 'See every change instantly with our live preview that updates as you type.', color: 'from-yellow-500 to-orange-500' },
];

const templates = [
  { name: 'Modern Professional', color: 'from-primary-600 to-blue-600', desc: 'Two-column, bold accents' },
  { name: 'Minimal Clean', color: 'from-gray-600 to-slate-700', desc: 'Elegant single-column' },
  { name: 'Developer Portfolio', color: 'from-gray-900 to-slate-800', desc: 'Code-inspired dark header' },
  { name: 'Corporate ATS', color: 'from-slate-500 to-gray-700', desc: 'ATS-safe, clean layout' },
  { name: 'Creative Designer', color: 'from-pink-600 to-purple-600', desc: 'Colorful sidebar design' },
];

const stats = [
  { value: '50K+', label: 'Resumes Created' },
  { value: '5', label: 'Premium Templates' },
  { value: '95%', label: 'ATS Pass Rate' },
  { value: '4.9★', label: 'User Rating' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-950 text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 border-b border-white/5 bg-dark-950/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg">ResumeAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
            <Link to="/signup" className="btn-primary text-sm py-2" id="landing-cta-nav">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 bg-mesh overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

        <motion.div
          className="text-center max-w-4xl mx-auto relative z-10"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-sm text-primary-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powered by Google Gemini AI</span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6">
            Build{' '}
            <span className="text-gradient">AI-Powered</span>
            <br />Resumes That
            <br />
            <span className="text-gradient">Get You Hired</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-xl text-dark-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create stunning, ATS-optimized resumes in minutes with AI-generated content,
            5 professional templates, and real-time preview. Stand out from the crowd.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary text-base px-8 py-4 shadow-glow-lg" id="hero-cta">
              Create My Resume <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-4">
              Sign In
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8">
            {['No credit card required', 'Free forever', '5 templates'].map(item => (
              <div key={item} className="flex items-center gap-1.5 text-sm text-dark-400">
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                {item}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}>
              <div className="text-3xl font-display font-bold text-gradient">{stat.value}</div>
              <div className="text-sm text-dark-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Everything you need to land your dream job
            </h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              From AI content generation to ATS optimization — we've built every tool you need to create a standout resume.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-hover group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-white text-lg mb-2">{feature.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates showcase */}
      <section className="py-24 px-4 bg-dark-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              5 Professional Templates
            </h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              Switch between templates instantly. Every design is crafted for maximum impact.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {templates.map((tpl, i) => (
              <motion.div key={tpl.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group cursor-pointer"
              >
                <div className={`h-40 rounded-2xl bg-gradient-to-br ${tpl.color} relative overflow-hidden border border-white/10 group-hover:border-primary-500/50 transition-all duration-300 group-hover:shadow-glow mb-3`}>
                  {/* Mini resume mockup */}
                  <div className="absolute inset-3 bg-white/10 rounded-lg backdrop-blur-sm flex flex-col gap-1.5 p-2">
                    <div className="h-2.5 bg-white/60 rounded w-20" />
                    <div className="h-1.5 bg-white/30 rounded w-14" />
                    <div className="mt-2 space-y-1">
                      <div className="h-1 bg-white/20 rounded" />
                      <div className="h-1 bg-white/20 rounded w-4/5" />
                      <div className="h-1 bg-white/20 rounded w-3/5" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </div>
                <p className="text-sm font-semibold text-white text-center">{tpl.name}</p>
                <p className="text-xs text-dark-500 text-center">{tpl.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Get your resume ready in 3 steps
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Fill Your Details', desc: 'Enter your personal info, experience, education, and projects into our guided form.', icon: FileText },
              { step: '02', title: 'AI Generates Content', desc: 'Click AI Generate to create compelling summaries, project descriptions, and skill suggestions.', icon: Brain },
              { step: '03', title: 'Download & Apply', desc: 'Choose a template, preview your resume, and download a perfect PDF with one click.', icon: Download },
            ].map((item, i) => (
              <motion.div key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-[10px] font-mono text-primary-400 uppercase tracking-widest mb-2">{item.step}</div>
                <h3 className="text-lg font-display font-bold text-white mb-2">{item.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="card border border-primary-500/20 bg-gradient-card relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-glow opacity-50" />
            <div className="relative z-10 py-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow animate-pulse-glow">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-display font-bold text-white mb-4">
                Ready to land your dream job?
              </h2>
              <p className="text-dark-300 mb-8 max-w-lg mx-auto">
                Join thousands of professionals who've used ResumeAI to create standout resumes and get hired faster.
              </p>
              <Link to="/signup" className="btn-primary text-lg px-10 py-4 shadow-glow-lg" id="bottom-cta">
                Build My Resume Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-white text-sm">ResumeAI</span>
          </div>
          <p className="text-dark-500 text-xs">© 2024 ResumeAI. Built with ❤️ and Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
}
