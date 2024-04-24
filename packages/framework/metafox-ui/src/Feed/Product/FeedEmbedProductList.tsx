/**
 * @type: ui
 * name: feedArticle.view.list.embedItem
 */
import { ImageRatio, ItemShape } from '@metafox/ui';
import * as React from 'react';
import FeedEmbedProductTemplate from './FeedEmbedProductTemplate';

type Props = {
  title?: string;
  description?: string;
  link?: string;
  host?: string;
  image?: string;
  mediaRatio?: ImageRatio;
  price?: string;
  displayStatistic?: string;
  maxLinesTitle?: number;
  maxLinesDescription?: number;
  highlightSubInfo?: string;
  variant?: 'grid' | 'list';
} & ItemShape;

const FeedArticleList = (props: Props) => (
  <FeedEmbedProductTemplate
    variant={'list'}
    widthImage="90px"
    mediaRatio={'11'}
    {...props}
  />
);

export default FeedArticleList;
