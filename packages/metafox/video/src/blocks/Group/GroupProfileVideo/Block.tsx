/**
 * @type: block
 * name: video.block.groupVideoListingBlock
 * title: Group's Videos
 * keywords: video
 * description: Display group's videos
 * thumbnail:
 */
import { createBlock, ListViewBlockProps } from '@metafox/framework';

const VideoListingBlock = createBlock<ListViewBlockProps>({
  name: 'VideoListingBlock',
  extendBlock: 'core.block.listview',
  overrides: {
    contentType: 'video',
    errorPage: 'default'
  },
  defaults: {
    title: 'Videos',
    blockProps: { variant: 'contained' },
    itemView: 'video.itemView.mainCard',
    gridContainerProps: { spacing: 2 },
    gridItemProps: { xs: 12, sm: 6, md: 4, lg: 4, xl: 4 },
    displayLimit: 1,
    gridVariant: 'gridView',
    dataSource: {
      apiUrl: '/video',
      apiParams: 'user_id=:id&limit=1'
    }
  }
});

export default VideoListingBlock;
