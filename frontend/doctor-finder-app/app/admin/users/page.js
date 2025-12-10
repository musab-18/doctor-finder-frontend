'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import {
  Search,
  Loader2,
  ArrowLeft,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Users,
  Shield,
} from 'lucide-react';

export default function AdminUsersPage() {
  const router = useRouter();
  const { user: currentUser, loading: authLoading, isAdmin, isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=/admin/users');
      } else if (!isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Mock data
      setUsers([
        { id: '1', firstName: 'Admin', lastName: 'User', email: 'admin@doctorfinder.com', role: 'admin', isActive: true, createdAt: new Date().toISOString() },
        { id: '2', firstName: 'John', lastName: 'Doe', email: 'user@test.com', role: 'user', isActive: true, createdAt: new Date().toISOString() },
        { id: '3', firstName: 'Jane', lastName: 'Smith', email: 'jane@test.com', role: 'user', isActive: true, createdAt: new Date().toISOString() },
        { id: '4', firstName: 'Bob', lastName: 'Wilson', email: 'bob@test.com', role: 'user', isActive: false, createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await api.updateUser(id, { isActive: !users.find(u => u.id === id)?.isActive });
      setUsers(users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
    } catch (error) {
      console.error('Error toggling user:', error);
      setUsers(users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
    }
  };

  const handleDeleteUser = async (id) => {
    if (id === currentUser?.id) {
      alert('You cannot delete your own account');
      return;
    }
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
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
          >
            <h1 className="text-3xl font-bold text-white">Manage Users</h1>
            <p className="text-slate-300">{users.length} total users</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users Table */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-slate-700">User</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Email</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Role</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                    <th className="text-left p-4 font-semibold text-slate-700">Joined</th>
                    <th className="text-right p-4 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {user.firstName} {user.lastName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">{user.email}</td>
                      <td className="p-4">
                        <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}>
                          <Shield className="w-3 h-3 mr-1" />
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge className={user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          {user.id !== currentUser?.id && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleActive(user.id)}
                                title={user.isActive ? 'Deactivate' : 'Activate'}
                              >
                                {user.isActive ? (
                                  <ToggleRight className="w-5 h-5 text-green-600" />
                                ) : (
                                  <ToggleLeft className="w-5 h-5 text-slate-400" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {user.id === currentUser?.id && (
                            <span className="text-sm text-slate-400">You</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No users found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}












