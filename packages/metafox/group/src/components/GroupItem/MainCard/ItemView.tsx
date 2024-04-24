import { Link, useGlobal } from '@metafox/framework';
import { GroupItemProps } from '@metafox/group/types';
import {
  ButtonList,
  FeaturedFlag,
  ItemMedia,
  ItemText,
  ItemTitle,
  ItemView,
  LineIcon,
  SponsorFlag,
  Statistic,
  Image,
  PendingFlag,
  ButtonAction
} from '@metafox/ui';
import { filterShowWhen, withDisabledWhen, getImageSrc } from '@metafox/utils';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as React from 'react';

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontSize: theme.mixins.pxToRem(15),
  fontWeight: '600',
  marginLeft: theme.spacing(1)
}));

const FlagWrapper = styled('div', {
  name: 'GroupMainCardItem',
  slot: 'flagWrapper'
})(({ theme }) => ({
  marginBottom: theme.spacing(1)
}));

const ItemTextWrapper = styled(ItemText, {
  name: 'ItemTextWrapper'
})(({ theme }) => ({
  width: '100%'
}));

const ItemMediaWrapper = styled(ItemMedia, {
  name: 'ItemMediaWrapper'
})(({ theme }) => ({
  '& img': {
    border: 'none'
  }
}));

const RegName = styled(Box, { slot: 'IconButtonWrapper' })(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 13,
  paddingRight: theme.spacing(0.5)
}));

const Summary = styled(Box, { slot: 'Summary' })(({ theme }) => ({
  display: 'flex'
}));

const LinkStyled = styled(Link, { name: 'Link' })(({ theme }) => ({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: 'block'
}));

export default function GroupMainCardItem({
  item,
  itemActionMenu,
  identity,
  handleAction,
  user,
  itemProps,
  wrapProps,
  wrapAs
}: GroupItemProps) {
  const {
    ItemActionMenu,
    useSession,
    i18n,
    getAcl,
    getSetting,
    assetUrl,
    InViewTrackingSponsor,
    LinkTrackingSponsor
  } = useGlobal();
  const { loggedIn, user: authUser } = useSession();

  if (!item) return null;

  const { title, id, statistic, link = '', is_sponsor, extra } = item || {};
  const to = link || `/group/${id}`;

  const acl = getAcl();
  const setting = getSetting();
  const condition = {
    item,
    acl,
    setting,
    isAuth: authUser?.id === user?.id
  };

  const actionMenuItems = withDisabledWhen(
    filterShowWhen(itemActionMenu, condition),
    condition
  );

  const reactButton: any = actionMenuItems.splice(0, 1)[0];

  const cover = getImageSrc(
    item.cover,
    '500',
    assetUrl('group.cover_no_image')
  );

  const onAction = onSuccess => {
    handleAction(reactButton.value, { onSuccess });
  };

  const isTrackingViewSponsor =
    is_sponsor && itemProps?.isTrackingSponsor && InViewTrackingSponsor;
  const isTrackingClickSponsor =
    is_sponsor && itemProps?.isTrackingSponsor && LinkTrackingSponsor;

  return (
    <ItemView
      wrapAs={wrapAs}
      wrapProps={wrapProps}
      testid={`${item.resource_name}`}
      data-eid={identity}
      mediaPlacement="top"
    >
      {isTrackingViewSponsor ? (
        <InViewTrackingSponsor identity={identity} />
      ) : null}
      <ItemMediaWrapper>
        {isTrackingClickSponsor ? (
          <LinkTrackingSponsor to={to} identity={identity}>
            <Image src={cover} aspectRatio={'13'} />
          </LinkTrackingSponsor>
        ) : (
          <Image link={to} src={cover} aspectRatio={'13'} />
        )}
      </ItemMediaWrapper>
      <ItemTextWrapper>
        <ItemTitle>
          {item.is_featured || item.is_sponsor || item.is_pending ? (
            <FlagWrapper>
              <FeaturedFlag value={item.is_featured} variant="itemView" />
              <SponsorFlag
                value={item.is_sponsor}
                variant="itemView"
                item={item}
              />
              <PendingFlag variant="itemView" value={item.is_pending} />
            </FlagWrapper>
          ) : null}
          {isTrackingClickSponsor ? (
            <LinkTrackingSponsor
              to={to}
              color={'inherit'}
              hoverCard
              identity={identity}
            >
              {title}
            </LinkTrackingSponsor>
          ) : (
            <LinkStyled to={to} color={'inherit'} hoverCard>
              {title}
            </LinkStyled>
          )}
        </ItemTitle>
        <Summary>
          {extra?.can_view_privacy ? (
            <RegName>{item.reg_name} &middot; </RegName>
          ) : null}
          <Statistic
            values={statistic}
            display={'total_member'}
            skipZero={false}
            truthyValue
          />
        </Summary>
        <Box sx={{ mt: 2 }}>
          {loggedIn ? (
            <ButtonList>
              {reactButton && (
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <ButtonAction
                    isIcon
                    size="medium"
                    color="primary"
                    variant="outlined-square"
                    disabled={reactButton?.disabled}
                    action={onAction}
                    sx={{ width: '100%' }}
                    className={reactButton.name}
                  >
                    <LineIcon icon={reactButton?.icon} />
                    <TypographyStyled variant="body1">
                      {i18n.formatMessage({ id: reactButton.label })}
                    </TypographyStyled>
                  </ButtonAction>
                </Box>
              )}
              {item.extra && itemProps.showActionMenu ? (
                <ItemActionMenu
                  identity={identity}
                  items={actionMenuItems}
                  handleAction={handleAction}
                  size="medium"
                  variant="outlined-square"
                  color="primary"
                  icon="ico-dottedmore-o"
                  tooltipTitle={i18n.formatMessage({ id: 'more_options' })}
                  sx={{ ml: 1 }}
                />
              ) : null}
            </ButtonList>
          ) : null}
        </Box>
      </ItemTextWrapper>
    </ItemView>
  );
}
