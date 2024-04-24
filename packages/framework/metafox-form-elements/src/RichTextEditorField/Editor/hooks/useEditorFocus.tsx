import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { BLUR_COMMAND, FOCUS_COMMAND, COMMAND_PRIORITY_LOW } from 'lexical';
import React from 'react';

const useEditorFocus = () => {
  const [editor] = useLexicalComposerContext();
  // Possibly use useRef for synchronous updates but no re-rendering effect
  const [hasFocus, setFocus] = React.useState(false);

  React.useEffect(
    () =>
      editor.registerCommand(
        BLUR_COMMAND,
        () => {
          setFocus(false);

          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
    []
  );

  React.useEffect(
    () =>
      editor.registerCommand(
        FOCUS_COMMAND,
        () => {
          setFocus(true);

          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
    []
  );

  return hasFocus;
};
export default useEditorFocus;
