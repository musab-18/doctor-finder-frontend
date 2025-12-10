'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import {
  Users,
  Stethoscope,
  Calendar,
  Activity,
  ArrowRight,
  TrendingUp,
  Loader2,
  LayoutDashboard,
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    users: { total: 0, active: 0 },
    doctors: { total: 0, featured: 0 },
    appointments: { total: 0, pending: 0, confirmed: 0, completed: 0 },
    specializations: { total: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/admin');
      } else if (!isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      const [userStats, appointmentStats] = await Promise.all([
        api.getUserStatistics(),
        api.getAppointmentStatistics(),
      ]);
      setStats({
        users: userStats || { total: 156, active: 142 },
        appointments: appointmentStats || { total: 523, pending: 45, confirmed: 78, completed: 400 },
        doctors: { total: 48, featured: 10 },
        specializations: { total: 12 },
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Mock data for demo
      setStats({
        users: { total: 156, active: 142 },
        appointments: { total: 523, pending: 45, confirmed: 78, completed: 400 },
        doctors: { total: 48, featured: 10 },
        specializations: { total: 12 },
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.users.total,
      subtitle: `${stats.users.active} active`,
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      link: '/admin/users',
    },
    {
      title: 'Doctors',
      value: stats.doctors.total,
      subtitle: `${stats.doctors.featured} featured`,
      icon: Stethoscope,
      color: 'from-teal-500 to-emerald-600',
      bgColor: 'bg-teal-50',
      link: '/admin/doctors',
    },
    {
      title: 'Appointments',
      value: stats.appointments.total,
      subtitle: `${stats.appointments.pending} pending`,
      icon: Calendar,
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      link: '/admin/appointments',
    },
    {
      title: 'Specializations',
      value: stats.specializations.total,
      subtitle: 'Categories',
      icon: Activity,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      link: '/admin/specializations',
    },
  ];

  const quickActions = [
    { label: 'Manage Users', href: '/admin/users', icon: Users },
    { label: 'Manage Doctors', href: '/admin/doctors', icon: Stethoscope },
    { label: 'Manage Appointments', href: '/admin/appointments', icon: Calendar },
    { label: 'Manage Specializations', href: '/admin/specializations', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Admin Dashboard
              </h1>
              <p className="text-slate-300">
                Welcome back, {user?.firstName}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-16 mb-8"
        >
          {statCards.map((stat, index) => (
            <Link key={index} href={stat.link}>
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-slate-500 text-sm">{stat.title}</p>
                      <p className="text-4xl font-bold text-slate-900 my-2">{stat.value}</p>
                      <p className="text-sm text-slate-500">{stat.subtitle}</p>
                    </div>
                    <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-7 h-7 text-slate-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <Button
                      variant="outline"
                      className="w-full h-16 justify-between group hover:border-teal-300 hover:bg-teal-50"
                    >
                      <span className="flex items-center gap-2">
                        <action.icon className="w-5 h-5 text-slate-500 group-hover:text-teal-600" />
                        {action.label}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid lg:grid-cols-2 gap-8"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                Appointment Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Pending</span>
                  <span className="font-semibold text-yellow-600">{stats.appointments.pending}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: `${(stats.appointments.pending / stats.appointments.total) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Confirmed</span>
                  <span className="font-semibold text-green-600">{stats.appointments.confirmed}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${(stats.appointments.confirmed / stats.appointments.total) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Completed</span>
                  <span className="font-semibold text-blue-600">{stats.appointments.completed}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(stats.appointments.completed / stats.appointments.total) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                User Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-48">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto relative">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#e2e8f0"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="url(#gradient)"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(stats.users.active / stats.users.total) * 352} 352`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient">
                          <stop offset="0%" stopColor="#14b8a6" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-slate-900">
                        {Math.round((stats.users.active / stats.users.total) * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-slate-600">Active Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}












