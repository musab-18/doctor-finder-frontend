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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  ArrowLeft,
  ToggleLeft,
  ToggleRight,
  Activity,
} from 'lucide-react';

export default function AdminSpecializationsPage() {
  const router = useRouter();
  const { loading: authLoading, isAdmin, isAuthenticated } = useAuth();
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/admin/specializations');
      } else if (!isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchSpecializations();
    }
  }, [isAdmin]);

  const fetchSpecializations = async () => {
    try {
      const data = await api.getSpecializations();
      setSpecializations(data || []);
    } catch (error) {
      console.error('Error fetching specializations:', error);
      // Mock data
      setSpecializations([
        { id: '1', name: 'Cardiology', description: 'Heart and cardiovascular system specialists', icon: '❤️', isActive: true },
        { id: '2', name: 'Dermatology', description: 'Skin, hair, and nail specialists', icon: '🧴', isActive: true },
        { id: '3', name: 'Neurology', description: 'Brain and nervous system specialists', icon: '🧠', isActive: true },
        { id: '4', name: 'Orthopedics', description: 'Bone, joint, and muscle specialists', icon: '🦴', isActive: true },
        { id: '5', name: 'Pediatrics', description: 'Child health specialists', icon: '👶', isActive: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const newSpec = await api.createSpecialization(formData);
      setSpecializations([...specializations, newSpec]);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding specialization:', error);
      // For demo
      const mockSpec = {
        id: Date.now().toString(),
        ...formData,
        isActive: true,
      };
      setSpecializations([...specializations, mockSpec]);
      setShowAddModal(false);
      resetForm();
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const updatedSpec = await api.updateSpecialization(selectedSpec.id, formData);
      setSpecializations(specializations.map(s => s.id === selectedSpec.id ? { ...s, ...updatedSpec } : s));
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      console.error('Error updating specialization:', error);
      // For demo
      setSpecializations(specializations.map(s => s.id === selectedSpec.id ? { ...s, ...formData } : s));
      setShowEditModal(false);
      resetForm();
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this specialization?')) return;
    try {
      await api.deleteSpecialization(id);
      setSpecializations(specializations.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting specialization:', error);
      setSpecializations(specializations.filter(s => s.id !== id));
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await api.updateSpecialization(id, { isActive: !specializations.find(s => s.id === id)?.isActive });
      setSpecializations(specializations.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
    } catch (error) {
      console.error('Error toggling specialization:', error);
      setSpecializations(specializations.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
    }
  };

  const openEditModal = (spec) => {
    setSelectedSpec(spec);
    setFormData({
      name: spec.name || '',
      description: spec.description || '',
      icon: spec.icon || '',
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', icon: '' });
    setSelectedSpec(null);
  };

  const filteredSpecs = specializations.filter(
    (spec) => spec.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
              <h1 className="text-3xl font-bold text-white">Manage Specializations</h1>
              <p className="text-slate-300">{specializations.length} specializations</p>
            </div>
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
              <DialogTrigger asChild>
                <Button className="bg-teal-500 hover:bg-teal-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Specialization
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Specialization</DialogTitle>
                  <DialogDescription>Create a new medical specialization category.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAdd} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Icon (Emoji)</Label>
                    <Input name="icon" value={formData.icon} onChange={handleInputChange} placeholder="e.g., ❤️" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => { setShowAddModal(false); resetForm(); }} className="flex-1">Cancel</Button>
                    <Button type="submit" className="flex-1 bg-teal-500 hover:bg-teal-600" disabled={formLoading}>
                      {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
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
              placeholder="Search specializations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Specializations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpecs.map((spec) => (
            <motion.div
              key={spec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl flex items-center justify-center text-2xl">
                        {spec.icon || '🏥'}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{spec.name}</h3>
                        <Badge className={spec.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {spec.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {spec.description && (
                    <p className="text-slate-600 text-sm mt-4">{spec.description}</p>
                  )}
                  <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleActive(spec.id)}
                      title={spec.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {spec.isActive ? (
                        <ToggleRight className="w-5 h-5 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-slate-400" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(spec)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(spec.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredSpecs.length === 0 && (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No specializations found</p>
          </div>
        )}

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Specialization</DialogTitle>
              <DialogDescription>Update specialization details.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEdit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label>Icon (Emoji)</Label>
                <Input name="icon" value={formData.icon} onChange={handleInputChange} placeholder="e.g., ❤️" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} />
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











