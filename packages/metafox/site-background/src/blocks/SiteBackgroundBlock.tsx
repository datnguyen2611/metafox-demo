/**
 * @type: siteDock
 * name:  site.block.SiteBackgroundBlock
 * title: Site Background Block
 * bundle: web
 */
import { useGlobal } from '@metafox/framework';
import { useTheme } from '@mui/material';
import { isEmpty } from 'lodash';
import moment from 'moment';
import React from 'react';

const durationFromNow = day => {
  const date = moment(day);
  const today = moment(new Date());

  return Math.round(moment.duration(today - date).asDays());
};

const SiteBackgroundBlock = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const { getSetting } = useGlobal();
  const settingSiteBackground = getSetting('site-background');
  const { collection, the_background_rotation_frequency } =
    settingSiteBackground || {};

  if (!collection) return;

  const indexCollection =
    durationFromNow(collection.created_at) % (collection?.total_item || 1);
  const collectionMode: [] = collection?.backgrounds[mode];

  const { image, is_cover } =
    collectionMode[
      the_background_rotation_frequency === 'off' ? 0 : indexCollection
    ] || {};

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    if (!isEmpty(collectionMode)) {
      document.body.style.backgroundImage = `url(${image?.origin})`;
      document.body.style.backgroundRepeat = is_cover ? 'no-repeat' : 'repeat';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.backgroundSize = is_cover ? 'cover' : 'unset';
    } else document.body.style.background = theme?.siteBackground;
  }, [collectionMode, image?.origin, is_cover, theme?.siteBackground]);
};

export default SiteBackgroundBlock;
