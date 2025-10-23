'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Activity,
  Users,
  Clock,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  Coffee,
  ChevronRight,
  RefreshCw,
  Calendar,
  MapPin
} from 'lucide-react';

export default function ModernDashboard() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = () => {
    const baseDate = new Date(2024, 9, 21);
    const time = currentTime;

    const dateStr = baseDate.toLocaleDateString('en-GB', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    const timeStr = time.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return { date: dateStr, time: timeStr };
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const stats = [
    {
      id: 1,
      label: 'Active',
      sublabel: 'Theatres',
      value: '18/23',
      icon: Activity,
      color: 'from-green-500 to-emerald-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      trend: '+2'
    },
    {
      id: 2,
      label: 'On Duty',
      sublabel: 'Staff',
      value: '73',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 3,
      label: 'On Break',
      sublabel: 'Staff',
      value: '8',
      icon: Coffee,
      color: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      id: 4,
      label: 'Efficiency',
      sublabel: 'Score',
      value: '92%',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      trend: '+3%'
    }
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Staff Wellbeing',
      subtitle: 'Manage breaks & relief requests',
      icon: Coffee,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      badge: '3',
      onClick: () => router.push('/modern/wellbeing')
    },
    {
      id: 2,
      title: 'Theatre Schedule',
      subtitle: 'View all theatre operations',
      icon: Calendar,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      onClick: () => router.push('/modern/schedule')
    },
    {
      id: 3,
      title: 'Staff Directory',
      subtitle: 'View staff on duty & status',
      icon: Users,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      onClick: () => router.push('/modern/staff')
    },
    {
      id: 4,
      title: 'Performance',
      subtitle: 'Efficiency & turnover metrics',
      icon: TrendingUp,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      onClick: () => router.push('/modern/performance')
    }
  ];

  const alerts = [
    {
      id: 1,
      title: 'Relief Request',
      subtitle: 'S. Patel (Anaes N/P)',
      detail: 'Main Theatre 3',
      time: '2m',
      urgent: false,
      color: 'blue',
      onClick: () => router.push('/modern/wellbeing')
    },
    {
      id: 2,
      title: 'Urgent Relief',
      subtitle: 'RN M. Johnson',
      detail: 'DSU Theatre 5',
      time: '5m',
      urgent: true,
      color: 'red',
      onClick: () => router.push('/modern/wellbeing')
    },
    {
      id: 3,
      title: 'Break Overdue',
      subtitle: '12 staff members',
      detail: 'Require break scheduling',
      time: '10m',
      urgent: false,
      color: 'orange',
      onClick: () => router.push('/modern/wellbeing')
    }
  ];

  const { date, time } = formatDateTime();

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Compact Header - Epic Style */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white sticky top-0 z-40 shadow-lg">
          {/* Top bar */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-xl font-bold">TOM Dashboard</h1>
                <div className="flex items-center gap-3 mt-1 text-xs text-blue-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {time}
                  </span>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                className="p-2.5 hover:bg-white/10 rounded-xl transition-all active:scale-95"
              >
                <RefreshCw
                  className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
                />
              </button>
            </div>
          </div>

          {/* Stats Row - Scrollable on mobile */}
          <div className="px-4 pb-3 overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 min-w-min">
              {stats.map((stat) => (
                <motion.div
                  key={stat.id}
                  whileTap={{ scale: 0.97 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex-shrink-0 w-[140px] border border-white/20"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className={`${stat.iconBg} bg-opacity-20 p-1.5 rounded-lg`}>
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                    {stat.trend && (
                      <span className="text-xs font-semibold text-green-300">
                        {stat.trend}
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-[10px] text-blue-100 mt-0.5">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 space-y-4">
          {/* Quick Actions Grid */}
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <motion.button
                  key={action.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={action.onClick}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left relative overflow-hidden active:shadow-md transition-shadow"
                >
                  {action.badge && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {action.badge}
                    </div>
                  )}
                  <div className={`${action.iconBg} p-2.5 rounded-xl inline-flex mb-3`}>
                    <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                  </div>
                  <div className="font-semibold text-gray-900 text-sm mb-1">
                    {action.title}
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-2">
                    {action.subtitle}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Recent Alerts - List Style */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900">Recent Alerts</h2>
              <button
                onClick={() => router.push('/modern/wellbeing')}
                className="text-blue-600 text-sm font-semibold active:text-blue-700"
              >
                View All
              </button>
            </div>
            <div className="space-y-2">
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={alert.onClick}
                  className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 ${
                    alert.urgent ? 'border-red-500' : 'border-blue-500'
                  } active:shadow-md transition-shadow cursor-pointer`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 text-sm">
                          {alert.title}
                        </span>
                        {alert.urgent && (
                          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      <div className="text-sm text-gray-700 mb-0.5">
                        {alert.subtitle}
                      </div>
                      <div className="text-xs text-gray-500">{alert.detail}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-gray-400">{alert.time}</div>
                      <ChevronRight className="w-4 h-4 text-gray-400 ml-auto mt-1" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm mb-1">
                  NHS Theatre Department
                </div>
                <div className="text-xs text-gray-600">
                  Real-time operations management system
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </>
  );
}
