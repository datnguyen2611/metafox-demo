import { BlockViewProps, useGlobal } from '@metafox/framework';
import { AppBar, Toolbar, Box } from '@mui/material';
import { styled, useThemeProps } from '@mui/material/styles';
import React from 'react';
import AppBarLoginForm from '../AppBarBlock/AppBarLoginForm';
import AppBarRegisterPage from '../AppBarBlock/AppBarRegisterPage';
import AppBarSearch from '../AppBarBlock/AppBarSearch';
import AppBarSubMenu from '../AppBarBlock/AppBarSubMenu';
import Provider from '../AppBarBlock/Context/Provider';

export type Props = BlockViewProps;

const PrimaryAppBar = styled(Box, {
  name: 'MfMiniAppBarBlock',
  slot: 'Root',
  overridesResolver: (props, styles) => [styles.root]
})({
  height: 58,
  minHeight: 58,
  minWidth: 1,
  position: 'relative',
  margin: 0,
  padding: 0,
  flexGrow: 1,
  flexBasis: '100%',
  width: '100%'
});

export default function AppBarMini(props) {
  const { searchPlacement } = useThemeProps({ props, name: 'MfAppBarMini' });

  const { useLoggedIn, usePageParams, getSetting } = useGlobal();

  const loggedIn = useLoggedIn();
  const { shouldShowMenuHeaderLogin } = usePageParams();
  const appbarRight = React.useMemo(() => {
    return shouldShowMenuHeaderLogin ? (
      <AppBarRegisterPage />
    ) : (
      <AppBarLoginForm />
    );
  }, [shouldShowMenuHeaderLogin]);
  const offline = getSetting('core.offline');

  if (offline) {
    return (
      <Provider>
        <PrimaryAppBar data-testid="appbar">
          <AppBar>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
              }}
            ></Box>
          </AppBar>
        </PrimaryAppBar>
      </Provider>
    );
  }

  return (
    <Provider>
      <PrimaryAppBar data-testid="appbar">
        <AppBar>
          <Toolbar>
            {loggedIn ? (
              <>
                <AppBarSearch placement={searchPlacement} />
                <Box flex={1} />
                <AppBarSubMenu />
              </>
            ) : (
              appbarRight
            )}
          </Toolbar>
        </AppBar>
      </PrimaryAppBar>
    </Provider>
  );
}
