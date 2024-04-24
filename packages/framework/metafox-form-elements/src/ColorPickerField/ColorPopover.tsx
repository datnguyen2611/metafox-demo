import { Box } from '@mui/material';
import { hexToRgb, rgbToHex } from '@mui/system/colorManipulator';
import React from 'react';
import { HexAlphaColorPicker } from 'react-colorful';

interface Props {
  color: string;
  onChange?: (value: string) => void;
  picker: string;
}

function ColorPopover({ color: value = '#000', onChange }: Props) {
  try {
    value = /#/i.test(value) ? value : rgbToHex(value);
  } catch (err) {
    // color error.
  }

  const defaultColor = '#ffffff';
  const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

  const [color, setColor] = React.useState<string>(value);

  const testColor = React.useCallback((color: string) => {
    setColor(color);
  }, []);

  React.useEffect(() => {
    try {
      // required to check color is valid
      hexToRgb(color);
      onChange(color);
    } catch (err) {
      //
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);

  const onBlur = () => {
    if (!hexColorRegex.test(color)) {
      setColor(defaultColor);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <HexAlphaColorPicker color={color} onChange={setColor} />
      <Box sx={{ pt: 1 }}>
        <input
          defaultValue={color}
          value={color}
          name="hex_alpha"
          placeholder="#aa00ccff"
          onChange={evt => testColor(evt.currentTarget.value)}
          onBlur={onBlur}
        />
      </Box>
    </Box>
  );
}

export default ColorPopover;
