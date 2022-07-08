import React, { useState } from "react";
import Typography from "./../../../../components/Typography";
import Button from "./../../../../components/Button";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { getLinkStory } from "./../../../../utils"
import { useFeatureFlag } from "../../../../services/featureFlag";
import { isUserOwner } from "../../../../services";
const StoryDropdownWidget = props => {
    const [showWidget, setShowWidget] = useState(false)
    const { storyId, treeId, primaryPersonId, refType } = useParams()
    const { enabled: showReport } = useFeatureFlag("StoryReport");
    const handleEdit = () => {
        return `/stories/edit${getLinkStory({ refType: refType, storyId, treeId, primaryPersonId })}`
    }

    return <>
        <Button onClick={() => setShowWidget(prev => !prev)} icon="ellipsisHorizontal" size="large" title="" type="default" />
        {showWidget ?
            <ClickAwayListener onClickAway={() => setShowWidget(false)}>
                <div className="story-dropdown">
                    <div className="dropdown-content">
                        <Link to={handleEdit} className="">
                            <Typography size={14} text="secondary">
                                Edit story
                            </Typography>
                        </Link>

                        <button onClick={() => props.setShowDialog(true)} >
                            <Typography size={14} text="danger">
                                Delete story
                            </Typography>
                        </button>
                        {!isUserOwner(props.view?.authorId) && showReport &&
                        <button onClick={() => props.setShowReportModal(true)} >
                            <Typography size={14} text="secondary">
                                Report story
                            </Typography>
                        </button> }
                    </div>
                </div>
            </ClickAwayListener>
            : null}
    </>
}
export default StoryDropdownWidget