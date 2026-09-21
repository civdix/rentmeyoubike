// Production API Base URL (Configurable via NEXT_PUBLIC_API_URL / VITE_API_URL for remote hosting)
// Automatically normalizes URLs with or without trailing slashes and ensures /api prefix
const resolveApiBase = () => {
  let envUrl = '';
  if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_URL) {
    envUrl = process.env.NEXT_PUBLIC_API_URL;
  }

  if (!envUrl) {
    try {
      if (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_API_URL) {
        envUrl = import.meta.env.VITE_API_URL;
      }
    } catch {
      // ignore
    }
  }

  // Default to Render backend
  if (!envUrl) {
    envUrl = 'https://rentmeyoubikebackend.onrender.com/api';
  }

  const cleanUrl = String(envUrl).trim().replace(/\/+$/, '');
  if (!cleanUrl) return 'https://rentmeyoubikebackend.onrender.com/api';
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const API_BASE = resolveApiBase();

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  // RBAC Authentication headers
  const role = typeof window !== 'undefined' ? localStorage.getItem('vr_role') || 'customer' : 'customer';
  const token = typeof window !== 'undefined' ? (localStorage.getItem('vr_token') || localStorage.getItem('vr_admin_token')) : null;

  const authHeaders = {};
  if (role) {
    authHeaders['x-user-role'] = role;
  }
  if (token) {
    authHeaders['Authorization'] = `Bearer ${token}`;
  }

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const contentTypeHeader = isFormData ? {} : { 'Content-Type': 'application/json' };

  const config = {
    ...options,
    headers: {
      ...contentTypeHeader,
      ...authHeaders,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.error || errorData.message || `HTTP error! status: ${response.status}`;
      if (response.status === 401 && typeof window !== 'undefined') {
        if (!endpoint.startsWith('/auth/') && !endpoint.startsWith('/contact')) {
          window.dispatchEvent(new CustomEvent('vr_unauthorized', { detail: { message: errorMsg, endpoint } }));
        }
      }
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = errorData;
      throw err;
    }
    return await response.json();
  } catch (err) {
    console.warn(`API request to ${url} failed:`, err.message);
    throw err;
  }
}

// ==================== VEHICLES ====================
export async function apiFetchVehicles(params = {}) {
  const query = new URLSearchParams();
  if (params.type && params.type !== 'all') query.append('type', params.type);
  if (params.category && params.category !== 'all') query.append('category', params.category);
  if (params.transmission && params.transmission !== 'all') query.append('transmission', params.transmission);
  if (params.area && params.area !== 'all') query.append('area', params.area);
  if (params.maxPrice) query.append('maxPrice', params.maxPrice);
  if (params.status && params.status !== 'all') query.append('status', params.status);
  if (params.search) query.append('search', params.search);

  const qs = query.toString();
  return request(`/vehicles${qs ? `?${qs}` : ''}`);
}

export async function apiFetchVehicleById(id) {
  return request(`/vehicles/${id}`);
}

export async function apiCreateVehicle(vehicleData) {
  return request('/vehicles', {
    method: 'POST',
    body: JSON.stringify(vehicleData)
  });
}

export async function apiUpdateVehicle(id, vehicleData) {
  return request(`/vehicles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(vehicleData)
  });
}

export async function apiToggleVehicleStatus(id) {
  return request(`/vehicles/${id}/status`, {
    method: 'PATCH'
  });
}

export async function apiVerifyVehicle(id, action) {
  return request(`/vehicles/${id}/verify`, {
    method: 'PATCH',
    body: JSON.stringify({ action })
  });
}

// ==================== BOOKINGS ====================
export async function apiFetchBookings(params = {}) {
  const query = new URLSearchParams();
  if (params.status && params.status !== 'all') query.append('status', params.status);
  if (params.customerPhone) query.append('customerPhone', params.customerPhone);
  if (params.search) query.append('search', params.search);

  const qs = query.toString();
  return request(`/bookings${qs ? `?${qs}` : ''}`);
}

export async function apiFetchBookingById(id) {
  return request(`/bookings/${id}`);
}

export async function apiCreateBooking(bookingData) {
  return request('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  });
}

export async function apiUpdateBookingStatus(id, status, extra = {}) {
  return request(`/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, extra })
  });
}

export async function apiUpdatePaymentStatus(id, paymentStatus, paymentId = null, refundStatus = null) {
  return request(`/bookings/${id}/payment`, {
    method: 'PATCH',
    body: JSON.stringify({ paymentStatus, paymentId, refundStatus })
  });
}

export async function apiVerifyKYC(id, kycData = {}) {
  return request(`/bookings/${id}/kyc`, {
    method: 'PATCH',
    body: JSON.stringify(kycData)
  });
}

