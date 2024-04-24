/**
 * @type: block
 * name: core.siteBarMobileBlock
 * title: SiteBar Mobile
 * keywords: sidebar
 * mobile: true
 */

import SideAppMenuBlock from '@metafox/core/blocks/SidebarAppMenu/Base';
import {
  BlockViewProps,
  createBlock,
  Link,
  useGlobal,
  useLocation,
  useScrollDirection,
  BROADCAST_CONNECTIONS_PUSHER_KEY
} from '@metafox/framework';
import { Block, BlockContent } from '@metafox/layout';
import { LineIcon, UserAvatar } from '@metafox/ui';
import { filterShowWhen } from '@metafox/utils';
import { Button, Popover, styled, useTheme, Badge, Box } from '@mui/material';
import { isEmpty } from 'lodash';
import React from 'react';
import AppBarSearch from '../../blocks/AppBarBlock/AppBarSearch';
import { getStatusSelector } from '@metafox/core/selectors/status';
import { useSelector } from 'react-redux';

const TabMenuData = [
  {
    to: '/',
    icon: 'ico-home-alt',
    appName: 'feed',
    scrollTop: true
  },
  {
    to: '/messages',
    icon: 'ico-comment-o',
    appName: 'chatplus',
    name: 'new_chat_message',
    showWhen: ['and', ['truthy', 'setting.chatplus.server']]
  },
  {
    to: '/messages',
    icon: 'ico-comment-o',
    appName: 'chat',
    name: 'new_chat_message',
    showWhen: [
      'and',
      ['falsy', 'setting.chatplus.server'],
      ['truthy', 'pusherService']
    ]
  },
  {
    to: '/notification',
    icon: 'ico-bell-o',
    appName: 'notification',
    name: 'new_notification'
  },
  {
    icon: 'ico-search-o',
    appName: '',
    style: 'search'
  }
];

const BlockHeader = styled('div', { name: 'BlockHeader' })(({ theme }) => ({
  minHeight: 60
}));

const MenuWrapper = styled('div', { name: 'MenuWrapper' })<{
  active?: boolean;
  scrollPosition?: number;
  minHeight?: number;
}>(({ theme, active, scrollPosition, minHeight }) => ({
  display: 'flex',
  height: minHeight,
  boxShadow: '0px 2px 1px 0 rgba(0, 0, 0, 0.05)',
  backgroundColor: theme.mixins.backgroundColor('paper'),
  zIndex: 1300,
  left: 0,
  right: 0,
  position: 'fixed',
  transitionDuration: '.5s',
  top: 0,
  ...(active &&
    scrollPosition > minHeight && {
      top: `-${minHeight}px`
    })
}));

const MenuButtonIcon = styled(LineIcon, { name: 'MenuButtonIcon' })(
  ({ theme }) => ({
    width: 24,
    height: 24,
    fontSize: theme.mixins.pxToRem(24)
  })
);

const MenuButton = styled(Link, { name: 'MenuButton' })<{
  activeMenu?: boolean;
}>(({ theme, activeMenu }) => ({
  flex: '1',
  minWidth: '64px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderBottom: 'solid 2px #fff',
  ...(activeMenu && {
    color: `${theme.palette.primary.main} !important`,
    borderBottomColor: theme.palette.primary.main
  })
}));

const Logo = styled(Link, { name: 'Logo' })(({ theme }) => ({
  height: 35,
  display: 'inline-block'
}));

const MenuGuestWrapper = styled('div', { name: 'MenuGuestWrapper' })(
  ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '60px',
    boxShadow: '0px 2px 1px 0 rgba(0, 0, 0, 0.05)',
    backgroundColor: theme.mixins.backgroundColor('paper'),
    padding: theme.spacing(0, 2),
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 2,
    '& $menuButton': {
      flex: 'none'
    }
  })
);

const ButtonSignIn = styled(Button, { name: 'ButtonSignIn' })(({ theme }) => ({
  fontSize: 15,
  height: 32,
  padding: theme.spacing(0, 3),
  textTransform: 'capitalize'
}));

