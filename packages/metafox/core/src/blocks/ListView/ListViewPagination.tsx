import {
  getPagingSelector,
  GlobalState,
  initPagingState,
  ListViewPaginationProps,
  PagingState,
  useGlobal
} from '@metafox/framework';
import { Block, BlockContent, BlockHeader } from '@metafox/layout';
// layout
import { Grid, Skeleton as SkeletonDefault, Box } from '@mui/material';
// components
import { isArray, range, get } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { Pagination } from '@metafox/ui';

function ListViewPagination({
  title,
  itemView,
  itemProps = {},
  gridItemProps = {},
  gridContainerProps = { spacing: 2 },
  pagingId,
  messagePagination,
  handleUpdateLastRead,
  loadMore,
  numberOfItemsPerPage,
  emptyPage = 'core.block.no_content',
  emptyPageProps,
  errorPage,
  hasSort = false,
  titleBackend = false,
  moduleName,
  resourceName,
  actionSortName,
  handleActionItem,
  hideTopPagination,
  hideBottomPagination
}: ListViewPaginationProps) {
  const { jsxBackend, usePageParams, i18n } = useGlobal();
  const pageParams = usePageParams();
  const { page } = pageParams;
  const ItemView = jsxBackend.get(itemView);
  const Skeleton = jsxBackend.get(`${itemView}.skeleton`);
  const currentPageInitial = parseInt(page || 1, 10);

  const limitSkeleton = numberOfItemsPerPage;

  const [currentPage, setCurrentPage] =
    React.useState<number>(currentPageInitial);
  const paging =
    useSelector<GlobalState, PagingState>((state: GlobalState) =>
      getPagingSelector(state, pagingId)
    ) || initPagingState();

  const { loading, refreshing, error, ended, initialized, pagesOffset, dirty } =
    paging ?? {};
  const perPage = numberOfItemsPerPage || 20;

  const data = paging.pages[currentPage]?.ids || [];

  React.useEffect(() => {
    if (handleUpdateLastRead) {
      handleUpdateLastRead();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  React.useEffect(() => {
    const current_page = parseInt(
      pageParams?.page || pagesOffset?.current_page,
      10
    );
    setCurrentPage(current_page);

    if (current_page !== pageParams?.page) loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageParams?.page, pagesOffset?.current_page]);

  React.useEffect(() => {
    if (!refreshing || dirty) return;

    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, refreshing]);

  if (!ItemView) return null;

  if (!gridItemProps.xs) {
    gridItemProps.xs = 12;
  }

  if (error) {
    if (errorPage === 'hide') return null;

    const message =
      get(error, 'response.data.error') || get(error, 'response.data.message');

    const errorName =
      get(error, 'response.status') === 403
        ? 'core.block.error403'
        : 'core.block.error404';
    const ErrorBlock = jsxBackend.get(errorName);

    if (errorPage === 'default') {
      return (
        <Block>
          <BlockHeader title={title} data={data} />
          <BlockContent>
            <ErrorBlock title={message} />
          </BlockContent>
        </Block>
      );
    }

    return <ErrorBlock title={message} />;
  }

  const blockHeaderBackend = (
    <Box sx={{ display: 'block' }}>
      <Box component={'h2'} mt={0} mb={0.5}>
        {pagesOffset?.title}
      </Box>
      <Box color="text.secondary">{pagesOffset?.description}</Box>
    </Box>
  );

  if ((!data.length && ended) || error) {
    if (emptyPage === 'hide') return null;

    if (typeof emptyPage !== 'string') return emptyPage;

    const NoResultsBlock = jsxBackend.get(emptyPage);

    if (!NoResultsBlock) return null;

    const { noBlock, contentStyle } = emptyPageProps || {};

    if (noBlock) {
      return <NoResultsBlock {...emptyPageProps} />;
    }

    return (
      <Block>
        {titleBackend ? (
          <BlockHeader children={blockHeaderBackend} />
        ) : (
          <BlockHeader title={title} />
        )}
        <BlockContent {...contentStyle}>
          {React.createElement(NoResultsBlock, { ...emptyPageProps })}
        </BlockContent>
      </Block>
    );
  }

  if (!initialized) {
    if (!Skeleton) {
      return <div>{i18n.formatMessage({ id: 'loading_dots' })}</div>;
    }

    return (
      <Block>
        {titleBackend ? (
          <BlockHeader>
            <SkeletonDefault height={24} width={160} />
          </BlockHeader>
        ) : (
          <BlockHeader title={title} />
        )}
        <BlockContent>
          <Grid
            container
            sx={{ '&:empty': { display: 'none' } }}
            {...gridContainerProps}
          >
            {range(0, limitSkeleton).map(index => (
              <Skeleton
                wrapAs={Grid}
                wrapProps={gridItemProps}
                itemProps={itemProps}
                key={index.toString()}
              />
            ))}
          </Grid>
        </BlockContent>
      </Block>
    );
  }

  return (
    <Block>
      {titleBackend ? (
        <BlockHeader children={blockHeaderBackend} data={data} />
      ) : (
        <BlockHeader title={title} data={data} />
      )}
      <BlockContent>
        {!hideTopPagination ? (
          <Pagination
            currentPage={currentPage}
            from={paging.pages[currentPage]?.from}
            to={paging.pages[currentPage]?.to}
            total={pagesOffset?.total_item || pagesOffset?.total}
            itemsPerPage={perPage}
            message={messagePagination}
            hasSort={hasSort}
            moduleName={moduleName}
            resourceName={resourceName}
            actionName={actionSortName}
          />
        ) : null}
        <Grid container {...gridContainerProps}>
          {isArray(data) &&
            data.map((id, index) => (
              <ItemView
                index={index}
                identity={id}
                itemProps={itemProps}
                key={id.toString()}
                wrapAs={Grid}
                wrapProps={gridItemProps}
                pagingId={pagingId}
                handleActionItem={handleActionItem}
              />
            ))}
          {loading && Skeleton ? (
            <>
              {range(0, limitSkeleton).map(index => (
                <Skeleton
                  wrapAs={Grid}
                  wrapProps={gridItemProps}
                  itemProps={itemProps}
                  key={index.toString()}
                />
              ))}
            </>
          ) : null}
        </Grid>
        {!hideBottomPagination ? (
          <Pagination
            currentPage={currentPage}
            from={paging.pages[currentPage]?.from}
            to={paging.pages[currentPage]?.to}
            total={pagesOffset?.total_item || pagesOffset?.total}
            itemsPerPage={perPage}
            message={messagePagination}
          />
        ) : null}
      </BlockContent>
    </Block>
  );
}

export default ListViewPagination;
