'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import api from '@/lib/api';
import {
  Search,
  Star,
  MapPin,
  Clock,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Stethoscope,
  X,
} from 'lucide-react';

// Symptom to Specialization mapping
const symptomToSpecialty = {
  // Heart related
  'chest pain': 'Cardiologist',
  'heart': 'Cardiologist',
  'heartbeat': 'Cardiologist',
  'blood pressure': 'Cardiologist',
  'bp': 'Cardiologist',
  'palpitation': 'Cardiologist',
  
  // Skin related
  'skin': 'Dermatologist',
  'acne': 'Dermatologist',
  'pimple': 'Dermatologist',
  'rash': 'Dermatologist',
  'itching': 'Dermatologist',
  'hair fall': 'Dermatologist',
  'hair loss': 'Dermatologist',
  
  // Brain/Neuro related
  'headache': 'Neurologist',
  'migraine': 'Neurologist',
  'seizure': 'Neurologist',
  'paralysis': 'Neurologist',
  'memory': 'Neurologist',
  'brain': 'Neurologist',
  'nerve': 'Neurologist',
  'head pain': 'Neurologist',
  
  // Bone related
  'bone': 'Orthopedic Surgeon',
  'joint': 'Orthopedic Surgeon',
  'fracture': 'Orthopedic Surgeon',
  'back pain': 'Orthopedic Surgeon',
  'knee': 'Orthopedic Surgeon',
  'spine': 'Orthopedic Surgeon',
  'arthritis': 'Orthopedic Surgeon',
  'leg pain': 'Orthopedic Surgeon',
  'arm pain': 'Orthopedic Surgeon',
  'shoulder': 'Orthopedic Surgeon',
  'hip': 'Orthopedic Surgeon',
  
  // Child related
  'child': 'Pediatrician',
  'baby': 'Pediatrician',
  'infant': 'Pediatrician',
  'kid': 'Pediatrician',
  'vaccination': 'Pediatrician',
  'child fever': 'Pediatrician',
  
  // Women health
  'pregnancy': 'Gynecologist',
  'pregnant': 'Gynecologist',
  'period': 'Gynecologist',
  'menstrual': 'Gynecologist',
  'pcod': 'Gynecologist',
  'pcos': 'Gynecologist',
  'women': 'Gynecologist',
  'ovary': 'Gynecologist',
  
  // Eye related
  'eye': 'Eye Specialist',
  'vision': 'Eye Specialist',
  'glasses': 'Eye Specialist',
  'cataract': 'Eye Surgeon',
  'blind': 'Eye Specialist',
  'eye pain': 'Eye Specialist',
  
  // Dental
  'tooth': 'Dentist',
  'teeth': 'Dentist',
  'dental': 'Dentist',
  'gum': 'Dentist',
  'cavity': 'Dentist',
  'tooth pain': 'Dentist',
  
  // ENT
  'ear': 'ENT Specialist',
  'nose': 'ENT Specialist',
  'throat': 'ENT Specialist',
  'hearing': 'ENT Specialist',
  'sinus': 'ENT Specialist',
  'tonsil': 'ENT Specialist',
  'ear pain': 'ENT Specialist',
  'sore throat': 'ENT Specialist',
  
  // Stomach/Gastro
  'stomach': 'Gastroenterologist',
  'digestion': 'Gastroenterologist',
  'acidity': 'Gastroenterologist',
  'liver': 'Gastroenterologist',
  'gastric': 'Gastroenterologist',
  'constipation': 'Gastroenterologist',
  'diarrhea': 'Gastroenterologist',
  'stomach pain': 'Gastroenterologist',
  'vomiting': 'Gastroenterologist',
  'nausea': 'Gastroenterologist',
  
  // Mental health
  'depression': 'Psychologist',
  'anxiety': 'Psychologist',
  'stress': 'Psychologist',
  'mental': 'Psychologist',
  'sleep': 'Psychologist',
  'insomnia': 'Psychologist',
  'panic': 'Psychologist',
  
  // Lung/Breathing
  'breathing': 'Pulmonologist',
  'asthma': 'Pulmonologist',
  'cough': 'Pulmonologist',
  'lung': 'Pulmonologist',
  'breathlessness': 'Pulmonologist',
  
  // Urinary
  'urine': 'Urologist',
  'kidney': 'Urologist',
  'bladder': 'Urologist',
  'prostate': 'Urologist',
  'kidney stone': 'Urologist',
  
  // General
  'fever': 'General Physician',
  'cold': 'General Physician',
  'flu': 'General Physician',
  'weakness': 'General Physician',
  'fatigue': 'General Physician',
  'body pain': 'General Physician',
  'viral': 'General Physician',
  
  // Diet
  'weight': 'Nutritionist',
  'diet': 'Nutritionist',
  'obesity': 'Nutritionist',
  'nutrition': 'Nutritionist',
  'weight loss': 'Nutritionist',
  'weight gain': 'Nutritionist',
  
  // Diabetes
  'diabetes': 'Diabetologist',
  'sugar': 'Diabetologist',
  'blood sugar': 'Diabetologist',
  
  // Cancer
  'cancer': 'Oncologist',
  'tumor': 'Oncologist',
  'chemotherapy': 'Oncologist',
};

