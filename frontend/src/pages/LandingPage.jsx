import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Users, Share2, BarChart3, ChevronRight } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="glass-card p-6 hover:bg-white/20 transition-all duration-300"
  >
    <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-primary-400" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-slate-400">{description}</p>
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="flex flex-col gap-24">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="max-w-4xl mx-auto px-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            How well do your friends <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
              really know you?
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Create a premium, interactive friendship quiz in seconds. Share the link, let them guess, and see who takes the crown on your live leaderboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
              <Sparkles className="h-5 w-5" />
              Create Your Quiz
            </Link>
            <Link to="/login" className="btn-secondary flex items-center gap-2 text-lg px-8 py-4 group">
              Explore Demo <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to test friendships</h2>
          <p className="text-slate-400 text-lg">A premium experience for both you and your friends.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Users} 
            title="Unlimited Quizzes" 
            description="Create as many quizzes as you want. Test different friend groups, coworkers, or family members."
            delay={0.1}
          />
          <FeatureCard 
            icon={Share2} 
            title="Smart Sharing" 
            description="Generate a beautiful, unique link. Share it directly to WhatsApp, Twitter, or anywhere else."
            delay={0.2}
          />
          <FeatureCard 
            icon={BarChart3} 
            title="Live Results & Analytics" 
            description="Watch the scores roll in real-time. See who got what right, and who failed miserably."
            delay={0.3}
          />
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 glass-panel p-8 md:p-16 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-500/20 rounded-full blur-[80px] -z-10"></div>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
          {[
            { step: '1', title: 'Create', desc: 'Add your custom questions' },
            { step: '2', title: 'Share', desc: 'Send the link to friends' },
            { step: '3', title: 'See Results', desc: 'Check your leaderboard' }
          ].map((item, index) => (
            <div key={item.step} className="flex flex-col items-center text-center relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-2xl font-bold mb-4 shadow-lg shadow-primary-500/30">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-slate-400">{item.desc}</p>
              {index < 2 && (
                <div className="hidden md:block absolute top-8 -right-12 w-8 h-[2px] bg-white/20"></div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