const PopoverStyled = styled(Popover, { name: 'PopoverStyled' })(
  ({ theme }) => ({
    '& .MuiPopover-paper': {
      maxWidth: '100%',
      width: '100%',
      borderRadius: 0,
      top: '60px !important',
      bottom: 0,
      boxShadow: 'none !important',
      borderTop: `solid 1px ${theme.palette.border?.secondary}`,
      marginTop: '-1px'
    }
  })
);

const DropdownMenuWrapper = styled('div', { name: 'DropdownMenuWrapper' })(
  ({ theme }) => ({
    width: '100%',
    minHeight: 'calc(100vh - 60px)'
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

const UserAction = styled('div', { name: 'UserAction' })(({ theme }) => ({
  marginLeft: 'auto',
  '& > .ico': {
    width: 32,
    height: 32,
    fontSize: theme.mixins.pxToRem(24),
    color: theme.palette.text.secondary,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

const MenuApp = styled('div', { name: 'MenuApp' })(({ theme }) => ({
  borderTop: 'solid 8px',
  borderTopColor: theme.palette.border?.secondary,
  paddingTop: 16,
  '& ul': {
    marginLeft: theme.spacing(-1),
    paddingBottom: theme.spacing(4)
  },
  '& ul > li': {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: theme.spacing(1),
    paddingLeft: 0,
    '& > a': {
      display: 'flex',
      padding: theme.spacing(1),
      fontSize: '0.9375rem',
      alignItems: 'center',
      fontWeight: 'bold'
    }
  }
}));

const SearchMobile = styled('div', { name: 'SearchMobile' })(({ theme }) => ({
  display: 'block',
  zIndex: '1301',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  top: '0',
  width: '100%',
  height: '100%',
  '& > div': {
    width: '100%'
  },
  '& form': {
    width: 'calc(100% - 96px)'
  }
}));

const CancelButton = styled(Link, { name: 'CancelButton' })(({ theme }) => ({
  position: 'absolute',
  zIndex: theme.zIndex.appBar,
  right: '16px',
  top: '50%',
  transform: 'translateY(-50%)'
}));

function BaseBlock({ blockProps }: BlockViewProps) {
  const {
    i18n,
    useSession,
    navigate,
    assetUrl,
    usePageParams,
    dialogBackend,
    getSetting,
    jsxBackend
  } = useGlobal();
  const location = useLocation();
  const { user: authUser } = useSession();
  const [open, setOpen] = React.useState<Boolean>(false);
  const [openSearch, setOpenSearch] = React.useState<Boolean>(false);
  const anchorRef = React.useRef<HTMLDivElement>();
  const theme = useTheme();
  const setting: any = getSetting();
  const menuRef = React.useRef();
  const scrollDirection = useScrollDirection();
  const [scrollPosition, setPosition] = React.useState(0);
  const minHeight = 60;
  const status = useSelector(getStatusSelector);
  const FooterMenu = jsxBackend.get('core.ui.footerList');

  React.useEffect(() => {
    function updatePosition() {
      setPosition(window.pageYOffset);
    }
    window.addEventListener('scroll', updatePosition);
    updatePosition();

    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  React.useEffect(() => {
    window.document.body.style.overflow = '';

    if (open) {
      window.document.body.style.overflow = 'hidden';
    }
  }, [open]);

  const TabMenu = filterShowWhen(TabMenuData, {
    setting,
    pusherService: !!BROADCAST_CONNECTIONS_PUSHER_KEY
  });

  const logo =
    theme.palette.mode === 'dark'
      ? assetUrl('layout.image_logo_dark')
      : assetUrl('layout.image_logo');

  const { appName = 'feed' } = usePageParams();

  const handleClick = () => {
    setOpen(prev => !prev);
  };

  const handleClose = () => {
    setOpen(prev => !prev);
  };

  const toggleOpen = () => {
    setOpenSearch(prev => !prev);
  };

  React.useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const id = open ? 'dropdownMenuMobile' : undefined;

  const handleShowProfileMenu = () => {
    dialogBackend.present({
      component: 'core.dialog.profileMenuMobile',
      props: {}
    });
  };

  const signInButtonOnClick = () => {
    navigate({
      pathname: '/login'
    });
  };

  const handleMenuClick = menu => {
    if (menu.scrollTop) {
      window.scrollTo(0, 0);
    }
  };

  if (isEmpty(authUser)) {
    return (
      <Block>
        <BlockContent>
          <BlockHeader>
            <MenuGuestWrapper>
              <Logo to="/" title={i18n.formatMessage({ id: 'home' })}>
                <img src={logo} height="35" alt="home" />
              </Logo>
              <ButtonSignIn
                variant="contained"
                color="primary"
                size="small"
                onClick={signInButtonOnClick}
                disableElevation
                type="submit"
              >
                {i18n.formatMessage({ id: 'sign_in' })}
              </ButtonSignIn>
            </MenuGuestWrapper>
          </BlockHeader>
        </BlockContent>
      </Block>
    );
  }

  return (
    <Block>
      <BlockContent>
        <BlockHeader>
          <MenuWrapper
            ref={menuRef}
            active={scrollDirection === 'down' ? true : false}
            scrollPosition={scrollPosition}
            minHeight={minHeight}
          >
            {TabMenu.map((item, index) =>
              (item.style !== 'search' ? (
                <MenuButton
                  key={index}
                  role="button"
                  to={item.to}
                  activeMenu={appName === item.appName && !open}
                  underline="none"
                  onClick={() => handleMenuClick(item)}
                >
                  {status[item?.name] ? (
                    <Badge
                      color="error"
                      badgeContent={status[item?.name]}
                      max={99}
                    >
                      <MenuButtonIcon icon={item.icon} />
                    </Badge>
                  ) : (
                    <MenuButtonIcon icon={item.icon} />
                  )}
                </MenuButton>
              ) : (
                <>
                  <MenuButton
                    key={index}
                    role="button"
                    to={item.to}
                    activeMenu={appName === item.appName && !open}
                    underline="none"
                    onClick={toggleOpen}
                  >
                    <MenuButtonIcon icon={item.icon} />
                  </MenuButton>
                  {openSearch ? (
                    <SearchMobile>
                      <AppBarSearch
                        openSearch={openSearch}
                        menuRef={menuRef}
                        closeSearch={() => setOpenSearch(false)}
                      />
                      <CancelButton onClick={toggleOpen}>
                        {i18n.formatMessage({ id: 'cancel' })}
                      </CancelButton>
                    </SearchMobile>
                  ) : null}
                </>
              ))
            )}
            <MenuButton
              role="button"
              ref={anchorRef}
              activeMenu={open}
              onClick={handleClick}
              underline="none"
            >
              <MenuButtonIcon icon="ico-navbar" />
            </MenuButton>
          </MenuWrapper>
        </BlockHeader>
        <PopoverStyled
          id={id}
          open={Boolean(open)}
          anchorEl={anchorRef.current}
          onClose={handleClose}
          disableScrollLock
          anchorReference="anchorPosition"
          anchorPosition={{ top: 60, left: 0 }}
          style={{ maxWidth: '100%' }}
          marginThreshold={0}
          transitionDuration={0}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <DropdownMenuWrapper>
            <UserBlock>
              <Avatar>
                <UserAvatar user={authUser} size={48} />
              </Avatar>
              <UserInner>
                <UserName>{authUser.full_name}</UserName>
                <LinkInfo to={authUser.link}>
                  {authUser?.role?.name ||
                    i18n.formatMessage({ id: 'view_profile' })}
                </LinkInfo>
              </UserInner>
              <UserAction>
                <LineIcon
                  icon={'ico ico-angle-right'}
                  onClick={handleShowProfileMenu}
                />
              </UserAction>
            </UserBlock>
            <MenuApp>
              <SideAppMenuBlock
                appName="core"
                menuName="primaryMenu"
                displayViewMore={false}
              />
            </MenuApp>
            {FooterMenu && (
              <Box sx={{ px: 2, pb: 2, pt: 1 }}>
                <FooterMenu color="inherit" />
              </Box>
            )}
          </DropdownMenuWrapper>
        </PopoverStyled>
      </BlockContent>
    </Block>
  );
}

const SiteBarMobileBlock = createBlock<BlockViewProps>({
  name: 'SiteBarMobileBlock',
  extendBlock: BaseBlock
});

export default SiteBarMobileBlock;
