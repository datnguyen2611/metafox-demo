/**
 * @type: dialog
 * name: feed.status.viewEditHistoryDialog
 */

import { Dialog, DialogContent, DialogTitle } from '@metafox/dialog';
import { useGlobal } from '@metafox/framework';
import { Box, styled, CircularProgress } from '@mui/material';
import React from 'react';

const name = 'HistoryDialog';
const DialogContentStyled = styled(DialogContent, {
  name,
  slot: 'DialogContentStyled'
})(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(0, 2),
  paddingBottom: 0,
  [theme.breakpoints.down('sm')]: {
    borderRadius: 0
  }
}));

const ViewEditHistory = ({ dataSource, pageParams }) => {
  const { useDialog, i18n, useFetchItems, jsxBackend } = useGlobal();
  const FeedHistoryItem = jsxBackend.get('FeedHistoryItem');
  const { dialogProps } = useDialog();
  const [data, loading] = useFetchItems({
    dataSource,
    pageParams,
    data: []
  });

  return (
    <Dialog
      {...dialogProps}
      data-testid="dialogStatusComposer"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{i18n.formatMessage({ id: 'edit_history' })}</DialogTitle>
      <DialogContentStyled>
        {loading ? (
          <Box
            p={2}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CircularProgress size={16} />
          </Box>
        ) : null}
        {data && data.length ? (
          <Box mt={2}>
            {data.map(item => (
              <Box mb={3} key={`k${item.id}`}>
                <FeedHistoryItem item={item} />
              </Box>
            ))}
          </Box>
        ) : null}
      </DialogContentStyled>
    </Dialog>
  );
};

export default ViewEditHistory;
