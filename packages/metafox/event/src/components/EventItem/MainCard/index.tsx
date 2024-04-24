/**
 * @type: itemView
 * name: event.itemView.mainCard
 * chunkName: event
 */
import {
  actionCreators,
  connectItemView
} from '@metafox/event/hocs/connectEventItem';
import ItemView from './ItemView';

export default connectItemView(ItemView, actionCreators);
