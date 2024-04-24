import {
  BlockViewProps,
  useGlobal,
  useIsMobile,
  useResourceAction,
  useResourceForm
} from '@metafox/framework';
import { styled, Box, Typography, Grid } from '@mui/material';
import { Block, BlockContent, BlockHeader } from '@metafox/layout';
import React from 'react';
import { FormBuilder } from '@metafox/form';
import { whenParamRules } from '@metafox/utils';
import qs from 'querystring';
import { APP_EWALLET, EWALLET_TRANSACTION, TRANSACTION } from '../../constants';

export type Props = BlockViewProps;

const gridTitle = [
  {
    label: 'ewallet_user',
    grid: 1
  },
  {
    label: 'gross',
    grid: 1.1
  },
  {
    label: 'fee',
    grid: 1.1
  },
  {
    label: 'net',
    grid: 1.1
  },
  {
    label: 'balance',
    grid: 1.1
  },
  {
    label: 'current_balance',
    grid: 1.1
  },
  {
    label: 'source',
    grid: 1
  },
  {
    label: 'action',
    grid: 1.5
  },
  {
    label: 'reference',
    grid: 1
  },
  {
    label: 'status',
    grid: 1
  },
  {
    label: 'creation_date',
    grid: 1
  }
];

const TitleStyled = styled(Grid, { name: 'TitleStyled' })(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(3, 2, 2),
  [theme.breakpoints.up('sm')]: {
    minWidth: theme.breakpoints.values.xl
  }
}));

const ContentWrapper = styled(Box, {
  name: 'ContentWrapper'
})(({ theme }) => ({
  padding: theme.spacing(3, 2, 2),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0)
  }
}));

const TableStyled = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    overflowX: 'auto'
  }
}));

const RecordStyled = styled(Box, { name: 'RecordStyled' })(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    minWidth: theme.breakpoints.values.xl
  }
}));

export default function Base({ title, ...rest }: Props) {
  const { usePageParams, navigate, jsxBackend, i18n } = useGlobal();
  const pageParams = usePageParams();
  const isMobile = useIsMobile();

  const dataSource = useResourceAction(
    APP_EWALLET,
    EWALLET_TRANSACTION,
    'viewAll'
  );

  const formSchema = useResourceForm(APP_EWALLET, TRANSACTION, 'search_form');

  const ListView = jsxBackend.get('core.block.mainListing');

  const submitFilter = (values, form) => {
    const apiRules = dataSource.apiRules;

    const params = whenParamRules(values, apiRules);

    navigate(`?${qs.stringify(params)}`, { replace: true });
    form.setSubmitting(false);
  };

  return (
    <Block testid="activityPointBlock" {...rest}>
      <BlockHeader title={title}></BlockHeader>
      <BlockContent {...rest}>
        <ContentWrapper>
          <FormBuilder
            navigationConfirmWhenDirty={false}
            formSchema={formSchema}
            onSubmit={submitFilter}
          />
          <TableStyled>
            {!isMobile ? (
              <TitleStyled container>
                {gridTitle.map((title, index) => (
                  <Grid item key={index} xs={title.grid} pr={2}>
                    <Typography variant="h5">
                      {i18n.formatMessage({ id: title.label })}
                    </Typography>
                  </Grid>
                ))}
              </TitleStyled>
            ) : null}
            <RecordStyled sx={isMobile && { mt: 3 }}>
              {React.createElement(ListView, {
                itemView: 'ewallet.itemView.transaction',
                dataSource,
                emptyPage: 'core.itemView.no_content_history_point',
                pageParams,
                clearDataOnUnMount: true,
                blockLayout: 'App List - Record Table',
                itemLayout: 'Record Item - Table',
                gridLayout: 'Record Item - Table',
                loadMoreType: 'pagination',
                hideTopPagination: true,
                numberOfItemsPerPage: 10,
                canLoadMore: true,
                hideBottomPagination: false
              })}
            </RecordStyled>
          </TableStyled>
        </ContentWrapper>
      </BlockContent>
    </Block>
  );
}

Base.displayName = 'package_transaction';
