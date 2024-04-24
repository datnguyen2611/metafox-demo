/**
 * @type: ui
 * name: appbar.menu.more
 * chunkName: appbarAs
 */
import {
  RefOf,
  RouteLink,
  useAppMenu,
  useGlobal,
  useLocation
} from '@metafox/framework';
import { ScrollContainer } from '@metafox/layout';
import { LineIcon, Popper, SearchBox } from '@metafox/ui';
import {
  Box,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  PopperProps
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { isEmpty } from 'lodash';
import React from 'react';
import { filterShowWhen } from '@metafox/utils';

const StyledAvatar = styled(ListItemAvatar)(({ theme }) => ({
  fontSize: theme.mixins.pxToRem(24),
  width: theme.spacing(6),
  minWidth: `${theme.spacing(6)}`,
  height: theme.spacing(6),
  backgroundColor: '#e0dddd',
  color: theme.palette.mode === 'light' ? '#828080' : '#616161',
  borderRadius: '50%',
  marginRight: theme.spacing(1.25),
  paddingRight: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

export default function AppBarMenuMore({
  anchorRef,
  enableSearch,
  closePopover,
  ...rest
}: PopperProps & {
  closePopover: any;
  enableSearch: boolean;
  anchorRef: RefOf<HTMLDivElement>;
}) {
  const primaryMenu = useAppMenu('core', 'dropdownMenu');
  const [query, setQuery] = React.useState<string>('');
  const { i18n, getSetting, useSession } = useGlobal();
  const { key } = useLocation();
  const setting = getSetting();
  const session = useSession();

  React.useEffect(() => {
    closePopover();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const menu = React.useMemo(() => {
    const x = query.trim();

    if (!primaryMenu?.items.length) return [];

    const menuFilter = filterShowWhen(primaryMenu?.items, { setting, session });

    if (isEmpty(x)) {
      return menuFilter;
    }

    return menuFilter.filter(
      item => item.label.toLowerCase().indexOf(x) !== -1
    );
  }, [primaryMenu?.items, query, setting, session]);
  const placeholder = i18n.formatMessage({ id: 'search_app' });

  return (
    <Popper
      id="popupMoreMenu"
      data-testid="popupMoreMenu"
      anchorEl={anchorRef.current}
      popperOptions={{
        strategy: 'fixed'
      }}
      {...rest}
    >
      <Paper sx={{ width: 360, overflow: 'hidden', py: 1 }}>
        {enableSearch ? (
          <Box sx={{ p: [2, 2, 1, 2] }}>
            <SearchBox
              autoFocus
              name="q"
              placeholder={placeholder}
              type="search"
              onChange={e => setQuery(e.target.value)}
              autoComplete="off"
              role="combobox"
            />
          </Box>
        ) : null}
        <ScrollContainer autoHide autoHeight autoHeightMax={450}>
          {menu.filter(Boolean).map((item, index) => (
            <ListItem
              key={index.toString()}
              variant="contained"
              to={item.to}
              data-testid={item.testid || item.name}
              component={RouteLink}
            >
              <StyledAvatar>
                <LineIcon icon={item.icon} />
              </StyledAvatar>
              <ListItemText primary={item.label} secondary={item.subInfo} />
            </ListItem>
          ))}
        </ScrollContainer>
      </Paper>
    </Popper>
  );
}
