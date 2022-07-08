import Skeleton from "@material-ui/lab/Skeleton"
import "./index.css"

const TopicLoader = () => {

    return (
        <>
            <div className="bg-white w-full rounded-lg shadow-xl lg:flex mb-10 topic-flow">
                <div className="w-full lg:w-64">
                    <Skeleton variant="rectangular" height={200} />
                </div>

                <div className="p-6 w-full">
                    <h2 className="mb-2 text-2xl font-bold text-gray-7">
                        <Skeleton variant="rectangular" width={323} height={21} />
                    </h2>
                    <p className="text-gray-6">
                        <Skeleton variant="rectangular" width={150} height={21} />
                    </p>
                </div>
                <div className="p-6">
                    <h2 className="mb-2 text-2xl font-bold text-gray-7">
                        <Skeleton variant="rectangular" width={150} height={21} />
                    </h2>
                </div>
            </div>
        </>
    )
}

export default TopicLoader