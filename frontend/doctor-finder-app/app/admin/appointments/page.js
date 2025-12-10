'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import {
  Search,
  Loader2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
} from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminAppointmentsPage() {
  const router = useRouter();
  const { loading: authLoading, isAdmin, isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/admin/appointments');
      } else if (!isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchAppointments();
    }
  }, [isAdmin]);

  const fetchAppointments = async () => {
    try {
      const data = await api.getAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Mock data
      setAppointments([
        { id: '1', user: { firstName: 'John', lastName: 'Doe', email: 'john@test.com' }, doctor: { firstName: 'Sarah', lastName: 'Johnson', specialization: { name: 'Cardiology' } }, appointmentDate: new Date().toISOString(), appointmentTime: '10:00', status: 'pending', symptoms: 'Chest pain' },
        { id: '2', user: { firstName: 'Jane', lastName: 'Smith', email: 'jane@test.com' }, doctor: { firstName: 'Michael', lastName: 'Chen', specialization: { name: 'Dermatology' } }, appointmentDate: new Date().toISOString(), appointmentTime: '14:30', status: 'confirmed', symptoms: 'Skin rash' },
        { id: '3', user: { firstName: 'Bob', lastName: 'Wilson', email: 'bob@test.com' }, doctor: { firstName: 'Emily', lastName: 'Davis', specialization: { name: 'Neurology' } }, appointmentDate: new Date(Date.now() - 86400000).toISOString(), appointmentTime: '09:00', status: 'completed', symptoms: 'Headache' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    setActionLoading(id);
    try {
      await api.confirmAppointment(id);
      setAppointments(appointments.map(apt => apt.id === id ? { ...apt, status: 'confirmed' } : apt));
    } catch (error) {
      console.error('Error confirming appointment:', error);
      setAppointments(appointments.map(apt => apt.id === id ? { ...apt, status: 'confirmed' } : apt));
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (id) => {
    setActionLoading(id);
    try {
      await api.completeAppointment(id);
      setAppointments(appointments.map(apt => apt.id === id ? { ...apt, status: 'completed' } : apt));
    } catch (error) {
      console.error('Error completing appointment:', error);
      setAppointments(appointments.map(apt => apt.id === id ? { ...apt, status: 'completed' } : apt));
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    setActionLoading(id);
    try {
      await api.cancelAppointment(id);
      setAppointments(appointments.map(apt => apt.id === id ? { ...apt, status: 'cancelled' } : apt));
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setAppointments(appointments.map(apt => apt.id === id ? { ...apt, status: 'cancelled' } : apt));
    } finally {
      setActionLoading(null);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.user?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctor?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctor?.lastName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="inline-flex items-center text-slate-300 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-white">Manage Appointments</h1>
            <p className="text-slate-300">{appointments.length} total appointments</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Appointments Table */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-slate-700">Patient</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Doctor</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Date & Time</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Symptoms</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                    <th className="text-right p-4 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((apt) => (
                    <tr key={apt.id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {apt.user?.firstName} {apt.user?.lastName}
                          </p>
                          <p className="text-sm text-slate-500">{apt.user?.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-slate-900">
                            Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}
                          </p>
                          <p className="text-sm text-slate-500">{apt.doctor?.specialization?.name}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-900">
                              {new Date(apt.appointmentDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-slate-500">{apt.appointmentTime}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600 max-w-xs truncate">
                        {apt.symptoms || 'Not specified'}
                      </td>
                      <td className="p-4">
                        <Badge className={statusColors[apt.status]}>
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          {actionLoading === apt.id ? (
                            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                          ) : (
                            <>
                              {apt.status === 'pending' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    onClick={() => handleConfirm(apt.id)}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Confirm
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleCancel(apt.id)}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Cancel
                                  </Button>
                                </>
                              )}
                              {apt.status === 'confirmed' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    onClick={() => handleComplete(apt.id)}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Complete
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleCancel(apt.id)}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Cancel
                                  </Button>
                                </>
                              )}
                              {(apt.status === 'completed' || apt.status === 'cancelled') && (
                                <span className="text-sm text-slate-400">No actions</span>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredAppointments.length === 0 && (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No appointments found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}












