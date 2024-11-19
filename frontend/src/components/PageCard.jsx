const PageCard = ({ title }) => {
    if(title.length > 20){
        title = title.slice(0, 17) + "...";
    }
    return (
        <div className="border border-black rounded-xl px-4 py-2 mt-4">
            {title}
        </div>
    )
}

export default PageCard;