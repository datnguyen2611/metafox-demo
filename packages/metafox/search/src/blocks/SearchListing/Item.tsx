import {
  MenuShape,
  useAppMenu,
  useGlobal,
  useIsMobile,
  useLocation,
  useResourceAction
} from '@metafox/framework';
import { Block, BlockContent, usePageParams } from '@metafox/layout';
import * as React from 'react';
import { APP_SEARCH } from '@metafox/search';
import { compactData } from '@metafox/utils';
import { upperFirst, omit } from 'lodash';
import { Button, Box, styled, Typography } from '@mui/material';
import qs from 'query-string';

const name = 'SearchItem';

const SearchItemStyled = styled(Box, {
  name,
  slot: 'Root',
  overridesResolver(props, styles) {
    return [styles.root];
  }
})(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    width: theme.layoutSlot.points['sm']
  },
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

const TitleSearchContent = styled(Typography, {
  name,
  slot: 'TitleSearchContent',
  overridesResolver(props, styles) {
    return [styles.TitleSearchContent];
  }
})(({ theme }) => ({
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(2)
}));

export default function SearchItem({
  item,
  searchSectionAction = 'viewAll',
  searchPreviewAction,
  isLimitMode
}: {
  item?: Record<string, any>;
  searchSectionAction?: string;
  searchPreviewAction?: string;
  isLimitMode?: boolean;
}) {
  const pageParams = usePageParams();
  const { ListView, navigate, i18n } = useGlobal();
  const { appName, resourceName, is_hashtag } = pageParams;
  const isMobile = useIsMobile();

  const menu: MenuShape = useAppMenu(APP_SEARCH, 'webCategoryMenu');

  const { view, id } = usePageParams();
  const location = useLocation();

  const itemParam = item ? omit(item, ['id']) : { item_type: view };

  const { item_type } = Object.assign({}, itemParam);

  const showFullListing = !isLimitMode || item_type === 'feed';

  const actionPreview = searchPreviewAction || searchSectionAction;

  searchSectionAction =
    view === 'all' && !showFullListing ? actionPreview : searchSectionAction;

  const dataSource = useResourceAction(
    appName,
    resourceName,
    searchSectionAction
  );

  const handleViewAll = () => {
    const search = qs.stringify(
      Object.assign({}, qs.parse(location.search), {
        view: item_type
      })
    );

    let pathname = id
      ? `/${appName}/search/${id}?${search}`
      : `/search/${item_type}${location.search}`;

    if (is_hashtag) {
      pathname = `/hashtag/search?${search}`;
    }

    navigate(pathname);
  };

  const label =
    menu?.items?.find(item => item?.name === view)?.label ||
    i18n.formatMessage({ id: 'search_results' });

  let propsListView = { canLoadMore: true, canLoadSmooth: true };

  if (!showFullListing) {
    propsListView = { canLoadMore: false, canLoadSmooth: false };
  }

  return (
    <SearchItemStyled>
      <Block>
        <BlockContent>
          {view !== 'all' && (
            <TitleSearchContent variant="h4">
              {label}
            </TitleSearchContent>
          )}
          <ListView
            testid="searchListing"
            blockLayout="Search Main Lists"
            gridLayout="Search - Main Card"
            itemLayout={
              item_type.includes('music') && isMobile
                ? `${upperFirst(item_type)} - Main Card - Mobile`
                : `${upperFirst(item_type)} - Main Card`
            }
            itemView={`${item_type}.itemView.mainCard`}
            dataSource={{
              apiUrl: dataSource.apiUrl,
              apiParams: compactData(dataSource.apiParams, {
                ...pageParams,
                ...itemParam
              })
            }}
            {...propsListView}
          />
          {!showFullListing && (
            <Button variant="link" onClick={handleViewAll}>
              {i18n.formatMessage(
                { id: 'view_all_results_for_item' },
                { label: item.label }
              )}
            </Button>
          )}
        </BlockContent>
      </Block>
    </SearchItemStyled>
  );
}
