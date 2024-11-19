import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios"; // Import axios for making HTTP requests

const useFormStore = create(
  persist(
    (set) => ({
      forms: [], // Array to hold form data
      selectedForm: null, // Store the form that is selected
      currentPageIndex: 0, // Tracks the current page index

      // Function to set the list of forms
      setForms: (forms) => set({ forms }),

      // Function to add a new form
      addForm: (newForm) => set((state) => ({ forms: [...state.forms, newForm] })),

      // Function to select a form by ID
      selectForm: (formId) =>
        set((state) => ({
          selectedForm: state.forms.find((form) => form._id === formId) || null,
        })),

      // Function to update the form title and description
      updatePageTitleAndDescription: async (newTitle, newDescription) =>
        set((state) => {
          if (!state.selectedForm) return state;

          const currentPage = state.selectedForm.pages[state.currentPageIndex];

          // Update the title and description of the current page in the state
          const updatedPages = state.selectedForm.pages.map((page, index) =>
            index === state.currentPageIndex
              ? { ...page, title: newTitle, description: newDescription }
              : page
          );

          const updatedForm = {
            ...state.selectedForm,
            pages: updatedPages,
          };

          // Update the forms list with the updated form in state
          const updatedForms = state.forms.map((form) =>
            form._id === updatedForm._id ? updatedForm : form
          );

          // Send the PUT request to the backend to update the database
          updateFormInBackend(updatedForm);

          return {
            selectedForm: updatedForm,
            forms: updatedForms,
          };
        }),

      // Function to set the current page index
      setCurrentPageIndex: (index) => set({ currentPageIndex: index }),

      // Function to reorder pages within the selected form
      reorderPages: (startIndex, endIndex) =>
        set((state) => {
          if (!state.selectedForm) return state; // No form selected, no changes
          const updatedPages = Array.from(state.selectedForm.pages);
          const [movedPage] = updatedPages.splice(startIndex, 1); // Remove dragged page
          updatedPages.splice(endIndex, 0, movedPage); // Insert dragged page at new position

          const updatedForm = {
            ...state.selectedForm,
            pages: updatedPages,
          };

          // Update forms list with the updated form
          return {
            selectedForm: updatedForm,
            forms: state.forms.map((form) =>
              form._id === updatedForm._id ? updatedForm : form
            ),
          };
        }),

      // Function to remove a form
      removeForm: (formId) =>
        set((state) => ({
          forms: state.forms.filter((form) => form._id !== formId),
        })),
    }),
    {
      name: "form-store", // Name of the storage key
      getStorage: () => localStorage, // Use localStorage for persistence
    }
  )
);

const updateFormInBackend = async (updatedForm) => {
  try {
    const response = await axios.put(`http://localhost/forms/${updatedForm._id}`, {
      title: updatedForm.title,
      description: updatedForm.description,
      pages: updatedForm.pages,
    });

    if (response.status === 200) {
      console.log("Form updated successfully in the backend.");
    } else {
      console.error("Failed to update the form in the backend.");
    }
  } catch (error) {
    console.error("Error updating the form in the backend:", error);
  }
};

export default useFormStore;
