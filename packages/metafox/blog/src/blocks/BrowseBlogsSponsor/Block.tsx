/**
 * @type: block
 * name: blog.block.BrowseSponsorBlogs
 * title: Browse Blogs Sponsor
 * keywords: blog
 * experiment: true
 * description: Display blogs
 */
import { createBlock, ListViewBlockProps } from '@metafox/framework';

export default createBlock<ListViewBlockProps>({
  extendBlock: 'core.block.listview',
  overrides: {
    contentType: 'blog',
    itemProps: { showActionMenu: true, isTrackingSponsor: true }
  },
  defaults: {
    title: 'Blogs',
    itemView: 'blog.itemView.mainCard',
    blockLayout: 'Main Listings',
    gridLayout: 'Blog - Main Card'
  }
});
