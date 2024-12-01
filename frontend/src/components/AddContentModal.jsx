import useFormStore from "../store/formStore";

const AddContentModal = ({ isModalOpen, setIsModalOpen, closeModal }) => {
    const { addNewPage, setCurrentPageIndex, forms } = useFormStore();

    const colors = [
        { name: 'Red', class: 'bg-red-300' },
        { name: 'Green', class: 'bg-green-300' },
        { name: 'Blue', class: 'bg-blue-300' },
        { name: 'Yellow', class: 'bg-yellow-300' },
        { name: 'Pink', class: 'bg-pink-300' }
    ];

    const options = [
        { number: 1, name: "Multiple Choice", type: "Multiple Choice Question" },
        { number: 2, name: "Short Text", type: "text" },
        { number: 3, name: "Long Text", type: "text" },
        { number: 4, name: "Picture Choice", type: "Picture Choice" }
    ];

    const handleOptionClick = (type) => {
        console.log("This is the pageType from AddContentModal handleoptionClic: ", type);
        addNewPage(type);
        setCurrentPageIndex(forms.length - 2);
        // Call the function to add a new page
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Background overlay with opacity */}
            <div className="fixed inset-0 bg-black opacity-50" onClick={closeModal}></div>

            {/* The modal itself with full opacity */}
            <div className="bg-white border border-black rounded-xl flex flex-col items-center justify-center w-[500px] h-[500px] p-4 relative z-10">
                <button className="top-2 right-3 absolute text-2xl" onClick={closeModal}>
                    <p>&times;</p>
                </button>
                <div className="text-2xl font-bold top-2 absolute">
                    Add Content
                </div>
                <div className="flex flex-col space-y-4">
                    {options.map((option, index) => {
                        const colorClass = colors[index % colors.length].class; // Cycle through colors
                        return (
                            <button
                                key={option.number}  // Use option.type as the unique key
                                className={`${colorClass} cursor-pointer rounded-lg px-2 py-1.5`}
                                onClick={() => handleOptionClick(option.type)}  // Correct way to invoke the handler
                            >
                                {option.name}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AddContentModal;
