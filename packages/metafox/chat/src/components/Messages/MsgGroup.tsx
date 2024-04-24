import { ChatMsgPassProps, MsgGroupShape } from '@metafox/chat/types';
import React from 'react';
import MsgSet from './MsgSet';

interface MsgGroupProps extends ChatMsgPassProps {
  msgGroup: MsgGroupShape;
  showToolbar?: boolean;
}

export default function MsgGroup({
  msgGroup,
  disableReact,
  handleAction,
  showToolbar
}: MsgGroupProps) {
  if (!msgGroup) return null;

  const { items } = msgGroup;

  return items ? (
    <div>
      {items.map((msgSet, i) => (
        <MsgSet
          msgSet={msgSet}
          key={`k.0${i}`}
          disableReact={disableReact}
          showToolbar={showToolbar}
          handleAction={handleAction}
        />
      ))}
    </div>
  ) : null;
}
