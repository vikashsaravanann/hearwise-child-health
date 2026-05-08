import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, Award, Activity, MapPin, Download, Settings, Bell, Search } from 'lucide-react';

interface DashboardCard {
  id: string;
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  change: number;
  trend: 'up' | 'down';
}

interface SchoolData {
  name: string;
  students: number;
  completedTests: number;
  avgScore: number;
  trend: number;
}

interface LevelData {
  name: string;
  students: number;
  avgScore: number;
}

export default function AnimatedDashboardPage() {
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const dashboardCards: DashboardCard[] = [
    { id: 'total-students', title: 'Total Students', value: 2543, subtitle: 'Active enrollments', icon: <Users size={32} />, color: 'from-blue-400 to-blue-600', change: 12.5, trend: 'up' },
    { id: 'tests-completed', title: 'Tests Completed', value: 18924, subtitle: 'This month', icon: <Activity size={32} />, color: 'from-cyan-400 to-cyan-600', change: 8.3, trend: 'up' },
    { id: 'avg-score', title: 'Avg Score', value: '82%', subtitle: 'Overall performance', icon: <Award size={32} />, color: 'from-emerald-400 to-emerald-600', change: 5.2, trend: 'up' },
    { id: 'schools-active', title: 'Schools Active', value: 156, subtitle: 'Across India', icon: <MapPin size={32} />, color: 'from-orange-400 to-orange-600', change: 3.8, trend: 'up' },
  ];

  const schoolPerformance: SchoolData[] = [
    { name: 'Delhi Public School', students: 450, completedTests: 3200, avgScore: 85, trend: 5 },
    { name: 'St. Xavier School', students: 380, completedTests: 2800, avgScore: 88, trend: 8 },
    { name: 'Modern School', students: 520, completedTests: 3900, avgScore: 82, trend: -2 },
    { name: 'Aditya Birla School', students: 410, completedTests: 3100, avgScore: 86, trend: 6 },
    { name: 'Cathedral School', students: 390, completedTests: 2900, avgScore: 84, trend: 3 },
  ];

  const levelDistribution: LevelData[] = [
    { name: 'Level 1', students: 2100, avgScore: 90 },
    { name: 'Level 2', students: 1950, avgScore: 85 },
    { name: 'Level 3', students: 1650, avgScore: 82 },
    { name: 'Level 4', students: 980, avgScore: 78 },
    { name: 'Level 5', students: 450, avgScore: 75 },
  ];

  const monthlyTrend = [
    { month: 'Jan', tests: 15000, score: 78 },
    { month: 'Feb', tests: 16500, score: 80 },
    { month: 'Mar', tests: 17200, score: 81 },
    { month: 'Apr', tests: 18900, score: 82 },
    { month: 'May', tests: 19500, score: 83 },
    { month: 'Jun', tests: 21200, score: 84 },
  ];

  useEffect(() => {
    dashboardCards.forEach((card) => {
      const numValue = typeof card.value === 'string' ? parseInt(card.value) : card.value;
      let count = 0;
      const increment = Math.ceil(numValue / 30);
      const timer = setInterval(() => {
        count += increment;
        if (count >= numValue) {
          setAnimatedValues((prev) => ({ ...prev, [card.id]: numValue }));
          clearInterval(timer);
        } else {
          setAnimatedValues((prev) => ({ ...prev, [card.id]: count }));
        }
      }, 30);
      return () => clearInterval(timer);
    });
  }, []);

  const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-4 md:p-8">
      <div className="flex justify-between items-center mb-8 flex-col md:flex-row gap-4">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            🌊 HearWise Admin Dashboard
          </h1>
          <p className="text-gray-600 font-semibold">Real-time hearing health analytics for children</p>
        </div>
        <div className="flex gap-4">
          <button className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95"><Bell size={24} className="text-blue-600" /></button>
          <button className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95"><Settings size={24} className="text-blue-600" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <div
            key={card.id}
            className={`relative rounded-3xl overflow-hidden shadow-xl border-2 border-white/50 backdrop-blur-sm transition-all duration-300 cursor-pointer stagger-${index + 1} ${hoveredCard === card.id ? 'scale-105 shadow-2xl' : 'hover:scale-102'}`}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{ background: `linear-gradient(135deg, hsl(${[200, 195, 150, 30][index]}, 100%, 90%) 0%, hsl(${[200, 195, 150, 30][index]}, 100%, 75%) 100%)` }}
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse" />
            </div>
            <div className="relative p-6 z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/30 rounded-2xl backdrop-blur-sm"><div className="text-white">{card.icon}</div></div>
                <div className={`text-xs font-bold px-3 py-1 rounded-full ${card.trend === 'up' ? 'bg-green-400/30 text-green-700' : 'bg-red-400/30 text-red-700'}`}>
                  {card.trend === 'up' ? '📈' : '📉'} {Math.abs(card.change)}%
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700 opacity-80 mb-2">{card.title}</p>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-1">
                {typeof card.value === 'string' ? card.value : animatedValues[card.id] || 0}
              </h3>
              <p className="text-sm text-gray-100 opacity-75">{card.subtitle}</p>
            </div>
            {hoveredCard === card.id && (<div className="absolute inset-0 rounded-3xl border-2 border-white/60 animate-pulse-ring" />)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">📊 Monthly Trend</h3>
              <p className="text-sm text-gray-600 mt-1">Tests completed and average scores</p>
            </div>
            <button className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-all"><Download size={20} className="text-blue-600" /></button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <defs>
                <linearGradient id="colorTests" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '2px solid #3b82f6', borderRadius: '12px' }} />
              <Legend />
              <Line type="monotone" dataKey="tests" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 6 }} activeDot={{ r: 8 }} name="Tests Completed" />
              <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 6 }} activeDot={{ r: 8 }} name="Avg Score (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">🎯 Level Distribution</h3>
          <p className="text-sm text-gray-600 mb-6">Students per level</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={levelDistribution} cx="50%" cy="50%" labelLine={false} label={(entry) => `${entry.name}: ${entry.students}`} outerRadius={80} fill="#8884d8" dataKey="students" animationBegin={0} animationDuration={800}>
                {levelDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-6 flex-col md:flex-row gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">🏫 School Performance</h3>
            <p className="text-sm text-gray-600 mt-1">Top performing schools across India</p>
          </div>
          <div className="relative w-full md:w-64">
            <input type="text" placeholder="Search schools..." className="w-full px-4 py-2 rounded-full border-2 border-gray-200 pl-10 focus:outline-none focus:border-blue-500" />
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 font-bold text-gray-900">School Name</th>
                <th className="text-center py-4 px-4 font-bold text-gray-900">Students</th>
                <th className="text-center py-4 px-4 font-bold text-gray-900">Tests Done</th>
                <th className="text-center py-4 px-4 font-bold text-gray-900">Avg Score</th>
                <th className="text-center py-4 px-4 font-bold text-gray-900">Trend</th>
              </tr>
            </thead>
            <tbody>
              {schoolPerformance.map((school, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-blue-50/50 transition-all cursor-pointer">
                  <td className="py-4 px-4 font-semibold text-gray-900">{school.name}</td>
                  <td className="text-center py-4 px-4"><span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full font-bold text-sm">{school.students}</span></td>
                  <td className="text-center py-4 px-4"><span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-600 rounded-full font-bold text-sm">{school.completedTests}</span></td>
                  <td className="text-center py-4 px-4"><span className="inline-block px-3 py-1 bg-green-100 text-green-600 rounded-full font-bold text-sm">{school.avgScore}%</span></td>
                  <td className="text-center py-4 px-4"><span className={`inline-block px-3 py-1 rounded-full font-bold text-sm ${school.trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{school.trend > 0 ? '📈' : '📉'} {Math.abs(school.trend)}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">⭐ Performance by Level</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={levelDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '2px solid #3b82f6', borderRadius: '12px' }} />
            <Legend />
            <Bar dataKey="students" fill="#3b82f6" radius={[12, 12, 0, 0]} name="Students" />
            <Bar dataKey="avgScore" fill="#10b981" radius={[12, 12, 0, 0]} name="Avg Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <style>{`
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.1); opacity: 0; } }
        .animate-pulse-ring { animation: pulse-ring 1.5s ease-out infinite; }
        .stagger-1 { animation-delay: 0s; }
        .stagger-2 { animation-delay: 0.1s; }
        .stagger-3 { animation-delay: 0.2s; }
        .stagger-4 { animation-delay: 0.3s; }
      `}</style>
    </div>
  );
}
