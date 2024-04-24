/**
 * @type: itemView
 * name: video.embedItem.insideFeedItem
 * chunkName: video
 */

import {
  actionCreators,
  connectItemView
} from '@metafox/video/hocs/connectVideoItem';
import ItemView from './ItemView';

export default connectItemView(ItemView, actionCreators);
