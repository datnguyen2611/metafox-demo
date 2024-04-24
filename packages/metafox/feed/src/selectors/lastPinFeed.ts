import { GlobalState } from '@metafox/framework';
import { createSelector } from 'reselect';
import { get } from 'lodash';

const getLastPin = (
  state: GlobalState,
  profileId: number,
  pagingId: string
) => {
  if (!state.feed.entities.feed) return undefined;

  const ids = get(state, `pagination.${pagingId}.ids`);
  const lastItem = ids.find(id => {
    const obj = get(state, id);

    return obj?.pins?.includes(profileId);
  });

  return get(state, lastItem);
};

export const getLastPinFeed = createSelector(getLastPin, data => data);
