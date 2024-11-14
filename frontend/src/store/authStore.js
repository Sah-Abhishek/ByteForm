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
        set({ loading: true , error: null});
        try{
            console.log("This is a test from useAuthStore");
            const response = await axios.post("http://localhost:3000/login", {
                email, password
            });
            console.log("This is response from login authStore: ", response);
            const { user, token } = response.data;
            set({user: user, token: token, loading: false});
            localStorage.setItem('token', token);
            console.log("Login Successful from login authStore");

        }catch(error){
            // console.log("This is response from login authstore: ", response.data);
            console.log("This is error from zustand authStore.js: ", error);
        }finally{
            set({loading: false})
        }
    }
    
    
}))
export default useAuthStore;