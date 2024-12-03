import { create } from 'zustand';
import axios from 'axios';
const baseURL = import.meta.env.VITE_BACK_URL;


// A utility function to save the user and token in localStorage
const saveToLocalStorage = (user, token) => {
  if (user && token) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }
};

// A utility function to get the user and token from localStorage
const getFromLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  return { user, token };
};

const useAuthStore = create((set) => {
  const { user, token } = getFromLocalStorage(); // Load user and token from localStorage on app load

  return {
    user: user || null, // Default to null if no user found
    token: token || null, // Default to null if no token found
    loading: false,
    error: null,

    // Set user and token in Zustand store and localStorage
    setUser: (user, token) => {
      set({ user, token });
      saveToLocalStorage(user, token); // Save to localStorage
    },

    logOut: () => {
      set({ user: null, token: null });
      localStorage.removeItem('user');
      localStorage.removeItem('token'); // Remove from localStorage
    },

    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    login: async (email, password) => {
      set({ loading: true, error: null });  // Reset error and set loading to true
      try {
        const response = await axios.post(`${baseURL}/login`, { email, password });
        const { user, token } = response.data;
        set({ loading: false });
        saveToLocalStorage(user, token);  // Save to localStorage
        set({ user, token });
        return { success: true };
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'An error occurred during login.';
        set({ error: errorMessage, loading: false });
        return { success: false, message: errorMessage };
      }
    },

    signup: async (username, email, password) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.post(`${baseURL}/signup`, { username, email, password });
        return response;
      } catch (err) {
        const errorMessage = err.response?.data?.message || "An unknown error occurred.";
        set({ error: errorMessage, loading: false });
        throw new Error(errorMessage);
      }
    }
  };
});

export default useAuthStore;
