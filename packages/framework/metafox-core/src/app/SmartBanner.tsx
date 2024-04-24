import React from 'react';
import { useGlobal } from '@metafox/framework';
import SmartBanner from 'react-smartbanner';
import 'react-smartbanner/dist/main.css';

export default function Banner({ children }) {
  const { getSetting } = useGlobal();
  const site_name = getSetting('core.general.site_name');

  return (
    <SmartBanner
      title={site_name}
      daysHidden={7}
      daysReminder={0}
      position="bottom"
      ignoreIosVersion
    />
  );
}
