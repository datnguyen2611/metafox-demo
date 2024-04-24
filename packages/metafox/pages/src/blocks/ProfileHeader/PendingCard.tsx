/**
 * @type: itemView
 * name: page.itemView.pendingReviewPageCard
 * chunkName: page
 */
import { useGlobal } from '@metafox/framework';
import { ButtonAction, LineIcon } from '@metafox/ui';
import {
  Box,
  Card,
  IconButton,
  styled,
  Typography,
  Stack
} from '@mui/material';
import React from 'react';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  background:
    theme.palette.mode === 'light'
      ? theme.layoutSlot.background.paper
      : theme.palette.background.default,
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
  boxShadow: 'none'
}));

const StyledTypography = styled(Typography)(({ theme }) => ({}));

const PreviewPendingCard = ({ item }) => {
  const { i18n, dispatch } = useGlobal();

  if (!item?.is_pending) return null;

  const { extra } = item;

  const handleApprove = onSuccess => {
    dispatch({
      type: 'approveItem',
      payload: { identity: item._identity, onSuccess }
    });
  };

  const handleDecline = onSuccess => {
    dispatch({
      type: 'deleteItem',
      payload: { identity: item._identity, onSuccess }
    });
  };

  return (
    <StyledCard>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box>
          <IconButton size={'medium'}>
            <LineIcon icon="ico-clock-o" />
          </IconButton>
        </Box>
        <Box sx={{ paddingLeft: 2 }}>
          <Typography variant="h5" color="text.primary" paddingBottom={0.5}>
            {i18n.formatMessage({ id: 'this_page_is_pending_state' })}
          </Typography>
          <StyledTypography variant="body2">
            {i18n.formatMessage({
              id: 'contents_from_this_page_will_be_public_visible_after_admins_approve_it'
            })}
          </StyledTypography>
        </Box>
      </Box>
      <Stack spacing={1} alignItems="center" direction="row">
        {extra?.can_approve ? (
          <>
            <ButtonAction
              size="small"
              variant="contained"
              action={handleApprove}
            >
              {i18n.formatMessage({ id: 'approve' })}
            </ButtonAction>
            <ButtonAction
              size="small"
              variant="outlined"
              action={handleDecline}
            >
              {i18n.formatMessage({ id: 'decline' })}
            </ButtonAction>
          </>
        ) : null}
      </Stack>
    </StyledCard>
  );
};

export default PreviewPendingCard;
