import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import {
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand
} from 'lexical';
import { useEffect } from 'react';
import { $createIframeNode, IframeNode } from '../../nodes/IframeNode';

export const INSERT_IFRAME_COMMAND: LexicalCommand<string> = createCommand(
  'INSERT_IFRAME_COMMAND'
);

export default function IframePlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([IframeNode])) {
      throw new Error('IframePlugin: iframeNode not registered on editor');
    }

    return editor.registerCommand<string>(
      INSERT_IFRAME_COMMAND,
      payload => {
        const iframeNode = $createIframeNode(payload);
        $insertNodeToNearestRoot(iframeNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
