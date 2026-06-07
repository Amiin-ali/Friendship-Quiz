import { Zap, Globe, MessageCircle, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/10 bg-dark-900/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Zap className="h-6 w-6 text-primary-400" />
              <span className="font-heading font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
                KnowMe Challenge
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm">
              Discover how well your friends really know you with beautiful, interactive friendship quizzes.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Product</h3>
            <ul className="space-y-3 text-slate-400">
              <li><Link to="/create-quiz" className="hover:text-primary-400 transition-colors">Create Quiz</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Connect</h3>
            <div className="flex space-x-4 text-slate-400">
              <a href="#" className="hover:text-white transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} KnowMe Challenge. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-4 md:mt-0">
            Made with <Heart className="h-4 w-4 text-red-500 inline" /> by Antigravity
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
