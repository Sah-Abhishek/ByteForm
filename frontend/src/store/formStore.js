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
      updatePageTitleAndDescription: async (pageId, newTitle, newDescription) => {
        set((state) => {
            if (!state.selectedForm) return state;

            // Find the page by ID and update its title and description
            const updatedPages = state.selectedForm.pages.map((page) =>
                page._id === pageId // Check the ID to find the specific page
                    ? { ...page, title: newTitle, description: newDescription }
                    : page
            );

            const updatedForm = {
                ...state.selectedForm,
                pages: updatedPages,
            };

            // Send the updated form to the backend
            updateFormInBackend(updatedForm, set); // Pass set here

            return {
                selectedForm: updatedForm, // Update selected form in state
                forms: state.forms.map((form) =>
                    form._id === updatedForm._id ? updatedForm : form
                ),
            };
        });
      },

      removeOption: (pageId, option) => {
        set((state) => {
          if (!state.selectedForm) return state;

          console.log("This is the option clicked: ", option);

          const updatedPages = state.selectedForm.pages.map((page) =>
            page._id === pageId
              ? { ...page, options: page.options.filter((opt) => opt !== option) }
              : page
          );

          const updatedForm = {
            ...state.selectedForm,
            pages: updatedPages,
          };

          updateFormInBackend(updatedForm, set); // Pass set here

          return {
            selectedForm: updatedForm,
            forms: state.forms.map((form) =>
              form._id === updatedForm._id ? updatedForm : form
            ),
          };
        });
      },

      // Function to set the current page index
      setCurrentPageIndex: (index) => set({ currentPageIndex: index }),

      addOption: (pageId, newOption) => {
        set((state) => {
          if (!state.selectedForm || !newOption) return state;

          // Find the page and add the new option to its options
          const updatedPages = state.selectedForm.pages.map((page) =>
            page._id === pageId
              ? { ...page, options: [...page.options, newOption] }
              : page
          );

          const updatedForm = {
            ...state.selectedForm,
            pages: updatedPages,
          };

          // Update the backend with the new option
          updateFormInBackend(updatedForm, set); // Pass set here

          return {
            selectedForm: updatedForm,
            forms: state.forms.map((form) =>
              form._id === updatedForm._id ? updatedForm : form
            ),
          };
        });
      },

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

          updateFormInBackend(updatedForm, set);

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

// Function to update form in the backend
const updateFormInBackend = async (updatedForm, set) => {
  try {
    const response = await axios.put(`http://localhost:3000/updateform/${updatedForm._id}`, updatedForm);

    if (response.status === 200) {
      console.log("Form updated successfully in the backend.");
      
      // Set the updated form as the selected form in the store
      set((state) => ({
        selectedForm: updatedForm,
        forms: state.forms.map((form) =>
          form._id === updatedForm._id ? updatedForm : form
        ),
      }));
    } else {
      console.error("Failed to update the form in the backend.");
    }
  } catch (error) {
    console.error("Error updating the form in the backend:", error);
  }
};

export default useFormStore;
