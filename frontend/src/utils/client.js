// API Client for DineReserve Backend
// Centralized module for all API requests

const API_BASE_URL = 'https://dinereserve.onrender.com';

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
 * Register a new user
 * @param {object} userData - { name, email, phone, password }
 * @returns {Promise<object>} - User registration response
 */
export const registerUser = async (userData) => {
  return apiCall('/user/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

/**
 * Login user
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} - User login response with user data
 */
export const loginUser = async (credentials) => {
  return apiCall('/user/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

/**
 * Increment reservation count for a user
 * @param {string} userId - User ID
 * @returns {Promise<object>} - Updated user data
 */
export const incrementUserReservations = async (userId) => {
  return apiCall(`/user/${userId}/increment-reservations`, {
    method: 'POST',
  });
};

// ==================== RESERVATION ENDPOINTS ====================

/**
 * Create a new reservation
 * @param {object} reservationData - { name, email, phone, date, time, seats }
 * @returns {Promise<object>} - Created reservation response
 */
export const createReservation = async (reservationData) => {
  return apiCall('/reservation/register', {
    method: 'POST',
    body: JSON.stringify(reservationData),
  });
};

/**
 * Get all reservations for a specific user by email
 * @param {string} email - User email
 * @returns {Promise<object>} - Array of reservations
 */
export const getUserReservations = async (email) => {
  return apiCall(`/reservation/user/${email}`, {
    method: 'GET',
  });
};

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
 * Get a specific reservation by ID
 * @param {string} reservationId - Reservation ID
 * @returns {Promise<object>} - Reservation details
 */
export const getReservationById = async (reservationId) => {
  return apiCall(`/reservation/${reservationId}`, {
    method: 'GET',
  });
};

/**
 * Update a reservation
 * @param {string} reservationId - Reservation ID
 * @param {object} updateData - Data to update
 * @returns {Promise<object>} - Updated reservation
 */
export const updateReservation = async (reservationId, updateData) => {
  return apiCall(`/reservation/${reservationId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData),
  });
};

/**
 * Delete a reservation
 * @param {string} reservationId - Reservation ID
 * @returns {Promise<object>} - Deletion response
 */
export const deleteReservation = async (reservationId) => {
  return apiCall(`/reservation/${reservationId}`, {
    method: 'DELETE',
  });
};

/**
 * Cancel a reservation
 * @param {string} reservationId - Reservation ID
 * @returns {Promise<object>} - Cancellation response
 */
export const cancelReservation = async (reservationId) => {
  return apiCall(`/reservation/${reservationId}/cancel`, {
    method: 'PUT',
  });
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Store user data in localStorage
 * @param {object} user - User object
 */
export const saveUserToStorage = (user) => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
    if (user.email) {
      localStorage.setItem('userEmail', user.email);
    }
  } catch (err) {
    console.warn('Failed to save user to localStorage:', err);
  }
};

/**
 * Get user data from localStorage
 * @returns {object|null} - User object or null
 */
export const getUserFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem('user')) || null;
  } catch (err) {
    console.warn('Failed to get user from localStorage:', err);
    return null;
  }
};

/**
 * Get user email from localStorage
 * @returns {string|null} - User email or null
 */
export const getUserEmailFromStorage = () => {
  try {
    return localStorage.getItem('userEmail') || null;
  } catch (err) {
    console.warn('Failed to get user email from localStorage:', err);
    return null;
  }
};

/**
 * Clear user data from localStorage (logout)
 */
export const clearUserFromStorage = () => {
  try {
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
  } catch (err) {
    console.warn('Failed to clear user from localStorage:', err);
  }
};

/**
 * Check if user is logged in
 * @returns {boolean} - True if user is logged in
 */
export const isUserLoggedIn = () => {
  const user = getUserFromStorage();
  return !!user && !!user.email;
};
