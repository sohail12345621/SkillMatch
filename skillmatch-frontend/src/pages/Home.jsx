import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: '🔄',
    title: 'Mutual Skill Exchange',
    desc: 'Teach what you know, learn what you want. Our algorithm finds perfect barter matches automatically.',
  },
  {
    icon: '🎯',
    title: 'Smart Matching',
    desc: 'AI-powered matching finds users whose offered skills align with your learning goals — and vice versa.',
  },
  {
    icon: '📅',
    title: 'Session Scheduling',
    desc: 'Schedule online or offline learning sessions with your matches. Track status from pending to completed.',
  },
  {
    icon: '⭐',
    title: 'Ratings & Reviews',
    desc: 'Rate sessions and build your reputation. Higher-rated users attract better skill exchange partners.',
  },
  {
    icon: '🎓',
    title: 'College Community',
    desc: 'Connect with students from your college or across campuses. Filter by institution to find local peers.',
  },
  {
    icon: '🔍',
    title: 'Skill Discovery',
    desc: 'Browse skills by category, search by name, or explore what your campus community has to offer.',
  },
];

const stats = [
  { value: '500+', label: 'Skills Available' },
  { value: '1,200+', label: 'Active Users' },
  { value: '3,000+', label: 'Sessions Completed' },
  { value: '4.8', label: 'Average Rating' },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/50 via-surface-950 to-surface-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-accent-500/8 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-primary-300 mb-8 animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Barter-Based Skill Exchange Platform
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              <span className="text-white">Teach One Skill.</span>
              <br />
              <span className="gradient-text">Learn Another.</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              SkillMatch connects you with students who want to learn what you know — and teach what you need.
              No money. Just skills.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="px-8 py-3.5 rounded-xl text-base font-semibold bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 transition-all duration-300 shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
                >
                  Go to Dashboard →
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-3.5 rounded-xl text-base font-semibold bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 transition-all duration-300 shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
                  >
                    Get Started Free →
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-3.5 rounded-xl text-base font-semibold glass text-gray-300 hover:text-white glass-hover transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* How it works - visual flow */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'List Your Skills', desc: 'Add skills you can teach and skills you want to learn' },
              { step: '02', title: 'Get Matched', desc: 'Our algorithm finds mutual exchange partners automatically' },
              { step: '03', title: 'Start Learning', desc: 'Schedule sessions, exchange knowledge, and rate your experience' },
            ].map((item, i) => (
              <div key={i} className="relative glass rounded-2xl p-6 text-center group hover:border-primary-500/30 transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl font-black gradient-text mb-3">{item.step}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-primary-500/40 text-2xl">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-extrabold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Everything You Need to <span className="gradient-text">Exchange Skills</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A complete platform built for students who believe the best way to learn is to teach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-6 group hover:border-primary-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative glass rounded-3xl p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-accent-500/10" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Ready to Start Exchanging Skills?
              </h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Join thousands of students who are learning new skills through peer-to-peer exchange.
              </p>
              {!user && (
                <Link
                  to="/register"
                  className="inline-flex px-8 py-3.5 rounded-xl text-base font-semibold bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 transition-all duration-300 shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40"
                >
                  Create Free Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>© 2025 SkillMatch. Built for college skill exchange.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
