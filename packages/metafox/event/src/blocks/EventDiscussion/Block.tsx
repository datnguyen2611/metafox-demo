/**
 * @type: block
 * name: event.block.eventDiscussion
 * title: Event Discussion
 * keywords: event
 * description: Display Event Discussion
 */

import { connectSubject, createBlock } from '@metafox/framework';
import {
  actionCreators,
  connectItemView
} from '@metafox/event/hocs/connectEventDetail';
import Base from './Base';

const Enhance = connectSubject(connectItemView(Base, actionCreators));

export default createBlock<any>({
  extendBlock: Enhance
});
