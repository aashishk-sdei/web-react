import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Slide from '@material-ui/core/Slide';
import { removeMessage } from "../../redux/actions/toastr"
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from "react-i18next";
import { tr } from "../../components/utils";

export const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export const  SlideTransition = (props) => {
    return <Slide {...props} direction="up" />;
}
function getActionText(type){
  let text = "Undo"
  if(type === 'error') {
    text = "Try Again"
  }
  return text
}
function getActionClass(type) {
  let _class = 'text-green-1'
  if(type === 'error') {
    _class = 'text-maroon-1'
  } else if(type === 'info') {
    _class = 'text-skyblue-1'
  }
  return _class
}
const useStyles = makeStyles(() => ({
    mainRoot: {
      "&:nth-child(2)":{
        bottom:"80px"
      },
      "&:nth-child(3)":{
        bottom:"136px"
      }
    },
    root: {
      width: '100%',
      background: 'none',
      boxShadow: 'none',
      padding: 0,
      margin: 0
    },
    filledInfo: {
      background:"#212122"
    },
    filledSuccess: {
      background:"#388367"
    },
    filledError: {
      background:"#B02A4C"
    }
  }));
const SnackbarComponent = ({timing}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const transition = SlideTransition
  const dispatch = useDispatch()
  const { message: messageList } = useSelector((state) => {
    return state.toastr;
  });
  const handleClose = (message, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(removeMessage(message.key));
  };

  const handleExited = (message) => {
    dispatch(removeMessage(message.key));
  };
  const getAction = (message) => {
    const classesAction =  getActionClass(message.type)
    return <span  className={`${classesAction} ml-6 cursor-pointer hover:underline`} onClick={()=>{
      message.cta.action();
      handleExited(message);
    }}>{message.cta.text?message.cta.text:getActionText(message.type)}</span>
  }
  const getType = (message) => {
    let type = message.type
    if(message.type === 'warning') {
      type = 'error'
    } else if(message.type === 'error') {
      type = 'warning'
    }
    return type
  }
  return (
    <div className='multi-snkbr-toaster'>
    
    {messageList.map((message)=><Snackbar 
        key = {message.key}
        classes = {{
          root: classes.mainRoot
        }}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        autoHideDuration={timing}
        open={message!==null}
        onClose={(_event, reason)=>handleClose(message, reason)}
        onExited={()=>handleExited(message)}
        TransitionComponent={transition}>
        <SnackbarContent
            classes = {{
                root: classes.root
            }}
            message={message && <Alert 
                classes = {{
                  filledInfo:classes.filledInfo,
                  filledSuccess:classes.filledSuccess,
                  filledWarning:classes.filledError
                }}
                sx={{ width: '100%' }}
                {...![undefined, true].includes(message.icon)?{icon:message.icon}:{}}
                {...message.canClose?{onClose: handleClose.bind(null, message)}: {}}
                severity={getType(message)}>
                {message.url ? 
                  <span>
                    {tr(t, message.content)}
                    <a href={message.url} className='ml-4'>View</a>
                  </span> 
                  : <span>{tr(t, message.content)}</span>}
                {message.cta && getAction(message)}
            </Alert>}
        />
    </Snackbar>)}
    </div>);
}
SnackbarComponent.propTypes = {
    timing: PropTypes.number
}
SnackbarComponent.defaultProps = {
    timing: 6000
}
export default SnackbarComponent