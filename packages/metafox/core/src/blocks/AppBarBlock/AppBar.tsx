import { BlockViewProps, useGlobal } from '@metafox/framework';
import { AppBar, Toolbar, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import AppBarBranch from './AppBarBranch';
import AppBarLoginForm from './AppBarLoginForm';
import AppBarRegisterPage from './AppBarRegisterPage';
import AppBarSearch from './AppBarSearch';
import AppBarSubMenu from './AppBarSubMenu';
import Provider from './Context/Provider';

export type Props = BlockViewProps;

const PrimaryAppBar = styled(Box, {
  name: 'PrimaryAppBar',
  slot: 'Root'
})({
  height: 58,
  minHeight: 58,
  minWidth: 1,
  position: 'relative',
  margin: 0,
  padding: 0,
  flexGrow: 1,
  flexBasis: '100%',
  width: '100%',
  '& form': {
    alignItems: 'end'
  }
});

export default function PrimaryAppBarRoot(props) {
  const { useLoggedIn, usePageParams, getSetting, useTheme } = useGlobal();
  const theme = useTheme();
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
            >
              <AppBarBranch offline />
            </Box>
          </AppBar>
        </PrimaryAppBar>
      </Provider>
    );
  }

  return (
    <Provider>
      <PrimaryAppBar data-testid="appbar">
        <AppBar sx={{ background: theme.palette?.appBar }}>
          <Toolbar>
            <AppBarBranch />
            {loggedIn ? (
              <>
                <AppBarSearch />
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
