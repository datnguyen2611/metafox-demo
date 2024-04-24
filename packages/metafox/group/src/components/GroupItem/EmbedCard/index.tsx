/**
 * @type: embedView
 * name: group.embedItem.insideFeedItem
 * chunkName: groupFeed
 */
import {
  actionCreators,
  connectItemView
} from '../../../hocs/connectGroupItem';
import ItemView from './ItemView';

export default connectItemView(ItemView, actionCreators);
