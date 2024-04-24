/**
 * @type: embedView
 * name: user.embedItem.insideFeedItem
 */
import { actionCreators, connectItemView } from '../../../hocs/connectUserItem';
import ItemView from './ItemView';

export default connectItemView(ItemView, actionCreators);
