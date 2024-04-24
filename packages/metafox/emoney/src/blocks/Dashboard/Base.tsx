import {
  BlockViewProps,
  useGlobal,
  useResourceAction
} from '@metafox/framework';
import { Box, styled, Typography } from '@mui/material';
import { Block, BlockContent, BlockHeader } from '@metafox/layout';
import React from 'react';
import ErrorPage from '@metafox/core/pages/ErrorPage/Page';
import { compactUrl } from '@metafox/utils';
import { APP_EWALLET, EWALLET_STATISTIC } from '../../constants';

export type Props = BlockViewProps;

const UserBalanceText = styled(Box)(({ theme }) => ({
  fontSize: theme.mixins.pxToRem(20),
  fontWeight: 'bold',
  marginBottom: theme.spacing(1)
}));

const UserBalanceNumber = styled(Box)(({ theme }) => ({
  fontSize: theme.mixins.pxToRem(40),
  marginBottom: theme.spacing(2)
}));

const Balances = styled(Box)(({ theme }) => ({
  fontSize: theme.mixins.pxToRem(16),
  background: theme.palette.border.secondary,
  padding: theme.spacing(2),
  width: 'min(100%, 400px)',
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1)
}));
const Balance = styled(Box)(({ theme }) => ({
  display: 'flex'
}));

const Dotted = styled(Box)(({ theme }) => ({
  flex: 1,
  borderBottom: '2px dotted',
  margin: theme.spacing(0, 0.5, 0.5, 0.5)
}));

const Total = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexFlow: 'wrap',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column'
  }
}));

const ItemNumber = styled(Box)(({ theme }) => ({
  fontSize: theme.mixins.pxToRem(40)
}));

const ItemLabel = styled(Box)(({ theme }) => ({
  whiteSpace: 'nowrap'
}));

const Item = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  fontSize: theme.mixins.pxToRem(18),
  gap: theme.spacing(1),
  padding: theme.spacing(0, 3, 3, 0),
  marginRight: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginRight: theme.spacing(1)
  }
}));

const TTL = 36000000;
// cache 1 hours

export default function Base({
  title,
  emptyPage = 'core.block.no_results',
  ...rest
}: Props) {
  const { useFetchDetail, i18n, useSession } = useGlobal();
  const { user } = useSession();

  const dataSource = useResourceAction(
    APP_EWALLET,
    EWALLET_STATISTIC,
    'viewItem'
  );

  const [data, loading, error] = useFetchDetail({
    dataSource: {
      apiUrl: compactUrl(dataSource.apiUrl, user)
    },
    ttl: TTL,
    cachePrefix: 'dashboard',
    cacheKey: 'ewallet',
    forceReload: false
  });

  return (
    <Block testid="activityPointBlock" {...rest}>
      <BlockHeader title={title} />
      <BlockContent>
        <Box p={{ xs: 2, md: 4 }}>
          <ErrorPage loading={loading} error={error}>
            {data && (
              <>
                <UserBalanceText>
                  {i18n.formatMessage({ id: 'balance' })}
                </UserBalanceText>
                <UserBalanceNumber>{data?.user_balance}</UserBalanceNumber>
                <Box mb={2}>
                  {i18n.formatMessage({ id: 'ewallet_available' })}
                </Box>
                <Balances>
                  {data?.balances.map((balance, index) => (
                    <Balance key={index}>
                      {balance.label}
                      <Dotted sx={{ flex: 1 }}></Dotted>
                      {balance.value}
                    </Balance>
                  ))}
                </Balances>
                <Box marginBottom={2}>
                  {data?.balance_description}
                </Box>
                <Total>
                  <Item>
                    <ItemLabel>
                      <Typography variant="body1">
                        {i18n.formatMessage({ id: 'total_amount_in' })}
                      </Typography>
                    </ItemLabel>
                    <ItemNumber>{data.earned}</ItemNumber>
                  </Item>
                  <Item>
                    <ItemLabel>
                      <Typography variant="body1">
                        {i18n.formatMessage({ id: 'withdrawn' })}
                      </Typography>
                    </ItemLabel>
                    <ItemNumber>{data.withdraw}</ItemNumber>
                  </Item>
                  <Item>
                    <ItemLabel>
                      <Typography variant="body1">
                        {i18n.formatMessage({ id: 'pending_withdrawal' })}
                      </Typography>
                    </ItemLabel>
                    <ItemNumber>{data.pending_withdraw}</ItemNumber>
                  </Item>
                  <Item>
                    <ItemLabel>
                      <Typography variant="body1">
                        {i18n.formatMessage({ id: 'pending_amount_in' })}
                      </Typography>
                    </ItemLabel>
                    <ItemNumber>{data.pending_transaction}</ItemNumber>
                  </Item>
                  <Item>
                    <ItemLabel>
                      <Typography variant="body1">
                        {i18n.formatMessage({ id: 'purchased' })}
                      </Typography>
                    </ItemLabel>
                    <ItemNumber>{data?.purchased}</ItemNumber>
                  </Item>
                </Total>
              </>
            )}
          </ErrorPage>
        </Box>
      </BlockContent>
    </Block>
  );
}

Base.displayName = 'Ewallet_Dashboard';
