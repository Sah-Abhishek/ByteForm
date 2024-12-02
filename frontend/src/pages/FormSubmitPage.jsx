import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const FormSubmitPage = () => {
    const { formId } = useParams();

    // Remove any unwanted data fetching logic that might be causing backend calls
    useEffect(() => {
        console.log(formId);  // Just log the formId or use it for frontend display
        // Remove backend call if it's not necessary
    }, [formId]);

    return <div>{formId}</div>;
}

export default FormSubmitPage;
