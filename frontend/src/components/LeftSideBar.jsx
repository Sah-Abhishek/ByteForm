import useFormStore from "../store/formStore";


const LeftSideBar = () => {
    const { selectedForm } = useFormStore();
    return (
        <div>
            <div className="w-1/8 bg-gray-200 h-full sticky top-0 px-5 pt-4 shadow-md border border-black rounded-xl overflow-y-auto scrollbar-hidden">
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-bold mb-4">History</h2>
                    {
                        selectedForm.pages.map((page, index) => (
                            <div key={index} className="transition duration-300">
                                {page.title}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default LeftSideBar;