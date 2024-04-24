import produce, { Draft } from 'immer';
import { AppState } from '../types';

export default produce(
  (draft: Draft<AppState['announcementListing']>, action) => {
    switch (action.type) {
      case 'announcement/listing/FULFILL':
        draft.data = [...draft.data, ...action.payload.data];
        draft.loaded = true;
        break;

      default:
        return draft;
    }
  },
  {
    data: [],
    loaded: false
  }
);
