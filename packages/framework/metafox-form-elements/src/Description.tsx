import { useGlobal } from '@metafox/framework';
import { FormHelperText, SxProps, Box } from '@mui/material';
import { isString } from 'lodash';
import React from 'react';
import HtmlViewer from '@metafox/html-viewer';

type Props = {
  text: string;
  sx?: SxProps;
  error?: boolean;
};
export default function Description({ text, sx, error = false }: Props) {
  const { i18n } = useGlobal();

  if (!text) return null;

  if (isString(text) && text.startsWith('<html>')) {
    return (
      <FormHelperText sx={sx} error={error}>
        {i18n.formatMessage({ id: '[placeholder]', defaultMessage: text })}
      </FormHelperText>
    );
  }

  return (
    <FormHelperText sx={sx} error={error}>
      <Box sx={{ whiteSpace: 'normal', wordBreak: 'break-word', mb: 0.5 }}>
        <HtmlViewer html={text} />
      </Box>
    </FormHelperText>
  );
}
