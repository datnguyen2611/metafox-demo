/**
 * @type: block
 * name: forum_thread.block.ProfileThreads
 * title: Profile Threads
 * keywords: forum, profile
 * description: display Profile Threads
 */
import { createBlock, ListViewBlockProps } from '@metafox/framework';

export default createBlock<ListViewBlockProps>({
  name: 'ProfileThreads',
  extendBlock: 'core.block.listview',
  defaults: {
    contentType: 'thread',
    title: 'Threads',
    itemView: 'forum_thread.itemView.profileCard'
  },
  overrides: {
    errorPage: 'default'
  }
});
