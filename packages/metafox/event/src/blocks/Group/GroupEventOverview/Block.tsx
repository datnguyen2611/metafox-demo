/**
 * @type: block
 * name: event.block.groupEventOverviewBlock
 * title: Group's Event Overview
 * keywords: event
 * description: Display group's Overview.
 * profile: true
 */
import { createBlock, ListViewBlockProps } from '@metafox/framework';

export default createBlock<ListViewBlockProps>({
  extendBlock: 'core.block.listview',
  defaults: {
    title: 'Upcoming Event'
  }
});
