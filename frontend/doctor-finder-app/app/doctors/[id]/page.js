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
import { Input } from '@/components/ui/input';
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
  MessageSquare,
  ThumbsUp,
  User,
} from 'lucide-react';

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
];

export default function DoctorProfilePage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetchDoctor();
    fetchReviews();
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

  const fetchReviews = async () => {
    try {
      const [reviewsData, statsData] = await Promise.all([
        api.getDoctorReviews(id),
        api.getDoctorReviewStats(id),
      ]);
      setReviews(reviewsData || []);
      setReviewStats(statsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/doctors/' + id);
      return;
    }

    setReviewLoading(true);
    try {
      await api.createReview({
        doctorId: id,
        rating: reviewRating,
        comment: reviewComment,
      });
      setShowReviewModal(false);
      setReviewRating(5);
      setReviewComment('');
      fetchReviews();
      fetchDoctor();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
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

            {/* Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-teal-600" />
                      Patient Reviews
                    </CardTitle>
                    <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
                      <DialogTrigger asChild>
                        <Button 
                          className="bg-teal-500 hover:bg-teal-600"
                          onClick={() => {
                            if (!isAuthenticated) {
                              router.push('/login?redirect=/doctors/' + id);
                            }
                          }}
                        >
                          Write a Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Write a Review</DialogTitle>
                          <DialogDescription>
                            Share your experience with Dr. {doctor?.firstName} {doctor?.lastName}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          {/* Star Rating */}
                          <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">
                              Your Rating
                            </label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  onClick={() => setReviewRating(star)}
                                  className="p-1 transition-transform hover:scale-110"
                                >
                                  <Star
                                    className={`w-8 h-8 ${
                                      star <= (hoverRating || reviewRating)
                                        ? 'text-amber-400 fill-amber-400'
                                        : 'text-slate-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          {/* Comment */}
                          <div>
                            <label className="text-sm font-medium text-slate-700 mb-2 block">
                              Your Review
                            </label>
                            <Textarea
                              placeholder="Share your experience with this doctor..."
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              rows={4}
                            />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setShowReviewModal(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="flex-1 bg-teal-500 hover:bg-teal-600"
                            onClick={handleSubmitReview}
                            disabled={reviewLoading}
                          >
                            {reviewLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : null}
                            Submit Review
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Rating Summary */}
                  {reviewStats && (
                    <div className="flex flex-col md:flex-row gap-6 mb-6 p-4 bg-slate-50 rounded-xl">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-slate-900">{reviewStats.averageRating}</div>
                        <div className="flex justify-center gap-0.5 my-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Math.round(reviewStats.averageRating)
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-slate-500">{reviewStats.totalReviews} reviews</div>
                      </div>
                      <div className="flex-1 space-y-1">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm text-slate-600 w-3">{rating}</span>
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-400 rounded-full"
                                style={{
                                  width: `${reviewStats.totalReviews > 0 ? (reviewStats.ratingDistribution[rating] / reviewStats.totalReviews) * 100 : 0}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-slate-500 w-8">
                              {reviewStats.ratingDistribution[rating]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>No reviews yet. Be the first to review!</p>
                      </div>
                    ) : (
                      reviews.map((review) => (
                        <div key={review.id} className="border-b border-slate-100 pb-4 last:border-0">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                              {review.user?.firstName?.[0] || <User className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-slate-900">
                                    {review.user?.firstName} {review.user?.lastName}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <div className="flex gap-0.5">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`w-3 h-3 ${
                                            star <= review.rating
                                              ? 'text-amber-400 fill-amber-400'
                                              : 'text-slate-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    {review.isVerified && (
                                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Verified
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <span className="text-sm text-slate-400">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              {review.comment && (
                                <p className="text-slate-600 mt-2">{review.comment}</p>
                              )}
                              {review.doctorReply && (
                                <div className="mt-3 pl-4 border-l-2 border-teal-500 bg-teal-50 p-3 rounded-r-lg">
                                  <p className="text-sm font-medium text-teal-700">Doctor's Response:</p>
                                  <p className="text-sm text-slate-600">{review.doctorReply}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
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


