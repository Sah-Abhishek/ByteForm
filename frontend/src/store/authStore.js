import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
    user: null,
    token: null,
    loading: false,
    error: null,

    setUser: (user, token) => set({ user }),

    logOut: () => set({ user: null, token: null}),

    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    login: async (email, password) => {
        set({ loading: true, error: null });  // Reset error and set loading to true
        try {
            const response = await axios.post("http://localhost:3000/login", {
                email, password
            });
            const { user, token } = response.data;
            set({ user, token, loading: false });
            localStorage.setItem('token', token);  // Save token in localStorage
            return { success: true };  // Return success response to the component
    
        } catch (err) {
            // If there's an error, set the error message in the store
            const errorMessage = err.response?.data?.message || 'An error occurred during login.';
            console.log("Error from login:", errorMessage);
            set({ error: errorMessage });  // Set only the message part of the error
            return { success: false, message: errorMessage };  // Return error message and status
        } finally {
            set({ loading: false });  // Reset loading state
        }
    },
    

    signup: async (username, email, password) => {
        set({ loading: true, error: null });  // Reset any previous loading or error state
        
        try {
            // Make the API call to signup
            const response = await axios.post("http://localhost:3000/signup", { username, email, password });
            
            console.log("This is the response from the backend: ", response.data);
            return response;  // Return the response to be handled in the component
        } catch (err) {
            console.error("Error in signup process: ", err);
            
            // Check if error response exists and contains a message
            const errorMessage = err.response?.data?.message || "An unknown error occurred.";
            console.log("Error from backend: ", errorMessage);
            
            // Update the store with the error message
            set({ error: errorMessage });
            
            // Optionally throw the error to handle it in the component (e.g., for a global error handler)
            throw new Error(errorMessage);  // You can customize this if necessary
        } finally {
            // Reset loading state after completion (success or error)
            set({ loading: false });
        }
    }
    
    
    
}))
export default useAuthStore;