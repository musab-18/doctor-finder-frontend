'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import {
  Search,
  Star,
  MapPin,
  Clock,
  Users,
  Award,
  Shield,
  Calendar,
  ArrowRight,
  Sparkles,
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Bone,
  Baby,
  Activity,
} from 'lucide-react';

// Symptom to Specialization mapping
const symptomToSpecialty = {
  'chest pain': 'Cardiologist',
  'heart': 'Cardiologist',
  'blood pressure': 'Cardiologist',
  'skin': 'Dermatologist',
  'acne': 'Dermatologist',
  'rash': 'Dermatologist',
  'headache': 'Neurologist',
  'migraine': 'Neurologist',
  'head pain': 'Neurologist',
  'bone': 'Orthopedic Surgeon',
  'joint': 'Orthopedic Surgeon',
  'back pain': 'Orthopedic Surgeon',
  'leg pain': 'Orthopedic Surgeon',
  'knee': 'Orthopedic Surgeon',
  'child': 'Pediatrician',
  'baby': 'Pediatrician',
  'pregnancy': 'Gynecologist',
  'period': 'Gynecologist',
  'eye': 'Eye Specialist',
  'vision': 'Eye Specialist',
  'tooth': 'Dentist',
  'teeth': 'Dentist',
  'dental': 'Dentist',
  'ear': 'ENT Specialist',
  'nose': 'ENT Specialist',
  'throat': 'ENT Specialist',
  'stomach': 'Gastroenterologist',
  'digestion': 'Gastroenterologist',
  'acidity': 'Gastroenterologist',
  'depression': 'Psychologist',
  'anxiety': 'Psychologist',
  'stress': 'Psychologist',
  'cough': 'Pulmonologist',
  'breathing': 'Pulmonologist',
  'asthma': 'Pulmonologist',
  'urine': 'Urologist',
  'kidney': 'Urologist',
  'fever': 'General Physician',
  'cold': 'General Physician',
  'flu': 'General Physician',
};

const commonSymptoms = [
  { label: 'Fever', icon: '🤒' },
  { label: 'Headache', icon: '🤕' },
  { label: 'Chest Pain', icon: '💔' },
  { label: 'Stomach Pain', icon: '🤢' },
  { label: 'Back Pain', icon: '🦴' },
  { label: 'Leg Pain', icon: '🦵' },
];

const iconMap = {
  'Cardiology': Heart,
  'Cardiologist': Heart,
  'Dermatology': Sparkles,
  'Neurology': Brain,
  'Orthopedics': Bone,
  'Pediatrics': Baby,
  'Ophthalmology': Eye,
};

