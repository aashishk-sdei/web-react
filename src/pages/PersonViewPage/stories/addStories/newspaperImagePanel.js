const NewspaperImagePanel = ({localImage}) => {
    return <div className="main-stroy-img fit">
        <div className="clipping-actions md:h-full w-full flex items-center justify-center overflow-y-hidden">
            <img src={localImage} className="h-full w-full" />
        </div>
    </div>
}
export default NewspaperImagePanel