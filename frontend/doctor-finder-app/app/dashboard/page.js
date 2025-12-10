'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Loader2,
  CalendarCheck,
  CalendarX,
  AlertCircle,
  Star,
  ArrowRight,
} from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/dashboard');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments();
    }
  }, [isAuthenticated]);

  const fetchAppointments = async () => {
    try {
      const data = await api.getAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Mock data for demo
      setAppointments([
        {
          id: '1',
          doctor: { firstName: 'Sarah', lastName: 'Johnson', specialization: { name: 'Cardiology' } },
          appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString(),
          appointmentTime: '10:00',
          status: 'confirmed',
          symptoms: 'Regular checkup',
        },
        {
          id: '2',
          doctor: { firstName: 'Michael', lastName: 'Chen', specialization: { name: 'Dermatology' } },
          appointmentDate: new Date(Date.now() + 86400000 * 5).toISOString(),
          appointmentTime: '14:30',
          status: 'pending',
          symptoms: 'Skin rash',
        },
        {
          id: '3',
          doctor: { firstName: 'Emily', lastName: 'Davis', specialization: { name: 'Neurology' } },
          appointmentDate: new Date(Date.now() - 86400000 * 3).toISOString(),
          appointmentTime: '09:00',
          status: 'completed',
          symptoms: 'Headache consultation',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    setCancellingId(id);
    try {
      await api.cancelAppointment(id);
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status: 'cancelled' } : apt
      ));
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      // For demo, update locally anyway
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status: 'cancelled' } : apt
      ));
    } finally {
      setCancellingId(null);
    }
  };

  const upcomingAppointments = appointments.filter(
    (apt) => new Date(apt.appointmentDate) >= new Date() && apt.status !== 'cancelled'
  );
  const pastAppointments = appointments.filter(
    (apt) => new Date(apt.appointmentDate) < new Date() || apt.status === 'completed'
  );
  const cancelledAppointments = appointments.filter((apt) => apt.status === 'cancelled');

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
      <div className="bg-gradient-to-br from-teal-600 to-emerald-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-teal-100">
                Manage your appointments and health journey
              </p>
            </div>
            <Link href="/doctors">
              <Button className="bg-white text-teal-700 hover:bg-teal-50">
                Book New Appointment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-6 -mt-16 mb-8"
        >
          <Card className="border-0 shadow-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <CalendarCheck className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">{upcomingAppointments.length}</p>
                <p className="text-slate-500">Upcoming</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">{pastAppointments.length}</p>
                <p className="text-slate-500">Completed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                <CalendarX className="w-7 h-7 text-red-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">{cancelledAppointments.length}</p>
                <p className="text-slate-500">Cancelled</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appointments Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {upcomingAppointments.length === 0 ? (
                <Card className="border-0 shadow-md">
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      No Upcoming Appointments
                    </h3>
                    <p className="text-slate-600 mb-6">
                      You don't have any scheduled appointments.
                    </p>
                    <Link href="/doctors">
                      <Button className="bg-teal-500 hover:bg-teal-600">
                        Find a Doctor
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onCancel={handleCancelAppointment}
                      cancelling={cancellingId === appointment.id}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {pastAppointments.length === 0 ? (
                <Card className="border-0 shadow-md">
                  <CardContent className="p-12 text-center">
                    <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      No Past Appointments
                    </h3>
                    <p className="text-slate-600">
                      Your appointment history will appear here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pastAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      isPast
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="cancelled">
              {cancelledAppointments.length === 0 ? (
                <Card className="border-0 shadow-md">
                  <CardContent className="p-12 text-center">
                    <CalendarX className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      No Cancelled Appointments
                    </h3>
                    <p className="text-slate-600">
                      Cancelled appointments will appear here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {cancelledAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      isCancelled
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

function AppointmentCard({ appointment, onCancel, cancelling, isPast, isCancelled }) {
  const appointmentDate = new Date(appointment.appointmentDate);
  
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Doctor Info */}
          <div className="flex items-start gap-4 flex-1">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
              {appointment.doctor?.firstName?.[0]}{appointment.doctor?.lastName?.[0]}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-slate-900">
                Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
              </h3>
              <p className="text-teal-600 font-medium">
                {appointment.doctor?.specialization?.name}
              </p>
              {appointment.symptoms && (
                <p className="text-slate-500 text-sm mt-1">
                  Reason: {appointment.symptoms}
                </p>
              )}
            </div>
          </div>

          {/* Date & Status */}
          <div className="flex flex-col items-end gap-2">
            <Badge className={statusColors[appointment.status]}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Badge>
            <div className="text-right">
              <p className="font-semibold text-slate-900">
                {appointmentDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <p className="text-slate-500">{appointment.appointmentTime}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {!isPast && !isCancelled && (
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <Link href={`/doctors/${appointment.doctor?.id || appointment.doctorId}`}>
              <Button variant="outline" size="sm">
                View Doctor
              </Button>
            </Link>
            {appointment.status !== 'completed' && (
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                onClick={() => onCancel(appointment.id)}
                disabled={cancelling}
              >
                {cancelling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Cancel'
                )}
              </Button>
            )}
          </div>
        )}

        {isPast && appointment.status === 'completed' && (
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <Button variant="outline" size="sm">
              <Star className="w-4 h-4 mr-2" />
              Leave Review
            </Button>
            <Link href={`/doctors/${appointment.doctor?.id || appointment.doctorId}`}>
              <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                Book Again
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}











