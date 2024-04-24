import { EventDetailViewProps } from '@metafox/event';
import { INTERESTED, NOT_INTERESTED, ON_GOING } from '@metafox/event/constants';
import { mappingRSVP } from '@metafox/event/utils';
import { getItemSelector, GlobalState, useGlobal } from '@metafox/framework';
import { ButtonStyled, Container, LineIcon, UserAvatar } from '@metafox/ui';
import {
  Box,
  Button,
  Card,
  CardActions,
  styled,
  Typography
} from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
  boxShadow: 'none',
  backgroundColor: theme.palette.background.paper,
  backgroundImage: 'none',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column'
  }
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary
}));

const InviteCard = ({ item, actions }: EventDetailViewProps) => {
  const { i18n, useLoggedIn } = useGlobal();

  const invite = useSelector<GlobalState>(state =>
    getItemSelector(state, item?.pending_invite)
  ) as any;

  const user = useSelector<GlobalState>(state =>
    getItemSelector(state, invite?.user)
  ) as any;

  if (!useLoggedIn()) {
    return null;
  }

  if (!user || !invite) return null;

  const going = mappingRSVP(ON_GOING);
  const interested = mappingRSVP(INTERESTED);
  const not_interested = mappingRSVP(NOT_INTERESTED);

  return (
    <Container maxWidth={'md'} gutter>
      <StyledCard>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <UserAvatar size={48} user={user} />
          <Box sx={{ paddingLeft: 2 }}>
            <StyledTypography variant="h5" sx={{ marginBottom: 0.5 }}>
              {i18n.formatMessage(
                { id: 'person_who_invite_me_to_this_event' },
                { value: user?.full_name }
              )}
            </StyledTypography>
            {invite?.expired_description ? (
              <Typography component="span" variant="body2" color="text.hint">
                {invite?.expired_description}
              </Typography>
            ) : null}
          </Box>
        </Box>
        <CardActions sx={{ paddingX: 0 }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<LineIcon icon={going.icon} />}
            component="h5"
            onClick={actions.joinEvent}
          >
            {i18n.formatMessage({ id: going.label })}
          </Button>
          <ButtonStyled
            size="small"
            variant="outlined"
            component="h5"
            startIcon={<LineIcon icon={interested.icon} />}
            onClick={actions.interestedEvent}
          >
            {i18n.formatMessage({ id: interested.label })}
          </ButtonStyled>
          <ButtonStyled
            size="small"
            variant="outlined"
            component="h5"
            onClick={actions.notInterestedEvent}
            startIcon={<LineIcon icon={not_interested.icon} />}
          >
            {i18n.formatMessage({ id: not_interested.label })}
          </ButtonStyled>
        </CardActions>
      </StyledCard>
    </Container>
  );
};

export default InviteCard;
