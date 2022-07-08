import React,{useState,useEffect} from 'react';
import {
    useHistory, 
    useParams
} from 'react-router-dom'
import SidebarComponent from './../Sidebar'
import {getViewRecords, getTrees } from './../../redux/actions/sidebar'
import { showFooter } from "../../redux/actions/layout"
import {useDispatch,useSelector} from 'react-redux'
import { v4 as uuidv4 } from "uuid";
import { isObjEmpty } from '../utils';

const Records=(_props)=>{
    const [showSideBar, setShowSideBar] = useState(true);
    const dispatch=useDispatch();
    const {recordId,partitionKey}=useParams();
    const history=useHistory();
    const showSideBarAction=()=>{
        setShowSideBar(prev=>!prev)
    }
    const newPartKey=partitionKey.split('@')[0];
    const [srcUrl,setSrcURL]=useState(null)
    const {
        userAccount
    } = useSelector(state=>{
        return state.user
    });
    const {
        isLoading,
        ssid:ssdiData,
        
    } = useSelector(state=>{
        return state.sidebar
    });
    useEffect(() => {
        dispatch(showFooter(false))
        return () => {
          dispatch(showFooter())
        }
      }, [dispatch])
    useEffect(()=>{
        if (userAccount) {
            dispatch(getTrees(userAccount.id));
        }
    }, [dispatch, userAccount])
    useEffect(() => {
        if(recordId && newPartKey){
            dispatch(getViewRecords({recordId,partitionKey}))
        }else{
            history.push('/')
        }
        
    }, [dispatch,history,partitionKey,recordId])
    useEffect(() => {
        if(ssdiData.imageId){
            setSrcURL(`https://imgwrapper.storied.com/storied/${newPartKey}/${ssdiData.imageId}`)
        }else if(!isObjEmpty(ssdiData)){
            setSrcURL(`https://imgwrapper.storied.com/storied/${newPartKey}/${uuidv4()}`)
        }
    }, [ssdiData,partitionKey]);
    return <>
     <div className={`w-full transform transition scale-auto`}>
    <SidebarComponent 
        isLoading={isLoading}
        profile={ssdiData}
        showSideBar={showSideBar} 
        showSideBarAction={showSideBarAction} 
        comparedTo={true}
        type={'records'}
    />
    <div className={`h-full transition-all duration-500 ${showSideBar?"mr-96":""}`}>
        <div className="pt-12 md:pt-16 w-full h-full">
    {srcUrl?<iframe src={srcUrl} height={"100%"} width={"100%"} title="Iframe Image"></iframe>:null}
    </div>
    </div>
</div>
    </>
}

export default Records;