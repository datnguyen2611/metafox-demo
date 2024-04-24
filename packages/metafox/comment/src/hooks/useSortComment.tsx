/**
 * @type: service
 * name: useSortComment
 */
import { useGlobal, useLocation } from '@metafox/framework';
import React from 'react';
import { SORT_RELEVANT, SortTypeValue } from '@metafox/comment';
import qs from 'query-string';

export default function useSortComment(sortDefault?: SortTypeValue) {
  const { getSetting } = useGlobal();
  const location = useLocation();
  const searchParams = location?.search
    ? qs.parse(location.search.replace(/^\?/, ''))
    : {};
  const { comment_id } = searchParams;

  const sortSetting: SortTypeValue = getSetting('comment.sort_by');
  const [sortType, setSortType] = React.useState<SortTypeValue>(
    sortDefault || (comment_id ? SORT_RELEVANT : sortSetting)
  );

  React.useEffect(() => {
    if (comment_id && sortType && sortType !== SORT_RELEVANT) {
      setSortType(SORT_RELEVANT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comment_id]);
  const [loading, setLoading] = React.useState(false);

  return [sortType, setSortType, loading, setLoading];
}
