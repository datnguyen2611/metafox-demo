/**
 * @type: service
 * name: InViewTrackingSponsor
 */

import { useGlobal } from '@metafox/framework';
import React from 'react';
import { Box } from '@mui/material';
import { useInView } from 'react-intersection-observer';

const SponsorshipTrackingItem = ({ identity, children }: any) => {
  const { dispatch, getSetting, useGetItem } = useGlobal();
  const item = useGetItem(identity);
  const timeout = React.useRef<any>();
  const end = React.useRef(false);
  // get second delay
  const delay_time_to_count_sponsor_view = getSetting(
    'advertise.delay_time_to_count_sponsor_view',
    0
  );
  const time = delay_time_to_count_sponsor_view * 1000;
  const [refTrackingView, inView] = useInView({
    threshold: 0
  });

  React.useEffect(() => {
    if (end?.current || item?._sponsorship_viewed) return;

    if (inView) {
      timeout.current = setTimeout(() => {
        end.current = true;
        dispatch({
          type: 'advertise/sponsorship/updateView',
          payload: { identity }
        });
      }, time);
    } else {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  React.useEffect(() => {
    // clean
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Box ref={refTrackingView}>{children}</Box>;
};

export default SponsorshipTrackingItem;
