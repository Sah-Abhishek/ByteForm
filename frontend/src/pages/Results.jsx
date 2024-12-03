import axios from "axios";
import { useEffect, useState } from "react";
import useFormStore from "../store/formStore";

const Results = () => {
    const { selectedForm } = useFormStore(); // Access the selected form from your state store
    const baseURL = import.meta.env.VITE_BACK_URL; // URL from environment variables
    const formId = selectedForm._id;  // Form ID from the selected form
    const [error, setError] = useState('');  // State to manage error messages
    const [results, setResults] = useState([]);  // State to store the results

    // Fetch results on component mount
    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get(`${baseURL}/getResults/${formId}`);  // API call to fetch form responses
                console.table(response.data);  // For debugging: Log the results in the console
                // Flatten the array of responses
                const flattenedResults = response.data.flat();
                setResults(flattenedResults);  // Update state with the flattened results
            } catch (error) {
                console.log("There was an error while fetching results: ", error);
                setError("Failed to fetch results");  // Set error message if request fails
            }
        };

        fetchResults();
    }, [formId, baseURL]);

    // Group responses by question title
    const groupedResults = results.reduce((acc, curr) => {
        const { title, response } = curr;
        if (!acc[title]) {
            acc[title] = [];
        }
        acc[title].push(response);
        return acc;
    }, {});

    // Extract the question titles (keys from groupedResults) for the table headers
    const questionTitles = Object.keys(groupedResults);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}  {/* Show error if exists */}
                <h1 className="text-3xl font-semibold text-center mb-6">Form Responses</h1>

                {/* Results Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                {/* Render dynamic headers for each question */}
                                {questionTitles.map((question, idx) => (
                                    <th key={idx} className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                                        {question}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Render each row as a response */}
                            {Object.values(groupedResults)[0]?.map((_, idx) => (
                                <tr key={idx}>
                                    {/* For each response, create a cell for every question */}
                                    {questionTitles.map((question, index) => (
                                        <td key={index} className="px-4 py-2 text-sm">
                                            {groupedResults[question][idx]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Results;
