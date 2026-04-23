const BASE_URL = import.meta.env.VITE_API_BASE_URL;

class EventService {
  async getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  async handleResponse(response) {
    const data = await response.json();
    if (!response.ok) {
      const error = (data && data.error) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  }

  // --- Auth APIs ---
  async login(email, password) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await this.handleResponse(response);
    if (result.success && result.data.token) {
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data));
    }
    return result;
  }

  async register(userData) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await this.handleResponse(response);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // --- Event APIs ---
  async getEvents(query = '') {
    const response = await fetch(`${BASE_URL}/events${query}`);
    return await this.handleResponse(response);
  }

  async getEventById(id) {
    const response = await fetch(`${BASE_URL}/events/${id}`);
    return await this.handleResponse(response);
  }

  async createEvent(eventData) {
    const authHeader = await this.getAuthHeader();
    const response = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader
      },
      body: JSON.stringify(eventData)
    });
    return await this.handleResponse(response);
  }

  async updateEvent(id, eventData) {
    const authHeader = await this.getAuthHeader();
    const response = await fetch(`${BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader
      },
      body: JSON.stringify(eventData)
    });
    return await this.handleResponse(response);
  }

  async deleteEvent(id) {
    const authHeader = await this.getAuthHeader();
    const response = await fetch(`${BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: authHeader
    });
    return await this.handleResponse(response);
  }

  // --- Booking APIs ---
  async bookEvent(eventId) {
    const authHeader = await this.getAuthHeader();
    const response = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader
      },
      body: JSON.stringify({ eventId })
    });
    return await this.handleResponse(response);
  }

  async getMyBookings() {
    const authHeader = await this.getAuthHeader();
    const response = await fetch(`${BASE_URL}/bookings/my`, {
      headers: authHeader
    });
    return await this.handleResponse(response);
  }

  async cancelBooking(id) {
    const authHeader = await this.getAuthHeader();
    const response = await fetch(`${BASE_URL}/bookings/${id}/cancel`, {
      method: 'PUT',
      headers: authHeader
    });
    return await this.handleResponse(response);
  }

  // --- Payment APIs ---
  async createPaymentOrder(eventId) {
    const authHeader = await this.getAuthHeader();
    const response = await fetch(`${BASE_URL}/payment/order`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader
      },
      body: JSON.stringify({ eventId })
    });
    return await this.handleResponse(response);
  }

  async verifyPayment(paymentData) {
    const authHeader = await this.getAuthHeader();
    const response = await fetch(`${BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...authHeader
      },
      body: JSON.stringify(paymentData)
    });
    return await this.handleResponse(response);
  }
}

export default new EventService();
