import { select } from 'redux-saga/effects';
import { getTotalPriorityFeed } from '@metafox/feed/selectors';

export function* getTotalPriority(profileId: number) {
  return (yield select(getTotalPriorityFeed, profileId)) as any;
}
