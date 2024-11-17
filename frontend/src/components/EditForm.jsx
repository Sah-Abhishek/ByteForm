import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useFormStore from "../store/formStore";  // Import the zustand store for forms
import LeftSideBar from "./LeftSideBar";

const EditForm = () => {
    const { formId } = useParams();  // Get form ID from URL
    const baseURL = import.meta.env.VITE_BACK_URL;
    const { user } = useAuthStore();  // Get the current user from auth store
    const { selectForm, selectedForm } = useFormStore();  // Get the selected form and selectForm from the form store
    const state = useFormStore.getState();

    // Fetch the form data when the component mounts or when formId changes
    useEffect(() => {
        const fetchForm = async () => {
            try {
                console.log("Fetching form with ID: ", formId);  // Log the form ID to ensure it's correct
                const response = await axios.get(`${baseURL}/form/${formId}`);  // Send GET request to backend
                console.log("Fetched form data: ", response.data);  // Log the fetched form data
                selectForm(response.data._id);  // Update the Zustand store with the fetched form data
                console.log("This is the current state: ", state);

            } catch (error) {
                console.error("Error fetching form details:", error);  // Log any error that occurs
            }
        };

        if (formId) {
            fetchForm();  // Only call the function if formId is present
        }
    }, [formId, baseURL, selectForm]);  // Re-run the effect when formId or baseURL changes

    // Effect to log selectedForm whenever it updates
    useEffect(() => {
        if (selectedForm) {
            console.log("Selected form has been updated:", selectedForm);  // Log selected form data
            console.log("This is the current state if selecteForm: ", state);

        }
    }, [selectedForm]);

    return (
        <div>
            <nav className="flex items-center justify-between w-full pb-4">
                <div className="flex items-center">
                    <button className="bg-black rounded-md text-white p-2 h-10 w-10 font-semibold m-2 mx-3">
                        {user.username.charAt(0)}
                    </button>
                    <span>{user.username}</span>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3 mx-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </span>
                </div>
                <div><button className="bg-red text-white rounded-md px-3 py-1 mr-4 bg-[#ae4e09] text-sm">View plans</button></div>
            </nav>
            <LeftSideBar/>

            {/* Display selected form details */}
            {selectedForm ? (
                <div>
                    <h2>{selectedForm.title}</h2>
                    <p>{selectedForm.description}</p>
                    {/* Add any other fields you want to display */}
                </div>
            ) : (
                <p>Loading form...</p>
            )}
        </div>
    );
};

export default EditForm;
