import { Button, IconButton, SxProps } from '@mui/material';
import { Theme } from '@mui/material/styles';
import React from 'react';

type Props = {
  size?: 'small' | 'medium' | 'large' | 'smaller' | 'smallest';
  action?: any;
  sx?: SxProps<Theme>;
  variant?: string;
  children: any;
  isIcon?: boolean;
  color?: string;
  disabled?: boolean;
  className?: string;
};

export default function ButtonAction({
  size,
  action,
  sx,
  variant,
  children,
  isIcon = false,
  color,
  disabled: forceDisabled,
  className
}: Props) {
  const [disabled, setDisabled] = React.useState(false);

  const onClick = () => {
    setDisabled(true);
    action(() => setDisabled(false));
  };

  if (isIcon)
    return (
      <IconButton
        disabled={disabled || forceDisabled}
        size={size}
        onClick={onClick}
        sx={sx}
        variant={variant}
        color={color}
        className={className}
      >
        {children}
      </IconButton>
    );

  return (
    <Button
      disabled={disabled || forceDisabled}
      size={size}
      onClick={onClick}
      sx={sx}
      variant={variant}
      color={color}
      className={className}
    >
      {children}
    </Button>
  );
}
