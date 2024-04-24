import { GlobalState } from '@metafox/framework';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { AppState } from '../types';

export const getAnnouncements = (state: GlobalState) =>
   state.announcement.announcementListing;

export function useAnnouncements() {
  return useSelector<GlobalState, AppState['announcementListing']>(state =>
    getAnnouncements(state)
  );
}

export const getTotalAnnouncements = (state: GlobalState) =>
  get(state, 'announcement.statistic.total', 0);

export const getTotalAnnouncementsSelector = createSelector(
  getTotalAnnouncements,
  data => data
);

export function useGetTotalAnnouncements() {
  return useSelector<GlobalState, number>(getTotalAnnouncementsSelector);
}
