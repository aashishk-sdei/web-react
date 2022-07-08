import React, { useState } from "react";
import Typography from "../../../../components/Typography";
import Button from "../../../../components/Button";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { Link } from "react-router-dom";
import { isUserOwner } from "../../../../services";
import { useSelector } from "react-redux";
const Commentdropdown = () => {
    const [showWidget, setShowWidget] = useState(false)
    const story = useSelector((state) => state.story)
   
    return <>
        <Button onClick={() => setShowWidget(prev => !prev)} icon="ellipsisHorizontal" size="large" title="" type="default" />
        {!isUserOwner(story?.view?.authorId) && (
            <>
            {showWidget ?
            <ClickAwayListener onClickAway={() => setShowWidget(false)}>
                <div className="story-dropdown">
                    <div className="dropdown-content">
                        <Link className="">
                            <Typography size={14} text="secondary">
                                Edit Comments
                            </Typography>
                        </Link>

                        <button >
                            <Typography size={14} text="danger">
                                Delete Comments
                            </Typography>
                        </button>
                    </div>
                </div>
            </ClickAwayListener>
            : null}
            </>
          )}
          {isUserOwner(story?.view?.authorId) && (
            <>
            {showWidget ?
            <ClickAwayListener onClickAway={() => setShowWidget(false)}>
                <div className="story-dropdown">
                    <div className="dropdown-content">
                        <Link  className="">
                            <Typography size={14} text="secondary">
                                Report Comments
                            </Typography>
                        </Link>
                    </div>
                </div>
            </ClickAwayListener>
            : null}
            </>
          )}
    </>
}
export default Commentdropdown