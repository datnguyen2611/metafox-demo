import { styled } from '@mui/material';
import React from 'react';

const WrapperHeader = styled('div', {
  shouldForwardProp: props => props !== 'searching' && props !== 'addNewMembers'
})<{ searching?: boolean; addNewMembers?: boolean }>(
  ({ theme, searching, addNewMembers }) => ({
    display: 'flex',
    alignItems: 'center',
    minHeight: theme.spacing(7),
    padding: theme.spacing(1.5, 1.25, 1.5, 2),
    borderBottom: theme.mixins.border('secondary'),
    ...((searching || addNewMembers) && {
      borderBottom: 'none'
    })
  })
);

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  searching?: boolean;
  addNewMembers?: boolean;
}

export default function ChatDockHeader({
  children,
  onClick,
  searching,
  addNewMembers
}: Props) {
  const handleClick = React.useCallback(
    evt => {
      evt.preventDefault();

      if (onClick) onClick();
    },
    [onClick]
  );

  return (
    <WrapperHeader
      onClick={handleClick}
      searching={searching}
      addNewMembers={addNewMembers}
    >
      {children}
    </WrapperHeader>
  );
}
