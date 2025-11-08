// API Client for DineReserve Admin Dashboard
// Centralized module for all admin API requests

const API_BASE_URL = 'https://dinereserve.onrender.com/api';

/**
 * Get admin auth token from localStorage
 */
const getAdminAuth = () => {
  return localStorage.getItem('adminAuth') || '';
};

/**
 * Generic fetch wrapper with error handling
 * @param {string} endpoint - API endpoint (e.g., '/user/login')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<object>} - Response data
 */
const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': getAdminAuth(),
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Backend already returns { success, data }, so just pass it through
    if (data.success !== undefined) {
      return data;
    }

    // Fallback for endpoints that don't return success field
    return { success: true, data };
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error.message);
    return { success: false, error: error.message };
  }
};

// ==================== USER ENDPOINTS ====================

/**
 * Get all users (admin endpoint)
 * @returns {Promise<object>} - All users
 */
export const getAllUsers = async () => {
  return apiCall('/user', {
    method: 'GET',
  });
};

/**
 * Update user (name, email, phone)
 * @param {string} userId - User ID
 * @param {object} updateData - { name, email, phone }
 * @returns {Promise<object>} - Updated user
 */
export const updateUser = async (userId, updateData) => {
  return apiCall(`/user/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
};

/**
 * Block/Unblock user
 * @param {string} userId - User ID
 * @returns {Promise<object>} - Updated user
 */
export const toggleBlockUser = async (userId) => {
  return apiCall(`/user/${userId}/block`, {
    method: 'POST',
  });
};

// ==================== RESERVATION ENDPOINTS ====================

/**
 * Get all reservations (admin endpoint)
 * @returns {Promise<object>} - All reservations
 */
export const getAllReservations = async () => {
  return apiCall('/reservation', {
    method: 'GET',
  });
};

/**
 * Update reservation status
 * @param {string} reservationId - Reservation ID
 * @param {object} updateData - { status, name, email, phone, time, seats, date }
 * @returns {Promise<object>} - Updated reservation
 */
export const updateReservation = async (reservationId, updateData) => {
  return apiCall(`/reservation/${reservationId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
};

/**
 * Delete reservation
 * @param {string} reservationId - Reservation ID
 * @returns {Promise<object>} - Deletion response
 */
export const deleteReservation = async (reservationId) => {
  return apiCall(`/reservation/${reservationId}`, {
    method: 'DELETE',
  });
};

/**
 * Cancel reservation
 * @param {string} reservationId - Reservation ID
 * @returns {Promise<object>} - Cancellation response
 */
export const cancelReservation = async (reservationId) => {
  return apiCall(`/reservation/${reservationId}/cancel`, {
    method: 'PUT',
  });
};
