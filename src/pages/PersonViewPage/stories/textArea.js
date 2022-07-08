import React, { useState, useRef } from "react";
import { Editor, EditorState, ContentState, convertToRaw } from "draft-js";
function TextArea(props) {
  const [editorState, setEditorState] = useState(EditorState.createWithContent(ContentState.createFromText(props.value)));
  const editor = useRef(null);
  function focusEditor() {
    editor.current.focus();
  }

  function moveFocusToEnd(editorContent) {
    const afterSelectionMove = EditorState.moveSelectionToEnd(editorContent)
    return EditorState.forceSelection(
      afterSelectionMove,
      afterSelectionMove.getSelection()
    )
  }

  const onChnage = (editorContent) => {
    const blocks = convertToRaw(editorContent.getCurrentContent()).blocks;
    let value = blocks.map((block) => block.text).join("\n");
    if (value?.length > 3500) {
      value = value.substring(0, 3500);
      setEditorState(moveFocusToEnd(EditorState.createWithContent(ContentState.createFromText(value))));
    } else {
      setEditorState(editorContent);
    }
    props.formik.setFieldValue(props.name, value !== "\n" ? value : "");
  };

  return (
    <div onClick={focusEditor}>
      <Editor ref={editor} editorState={editorState} onChange={onChnage} placeholder={props.placeholder} />
    </div>
  );
}
TextArea.defaultProps = {
  placeholder: "Enter your story or paste it here. (CTRL+V or CMD+V).",
};
export default TextArea;