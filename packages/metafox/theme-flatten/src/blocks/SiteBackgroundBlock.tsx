/**
 * @type: siteDock
 * name: theme-flatten.block.SiteBackgroundBlock
 * title: Site Background Block
 * bundle: web
 * theme: flatten
 */
import { useGlobal } from '@metafox/framework';
import { useTheme } from '@mui/material';
import React from 'react';

const SiteBackgroundBlock = () => {
  const theme = useTheme();
  const { getSetting } = useGlobal();
  const settingSiteBackground = getSetting('site-background');
  const siteBackground = theme.siteBackground;

  React.useEffect(() => {
    
    if (settingSiteBackground) return;

    document.body.style.background = siteBackground;
  }, [settingSiteBackground, siteBackground]);
};

export default SiteBackgroundBlock;
