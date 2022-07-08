//Components
import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { getQueryParam, tr } from "../../components/utils";
import { useHistory  } from "react-router-dom";
import { removeRecentTree } from "../../services";
import { useTranslation } from "react-i18next";
import { addRecentViewTree, getTreesListAsync, updateTreeName } from "../../redux/actions/homepage";
import { Typography } from "@material-ui/core";
import { trimString } from "shared-logics";

const Trees = () => {
  const dispatch = useDispatch()
  
  const [edit, setEdit] = useState(null);
  
  const [treeName, setTreeName] = useState({oldTreeName:"", newTreeName:"", treeId:""});

  const handleCancel = () => {
    setEdit(null);
    setTreeName({
      ...treeName,
      newTreeName: treeName.oldTreeName,
    });
  }

  const history = useHistory();
  const handleAddNewTree = () => {
    removeRecentTree();
    history.push("/family");
  };

  const { t } = useTranslation();
  const [treesData, setTreesData] = useState([]);
  const { userProfileAccount } = useSelector((state) => state.user);
  const {treesUpdated, trees} = useSelector((state) => state.homepage)

  useEffect(() => {
    if(treesUpdated) setTreesData(trees)
}, [treesUpdated, trees])

  useEffect(() => {
    async function getTreeList() {
    if (userProfileAccount) {
      let treelist = await getTreesListAsync(userProfileAccount.id);
      if (treelist && treelist.length > 0) 
        setTreesData(treelist);
    }
  }
  getTreeList();
  },[userProfileAccount]);

  const saveTreeName = () => {
    setEdit(null);
    dispatch(updateTreeName(treesData, treeName.treeId, treeName.newTreeName))
  }

  const handleChange = (e) => {
    const { value } = e.target;
     setTreeName({
       ...treeName,
       newTreeName:value
     })
     
  };

   const checkDisable = (treeNameVal) => {
     return (treeNameVal && trimString(treeNameVal) !== trimString(treeName.oldTreeName)) ? false : true
   }
  const handleViewTree = async (treeId, personId) => {
    addRecentViewTree(treeId);
    removeRecentTree();
    if (getQueryParam()) return history.push(`/family/pedigree-view/${treeId}/${personId}/4?${getQueryParam()}`);
    return history.push(`/family/pedigree-view/${treeId}/${personId}/4`);
  };
  const getTreeValue = (tree) => {
    if (tree.personCount) {
      return tree.personCount === 1 ? `1 ${tr(t, "home.profile.person")}` : `${tree.personCount} ${tr(t, "home.profile.People")}`;
    } else {
      return tr(t, "home.profile.noTrees");
    }
  };

  const editTreeName = (treeNameVal, treeIndex) =>{
    setEdit(treeIndex)
    setTreeName({
      ...treeName,
      oldTreeName:treeNameVal.treeName,
      newTreeName:treeNameVal.treeName,
      treeId: treeNameVal.treeId
    })
  }

  return (
    <div>
      <div className="setting-col-8 flex justify-between">
        <div className="pt-2 md:pt-0">
          <h2 className="setting-heading">{tr(t, "settings.trees")}</h2>
        </div>
        <div>
          <div className="hidden md:block">
            <Button handleClick={handleAddNewTree} tkey="settings.btnStart" fontWeight="medium" />
          </div>
          <div className="md:hidden btn-plus">
            <Button handleClick={handleAddNewTree} title="" icon="plus" fontWeight="medium" />
          </div>
        </div>
      </div>
      <div className="setting-content">
          <div>
            { treesData.length > 0 &&
              treesData.map((tree, tIndex) => (
                <div className="setting-col-8">
                  {(edit === tIndex) &&(
                  <div className="hidden-0">
                    <div className="prop-view prop-edit-mode">
                      <div className="prop-primary">
                        <label className="prop-label">{tr(t,"settings.editTree")}</label>
                        <div className="prop-link">
                          <Button handleClick={() => handleCancel()} type="link-white" fontWeight="medium" tkey="settings.cancel" />
                        </div>
                      </div>
                      <div className="prop-readonly">
                        <div className="prop-row ">
                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="w-full">
                              <Input id="treeName" 
                                     label="Tree Name" 
                                     type="text" 
                                     handleChange={handleChange}
                                     name="treeName" 
                                     value= {treeName.newTreeName}
                                     autoFocus="autoFocus" 
                                     position = {treeName.newTreeName.length} 
                                     placeholder={""} />
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <Button disabled={true} icon="trash" size="large" tkey = "settings.deleteTree" fontWeight="medium" type="link-danger" />
                            <Button  
                            handleClick={saveTreeName}
                            disabled= {checkDisable(treeName.newTreeName)}
                            size="large"
                            tkey="settings.save" 
                            fontWeight="medium"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> 
                  )}
                  {(tIndex !== edit) && (
                  <div className="prop-view">
                    <div className="prop-primary">
                      <div key={tIndex}  className="prop-readonly">
                        <div onClick={() => handleViewTree(tree.treeId, tree.homePersonId)} className="prop-readonly">
                          <Typography className="line-clamp-2 link-gray ">{tree.treeName}</Typography>
                        </div>
                        <label className="prop-label prop-label-regular ">{getTreeValue(tree)}</label>  
                      </div>
                      
                      <div className="prop-link">
                          <Button handleClick={() => editTreeName(tree, tIndex)} type="link-white" tkey="settings.edit" fontWeight="medium" />
                        </div>
                    </div>
                  </div>
                  )}
                </div>
              ))
            }            
          </div>
        
      </div>
    </div>
  );
};

export default Trees;
