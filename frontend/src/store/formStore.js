import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFormStore = create(
  persist(
    (set) => ({
      forms: [],  // Array to hold form data
      selectedForm: null,  // Store the form that is selected

      // Function to set the list of forms
      setForms: (forms) => set({ forms }),

      // Function to add a new form
      addForm: (newForm) => set((state) => ({ forms: [...state.forms, newForm] })),

      // Function to select a form by ID
      selectForm: (formId) => set((state) => ({
        selectedForm: state.forms.find((form) => form._id === formId) || null
      })),

      // Function to update an existing form
      updateForm: (updatedForm) => set((state) => ({
        forms: state.forms.map((form) => form._id === updatedForm._id ? updatedForm : form)
      })),

      // Function to remove a form
      removeForm: (formId) => set((state) => ({
        forms: state.forms.filter((form) => form._id !== formId)
      }))
    }),
    {
      name: 'form-store',  // Name of the storage key
      getStorage: () => localStorage,  // Use localStorage for persistence
    }
  )
);

export default useFormStore;
