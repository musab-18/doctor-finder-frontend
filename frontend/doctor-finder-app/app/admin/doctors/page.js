'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  Loader2,
  ArrowLeft,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

export default function AdminDoctorsPage() {
  const router = useRouter();
  const { loading: authLoading, isAdmin, isAuthenticated } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    experience: '',
    education: '',
    hospital: '',
    address: '',
    city: '',
    consultationFee: '',
    specializationId: '',
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/admin/doctors');
      } else if (!isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      const [doctorsData, specsData] = await Promise.all([
        api.getDoctors({ limit: 100 }),
        api.getSpecializations(),
      ]);
      setDoctors(doctorsData.data || []);
      setSpecializations(specsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Mock data
      setDoctors([
        { id: '1', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@hospital.com', specialization: { name: 'Cardiology' }, rating: 4.9, experience: 15, city: 'New York', isActive: true, isFeatured: true },
        { id: '2', firstName: 'Michael', lastName: 'Chen', email: 'michael@hospital.com', specialization: { name: 'Dermatology' }, rating: 4.8, experience: 12, city: 'Los Angeles', isActive: true, isFeatured: true },
        { id: '3', firstName: 'Emily', lastName: 'Davis', email: 'emily@hospital.com', specialization: { name: 'Neurology' }, rating: 4.9, experience: 18, city: 'Boston', isActive: true, isFeatured: false },
      ]);
      setSpecializations([
        { id: '1', name: 'Cardiology' },
        { id: '2', name: 'Dermatology' },
        { id: '3', name: 'Neurology' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const newDoctor = await api.createDoctor({
        ...formData,
        experience: parseInt(formData.experience),
        consultationFee: parseFloat(formData.consultationFee),
      });
      setDoctors([...doctors, newDoctor]);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding doctor:', error);
      // For demo
      const mockDoctor = {
        id: Date.now().toString(),
        ...formData,
        rating: 0,
        isActive: true,
        isFeatured: false,
        specialization: specializations.find(s => s.id === formData.specializationId),
      };
      setDoctors([...doctors, mockDoctor]);
      setShowAddModal(false);
      resetForm();
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditDoctor = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const updatedDoctor = await api.updateDoctor(selectedDoctor.id, {
        ...formData,
        experience: parseInt(formData.experience),
        consultationFee: parseFloat(formData.consultationFee),
      });
      setDoctors(doctors.map(d => d.id === selectedDoctor.id ? { ...d, ...updatedDoctor } : d));
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      console.error('Error updating doctor:', error);
      // For demo
      setDoctors(doctors.map(d => d.id === selectedDoctor.id ? { ...d, ...formData } : d));
      setShowEditModal(false);
      resetForm();
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await api.deleteDoctor(id);
      setDoctors(doctors.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting doctor:', error);
      setDoctors(doctors.filter(d => d.id !== id));
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await api.toggleDoctorActive(id);
      setDoctors(doctors.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d));
    } catch (error) {
      console.error('Error toggling active:', error);
      setDoctors(doctors.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d));
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await api.toggleDoctorFeatured(id);
      setDoctors(doctors.map(d => d.id === id ? { ...d, isFeatured: !d.isFeatured } : d));
    } catch (error) {
      console.error('Error toggling featured:', error);
      setDoctors(doctors.map(d => d.id === id ? { ...d, isFeatured: !d.isFeatured } : d));
    }
  };

  const openEditModal = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      firstName: doctor.firstName || '',
      lastName: doctor.lastName || '',
      email: doctor.email || '',
      phone: doctor.phone || '',
      bio: doctor.bio || '',
      experience: doctor.experience?.toString() || '',
      education: doctor.education || '',
      hospital: doctor.hospital || '',
      address: doctor.address || '',
      city: doctor.city || '',
      consultationFee: doctor.consultationFee?.toString() || '',
      specializationId: doctor.specializationId || '',
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bio: '',
      experience: '',
      education: '',
      hospital: '',
      address: '',
      city: '',
      consultationFee: '',
      specializationId: '',
    });
    setSelectedDoctor(null);
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-white">Manage Doctors</h1>
              <p className="text-slate-300">{doctors.length} doctors registered</p>
            </div>
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
              <DialogTrigger asChild>
                <Button className="bg-teal-500 hover:bg-teal-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Doctor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Doctor</DialogTitle>
                  <DialogDescription>Fill in the details to add a new doctor.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddDoctor} className="space-y-4 mt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input name="phone" value={formData.phone} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Specialization</Label>
                    <Select value={formData.specializationId} onValueChange={(value) => setFormData({ ...formData, specializationId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {specializations.map((spec) => (
                          <SelectItem key={spec.id} value={spec.id}>{spec.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Experience (Years)</Label>
                      <Input name="experience" type="number" value={formData.experience} onChange={handleInputChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label>Consultation Fee ($)</Label>
                      <Input name="consultationFee" type="number" value={formData.consultationFee} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Education</Label>
                    <Input name="education" value={formData.education} onChange={handleInputChange} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Hospital</Label>
                      <Input name="hospital" value={formData.hospital} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input name="city" value={formData.city} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input name="address" value={formData.address} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label>Bio</Label>
                    <Textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={3} />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => { setShowAddModal(false); resetForm(); }} className="flex-1">Cancel</Button>
                    <Button type="submit" className="flex-1 bg-teal-500 hover:bg-teal-600" disabled={formLoading}>
                      {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Doctor'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Doctors Table */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-slate-700">Doctor</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Specialization</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Rating</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Location</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                    <th className="text-right p-4 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((doctor) => (
                    <tr key={doctor.id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                            {doctor.firstName?.[0]}{doctor.lastName?.[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">Dr. {doctor.firstName} {doctor.lastName}</p>
                            <p className="text-sm text-slate-500">{doctor.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="secondary">{doctor.specialization?.name}</Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span>{doctor.rating || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">{doctor.city}</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <Badge className={doctor.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                            {doctor.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          {doctor.isFeatured && (
                            <Badge className="bg-amber-100 text-amber-700">Featured</Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleActive(doctor.id)}
                            title={doctor.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {doctor.isActive ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleFeatured(doctor.id)}
                            title={doctor.isFeatured ? 'Unfeature' : 'Feature'}
                          >
                            <Star className={`w-5 h-5 ${doctor.isFeatured ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEditModal(doctor)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteDoctor(doctor.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Doctor</DialogTitle>
              <DialogDescription>Update doctor information.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditDoctor} className="space-y-4 mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input name="phone" value={formData.phone} onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Specialization</Label>
                <Select value={formData.specializationId} onValueChange={(value) => setFormData({ ...formData, specializationId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((spec) => (
                      <SelectItem key={spec.id} value={spec.id}>{spec.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Experience (Years)</Label>
                  <Input name="experience" type="number" value={formData.experience} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label>Consultation Fee ($)</Label>
                  <Input name="consultationFee" type="number" value={formData.consultationFee} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Education</Label>
                <Input name="education" value={formData.education} onChange={handleInputChange} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Hospital</Label>
                  <Input name="hospital" value={formData.hospital} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input name="city" value={formData.city} onChange={handleInputChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input name="address" value={formData.address} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={3} />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => { setShowEditModal(false); resetForm(); }} className="flex-1">Cancel</Button>
                <Button type="submit" className="flex-1 bg-teal-500 hover:bg-teal-600" disabled={formLoading}>
                  {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}











