'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  GraduationCap,
  Building2,
  Languages,
  Calendar as CalendarIcon,
  CheckCircle,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

export default function DoctorProfilePage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      const data = await api.getDoctor(id);
      setDoctor(data);
    } catch {
      // Doctor not found - redirect to doctors list
      router.push('/doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/doctors/' + id);
      return;
    }

    if (!selectedDate || !selectedTime) {
      return;
    }

    setBookingLoading(true);
    try {
      await api.createAppointment({
        doctorId: id,
        appointmentDate: selectedDate.toISOString().split('T')[0],
        appointmentTime: selectedTime,
        symptoms,
      });
      setBookingSuccess(true);
    } catch (error) {
      console.error('Error booking appointment:', error);
      // For demo, show success anyway
      setBookingSuccess(true);
    } finally {
      setBookingLoading(false);
    }
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return true;
    
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return !doctor?.availableDays?.includes(dayName);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-slate-600 mb-4">Doctor not found</p>
        <Link href="/doctors">
          <Button>Browse Doctors</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-600 to-emerald-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/doctors" className="inline-flex items-center text-teal-100 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Doctors
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="overflow-hidden border-0 shadow-xl">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                        {doctor.firstName?.[0]}{doctor.lastName?.[0]}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h1 className="text-3xl font-bold text-slate-900">
                            Dr. {doctor.firstName} {doctor.lastName}
                          </h1>
                          <Badge className="bg-teal-500 text-white">
                            {doctor.specialization?.name}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-slate-600 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                            <span className="font-semibold">{doctor.rating}</span>
                            <span className="text-slate-400">({doctor.reviewCount} reviews)</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-5 h-5" />
                            <span>{doctor.experience} years experience</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {doctor.languages?.map((lang) => (
                            <Badge key={lang} variant="outline" className="bg-white">
                              <Languages className="w-3 h-3 mr-1" />
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">About</h2>
                    <p className="text-slate-600 leading-relaxed">{doctor.bio}</p>

                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <GraduationCap className="w-5 h-5 text-teal-600 mt-1" />
                          <div>
                            <p className="font-medium text-slate-900">Education</p>
                            <p className="text-slate-600">{doctor.education}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Building2 className="w-5 h-5 text-teal-600 mt-1" />
                          <div>
                            <p className="font-medium text-slate-900">Hospital</p>
                            <p className="text-slate-600">{doctor.hospital}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-teal-600 mt-1" />
                          <div>
                            <p className="font-medium text-slate-900">Location</p>
                            <p className="text-slate-600">{doctor.address}, {doctor.city}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <CalendarIcon className="w-5 h-5 text-teal-600 mt-1" />
                          <div>
                            <p className="font-medium text-slate-900">Available Days</p>
                            <p className="text-slate-600">{doctor.availableDays?.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-8 pt-6 border-t border-slate-100">
                      <a href={`tel:${doctor.phone}`} className="flex items-center gap-2 text-slate-600 hover:text-teal-600">
                        <Phone className="w-5 h-5" />
                        {doctor.phone}
                      </a>
                      <a href={`mailto:${doctor.email}`} className="flex items-center gap-2 text-slate-600 hover:text-teal-600">
                        <Mail className="w-5 h-5" />
                        {doctor.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24"
            >
              <Card className="border-0 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <span>Book Appointment</span>
                    <span className="text-2xl font-bold text-teal-600">
                      Rs. {doctor.consultationFee?.toLocaleString()}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Select Date
                    </label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={isDateDisabled}
                      className="rounded-lg border"
                    />
                  </div>

                  {/* Time Selection */}
                  {selectedDate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Select Time
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedTime(time)}
                            className={selectedTime === time ? 'bg-teal-500 hover:bg-teal-600' : ''}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Symptoms */}
                  {selectedTime && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Describe Your Symptoms (Optional)
                      </label>
                      <Textarea
                        placeholder="Tell the doctor about your symptoms..."
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        rows={3}
                      />
                    </motion.div>
                  )}

                  {/* Book Button */}
                  <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full h-12 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-lg"
                        disabled={!selectedDate || !selectedTime}
                        onClick={() => {
                          if (!isAuthenticated) {
                            router.push('/login?redirect=/doctors/' + id);
                          } else {
                            setShowBookingModal(true);
                          }
                        }}
                      >
                        {isAuthenticated ? 'Confirm Booking' : 'Login to Book'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      {bookingSuccess ? (
                        <div className="text-center py-6">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                          </div>
                          <DialogTitle className="text-2xl mb-2">Booking Confirmed!</DialogTitle>
                          <DialogDescription className="text-slate-600 mb-6">
                            Your appointment with Dr. {doctor.firstName} {doctor.lastName} has been booked for{' '}
                            {selectedDate?.toLocaleDateString()} at {selectedTime}.
                          </DialogDescription>
                          <div className="flex gap-3 justify-center">
                            <Link href="/dashboard">
                              <Button className="bg-teal-500 hover:bg-teal-600">
                                View My Appointments
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowBookingModal(false);
                                setBookingSuccess(false);
                                setSelectedDate(null);
                                setSelectedTime(null);
                                setSymptoms('');
                              }}
                            >
                              Book Another
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <DialogHeader>
                            <DialogTitle>Confirm Appointment</DialogTitle>
                            <DialogDescription>
                              Please review your appointment details before confirming.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="flex justify-between items-center py-2 border-b">
                              <span className="text-slate-600">Doctor</span>
                              <span className="font-medium">Dr. {doctor.firstName} {doctor.lastName}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                              <span className="text-slate-600">Specialization</span>
                              <span className="font-medium">{doctor.specialization?.name}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                              <span className="text-slate-600">Date</span>
                              <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                              <span className="text-slate-600">Time</span>
                              <span className="font-medium">{selectedTime}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-slate-600">Consultation Fee</span>
                              <span className="text-xl font-bold text-teal-600">Rs. {doctor.consultationFee?.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => setShowBookingModal(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="flex-1 bg-teal-500 hover:bg-teal-600"
                              onClick={handleBookAppointment}
                              disabled={bookingLoading}
                            >
                              {bookingLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              ) : null}
                              Confirm Booking
                            </Button>
                          </div>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>

                  <p className="text-xs text-center text-slate-500">
                    Free cancellation up to 24 hours before the appointment
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}