const commonSymptoms = [
  { label: 'Fever', icon: '🤒' },
  { label: 'Headache', icon: '🤕' },
  { label: 'Chest Pain', icon: '💔' },
  { label: 'Stomach Pain', icon: '🤢' },
  { label: 'Back Pain', icon: '🦴' },
  { label: 'Leg Pain', icon: '🦵' },
  { label: 'Skin Rash', icon: '🩹' },
  { label: 'Cough', icon: '😷' },
  { label: 'Eye Problem', icon: '👁️' },
  { label: 'Tooth Pain', icon: '🦷' },
  { label: 'Ear Pain', icon: '👂' },
  { label: 'Depression', icon: '😔' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function DoctorsContent() {
  const searchParams = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedSpecialization, setSelectedSpecialization] = useState(
    searchParams.get('specialization') || 'all'
  );
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [suggestedSpecialty, setSuggestedSpecialty] = useState('');
  const [activeSymptom, setActiveSymptom] = useState('');

  useEffect(() => {
    fetchSpecializations();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [searchQuery, selectedSpecialization, sortBy, currentPage]);

  // Find specialty based on symptoms
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

  const fetchSpecializations = async () => {
    try {
      const data = await api.getSpecializations();
      setSpecializations(data || []);
    } catch {
      setSpecializations([
        { id: '1', name: 'Cardiology' },
        { id: '2', name: 'Dermatology' },
        { id: '3', name: 'Neurology' },
        { id: '4', name: 'Orthopedics' },
        { id: '5', name: 'Pediatrics' },
      ]);
    }
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        sortBy,
        sortOrder: 'DESC',
      };

      if (searchQuery) params.search = searchQuery;
      if (selectedSpecialization && selectedSpecialization !== 'all') {
        params.specializationId = selectedSpecialization;
      }

      const data = await api.getDoctors(params);
      setDoctors(data.data || []);
      setTotalPages(data.meta?.totalPages || 1);
    } catch {
      // Mock data for demo
      setDoctors([
        { id: '1', firstName: 'Khalil', lastName: 'Ahmad', specialization: { name: 'Urologist' }, rating: 4.9, reviewCount: 241, experience: 16, city: 'Lahore', consultationFee: 3500, bio: 'Expert urologist with 16 years of experience.' },
        { id: '2', firstName: 'Iram', lastName: 'Munawar', specialization: { name: 'Gynecologist' }, rating: 4.8, reviewCount: 195, experience: 28, city: 'Karachi', consultationFee: 4000, bio: 'Senior gynecologist specializing in women health.' },
        { id: '3', firstName: 'Nasir', lastName: 'Raza Awan', specialization: { name: 'Neuro Surgeon' }, rating: 4.9, reviewCount: 312, experience: 28, city: 'Islamabad', consultationFee: 5000, bio: 'Expert neurosurgeon for brain and spine conditions.' },
        { id: '4', firstName: 'M. Shahid', lastName: 'Iqbal', specialization: { name: 'Cardiologist' }, rating: 4.7, reviewCount: 156, experience: 17, city: 'Rawalpindi', consultationFee: 4500, bio: 'Heart specialist with expertise in cardiac care.' },
        { id: '5', firstName: 'Ghulam', lastName: 'Mujtaba', specialization: { name: 'Dermatologist' }, rating: 4.9, reviewCount: 423, experience: 30, city: 'Faisalabad', consultationFee: 3000, bio: 'Skin specialist for all dermatological conditions.' },
        { id: '6', firstName: 'Amjad', lastName: 'Ali', specialization: { name: 'General Physician' }, rating: 4.8, reviewCount: 189, experience: 20, city: 'Multan', consultationFee: 2000, bio: 'General physician for fever, flu and common illnesses.' },
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchDoctors();
  };

  const handleSymptomClick = (symptom) => {
    setSearchQuery(symptom);
    setActiveSymptom(symptom);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setActiveSymptom('');
    setSuggestedSpecialty('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-600 to-emerald-700 py-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Find Doctor by Symptoms
            </h1>
            <p className="text-xl text-teal-100 max-w-2xl mx-auto">
              Enter your symptoms and we'll find the right specialist for you
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSearch}
            className="mt-8 max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl p-3">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Enter your symptom (e.g., fever, headache, leg pain)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-10 h-14 border-0 bg-slate-50 rounded-xl text-lg"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <Button
                  type="submit"
                  className="h-14 px-8 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 rounded-xl text-lg"
                >
                  Find Doctor
                </Button>
              </div>

              {/* Suggested Specialty */}
              {suggestedSpecialty && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-3 px-3 py-2 bg-teal-50 rounded-lg"
                >
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                  <span className="text-teal-700">
                    Based on your symptoms, we recommend: <strong>{suggestedSpecialty}</strong>
                  </span>
                </motion.div>
              )}

              {/* Common Symptoms */}
              <div className="mt-4">
                <p className="text-sm text-slate-500 mb-2">Common symptoms:</p>
                <div className="flex flex-wrap gap-2">
                  {commonSymptoms.map((symptom, index) => (
                    <button
                      key={`symptom-${index}`}
                      type="button"
                      onClick={() => handleSymptomClick(symptom.label)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm transition-all ${
                        activeSymptom === symptom.label
                          ? 'bg-teal-500 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-teal-100 hover:text-teal-700'
                      }`}
                    >
                      <span>{symptom.icon}</span>
                      <span>{symptom.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.form>
        </div>
      </div>

      {/* Filters and Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-4 mb-8"
        >
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>

              <div className={`flex flex-wrap gap-3 ${showFilters ? 'flex' : 'hidden md:flex'}`}>
                <Select
                  value={selectedSpecialization}
                  onValueChange={(value) => {
                    setSelectedSpecialization(value);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Specializations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specializations</SelectItem>
                    {specializations.map((spec) => (
                      <SelectItem key={spec.id} value={spec.id}>
                        {spec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="experience">Most Experienced</SelectItem>
                    <SelectItem value="consultationFee">Price: Low to High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <p className="text-slate-600 font-medium">
              {loading ? 'Searching...' : `${doctors.length} doctors found`}
            </p>
          </div>
        </motion.div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-slate-600 mb-4">No doctors found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialization('all');
                setActiveSymptom('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {doctors.map((doctor, index) => (
              <motion.div key={`doctor-${doctor.id}-${index}`} variants={itemVariants}>
                <Link href={`/doctors/${doctor.id}`}>
                  <Card className="group h-full overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-0">
                      {/* Doctor Header */}
                      <div className="relative h-32 bg-gradient-to-br from-teal-100 to-emerald-100">
                        <div className="absolute -bottom-10 left-6">
                          <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {doctor.firstName?.[0]}{doctor.lastName?.[0]}
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="font-semibold text-sm">{doctor.rating}</span>
                          <span className="text-slate-500 text-xs">({doctor.reviewCount})</span>
                        </div>
                      </div>

                      {/* Doctor Info */}
                      <div className="pt-14 p-6">
                        <h3 className="font-bold text-xl text-slate-900 group-hover:text-teal-600 transition-colors">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </h3>
                        <Badge variant="secondary" className="mt-2 bg-teal-50 text-teal-700">
                          {doctor.specialization?.name}
                        </Badge>

                        <p className="text-slate-600 text-sm mt-3 line-clamp-2">
                          {doctor.bio}
                        </p>

                        <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {doctor.experience} yrs exp
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {doctor.city}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                          <div>
                            <span className="text-slate-500 text-sm">Fee</span>
                            <p className="text-xl font-bold text-slate-900">Rs. {doctor.consultationFee?.toLocaleString()}</p>
                          </div>
                          <Button className="bg-teal-500 hover:bg-teal-600">
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 pb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={`page-${page}`}
                variant={currentPage === page ? 'default' : 'outline'}
                size="icon"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? 'bg-teal-500 hover:bg-teal-600' : ''}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    }>
      <DoctorsContent />
    </Suspense>
  );
}
