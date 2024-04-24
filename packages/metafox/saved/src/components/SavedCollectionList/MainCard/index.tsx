/**
 * @type: itemView
 * name: saved_collection_list.itemView.mainCard
 * title: Main Card
 * chunkName: saved
 */
import {
  actionCreators,
  connectItemView
} from '../../../hocs/connectSavedItemCollection';
import ItemView from './ItemView';

export default connectItemView(ItemView, actionCreators);