// ==================== INSPECTIONS ====================
export async function apiFetchInspections(bookingId = null) {
  if (bookingId) {
    return request(`/inspections/${bookingId}`);
  }
  return request('/inspections');
}

export async function apiSaveInspection(bookingId, type, inspectionData) {
  return request(`/inspections/${bookingId}`, {
    method: 'POST',
    body: JSON.stringify({ type, inspectionData })
  });
}

// ==================== CUSTOMERS ====================
export async function apiFetchCustomers(search = '') {
  const qs = search ? `?search=${encodeURIComponent(search)}` : '';
  return request(`/customers${qs}`);
}

export async function apiToggleCustomerStatus(id) {
  return request(`/customers/${id}/status`, {
    method: 'PATCH'
  });
}

// ==================== OWNERS ====================
export async function apiFetchOwners(search = '') {
  const qs = search ? `?search=${encodeURIComponent(search)}` : '';
  return request(`/owners${qs}`);
}

export async function apiToggleOwnerStatus(id) {
  return request(`/owners/${id}/status`, {
    method: 'PATCH'
  });
}

export async function apiVerifyOwner(id, status = 'Verified') {
  return request(`/owners/${id}/verify`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
}

export async function apiFetchOwnerUpi() {
  return request('/owners/payout/upi');
}

export async function apiSaveOwnerUpi(upiId) {
  return request('/owners/payout/upi', {
    method: 'PUT',
    body: JSON.stringify({ upiId })
  });
}

// ==================== DISPUTES ====================
export async function apiFetchDisputes() {
  return request('/disputes');
}

export async function apiCreateDispute(disputeData) {
  return request('/disputes', {
    method: 'POST',
    body: JSON.stringify(disputeData)
  });
}

export async function apiAddDisputeNote(id, text, sender = 'Admin') {
  return request(`/disputes/${id}/notes`, {
    method: 'POST',
    body: JSON.stringify({ text, sender })
  });
}

export async function apiResolveDispute(id, outcome) {
  return request(`/disputes/${id}/resolve`, {
    method: 'PATCH',
    body: JSON.stringify({ outcome })
  });
}

// ==================== SETTINGS & STATS ====================
export async function apiFetchSettings() {
  return request('/settings');
}

export async function apiUpdateAdminSettings(settings) {
  return request('/settings', {
    method: 'PUT',
    body: JSON.stringify(settings)
  });
}

export async function apiUpdateLegalConfig(legal) {
  return request('/settings/legal', {
    method: 'PUT',
    body: JSON.stringify(legal)
  });
}

export async function apiResetDemoData() {
  return request('/settings/reset', {
    method: 'POST'
  });
}

export async function apiFetchOverviewStats() {
  return request('/stats/overview');
}

function sanitizeClientUser(user) {
  if (!user || typeof user !== 'object') return null;
  const { password, pin, otp, token, ...safeUser } = user;
  return safeUser;
}

// ==================== AUTH / RBAC ====================
export async function apiLogin({ identifier, password, role }) {
  const res = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password, role })
  });
  if (res?.token && typeof window !== 'undefined') {
    localStorage.setItem('vr_token', res.token);
    localStorage.setItem('vr_role', res.role || 'customer');
    if (res.role === 'admin') localStorage.setItem('vr_admin_token', res.token);
    if (res.user) {
      const safe = sanitizeClientUser(res.user);
      localStorage.setItem('vr_user', JSON.stringify(safe));
    }
  }
  return res;
}

export async function apiRegister({ name, phone, email, password }) {
  const res = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, phone, email, password })
  });
  if (res?.token && typeof window !== 'undefined') {
    localStorage.setItem('vr_token', res.token);
    localStorage.setItem('vr_role', res.role || 'customer');
    if (res.user) {
      const safe = sanitizeClientUser(res.user);
      localStorage.setItem('vr_user', JSON.stringify(safe));
    }
  }
  return res;
}

