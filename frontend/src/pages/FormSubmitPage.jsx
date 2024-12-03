import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SubmitFormLoading from "../components/SubmitFormLoading";

const FormSubmitPage = () => {
    const { formId } = useParams();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({});
    const [currentPageIndex, setCurrentPageIndex] = useState(0); // Track the current page index
    const pages = form.pages || []; // Ensure pages array exists before mapping over it

    useEffect(() => {
        const fetchSubmitForm = async () => {
            setLoading(true);
            try {
                console.log("The form is fetched: ");
                const response = await axios.get(`http://localhost:3000/getsubmitform/${formId}`);
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
    }, [formId]);  // Dependency on formId so it will refetch when formId changes

    // Now log form after it's updated
    useEffect(() => {
        console.log("These are the pages: ", pages);
        console.log("This is the updated form from FormSubmitPage: ", form);
    }, [form]); // Log the form only when it's updated

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
                            className="w-full p-2 border border-gray-300 rounded mt-2"
                        />
                    </div>
                );
            case 'Multiple Choice Question':
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
                                        required={page.isRequired}
                                        className="mr-2"
                                    />
                                    <label htmlFor={`${page._id}-${index}`} className="text-md">{option}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                );
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
                                        required={page.isRequired}
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

    // Conditional rendering based on loading state
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
            {loading ? (
                <SubmitFormLoading />
            ) : (
                <div className=" p-6 rounded-lg  w-96">
                    {/* Render the current page content */}
                    {/* {form.title && <h1 className="text-2xl font-bold text-center mb-6">{form.title}</h1>} */}
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
                                    onClick={goToNextPage}
                                    disabled={currentPageIndex === pages.length - 1}
                                    className="bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-400"
                                >
                                    {currentPageIndex === pages.length -1 ? "Submit" : "Next"}
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
