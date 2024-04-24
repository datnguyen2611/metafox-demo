/**
 * @type: itemView
 * name: activitypoint.itemView.conversion
 * chunkName: activityPoint
 */

import {
  connectItemView,
  useGetItem,
  useGlobal,
  useIsMobile
} from '@metafox/framework';
import { Box, Grid, styled } from '@mui/material';
import * as React from 'react';
import LoadingSkeleton from './LoadingSkeleton';
import { ItemView } from '@metafox/ui';

const BoxRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between'
}));

const LeftRow = styled(Box)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightSemiBold,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary
}));

const RightRow = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  textAlign: 'right'
}));

const ItemViewMobileStyled = styled(ItemView)(({ theme }) => ({
  display: 'block'
}));

const Transactions = ({
  identity,
  wrapAs,
  wrapProps,
  state,
  handleAction
}: any) => {
  const item = useGetItem(identity);
  const isMobile = useIsMobile();
  const { i18n, ItemActionMenu } = useGlobal();

  if (!item) return null;

  const { creation_date, fee, status, points, total, actual } = item;

  if (isMobile) {
    return (
      <ItemViewMobileStyled
        wrapAs={wrapAs}
        wrapProps={wrapProps}
        testid="item-transaction-mobile"
      >
        <BoxRow>
          <LeftRow>{i18n.formatMessage({ id: 'point' })}</LeftRow>
          <RightRow>{points}</RightRow>
        </BoxRow>
        <BoxRow>
          <LeftRow>{i18n.formatMessage({ id: 'gross' })}</LeftRow>
          <RightRow>{total}</RightRow>
        </BoxRow>
        <BoxRow>
          <LeftRow>{i18n.formatMessage({ id: 'fee' })}</LeftRow>
          <RightRow>{fee}</RightRow>
        </BoxRow>
        <BoxRow>
          <LeftRow>{i18n.formatMessage({ id: 'net' })}</LeftRow>
          <RightRow>{actual}</RightRow>
        </BoxRow>
        <BoxRow>
          <LeftRow>{i18n.formatMessage({ id: 'status' })}</LeftRow>
          <RightRow>{status}</RightRow>
        </BoxRow>
        <BoxRow>
          <LeftRow>{i18n.formatMessage({ id: 'creation_date' })}</LeftRow>
          <RightRow> {new Date(creation_date).toLocaleDateString()}</RightRow>
        </BoxRow>

        <BoxRow>
          <LeftRow>{i18n.formatMessage({ id: 'options' })}</LeftRow>
          <RightRow>
            <ItemActionMenu
              identity={identity}
              icon="ico-gear-o"
              state={state}
              handleAction={handleAction}
            />
          </RightRow>
        </BoxRow>
      </ItemViewMobileStyled>
    );
  }

  return (
    <ItemView wrapAs={wrapAs} wrapProps={wrapProps} testid="item-transaction">
      <Grid container alignItems="center">
        <Grid item xs={1.5}>
          {points}
        </Grid>
        <Grid item xs={2}>
          {total}
        </Grid>
        <Grid item xs={2}>
          {fee}
        </Grid>
        <Grid item xs={2}>
          {actual}
        </Grid>
        <Grid item xs={1.5}>
          {status}
        </Grid>
        <Grid item xs={2}>
          {new Date(creation_date).toLocaleDateString()}
        </Grid>
        <Grid item xs={1}>
          <ItemActionMenu
            identity={identity}
            icon="ico-gear-o"
            state={state}
            handleAction={handleAction}
          />
        </Grid>
      </Grid>
    </ItemView>
  );
};

Transactions.LoadingSkeleton = LoadingSkeleton;

export default connectItemView(Transactions, () => {});
