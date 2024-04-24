/**
 * @type: dialog
 * name: core.dialog.profileMenuMobile
 */
import { Dialog, DialogContent, DialogTitle } from '@metafox/dialog';
import {
  Link,
  useActionControl,
  useAppMenu,
  useGlobal
} from '@metafox/framework';
import { UserAvatar } from '@metafox/ui';
import { Divider as MenuDivider, styled, Box } from '@mui/material';
import React from 'react';
import { filterShowWhen } from '@metafox/utils';

const DialogWrapper = styled(DialogContent, { name: 'DialogWrapper' })(
  ({ theme }) => ({
    padding: '0 !important'
  })
);

const UserBlock = styled('div', { name: 'UserBlock' })(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: `solid 1px ${theme.palette.border?.secondary}`
}));

const Avatar = styled('div', { name: 'Avatar' })(({ theme }) => ({
  width: 48,
  marginRight: theme.spacing(1)
}));

const UserInner = styled('div', { name: 'UserInner' })(({ theme }) => ({
  flex: 1,
  minWidth: 0
}));

const UserName = styled('div', { name: 'UserName' })(({ theme }) => ({
  fontSize: theme.mixins.pxToRem(18),
  lineHeight: 1.5,
  color: theme.palette.text.primary,
  fontWeight: 'bold'
}));

const LinkInfo = styled(Link, { name: 'LinkInfo' })(({ theme }) => ({
  fontSize: theme.mixins.pxToRem(15),
  lineHeight: 1,
  color: theme.palette.text.secondary
}));

function ProfileMenuMobile() {
  const {
    useDialog,
    i18n,
    useSession,
    jsxBackend,
    getSetting,
    getAcl,
    useIsMobile
  } = useGlobal();
  const { dialogProps } = useDialog();
  const { user: authUser } = useSession();
  const accountMenu = useAppMenu('core', 'accountMenu');
  const [handleAction] = useActionControl(null, {});
  const title = i18n.formatMessage({ id: 'profile' });

  const setting = getSetting();
  const acl = getAcl();
  const session = useSession();
  const isMobile = useIsMobile();

  const accountMenuFilter = filterShowWhen(accountMenu.items, {
    setting,
    acl,
    session,
    isMobile
  });

  return (
    <Dialog
      {...dialogProps}
      fullWidth
      data-testid="popupProfileMenu"
      fullScreen
    >
      <DialogTitle data-testid="popupTitle" enableBack disableClose>
        {title}
      </DialogTitle>
      <DialogWrapper>
        <Box>
          <MenuDivider {...{ variant: 'fullWidth' }} />
          <UserBlock>
            <Avatar>
              <UserAvatar user={authUser} size={48} />
            </Avatar>
            <UserInner>
              <UserName>{authUser.full_name}</UserName>
              <LinkInfo to={authUser.link}>
                {i18n.formatMessage({ id: 'view_profile' })}
              </LinkInfo>
            </UserInner>
          </UserBlock>
          {accountMenuFilter.filter(Boolean).map((item, index) =>
            jsxBackend.render({
              component: `menuItem.as.${item.as || 'normal'}`,
              props: {
                key: index.toString(),
                item,
                variant: item?.variant || 'contained',
                handleAction
              }
            })
          )}
        </Box>
      </DialogWrapper>
    </Dialog>
  );
}

export default ProfileMenuMobile;
