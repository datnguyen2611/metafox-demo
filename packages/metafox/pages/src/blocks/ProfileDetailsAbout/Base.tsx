import { BlockViewProps, useGlobal, Link } from '@metafox/framework';
import HtmlViewer from '@metafox/html-viewer';
import { Block, BlockContent, BlockHeader } from '@metafox/layout';
import { FormatDate, InformationList } from '@metafox/ui';
import { Skeleton, styled } from '@mui/material';
import React from 'react';

const name = 'MuiUserProfileDetailsPage';

const TextInfoStyled = styled('div', { name, slot: 'TextInfo' })(
  ({ theme }) => ({
    fontSize: theme.mixins.pxToRem(15),
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(2),
    wordBreak: 'break-word',
    wordWrap: 'break-word'
  })
);

export interface Props extends BlockViewProps {}

export default function UserProfileAboutBlock({ title }: Props) {
  const { useFetchDetail, usePageParams, i18n, useGetItem, jsxBackend } =
    useGlobal();
  const { id, identity } = usePageParams();

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
    text_parsed,
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

  const sections = Object.values(data?.sections || []);

  return (
    <>
      <Block>
        <BlockHeader title={title} />
        <BlockContent>
          {text_parsed && (
            <TextInfoStyled>
              <HtmlViewer html={text_parsed} />
            </TextInfoStyled>
          )}
          <div>
            <InformationList values={infoItems} />
          </div>
        </BlockContent>
      </Block>
      {sections.length
        ? sections.map((section, index) => (
            <Block key={`i${index}`}>
              <BlockHeader title={section?.label} />
              <BlockContent>
                {jsxBackend.render({
                  component: section.component ?? 'layout.section.list_info',
                  props: { section }
                })}
              </BlockContent>
            </Block>
          ))
        : null}
    </>
  );
}
