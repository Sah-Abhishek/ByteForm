import React, { useState, useEffect } from "react";
import axios, { getAdapter } from "axios";
import { BsThreeDots } from "react-icons/bs";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import useFormStore from "../store/formStore";

const Home = () => {
  const { token, user } = useAuthStore();
  const baseURL = import.meta.env.VITE_BACK_URL;
  const navigate = useNavigate();
  const { forms, setForms, selectForm, deleteForm } = useFormStore();
  const [dropDownOpen, setDropDownOpen] = useState(null); // Track the index of the dropdown that is open


  const fetchForms = async () => {
    try {
      const response = await axios.get(`${baseURL}/getAllForms`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setForms(response.data); // Update state with fetched forms
    } catch (error) {
      console.log("Error fetching forms: ", error);
    }
  };
  
  const createDefaultForm = async () => {
    try {
      const response = await axios.post(`${baseURL}/createNewForm`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(response.status)
      if (response.status === 201) {
        
        toast.success("Form created");
        const newForms = await axios.get(`${baseURL}/getAllForms`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log("The createDefault form is executed: ", )
        fetchForms();
        setForms(newForms.data); // Refresh the form list after creating
      }
    } catch (err) {
      console.log("Error creating form: ", err);
    }
  };


  
  // Fetch forms when the component mounts or when token or user changes
  useEffect(() => {
    if (!user || !token) {
      return navigate('/login');
    }

    

    fetchForms();
  }, [token, user, navigate, baseURL, setForms, ]);



  

  

  const handleFormClick = (formId) => {
    selectForm(formId);
    navigate(`/form/${formId}`);
  };

  const handleSvgClick = (e, index) => {
    e.stopPropagation(); // Prevents triggering the onClick for the form itself
    setDropDownOpen(dropDownOpen === index ? null : index); // Toggle dropdown visibility for this form
  };

  const handleClickOutside = (e) => {
    if (dropDownOpen !== null && !e.target.closest(".dropdown")) {
      setDropDownOpen(null); // Close dropdown if clicked outside
    }
  };

  const handleDeleteForm = async (formId) => {
    try {
      // Make the API call to delete the form from the server
      const response = await axios.delete(`${baseURL}/deleteForm/${formId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        toast.success("Form deleted successfully.");
        
        // Filter out the deleted form from the local state
        const updatedForms = forms.filter((form) => form._id !== formId);
        setForms(updatedForms); // Update the state to reflect the deletion
        
        // Close dropdown after deleting the form
        setDropDownOpen(null);
      }
    } catch (error) {
      console.log("Error deleting form: ", error);
      toast.error("There was an error deleting the form.");
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropDownOpen]);

  return (
    <div>
      <nav className="flex items-center justify-between w-full pb-4">
        <div className="flex items-center">
          <button className="bg-black rounded-md text-white p-2 h-10 w-10 font-semibold m-2 mx-3">
            {user ? user.username.charAt(0) : "?"} {/* Default to "?" if user is null */}
          </button>
          <span>{user ? user.username : "Guest"}</span> {/* Fallback to "Guest" if user is null */}
        </div>
        <div><button className="bg-red text-white rounded-md px-3 py-1 mr-4 bg-[#ae4e09] text-sm">View plans</button></div>
      </nav>

      <div className="flex flex-col justify-center items-center mx-6 bg-gray-100 h-[calc(100vh-72px)] py-10 overflow-auto rounded-xl">
        <div className="flex justify-center items-center">
          <button onClick={createDefaultForm} className="px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-700 transition w-80 font-semibold">+ &nbsp; Create a new form</button>
        </div>
        <hr className="my-4 mt-10 border-t-2 border-gray-300 w-[1700px]" />
        <div className="flex items-center px-4 py-3 text-sm w-[1500px]">
          <div className="w-[66.66%]"></div>
          <div className="flex justify-between w-[33.33%]">
            <h3>Responses</h3>
            <h3 className="mr-20">Updated At</h3>
          </div>
        </div>

        <div className="mt-4 space-y-3 overflow-y-auto scrollbar-hidden">
          {forms.map((form, index) => (
            <div key={form._id} className="flex cursor-pointer items-center justify-between px-4 py-3 bg-white border border-gray-300 w-[1500px] rounded-lg hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_-2px_4px_rgba(0,0,0,0.05),2px_0_4px_rgba(0,0,0,0.05),-2px_0_4px_rgba(0,0,0,0.05)] transition relative">
              <h3 className="w-[66.66%]" onClick={() => handleFormClick(form._id)}>{form.title}</h3>
              <div className="w-[33.33%] flex justify-between">
                <div className="px-7 text-gray-500">
                  <div className="flex">{form.responses.length}</div>
                </div>
                <div className="flex space-x-12">
                  <span className="text-gray-500">{form.updatedAt.split('T')[0]}</span>
                  <span
                    className="hover:rounded-md p-1 hover:bg-gray-200 transition"
                    onClick={(e) => handleSvgClick(e, index)} // Toggle dropdown
                  >
                    <BsThreeDots />
                  </span>
                </div>
              </div>

              {/* Dropdown for Delete */}
              {dropDownOpen === index && (
                <div className="dropdown absolute right-3 top-1/2 transform -translate-y-1/2 bg-white shadow-md border rounded-md mt-2 p-2 w-24 text-sm">
                  <button onClick={() => handleDeleteForm(form._id)} className="text-red-500 w-full text-xs px-1.5 py-1 hover:bg-gray-100 rounded-md">
                    Delete
                  </button>
                </div>
              )}
            </div>
          )).reverse()}
        </div>
      </div>
    </div>
  );
};

export default Home;
