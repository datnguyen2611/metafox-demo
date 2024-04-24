/**
 * @type: embedView
 * name: forum_thread.embedItem.insideFeedItem
 */

import {
  actionCreators,
  connectItemView
} from '@metafox/forum/hocs/connectForumThread';
import ItemView from './ItemView';

export default connectItemView(ItemView, actionCreators);
