import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SubmitFormLoading from "../components/SubmitFormLoading";

const FormSubmitPage = () => {
    const { formId } = useParams();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({});
    const [currentPageIndex, setCurrentPageIndex] = useState(0); // Track the current page index
    const [responses, setResponses] = useState([]); // Store responses as an array with _id, title, and response
    const pages = form.pages || []; // Ensure pages array exists before mapping over it
    const baseURL = import.meta.env.VITE_BACK_URL;

    useEffect(() => {
        const fetchSubmitForm = async () => {
            setLoading(true);
            try {
                console.log("The form is fetched: ");
                const response = await axios.get(`${baseURL}/getsubmitform/${formId}`);
                if (response.status === 200) {
                    setForm(response.data.form[0]);  // Set the form state with the fetched form data
                }
            } catch (error) {
                console.error("Error fetching form data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmitForm();
    }, [formId]);

    useEffect(() => {
        console.log("This is the response object: ", responses);
    }, [responses]);

    useEffect(() => {
        console.log("These are the pages: ", pages);
        console.log("This is the updated form from FormSubmitPage: ", form);
    }, [form]);

    // Handle input changes for text and radio button responses
    const handleInputChange = (page, value) => {
        setResponses((prevResponses) => {
            // Check if the response for this page already exists
            const existingResponseIndex = prevResponses.findIndex(response => response._id === page._id);
            
            if (existingResponseIndex >= 0) {
                // If exists, update the response
                const updatedResponses = [...prevResponses];
                updatedResponses[existingResponseIndex] = { 
                    _id: page._id, 
                    title: page.title, 
                    response: value 
                };
                return updatedResponses;
            } else {
                // If does not exist, add a new response object
                return [...prevResponses, { 
                    _id: page._id, 
                    title: page.title, 
                    response: value 
                }];
            }
        });
    };

    // Render form page content based on the page type
    const renderPageContent = (page) => {
        switch (page.type) {
            case 'text':
                return (
                    <div key={page._id} className="mb-4">
                        <label className="block text-3xl font-base">{page.title}</label>
                        <label className="block text-xl font-base my-4">{page.description ? page.description : ""}</label>
                        <input
                            type="text"
                            placeholder={page.placeholder}
                            required={page.isRequired}
                            value={responses.find(response => response._id === page._id)?.response || ''}
                            onChange={(e) => handleInputChange(page, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mt-2"
                        />
                    </div>
                );
            case 'Multiple Choice Question':
            case 'radioButton':
                return (
                    <div key={page._id} className="mb-4">
                        <label className="block text-lg font-semibold">{page.title}</label>
                        <div className="mt-2">
                            {page.options.map((option, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="radio"
                                        name={page._id}
                                        id={`${page._id}-${index}`}
                                        value={option}
                                        checked={responses.find(response => response._id === page._id)?.response === option}
                                        required={page.isRequired}
                                        onChange={(e) => handleInputChange(page, e.target.value)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={`${page._id}-${index}`} className="text-md">{option}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    // Navigate to the next page
    const goToNextPage = () => {
        if (currentPageIndex < pages.length - 1) {
            setCurrentPageIndex(currentPageIndex + 1);
        }
    };

    // Navigate to the previous page
    const goToPreviousPage = () => {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(currentPageIndex - 1);
        }
    };

    // Handle form submission
    const handleFormSubmit = async () => {
        try {
            const response = await axios.post(`${baseURL}/submitform/${form._id}`, {
                responses,
            });
            if (response.status === 200) {
                // Handle success (e.g., show a success message or redirect)
                alert('Form submitted successfully!');
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    // Conditional rendering based on loading state
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
            {loading ? (
                <SubmitFormLoading />
            ) : (
                <div className="p-6 rounded-lg w-96">
                    {pages.length > 0 ? (
                        <div className="space-y-4">
                            {/* Render the current page */}
                            {renderPageContent(pages[currentPageIndex])}

                            {/* Navigation buttons */}
                            <div className="flex justify-between">
                                <button
                                    onClick={goToPreviousPage}
                                    disabled={currentPageIndex === 0}
                                    className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-400"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={currentPageIndex === pages.length - 1 ? handleFormSubmit : goToNextPage}
                                    disabled={currentPageIndex === pages.length - 1 && Object.keys(responses).length < pages.length}
                                    className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-400"
                                >
                                    {currentPageIndex === pages.length - 1 ? "Submit" : "Next"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No form pages available</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default FormSubmitPage;
