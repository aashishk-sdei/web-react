import Skeleton from "../../../../components/Skeleton";
import './index.css';

const commentLoader =()=>{
    return <div className="head px-6 mb-6 rail-comments-loader mt-2">
    <div className="flex items-center">
        <div className="mr-3 rounded-full overflow-hidden w-8 h-8 flex items-center justify-center">
            <Skeleton variant="circular" width={32} height={32} />
        </div>
        <div className="flex-grow inside-span-block">
            <div className="mb-2"><Skeleton variant="rectangular" width={113} height={14} /></div>
            <div><Skeleton variant="rectangular" width="90%" height={14} /></div>
        </div>
    </div>
</div>
}
export default commentLoader;