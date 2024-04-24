import {
  ListViewBlockProps,
  useGetItem,
  useGlobal,
  useLocation
} from '@metafox/framework';
import { Block, BlockContent, BlockHeader, SearchBox } from '@metafox/layout';
import { LineIcon, UIBlockViewProps, ItemTabProps } from '@metafox/ui';
import { UserItemShape } from '@metafox/user';
import { filterShowWhen } from '@metafox/utils';
import { Menu, Tab, Tabs, styled } from '@mui/material';
import produce from 'immer';
import { get, isArray } from 'lodash';
import qs from 'querystring';
import React, { useCallback, useEffect, useRef } from 'react';

const TabWrapper = styled(Tab, { name: 'TabWrapper' })(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 'bold',
  fontSize: theme.mixins.pxToRem(15),
  padding: '0 !important',
  width: 'fit-content !important',
  minWidth: 'fit-content !important',
  textTransform: 'uppercase',
  marginLeft: theme.spacing(2.5),
  '&:first-of-type': {
    marginLeft: theme.spacing(0)
  }
}));

const SubTabWrapper = styled('div', {
  name: 'HeaderProfileInPageDetail',
  slot: 'subTabWrapper',
  shouldForwardProp: prop => prop !== 'pageDetail',
  overridesResolver(props, styles) {
    return [
      styles.subTabWrapper,
      props.pageDetail && styles.subTabWrapperPageDetail
    ];
  }
})<{ pageDetail?: boolean }>(({ theme, pageDetail }) => ({
  paddingBottom: theme.spacing(1.875),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column-reverse',
    alignItems: 'flex-start',
    ...(pageDetail && {
      padding: theme.spacing(0, 2)
    })
  }
}));

const MenuItem = styled('div', { name: 'MenuItem' })<{
  tabItemActive?: boolean;
}>(({ theme, tabItemActive }) => ({
  width: 240,
  minHeight: '40px',
  display: 'block',
  padding: theme.spacing(1, 2),
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  textTransform: 'uppercase',
  fontSize: '15px',
  color: theme.palette.text.secondary,
  '&:hover': {
    textDecoration: 'none !important',
    backgroundColor: theme.palette.action.hover,
    cursor: 'pointer'
  },
  ...(tabItemActive && {
    color: `${theme.palette.primary.main} !important`
  })
}));

const SecondMenu = styled('div', { name: 'SecondMenu' })(({ theme }) => ({
  listStyle: 'none none outside',
  margin: 0,
  padding: 0,
  display: 'inline-flex'
}));

const HiddenTabs = styled('div', { name: 'HiddenTabs' })(({ theme }) => ({
  visibility: 'hidden',
  position: 'absolute'
}));

const DisableGutter = styled('div', { name: 'DisableGutter' })<{
  disableGutter?: boolean;
}>(({ disableGutter }) => ({
  ...(disableGutter && {
    padding: 0
  })
}));

const TabItem = styled('div', { name: 'TabItem' })(({ theme }) => ({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  float: 'left',
  textDecoration: 'none',
  textTransform: 'uppercase',
  fontSize: '15px',
  fontWeight: 'bold',
  color: `${theme.palette.text.secondary} !important`,
  position: 'relative',
  whiteSpace: 'nowrap',
  '&:hover': {
    textDecoration: 'none',
    color: `${theme.palette.primary.main} !important`
  },
  [theme.breakpoints.down('xs')]: {
    padding: `26px ${theme.spacing(1)}px`,
    marginBottom: 0
  },
  minWidth: 60,
  cursor: 'pointer',
  marginRight: 0,
  flexGrow: 1
}));

type TabContainerProps = UIBlockViewProps &
  ListViewBlockProps & {
    profileActionMenu?: string;
    hasSearchBox?: string;
    item: any;
    user: UserItemShape;
    pageDetail: boolean;
  };

const convertTabToArray = (tabs: any[]) => {
  if (!isArray(tabs)) return [];

  return tabs.filter(Boolean);
};

