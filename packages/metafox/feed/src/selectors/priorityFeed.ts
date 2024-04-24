import { GlobalState } from '@metafox/framework';
import { createSelector } from 'reselect';
import { get } from 'lodash';

const getFeed = (state: GlobalState, profileId: number) => {
  if (!state.feed.entities.feed) return undefined;

  const pagingId = profileId ? `/feed?user_id=${profileId}` : '/feed';
  const ids = get(state, `pagination.${pagingId}.ids`) || [];

  const total = ids.filter(id => {
    const obj = get(state, id) || {};

    return (
      (obj.pins && obj.pins.length && obj.pins.includes(profileId)) ||
      obj.is_sponsor
    );
  }).length;

  return total;
};

export const getTotalPriorityFeed = createSelector(getFeed, data => data);
