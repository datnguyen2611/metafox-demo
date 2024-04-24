/**
 * @type: itemView
 * name: group_member.itemView.pending
 * chunkName: group
 */

import { connectItemView } from '@metafox/framework';
import actionCreators from '../../../../actions/groupManagerActions';
import ItemView from './ItemView';

export default connectItemView(ItemView, actionCreators);