export default function TabContainer({
  title,
  tabProps = {
    tabs: [],
    tabsNoSearchBox: [],
    disableGutter: false,
    activeTab: '',
    placeholderSearch: 'search_dot'
  },
  elements,
  hasSearchBox,
  item,
  user,
  pageDetail = false,
  compose
}: TabContainerProps) {
  const {
    tabs: items,
    tabsNoSearchBox = [],
    disableGutter,
    activeTab,
    to
  } = tabProps;

  const {
    navigate,
    jsxBackend,
    useSession,
    usePageParams,
    i18n,
    useIsMobile,
    getAcl,
    compactUrl
  } = useGlobal();
  const isMobile = useIsMobile();
  const acl = getAcl();
  const defaultTab = React.useMemo(
    () => activeTab || convertTabToArray(tabProps.tabs)[0]?.tab || '',
    [activeTab, tabProps.tabs]
  );
  const [tab, setTab] = React.useState<string>(defaultTab);

  const location = useLocation();
  const refMenuMore = useRef(null);
  const [query, setQuery] = React.useState('');
  const session = useSession();
  const { user: authUser, loggedIn } = session;
  const pageParams = usePageParams();
  const detailUser = useGetItem(`user.entities.user.${authUser?.id}`);
  const [open, setOpen] = React.useState<boolean>(false);
  const element = elements.find(element => element.props.name === tab);

  const isAuthUser =
    (authUser?.id === item?.id || user?.id === authUser?.id) && loggedIn;
  const [state, setState] = React.useState<number>(0);
  const searchRef = useRef<HTMLDivElement>();
  const searchHiddenRef = useRef<HTMLDivElement>();
  const totalRef = useRef<HTMLDivElement>();
  const hiddenTabsRef = useRef<HTMLDivElement>();
  const moreTabRef = useRef<HTMLDivElement>();
  const tabRef = useRef<HTMLDivElement>();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const selectMoreTabItem = (event: any, tab: any) => {
    event.stopPropagation();
    setTab(tab);
    const stab = qs.stringify({ stab: tab });

    navigate(
      {
        pathname: location.pathname,
        search: `?${stab}`
      },
      {
        keepScroll: true,
        state: location.state
      }
    );

    closeMenu();
  };

  const displayTab = filterShowWhen(items, {
    isAuthUser,
    session,
    item,
    authUser: detailUser,
    acl
  }) as ItemTabProps[];

  const tabs = displayTab.map(item => item.tab);
  const tabValue = items.find(item => item.tab === tab);

  const translateTabLabel = React.useCallback(
    tab => {
      const { statisticKey, label } = tab || {};

      if (!label) return null;

      const text = i18n.formatMessage({ id: label });
      const statistic = get({ item }, statisticKey);

      if (!statistic) return text;

      return `${text} (${statistic})`;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [item]
  );

  React.useEffect(() => {
    if (
      !tabs.includes(tab) &&
      tabValue &&
      tabValue?.redirectWhenNoPermission &&
      tabs.includes(tabValue?.redirectWhenNoPermission)
    ) {
      navigate({
        pathname: location.pathname,
        search: `?stab=${tabValue?.redirectWhenNoPermission || defaultTab}`
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, displayTab, items]);

  const moreTab = useCallback(
    (isHidden: Boolean) => (
      <SecondMenu ref={refMenuMore}>
        <TabItem>
          {i18n.formatMessage({ id: 'more' })}&nbsp;
          <LineIcon icon="ico-caret-down" />
        </TabItem>
        <Menu open={open} anchorEl={anchorEl} onClose={closeMenu}>
          {(state >= displayTab.length
            ? displayTab
            : displayTab.slice(state)
          ).map((itemTab, index) => (
            <MenuItem
              tabItemActive={itemTab.tab === tab}
              key={index.toString()}
              onClick={event => selectMoreTabItem(event, itemTab.tab)}
            >
              {translateTabLabel(itemTab)}
            </MenuItem>
          ))}
        </Menu>
      </SecondMenu>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [anchorEl, displayTab, open, selectMoreTabItem, state, tab]
  );

  const itemsNoSearchBox = convertTabToArray(tabsNoSearchBox);

  const hasSearch = hasSearchBox && !itemsNoSearchBox.includes(tab);

  const onResize = React.useCallback(() => {
    const cc: HTMLCollection[] = hiddenTabsRef.current?.children;

    if (!cc || !cc.length) return;

    const maxWidth = totalRef.current.getBoundingClientRect().width;
    const tabMoreWidth = moreTabRef.current?.getBoundingClientRect().width;

    const searchWidth =
      hasSearch && !isMobile
        ? searchHiddenRef.current?.getBoundingClientRect().width
        : 0;

    let totalWidth = 0;
    let index = -1;

    while (totalWidth + tabMoreWidth + searchWidth < maxWidth) {
      index++;
      totalWidth += cc[index]?.getBoundingClientRect()?.width;
    }

    const maxTabsWhenHasMore = 3;
    const countTabHasMore =
      index < maxTabsWhenHasMore ? index : maxTabsWhenHasMore;

    if (index === maxTabsWhenHasMore && cc.length === maxTabsWhenHasMore + 1) {
      setState(maxTabsWhenHasMore - 1);
    } else {
      setState(index >= cc.length ? cc.length : countTabHasMore);
    }
  }, [hasSearch, isMobile]);

  useEffect(() => {
    onResize();
  }, [onResize, tab, displayTab]);

  useEffect(() => {
    const { stab } = pageParams;
    const isTabOnDisplayTab = displayTab.some(tab => tab.tab === stab);

    if (!isTabOnDisplayTab && stab) {
      setTab(activeTab || convertTabToArray(tabProps.tabs)[0].tab);

      navigate({
        search: `?stab=${activeTab || convertTabToArray(tabProps.tabs)[0].tab}`
      });

      return;
    }

    if (!isArray(tabProps?.tabs)) return;

    setTab(stab || activeTab || convertTabToArray(tabProps.tabs)[0].tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabProps.tabs, activeTab, pageParams]);

  const closeMenu = () => setOpen(false);

  const toggleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleChange = (_: any, tab: any) => {
    if (tab !== 'more') {
      const stab = qs.stringify({ stab: tab });

      navigate(
        {
          pathname: to ? compactUrl(to, pageParams) : location.pathname,
          search: `?${stab}`
        },
        {
          keepScroll: true,
          state: location.state
        }
      );
    }
  };

  useEffect(() => {
    setQuery('');
  }, [pageParams?.stab, pageParams?.tab]);

  const modifiedElement =
    element?.props?.elements?.length &&
    produce(element, draft => {
      for (let i = 0; i < draft.props.elements.length; i++) {
        // draft.props.elements[i].props.hasSearchBox = true;
        draft.props.elements[i].props.query = query;
      }
    });

  compose(props => {
    props.hasSearchBox = false;
  });

  const changeLink = stab => {
    if (to && stab !== 'more') {
      navigate(
        {
          pathname: to ? compactUrl(to, pageParams) : location.pathname,
          search: `?${qs.stringify({ stab })}`
        },
        {
          keepScroll: true,
          state: location.state
        }
      );
    }
  };

  return (
    <Block>
      <BlockHeader title={title}></BlockHeader>
      <BlockContent>
        <SubTabWrapper ref={totalRef} pageDetail={pageDetail}>
          <HiddenTabs ref={hiddenTabsRef}>
            {displayTab.map((tab, index) => (
              <TabWrapper
                ref={tabRef}
                aria-label={tab.tab}
                value={tab.tab}
                label={translateTabLabel(tab)}
                key={index.toString()}
              />
            ))}
          </HiddenTabs>
          <Tabs
            value={tab}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="primary"
          >
            {(state >= displayTab.length
              ? displayTab
              : displayTab.slice(0, state)
            ).map((tab, index) => (
              <TabWrapper
                onClick={() => changeLink(tab.tab)}
                aria-label={tab.tab}
                value={tab.tab}
                label={translateTabLabel(tab)}
                key={index.toString()}
              />
            ))}
            {state < displayTab.length && (
              <Tab
                onClick={toggleOpen}
                value={'more'}
                label={moreTab(true)}
                ref={refMenuMore}
              />
            )}
          </Tabs>
          <HiddenTabs ref={moreTabRef}>
            <Tab value={'more'} label={moreTab(false)} ref={moreTabRef} />
          </HiddenTabs>

          <HiddenTabs ref={searchHiddenRef}>
            <SearchBox
              placeholder={tabProps?.placeholderSearch}
              onQueryChange={setQuery}
              sx={{
                width: { sm: 'auto', xs: '100%' },
                margin: { sm: 'initial', xs: '16px 0 0 0' },
                padding: '10px'
              }}
            />
          </HiddenTabs>
          {hasSearch ? (
            <SearchBox
              ref={searchRef}
              placeholder={
                tabValue?.placeholderSearch || tabProps?.placeholderSearch
              }
              onQueryChange={setQuery}
              sx={{
                width: { sm: 'auto', xs: '100%' },
                margin: { sm: 'initial', xs: '16px 0 0 0' }
              }}
              keyTab={`${pageParams?.tab}${
                pageParams?.stab || displayTab[0]?.tab
              }`}
            />
          ) : null}
        </SubTabWrapper>
        <DisableGutter disableGutter={disableGutter}>
          {modifiedElement ? jsxBackend.render(modifiedElement) : null}
        </DisableGutter>
      </BlockContent>
    </Block>
  );
}
