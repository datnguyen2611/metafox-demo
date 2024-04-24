import { AtomicBlockUtils, EditorState, SelectionState } from 'draft-js';
import { uniqueId } from 'lodash';
import React from 'react';
import PickerModal from './PickerModal';

const icon =
  // eslint-disable-next-line max-len
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTciIGhlaWdodD0iMTciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTYuNzA4IDYuNjE1YS40MzYuNDM2IDAgMCAwLS41NDMuMjkxbC0xLjgzIDYuMDQ1YS40MzYuNDM2IDAgMCAwIC44MzMuMjUyTDcgNy4xNmEuNDM2LjQzNiAwIDAgMC0uMjktLjU0NHpNOC45MzEgNi42MTVhLjQzNi40MzYgMCAwIDAtLjU0My4yOTFsLTEuODMgNi4wNDVhLjQzNi40MzYgMCAwIDAgLjgzNC4yNTJsMS44My02LjA0NGEuNDM2LjQzNiAwIDAgMC0uMjktLjU0NHoiLz48cGF0aCBkPSJNMTYuNTY0IDBILjQzNkEuNDM2LjQzNiAwIDAgMCAwIC40MzZ2MTYuMTI4YzAgLjI0LjE5NS40MzYuNDM2LjQzNmgxNi4xMjhjLjI0IDAgLjQzNi0uMTk1LjQzNi0uNDM2Vi40MzZBLjQzNi40MzYgMCAwIDAgMTYuNTY0IDB6TTMuNDg3Ljg3MmgxMC4wMjZ2MS43NDNIMy40ODdWLjg3MnptLTIuNjE1IDBoMS43NDN2MS43NDNILjg3MlYuODcyem0xNS4yNTYgMTUuMjU2SC44NzJWMy40ODhoMTUuMjU2djEyLjY0em0wLTEzLjUxM2gtMS43NDNWLjg3MmgxLjc0M3YxLjc0M3oiLz48Y2lyY2xlIGN4PSI5My44NjciIGN5PSIyNDUuMDY0IiByPSIxMy4xMjgiIHRyYW5zZm9ybT0ibWF0cml4KC4wMzMyIDAgMCAuMDMzMiAwIDApIi8+PGNpcmNsZSBjeD0iOTMuODY3IiBjeT0iMzYwLjU5MiIgcj0iMTMuMTI4IiB0cmFuc2Zvcm09Im1hdHJpeCguMDMzMiAwIDAgLjAzMzIgMCAwKSIvPjxwYXRoIGQ9Ik0xNC4yNTQgMTIuNjQxSDEwLjJhLjQzNi40MzYgMCAwIDAgMCAuODcyaDQuMDU0YS40MzYuNDM2IDAgMCAwIDAtLjg3MnoiLz48L3N2Zz4=';

interface Props {
  onChange?: (data: EditorState) => void;
  editorState?: EditorState;
}

interface ImageShape {
  src: string;
  width?: unknown;
  height?: unknown;
  align?: unknown;
}

export function ImageModal() {
  const stopEvent = evt => {
    evt.preventDefault();
    evt.stopPropagation();
  };

  return <div className="rdw-image-modal" onClick={stopEvent}></div>;
}

function ImagePicker(props: Props) {
  const [expanded, setExpaned] = React.useState<string>();
  const { editorState, onChange } = props;
  const [data, setData] = React.useState<ImageShape>();
  const [sel, setSel] = React.useState<SelectionState>();

  const handleExited = React.useCallback(() => {
    if (!data?.src) {
      return;
    }

    const state = EditorState.forceSelection(editorState, sel);

    const entityKey = state
      .getCurrentContent()
      .createEntity('EMBEDDED_LINK', 'IMMUTABLE', data)
      .getLastCreatedEntityKey();

    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      state,
      entityKey,
      ' '
    );
    onChange(newEditorState);
    setExpaned(undefined);
  }, [data, editorState, onChange, sel]);

  const handleOpen = () => {
    setSel(editorState.getSelection());
    setExpaned(uniqueId('embed code'));
  };

  return (
    <div
      aria-haspopup="true"
      aria-expanded={expanded}
      aria-label="rdw-embedded-control"
      className="rdw-embedded-wrapper"
    >
      <div onClick={handleOpen} className="rdw-option-wrapper" title="Embedded">
        <img src={icon} alt="alt" />
      </div>
      {expanded ? (
        <PickerModal
          key={expanded}
          onExited={handleExited}
          onChange={setData}
        />
      ) : null}
    </div>
  );
}
export default ImagePicker;
