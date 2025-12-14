const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  removeToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  async request(endpoint, options = {}, silent = false) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Check if response has content
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonError) {
          // If JSON parsing fails, use text instead
          const text = await response.text();
          throw new Error(text || 'Invalid JSON response');
        }
      } else {
        const text = await response.text();
        data = text ? { message: text } : { message: 'No content' };
      }

      if (!response.ok) {
        const error = new Error(data.message || data.error || 'Something went wrong');
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      if (!silent) {
        console.error('API Error:', error.message);
      }
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.access_token) {
      this.setToken(data.access_token);
    }
    return data;
  }

  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.access_token) {
      this.setToken(data.access_token);
    }
    return data;
  }

  async getProfile() {
    // Silent mode for profile check - don't log errors
    return this.request('/auth/profile', {}, true);
  }

  logout() {
    this.removeToken();
  }

  // Doctors endpoints
  async getDoctors(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/doctors?${queryString}`);
  }

  async getFeaturedDoctors() {
    return this.request('/doctors/featured');
  }

  async getDoctor(id) {
    return this.request(`/doctors/${id}`, {}, true);
  }

  async getDoctorsBySpecialization(specializationId) {
    return this.request(`/doctors/specialization/${specializationId}`);
  }

  async createDoctor(doctorData) {
    return this.request('/doctors', {
      method: 'POST',
      body: JSON.stringify(doctorData),
    });
  }

  async updateDoctor(id, doctorData) {
    return this.request(`/doctors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(doctorData),
    });
  }

  async deleteDoctor(id) {
    return this.request(`/doctors/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleDoctorActive(id) {
    return this.request(`/doctors/${id}/toggle-active`, {
      method: 'PATCH',
    });
  }

  async toggleDoctorFeatured(id) {
    return this.request(`/doctors/${id}/toggle-featured`, {
      method: 'PATCH',
    });
  }

  // Specializations endpoints
  async getSpecializations() {
    return this.request('/specializations');
  }

  async getSpecialization(id) {
    return this.request(`/specializations/${id}`);
  }

  async createSpecialization(data) {
    return this.request('/specializations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSpecialization(id, data) {
    return this.request(`/specializations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteSpecialization(id) {
    return this.request(`/specializations/${id}`, {
      method: 'DELETE',
    });
  }

  // Appointments endpoints
  async getAppointments() {
    return this.request('/appointments');
  }

  async getUpcomingAppointments() {
    return this.request('/appointments/upcoming');
  }

  async getAppointment(id) {
    return this.request(`/appointments/${id}`);
  }

  async createAppointment(appointmentData) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  }

  async cancelAppointment(id) {
    return this.request(`/appointments/${id}/cancel`, {
      method: 'PATCH',
    });
  }

  async confirmAppointment(id) {
    return this.request(`/appointments/${id}/confirm`, {
      method: 'PATCH',
    });
  }

  async completeAppointment(id, doctorNotes) {
    return this.request(`/appointments/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ doctorNotes }),
    });
  }

  async getAppointmentStatistics() {
    return this.request('/appointments/statistics');
  }

  // Users endpoints (Admin)
  async getUsers() {
    return this.request('/users');
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserStatistics() {
    return this.request('/users/statistics');
  }

  // Contacts endpoints
  async submitContact(contactData) {
    return this.request('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  async getContacts() {
    return this.request('/contacts');
  }

  async getContact(id) {
    return this.request(`/contacts/${id}`);
  }

  async getUnreadContactCount() {
    return this.request('/contacts/unread-count');
  }

  async markContactAsRead(id) {
    return this.request(`/contacts/${id}/mark-read`, {
      method: 'PATCH',
    });
  }

  // Reviews endpoints
  async createReview(reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async getDoctorReviews(doctorId) {
    return this.request(`/reviews/doctor/${doctorId}`);
  }

  async getDoctorReviewStats(doctorId) {
    return this.request(`/reviews/doctor/${doctorId}/stats`);
  }

  async getMyReviews() {
    return this.request('/reviews/my-reviews');
  }

  async updateReview(id, reviewData) {
    return this.request(`/reviews/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(reviewData),
    });
  }

  async deleteReview(id) {
    return this.request(`/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  async addDoctorReply(reviewId, reply) {
    return this.request(`/reviews/${reviewId}/reply`, {
      method: 'PATCH',
      body: JSON.stringify({ doctorReply: reply }),
    });
  }
}

export const api = new ApiService();
export default api;