const stats = [
  { icon: Users, value: '50K+', label: 'Happy Patients' },
  { icon: Award, value: '99+', label: 'Expert Doctors' },
  { icon: Shield, value: '100%', label: 'Verified Profiles' },
  { icon: Calendar, value: '24/7', label: 'Online Booking' },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [specializations, setSpecializations] = useState([]);
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestedSpecialty, setSuggestedSpecialty] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const query = searchQuery.toLowerCase();
      for (const [symptom, specialty] of Object.entries(symptomToSpecialty)) {
        if (query.includes(symptom)) {
          setSuggestedSpecialty(specialty);
          return;
        }
      }
    }
    setSuggestedSpecialty('');
  }, [searchQuery]);

  const fetchData = async () => {
    try {
      const [specsData, doctorsData] = await Promise.all([
        api.getSpecializations(),
        api.getFeaturedDoctors(),
      ]);
      setSpecializations(specsData || []);
      setFeaturedDoctors(doctorsData || []);
    } catch {
      setSpecializations([
        { id: '1', name: 'Cardiology' },
        { id: '2', name: 'Dermatology' },
        { id: '3', name: 'Neurology' },
        { id: '4', name: 'Orthopedics' },
        { id: '5', name: 'Pediatrics' },
        { id: '6', name: 'Ophthalmology' },
      ]);
      setFeaturedDoctors([
        { id: '1', firstName: 'Khalil', lastName: 'Ahmad', specialization: { name: 'Urologist' }, rating: 4.9, experience: 16, city: 'Lahore', consultationFee: 3500 },
        { id: '2', firstName: 'Iram', lastName: 'Munawar', specialization: { name: 'Gynecologist' }, rating: 4.8, experience: 28, city: 'Karachi', consultationFee: 4000 },
        { id: '3', firstName: 'Nasir', lastName: 'Raza', specialization: { name: 'Neuro Surgeon' }, rating: 4.9, experience: 28, city: 'Islamabad', consultationFee: 5000 },
        { id: '4', firstName: 'Shahid', lastName: 'Iqbal', specialization: { name: 'Cardiologist' }, rating: 4.7, experience: 17, city: 'Rawalpindi', consultationFee: 4500 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getSearchUrl = () => {
    if (suggestedSpecialty) {
      return `/doctors?search=${encodeURIComponent(suggestedSpecialty)}`;
    }
    return `/doctors${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`;
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 border border-teal-200 text-teal-700 text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Trusted by 50,000+ patients in Pakistan
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6">
                Find Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">Perfect Doctor</span>
              </h1>

              <p className="text-xl text-slate-600 mb-8 max-w-lg">
                Describe your symptoms and we'll help you find the right specialist. 
                Book appointments with top-rated doctors.
              </p>

              {/* Search Box */}
              <div className="bg-white rounded-2xl shadow-xl p-4 max-w-xl">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="Enter symptoms (fever, headache, leg pain)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-14 border-0 bg-slate-50 rounded-xl text-base"
                      />
                    </div>
                    <Link href={getSearchUrl()}>
                      <Button className="h-14 px-8 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 rounded-xl text-base font-semibold w-full sm:w-auto">
                        Find Doctor
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>
                  
                  {suggestedSpecialty && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-teal-50 rounded-lg">
                      <Stethoscope className="w-4 h-4 text-teal-600" />
                      <span className="text-sm text-teal-700">
                        Recommended: <strong>{suggestedSpecialty}</strong>
                      </span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-slate-500">Try:</span>
                    {commonSymptoms.map((symptom, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(symptom.label)}
                        className="text-xs px-2 py-1 bg-slate-100 hover:bg-teal-100 text-slate-600 hover:text-teal-700 rounded-full transition-colors"
                      >
                        {symptom.icon} {symptom.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mt-10">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      <p className="text-sm text-slate-500">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-32 h-32 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specializations Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-teal-100 text-teal-700">Specializations</Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Browse by Specialty</h2>
          </div>

          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView={2}
            navigation
            autoplay={{ delay: 3000 }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
            }}
          >
            {specializations.map((spec, index) => {
              const IconComponent = iconMap[spec.name] || Stethoscope;
              return (
                <SwiperSlide key={index}>
                  <Link href={`/doctors?specialization=${spec.id}`}>
                    <Card className="border-2 border-slate-100 hover:border-teal-200 hover:shadow-lg transition-all">
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-teal-600" />
                        </div>
                        <h3 className="font-semibold text-slate-900">{spec.name}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <Badge className="mb-4 bg-amber-100 text-amber-700">Top Rated</Badge>
              <h2 className="text-4xl font-bold text-slate-900">Featured Doctors</h2>
            </div>
            <Link href="/doctors">
              <Button variant="outline">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDoctors.map((doctor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/doctors/${doctor.id}`}>
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all">
                    <CardContent className="p-0">
                      <div className="relative h-40 bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {doctor.firstName?.[0]}{doctor.lastName?.[0]}
                        </div>
                        <div className="absolute top-4 right-4 bg-white/90 rounded-full px-3 py-1 flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="text-sm font-semibold">{doctor.rating}</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-slate-900">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </h3>
                        <p className="text-teal-600 font-medium">{doctor.specialization?.name}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {doctor.experience} yrs
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" /> {doctor.city}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-lg font-bold text-slate-900">
                            Rs. {doctor.consultationFee?.toLocaleString()}
                          </span>
                          <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-teal-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Join thousands of patients who have found their perfect doctor through MediFind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/doctors">
              <Button size="lg" className="bg-white text-teal-700 hover:bg-teal-50 text-lg px-8 h-14">
                Find a Doctor <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 h-14">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
