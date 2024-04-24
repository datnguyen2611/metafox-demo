import * as React from 'react';
import RouteLink, { LinkProps } from './RouteLink';
import { Link } from '@mui/material';
import { useGlobal, LINK_TRACKING_CLICK } from '@metafox/framework';

const MuiLink = React.forwardRef((props: LinkProps, ref: any) => {
  const { identityTrackingClick, ...rest } = props;
  const { dispatch } = useGlobal();

  if (identityTrackingClick) {
    rest.onClick = () => {
      if (dispatch) {
        dispatch({
          type: LINK_TRACKING_CLICK,
          payload: { identityTrackingClick }
        });
      }
    };
  }

  return <Link {...rest} ref={ref} component={RouteLink} />;
});

export default MuiLink;
