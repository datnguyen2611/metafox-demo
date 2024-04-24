import { HistoryState, useGlobal } from '@metafox/framework';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageParamAware() {
  const { use, usePageParams, getPageParams } = useGlobal();
  const location = useLocation<HistoryState>();
  const { key, state } = location;
  const pageParams = usePageParams();

  useMemo(() => {
    if (state?.asModal && getPageParams) return;

    use({ getPageParams: () => pageParams });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageParams, key]);

  return null;
}
