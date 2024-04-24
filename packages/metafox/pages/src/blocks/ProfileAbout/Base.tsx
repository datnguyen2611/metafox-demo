import { BlockViewProps, useGlobal, Link } from '@metafox/framework';
import HtmlViewer from '@metafox/html-viewer';
import { Block, BlockContent, BlockHeader } from '@metafox/layout';
import { FormatDate, InformationList, TruncateText } from '@metafox/ui';
import { Skeleton, styled } from '@mui/material';
import React from 'react';
import useStyles from './styles';

const StyledTextInfo = styled('div', {
  name: 'ProfileAbout',
  slot: 'itemIcon'
})(({ theme }) => ({
  fontSize: theme.mixins.pxToRem(15),
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1.5),
  '& p': {
    wordBreak: 'break-word'
  }
}));

export interface Props extends BlockViewProps {}

export default function UserProfileAboutBlock({ title }: Props) {
  const { useFetchDetail, usePageParams, i18n, useGetItem } = useGlobal();
  const { id, identity } = usePageParams();

  const classes = useStyles();

  const item = useGetItem(identity);

  const [data, loading] = useFetchDetail({
    dataSource: {
      apiUrl: `page-info/${id}`
    },
    forceReload: true
  });

  if (loading) {
    return (
      <Block>
        <BlockHeader title={title} />
        <BlockContent>
          <Skeleton height={20} width="100%" />
          <Skeleton height={20} width="100%" />
          <Skeleton height={20} width="100%" />
        </BlockContent>
      </Block>
    );
  }

  const {
    description,
    location,
    phone,
    external_link,
    extra,
    creation_date,
    category
  } = data || {};

  const textCategory = (
    <Link to={category?.link || category?.url} color="primary">
      {category?.name}
    </Link>
  );

  const infoItems = [
    {
      icon: 'ico-checkin-o',
      info: location
    },
    {
      icon: 'ico-phone-o',
      info: phone
    },
    {
      icon: 'ico-layers-o',
      info: textCategory,
      value: !!textCategory
    },
    {
      icon: 'ico-thumbup-o',
      info: i18n.formatMessage(
        {
          id: 'people_liked_this_page'
        },
        {
          value: item?.statistic?.total_like
        }
      )
    },
    {
      icon: 'ico-globe-alt-o',
      info: external_link ? (
        <Link
          to={external_link}
          color="primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          {external_link}
        </Link>
      ) : null
    },
    extra?.can_view_publish_date && {
      icon: 'ico-rocket-o',
      info: (
        <FormatDate
          data-testid="creationDate"
          value={creation_date}
          format="LL"
          phrase="published_on_time"
        />
      )
    }
  ];

  return (
    <Block>
      <BlockHeader title={title} />
      <BlockContent>
        {description && (
          <StyledTextInfo className={classes.textInfo}>
            <TruncateText variant={'body1'} lines={3}>
              <HtmlViewer html={description} simpleTransform />
            </TruncateText>
          </StyledTextInfo>
        )}
        <div>
          <InformationList values={infoItems} />
        </div>
      </BlockContent>
    </Block>
  );
}
