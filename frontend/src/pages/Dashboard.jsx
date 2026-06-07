import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  LineChart, Line, CartesianGrid 
} from 'recharts';
import { Activity, Users, Trophy, Target, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const StatCard = ({ title, value, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="glass-card p-6"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary-400" />
      </div>
    </div>
    <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
    <div className="text-3xl font-bold">{value}</div>
  </motion.div>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Mock data for charts since we didn't implement complex timeseries aggregation in backend
  const chartData = [
    { name: 'Mon', attempts: 4 },
    { name: 'Tue', attempts: 7 },
    { name: 'Wed', attempts: 12 },
    { name: 'Thu', attempts: 8 },
    { name: 'Fri', attempts: 15 },
    { name: 'Sat', attempts: 22 },
    { name: 'Sun', attempts: 18 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-slate-400">Welcome back! Here's how your quizzes are performing.</p>
        </div>
        <Link to="/create-quiz" className="btn-primary flex items-center gap-2">
          Create New Quiz
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Quizzes" value={data?.totalQuizzes || 0} icon={Target} delay={0.1} />
        <StatCard title="Total Participants" value={data?.totalParticipants || 0} icon={Users} delay={0.2} />
        <StatCard title="Total Attempts" value={data?.totalParticipants || 0} icon={Activity} delay={0.3} />
        <StatCard title="Average Score" value={`${data?.averageScore || 0}%`} icon={Trophy} delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 glass-panel p-6"
        >
          <h3 className="text-lg font-semibold mb-6">Activity This Week</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8'}} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="attempts" 
                  stroke="#14b8a6" 
                  strokeWidth={3}
                  dot={{ fill: '#14b8a6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#0d9488' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-panel p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Recent Attempts</h3>
          </div>
          
          <div className="space-y-4">
            {data?.recentAttempts && data.recentAttempts.length > 0 ? (
              data.recentAttempts.map((attempt) => (
                <div key={attempt._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div>
                    <p className="font-medium">{attempt.participantName}</p>
                    <p className="text-xs text-slate-400">took {attempt.quizId?.title}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${attempt.percentage >= 80 ? 'text-green-400' : attempt.percentage >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {attempt.percentage}%
                    </p>
                    <Link to={`/quiz/${attempt.quizId?.slug}/results`} className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
                      View <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">No recent attempts yet.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