export async function apiCustomerLogin(credentials) {
  const res = await request('/auth/customer-login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
  if (res?.token && typeof window !== 'undefined') {
    localStorage.setItem('vr_token', res.token);
    localStorage.setItem('vr_role', 'customer');
    if (res.user) {
      const safe = sanitizeClientUser(res.user);
      localStorage.setItem('vr_user', JSON.stringify(safe));
    }
  }
  return res;
}

export async function apiOwnerLogin(credentials) {
  const res = await request('/auth/owner-login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
  if (res?.token && typeof window !== 'undefined') {
    localStorage.setItem('vr_token', res.token);
    localStorage.setItem('vr_role', 'owner');
    if (res.user) {
      const safe = sanitizeClientUser(res.user);
      localStorage.setItem('vr_user', JSON.stringify(safe));
    }
  }
  return res;
}

export async function apiAdminLogin(pin) {
  const res = await request('/auth/admin-login', {
    method: 'POST',
    body: JSON.stringify({ pin })
  });
  if (res?.token && typeof window !== 'undefined') {
    localStorage.setItem('vr_token', res.token);
    localStorage.setItem('vr_admin_token', res.token);
    localStorage.setItem('vr_role', 'admin');
    if (res.user) {
      const safe = sanitizeClientUser(res.user);
      localStorage.setItem('vr_user', JSON.stringify(safe));
    }
  }
  return res;
}

export async function apiAdminLogout() {
  try {
    await request('/auth/logout', { method: 'POST' });
  } catch (e) {
    // Ignore network failure on logout
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vr_token');
      localStorage.removeItem('vr_admin_token');
      localStorage.removeItem('vr_user');
    }
  }
}

export async function apiGetSession() {
  return request('/auth/me');
}

// ==================== EMAIL VERIFICATION & DISTINCTION ====================
export async function apiCheckEmail(email, role = 'customer') {
  return request('/auth/check-email', {
    method: 'POST',
    body: JSON.stringify({ email, role })
  });
}

export async function apiSendEmailOtp(email, role = 'customer') {
  return request('/auth/send-email-otp', {
    method: 'POST',
    body: JSON.stringify({ email, role })
  });
}

export async function apiVerifyEmailOtp(email, otp) {
  return request('/auth/verify-email-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp })
  });
}

// ==================== IMAGEKIT PHOTO UPLOADS & SETTLEMENT ====================
export const MAX_PHOTO_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

export async function apiGetUploadAuth() {
  return request('/upload/auth');
}

export async function apiUploadPhoto(fileOrBase64, metadata = {}) {
  // Client-side 5 MB limit enforcement
  if (fileOrBase64 instanceof File || fileOrBase64 instanceof Blob) {
    if (fileOrBase64.size > MAX_PHOTO_UPLOAD_BYTES) {
      const mb = (fileOrBase64.size / (1024 * 1024)).toFixed(1);
      throw new Error(`Photo size exceeds 5 MB limit (${mb} MB). Please select an image under 5 MB.`);
    }

    const formData = new FormData();
    formData.append('photo', fileOrBase64);
    if (metadata.bookingId) formData.append('bookingId', metadata.bookingId);
    if (metadata.vehicleId) formData.append('vehicleId', metadata.vehicleId);
    if (metadata.category) formData.append('category', metadata.category);
    if (metadata.fileName) formData.append('fileName', metadata.fileName);

    return request('/upload', {
      method: 'POST',
      body: formData
    });
  } else if (typeof fileOrBase64 === 'string') {
    // Base64 or Data URI string
    const stringLength = fileOrBase64.length - (fileOrBase64.indexOf(',') + 1);
    const approxBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383687;
    if (approxBytes > MAX_PHOTO_UPLOAD_BYTES) {
      throw new Error('Photo size exceeds 5 MB limit. Please select an image under 5 MB.');
    }

    return request('/upload', {
      method: 'POST',
      body: JSON.stringify({
        image: fileOrBase64,
        fileName: metadata.fileName || 'photo.jpg',
        bookingId: metadata.bookingId || null,
        vehicleId: metadata.vehicleId || null,
        category: metadata.category || 'inspection'
      })
    });
  } else {
    throw new Error('Invalid photo upload argument: must be a File, Blob, or base64 string.');
  }
}

export async function apiDeletePhoto(fileId) {
  return request(`/upload/${fileId}`, {
    method: 'DELETE'
  });
}

export async function apiCleanupBookingImages(bookingId) {
  return request(`/upload/settlement-cleanup/${bookingId}`, {
    method: 'POST'
  });
}

// Contact Form API: Submits inquiry server-side
export async function apiSendContactMessage({ name, email, to, subject, message }) {
  return request('/contact', {
    method: 'POST',
    body: JSON.stringify({ name, email, to, subject, message })
  });
}

// ==================== LIVE CHAT / MESSAGING ====================
export async function apiFetchConversations() {
  return request('/messages/conversations');
}

export async function apiFetchMessages(params = {}) {
  const query = new URLSearchParams();
  if (params.conversationId) query.append('conversationId', params.conversationId);
  if (params.bookingId) query.append('bookingId', params.bookingId);
  if (params.customerPhone) query.append('customerPhone', params.customerPhone);
  const qs = query.toString();
  return request(`/messages${qs ? `?${qs}` : ''}`);
}

export async function apiSendMessage(data) {
  return request('/messages', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function apiMarkMessagesRead(conversationId) {
  return request(`/messages/${conversationId}/read`, {
    method: 'PATCH'
  });
}

