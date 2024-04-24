import { Box } from '@mui/material';
import React from 'react';
import { getAdminSiteStatus } from '@metafox/admincp/actions';
import { useGlobal, GlobalState } from '@metafox/framework';
import { useSelector } from 'react-redux';
import useStyles from './styles';

export default function AdminSideMenu() {
  const { dispatch, i18n } = useGlobal();
  const classes = useStyles();
  const siteStatus = useSelector<GlobalState>(state => state.admincp.status);
  const version = siteStatus?.data?.version;

  React.useEffect(() => {
    dispatch(getAdminSiteStatus(false));
  }, []);

  if (!version) return null;

  return (
    <Box className={classes.siteVersion}>
      {`${i18n.formatMessage({
        id: 'site_version'
      })}: ${version}`}
    </Box>
  );
}
