import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { treePeopleList } from './../../redux/actions/sidebar';
import { getRecentTree, isUserOwner } from "../../services";
import { getStories, getTreesListAsync } from './../../redux/actions/homepage';
import { addFooterGray, addFooterWhite } from "../../redux/actions/layout"
import StoriesPage from "./../PersonViewPage/stories/StoriesPage";
import SearchBar from "./SearchBar";
const pageSize = 10
const getScrollTopStories = () => {
  return (window.scrollY !== undefined) ? window.scrollY : (document.documentElement || document.body.parentNode || document.body).scrollTop;
}
const getDocumentHeightStories = () => {
  const body = document.body;
  const html = document.documentElement;

  return Math.max(
    body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight
  );
};
const getTotalPagesStories = (categoryName, leftPanelDetails) => {
  const total = (categoryName) ? leftPanelDetails[categoryName] : leftPanelDetails['AllStories'];
  if (!total || total < pageSize) {
    return 1
  } else {
    return Math.max(Math.ceil(total / pageSize)-1, 1)
  }
}
const Stories = () => {
  const history = useHistory();
  const storiesPageRef = useRef()
  const pageNumber = useRef(1);
  const isPagintionLoading = useRef(false);
  const getQueryParams = new URLSearchParams(window.location.search);
  const categoryName = getQueryParams.get('categoryName');
  const { leftPanelDetails, isLoading } = useSelector((state) => state.story);
  const { userProfileAccount } = useSelector(state => state.user);
  const { stories: list, isLoading: isListEmpty, isPaginationLoading: isPagintionLoadingR } = useSelector(state => state.homepage)
  const dispatch = useDispatch();
  const [totalPages, setTotalPages] = useState(0);
  const [noTree, setNoTree] = useState(false)
  const { treeId, primaryPersonId } = useParams();
  const isOwner = isUserOwner(userProfileAccount?.id);
  const selectPeople = (val) => {
    if (!!val.id) {
      history.push(`/stories/${val.treeId}/${val.id}`);
    } else if (!val.name) {
      history.push(`/stories`);
    } 
  }
  const handleScroll = () => {
    if (totalPages < pageNumber.current) return;
    const calHeight = getDocumentHeightStories() - window.innerHeight
    if (storiesPageRef.current.scrollHeight > window.innerHeight && (getScrollTopStories() + (storiesPageRef.current.scrollHeight / 2)) < calHeight) return;
    if (!isPagintionLoading.current) {
      dispatch(getStories({...primaryPersonId?{treeId: treeId, personId: primaryPersonId}:{} , categoryName, pageNumber: (pageNumber.current + 1), pageSize }, false, isPagintionLoading));
      pageNumber.current = pageNumber.current + 1
    }
  }
  const {
    treePeople
  } = useSelector(state => {
    return state.sidebar
  });
  useEffect(() => {
    dispatch(addFooterWhite())
    return () => {
      dispatch(addFooterGray())
    }
  }, [dispatch])
  useEffect(() => {
      dispatch(getStories({...primaryPersonId?{treeId: treeId, personId: primaryPersonId}:{}, categoryName, pageNumber: 1, pageSize: pageSize*2 }));
      pageNumber.current = 2
  }, [dispatch, treeId, primaryPersonId, categoryName]);
  useEffect(() => {
    if (leftPanelDetails) {
      setTotalPages(getTotalPagesStories(categoryName, leftPanelDetails))
    }
  }, [dispatch, categoryName, leftPanelDetails]);
  useEffect(() => {
    const fun = async ()=>{
      const obj = getRecentTree()
      if( obj ) {
        const _treeId = obj.treeId
        dispatch(treePeopleList({ treeId: _treeId }));
      } else {
        const treesList = await getTreesListAsync(userProfileAccount.id)
        if(treesList.length) {
          dispatch(treePeopleList({ treeId: treesList[0].treeId }));
        } else {
          setNoTree(true)
        }
      }
    }
    fun()
  }, [dispatch])
  useEffect(() => {
    if (totalPages !== 0) {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      }
    }
  }, [dispatch, categoryName, pageNumber, isPagintionLoading, totalPages]);
  return (
    <>
      <div className="pt-18 md:pt-22.5 all-stories-page-wrap main-wrapper mx-auto w-full">
        <div className={`search-bar-top md:max-w-xl mx-auto mb-4 px-3 md:px-3 relative`}>
          <SearchBar primaryPersonId={primaryPersonId} treePeople={treePeople} selectPeople={selectPeople} />
        </div>
        <div className="all-stories-page" ref={storiesPageRef}>
          <StoriesPage storiesTab = {true} noTree = {noTree} personView={true} grid={4}    midleClass="stories-middle-content view-all-stories-page" columnsCountBreakPoints={{ 510: 1, 511: 3, 1280: 4 }} rightPanel={false} stories={list} isStoryEmpty={isListEmpty} isLoading={isLoading} paginationLoader={isPagintionLoadingR} isOwner={isOwner}/>
        </div> 
      </div>
    </>
  );
};
export default Stories;
