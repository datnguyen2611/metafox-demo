/**
 * @type: reducer
 * name: announcement
 */
import {
  combineReducers,
  createEntityReducer,
  createUIReducer
} from '@metafox/framework';
import uiConfig from './uiConfig';
import statistic from './statistic';
import announcementListing from './announcementListing';

const appName = 'announcement';

const reducers = combineReducers({
  entities: createEntityReducer(appName),
  uiConfig: createUIReducer(appName, uiConfig),
  statistic,
  announcementListing
});

export default reducers;
