/**
 * @type: block
 * name: blog.block.ProfileBlogs
 * title: Profile Blogs
 * keywords: blog, profile
 * description: display Profile Blogs
 */
import { createBlock, ListViewBlockProps } from '@metafox/framework';

export default createBlock<ListViewBlockProps>({
  name: 'ProfileBlogs',
  extendBlock: 'core.block.listview',
  overrides: {
    errorPage: 'default'
  },
  defaults: {
    contentType: 'blog',
    dataSource: {
      apiUrl: '/blog'
    },
    title: 'Blogs',
    itemView: 'blog.itemView.profileCard'
  }
});
